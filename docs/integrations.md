# External Integrations

Logwise supports integrations with external systems for auto-discovery and synchronization of log sources.

## Overview

| Integration | Purpose | Auth Method |
|-------------|---------|-------------|
| **Cribl** | Discover inputs/sources from Cribl Stream | OAuth2 Client Credentials or Bearer Token |
| **Azure Data Explorer (ADX)** | Discover tables from ADX databases | Azure AD Service Principal |

---

## Cribl Integration

### Supported Versions
- Cribl Cloud (managed)
- Cribl Stream Self-Hosted

### Authentication Methods

#### 1. OAuth2 Client Credentials (Recommended)

For Cribl Cloud or self-hosted with OAuth enabled.

**Setup in Cribl:**
1. Go to **Settings > Security > API Tokens**
2. Create a new OAuth Client
3. Grant appropriate scopes (read access to sources/inputs)
4. Note the Client ID and Client Secret

**Configuration in Logwise:**
```json
{
  "type": "cribl",
  "authType": "oauth",
  "baseUrl": "https://your-org.cribl.cloud",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "workerGroup": "default"  // Optional, defaults to 'default'
}
```

#### 2. Bearer Token

For self-hosted instances or API token authentication.

**Setup in Cribl:**
1. Go to **Settings > Security > API Tokens**
2. Create a new API Token
3. Copy the token value

**Configuration:**
```json
{
  "type": "cribl",
  "authType": "bearer",
  "baseUrl": "https://cribl.internal:9000",
  "bearerToken": "your-api-token"
}
```

### API Endpoints Used

The integration uses these Cribl API endpoints:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/auth/login` | OAuth token exchange |
| `GET /m/{workerGroup}/system/inputs` | List all inputs (preferred) |
| `GET /m/{workerGroup}/system/sources` | List all sources (fallback) |
| `GET /api/v1/m/{workerGroup}/sources` | Alternative sources endpoint |

### Cribl Cloud vs Self-Hosted

**Cribl Cloud:**
- Base URL: `https://your-org.cribl.cloud`
- Auto-adds `/m/default` worker group path
- Uses `/api/v1/auth/login` for OAuth

**Self-Hosted:**
- Base URL: Your instance URL (e.g., `https://cribl.internal:9000`)
- Worker group configurable (default: `default`)
- May require `/m/{workerGroup}` prefix

### Troubleshooting

#### 403 Forbidden Error

This typically indicates a permissions issue:

1. **Worker Group Access**: Ensure the API credentials have access to the worker group
2. **Scope Permissions**: Check OAuth scopes include source/input read access
3. **API Token Permissions**: For bearer tokens, verify the token has read permissions

The system will automatically:
- Try `/inputs` endpoint first
- Fall back to `/sources` endpoint if `/inputs` returns 403

#### Connection Refused

1. Verify the base URL is correct
2. Check network connectivity
3. Ensure firewall allows outbound HTTPS

### Synced Data

When syncing, the following Cribl source fields are mapped:

| Cribl Field | Logwise Field |
|-------------|---------------|
| `id` | `criblId` |
| `type` | `criblType` |
| `type` | `name` (prefixed) |
| - | `category` = "Cribl" |
| - | `logType` = type |
| - | `status` = "collected" |

---

## Azure Data Explorer (ADX) Integration

### Prerequisites

1. Azure subscription with ADX cluster
2. Azure AD App Registration (Service Principal)
3. Database-level permissions

### Service Principal Setup

#### 1. Create App Registration

```bash
# Using Azure CLI
az ad app create --display-name "Logwise ADX Reader"

# Note the Application (client) ID
```

#### 2. Create Client Secret

```bash
az ad app credential reset --id <app-id>

# Note the generated secret
```

#### 3. Grant Database Permissions

In ADX, run:

```kusto
.add database <database> viewers ('aadapp=<client-id>;<tenant-id>')
```

Or for broader access:

```kusto
.add database <database> users ('aadapp=<client-id>;<tenant-id>')
```

### Configuration

