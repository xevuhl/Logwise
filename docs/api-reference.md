# API Reference

All API endpoints are prefixed with `/api`. The server runs on port 3001 by default.

Base URL: `http://localhost:3001/api`

## Log Sources

Manage log source inventory.

### GET /sources
Get all log sources.

**Response:**
```json
[
  {
    "id": "abc123",
    "name": "Firewall Logs",
    "category": "Network",
    "logType": "syslog",
    "status": "collected",
    "description": "Palo Alto firewall logs",
    "ownerTeam": "Network Security",
    "ownerContact": "netops@company.com",
    "criticalityTier": "tier-1",
    "tags": ["firewall", "perimeter"],
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-20T14:22:00.000Z"
  }
]
```

### GET /sources/:id
Get a single log source by ID.

**Response:** Single source object or 404.

### POST /sources
Create a new log source.

**Request Body:**
```json
{
  "name": "Windows Security Events",
  "category": "Endpoint",
  "logType": "windows-event",
  "status": "planned",
  "description": "Windows Security Event Logs from domain controllers",
  "ownerTeam": "Windows Team",
  "criticalityTier": "tier-1"
}
```

**Response:** Created source object with generated `id`.

### PUT /sources/:id
Update an existing log source.

**Request Body:** Partial or full source object.

**Response:** Updated source object.

### DELETE /sources/:id
Delete a log source.

**Response:** 204 No Content

### POST /sources/bulk
Bulk import log sources.

**Request Body:**
```json
{
  "sources": [
    { "name": "Source 1", "category": "Network", ... },
    { "name": "Source 2", "category": "Endpoint", ... }
  ],
  "replaceAll": false
}
```

---

## Targets

Manage ingestion destinations (SIEMs, data lakes, collectors).

### GET /targets
Get all targets.

**Response:**
```json
[
  {
    "id": "xyz789",
    "name": "Production SIEM",
    "type": "siem",
    "status": "active",
    "vendor": "Splunk",
    "version": "9.1.0",
    "endpoint": "https://splunk.company.com:8088",
    "port": "8088",
    "protocol": "HEC",
    "retentionDays": "90",
    "capacityGB": "5000"
  }
]
```

### GET /targets/:id
Get a single target by ID.

### POST /targets
Create a new target.

**Request Body:**
```json
{
  "name": "Security Data Lake",
  "type": "data-lake",
  "status": "active",
  "vendor": "Azure Data Explorer",
  "endpoint": "https://cluster.region.kusto.windows.net",
  "retentionDays": "365"
}
```

### PUT /targets/:id
Update an existing target.

### DELETE /targets/:id
Delete a target.

---

## Relationships

Map data flows between sources and targets.

### GET /relationships
Get all relationships.

**Response:**
```json
[
  {
    "id": "rel123",
    "sourceId": "source-abc",
    "sourceType": "source",
    "targetId": "target-xyz",
    "targetType": "target",
    "type": "feeds",
    "description": "Firewall logs to SIEM",
    "dataFlow": "TCP/514",
    "protocol": "Syslog"
  }
]
```

### POST /relationships
Create a new relationship.

**Request Body:**
```json
{
  "sourceId": "source-abc",
  "sourceType": "source",
  "targetId": "target-xyz",
  "targetType": "target",
  "type": "feeds",
  "protocol": "Syslog"
}
```

**Note:** `sourceType` can be `"source"` (log source) or `"target"` (for target-to-target flows like Cribl → SIEM).

### PUT /relationships/:id
Update a relationship.

### DELETE /relationships/:id
Delete a relationship.

### POST /relationships/cleanup
Remove orphaned relationships where source or target no longer exists.

---

## Integrations

Manage external integrations (Cribl, Azure Data Explorer).

### GET /integrations
Get all integrations.

**Response:**
```json
[
  {
    "id": "int123",
    "name": "Cribl Cloud",
    "type": "cribl",
    "status": "active",
    "baseUrl": "https://main-org.cribl.cloud",
    "authType": "oauth",
    "lastSync": "2026-01-20T10:00:00.000Z",
    "syncCount": 45
  }
]
```

### POST /integrations
Create a new integration.

**Cribl Integration:**
```json
{
  "name": "Cribl Cloud",
  "type": "cribl",
  "baseUrl": "https://main-orgname.cribl.cloud",
  "authType": "oauth",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "workerGroup": "default"
}
```

**Azure Data Explorer Integration:**
```json
{
  "name": "ADX Security Cluster",
  "type": "adx",
  "clusterUrl": "https://cluster.region.kusto.windows.net",
  "database": "SecurityLogs",
  "tenantId": "azure-tenant-id",
  "clientId": "app-client-id",
  "clientSecret": "app-client-secret"
}
```

### PUT /integrations/:id
Update an integration.

### DELETE /integrations/:id
Delete an integration.

### POST /integrations/:id/test
Test the integration connection.

**Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "version": "4.5.0"
}
```

### POST /integrations/:id/sync
Sync sources from the integration.

**Request Body:**
```json
{
  "importMode": "new-only",
  "selectedSources": ["source1", "source2"]
}
```

**Import Modes:**
- `new-only`: Only import sources that don't exist
- `update`: Import new and update existing
- `update-all`: Update all matching sources

### GET /integrations/:id/history
Get sync history for an integration.

### POST /integrations/:id/preview
Preview sources that would be imported (without actually importing).

---

## Assessments

Security maturity assessment responses (NIST CSF aligned).

### GET /assessments
Get all assessment responses.

### POST /assessments/:questionId
Save a response to a specific question.

**Request Body:**
```json
{
  "response": "yes",
  "notes": "Implemented via Splunk ES"
}
```

### POST /assessments/bulk
Save multiple assessment responses.

---

## Validation

Log collection validation tests and campaigns.

### GET /validation
Get all validation tests.

### POST /validation/:testId
Record a validation test result.

**Request Body:**
```json
{
  "status": "pass",
  "notes": "Verified 100 events in last hour"
}
```

### DELETE /validation/:testId
Delete a validation test.

### GET /validation/:testId/history
Get execution history for a test.

### GET /campaigns
Get all validation campaigns.

### POST /campaigns
Create a new campaign.

### PUT /campaigns/:id
Update a campaign.

### DELETE /campaigns/:id
Delete a campaign.

---

## Audit Log

### GET /audit
Get audit trail of all changes.

**Response:**
```json
[
  {
    "id": "audit123",
    "action": "created",
    "entityName": "Firewall Logs",
    "timestamp": "2026-01-15T10:30:00.000Z",
    "details": null
  },
  {
    "id": "audit124",
    "action": "status_changed",
    "entityName": "Windows Events",
    "timestamp": "2026-01-16T14:00:00.000Z",
    "details": {
      "field": "status",
      "oldValue": "planned",
      "newValue": "collected"
    }
  }
]
```

---

## Saved Views

### GET /views
Get all saved filter views.

### POST /views
Create a saved view.

**Request Body:**
```json
{
  "name": "Critical Sources",
  "filters": {
    "status": "collected",
    "criticalityTier": "tier-1"
  }
}
```

### DELETE /views/:id
Delete a saved view.

---

## Export

### GET /export
Export all data for backup or migration.

**Response:**
```json
{
  "sources": [...],
  "targets": [...],
  "relationships": [...],
  "assessments": [...],
  "exportedAt": "2026-01-20T12:00:00.000Z"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