```json
{
  "type": "adx",
  "name": "Production ADX",
  "clusterUrl": "https://yourcluster.region.kusto.windows.net",
  "database": "SecurityLogs",
  "tenantId": "your-azure-tenant-id",
  "clientId": "your-app-client-id",
  "clientSecret": "your-app-client-secret"
}
```

### Authentication Flow

1. Request token from Azure AD:
   ```
   POST https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
   ```

2. Token scope:
   ```
   {clusterUrl}/.default
   ```

3. Use bearer token for ADX queries

### API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST {clusterUrl}/v1/rest/query` | Execute KQL queries |

### Tables Discovery

The sync process runs:

```kusto
.show tables 
| project TableName
```

Each table is created/updated as a log source:
- **Name**: Table name
- **Category**: "ADX"
- **adxTable**: Table name reference

### Troubleshooting

#### Authentication Failed

1. Verify tenant ID is correct
2. Check client ID matches app registration
3. Ensure client secret hasn't expired
4. Verify the app has been granted database access

#### No Tables Returned

1. Confirm database name is correct
2. Check app has at least viewer permissions
3. Try running `.show tables` manually in ADX

#### Network Errors

1. ADX cluster must be accessible from Logwise server
2. Check firewall rules for Azure endpoints
3. Verify cluster URL format (include `https://`)

---

## Integration Management

### Adding an Integration

**Via API:**

```bash
POST /api/integrations
Content-Type: application/json

{
  "name": "Production Cribl",
  "type": "cribl",
  "baseUrl": "https://org.cribl.cloud",
  "authType": "oauth",
  "clientId": "...",
  "clientSecret": "...",
  "workerGroup": "default"
}
```

### Testing Connection

```bash
POST /api/integrations/:id/test
```

Returns:
```json
{
  "success": true,
  "message": "Connection successful"
}
```

Or on failure:
```json
{
  "success": false,
  "message": "403 Forbidden - Check API permissions"
}
```

### Triggering Sync

```bash
POST /api/integrations/:id/sync
```

This will:
1. Authenticate with the external system
2. Fetch sources/tables
3. Create new log sources in Logwise
4. Update existing sources if matched by `criblId` or `adxTable`
5. Log sync results to `data/integration-sync-history.json`

### Sync History

View past syncs:

```bash
GET /api/integrations/:id/sync-history
```

Response:
```json
[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "sourcesFound": 45,
    "sourcesCreated": 12,
    "sourcesUpdated": 33,
    "errors": []
  }
]
```

---

## Security Considerations

### Credential Storage

⚠️ **Important**: Credentials are stored in `data/integrations.json` in plain text.

For production deployments, consider:
1. Using environment variables for secrets
2. Implementing a secrets manager integration
3. Encrypting the data directory

### API Response Sanitization

The `/api/integrations` GET endpoint removes sensitive fields:
- `clientSecret` is replaced with `hasClientSecret: true`
- `bearerToken` is replaced with `hasBearerToken: true`

Full credentials are never returned to the frontend.

### Network Security

- All integration communications use HTTPS
- Consider using a dedicated service account with minimal permissions
- Rotate credentials regularly

---

## Adding New Integrations

To add support for a new integration type:

1. **Server-side** (`server/index.js`):
   - Add fetch function (e.g., `fetchNewSystemSources`)
   - Add to sync endpoint switch statement
   - Add to test endpoint switch statement

2. **Frontend** (`client/src/components/Integrations.jsx`):
   - Add to `integrationTypes` array
   - Add configuration form fields
   - Add to sync/test handlers

3. **Data Model** (`docs/data-models.md`):
   - Document new fields in Integration schema
   - Add type to IntegrationType union

Example skeleton for new integration:

```javascript
// server/index.js
async function fetchNewSystemSources(integration) {
  const token = await getAuthToken(integration);
  const response = await fetch(`${integration.baseUrl}/api/sources`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await response.json();
  
  return data.map(item => ({
    id: uuidv4(),
    name: item.name,
    category: 'NewSystem',
    status: 'collected',
    newSystemId: item.id,
    integrationId: integration.id
  }));
}
```
