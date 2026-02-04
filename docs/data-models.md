# Data Models

All data is stored as JSON files in the `/data` directory. Each file represents a collection of entities.

## Log Source

**File:** `data/sources.json`

A log source represents any system, application, or device that generates security-relevant logs.

```typescript
interface LogSource {
  // Identity
  id: string;                    // Unique identifier (auto-generated)
  name: string;                  // Display name (required)
  description?: string;          // Detailed description
  
  // Classification
  category: string;              // Category (Network, Endpoint, Cloud, etc.)
  logType: string;               // Log format type
  status: SourceStatus;          // Collection status
  criticalityTier: string;       // Criticality tier (tier-1 to tier-4)
  tags?: string[];               // Custom tags
  
  // Ownership
  ownerTeam?: string;            // Responsible team
  ownerContact?: string;         // Contact email/name
  
  // Technical Details
  collectionMethod?: string;     // How logs are collected
  networkRequirements?: string;  // Network/firewall requirements
  credentials?: string;          // Credential reference (not actual secrets)
  
  // Validation
  validationPlan?: string;       // How to validate collection
  expectedFields?: string;       // Key fields expected in logs
  sampleQuery?: string;          // Sample SIEM query
  
  // Metadata
  retention?: string;            // Retention period
  notes?: string;                // Additional notes
  
  // Integration References
  integrationId?: string;        // Source integration ID
  criblId?: string;              // Cribl source ID
  criblType?: string;            // Cribl input/output type
  adxTable?: string;             // ADX table name
  
  // System Fields
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  sortOrder?: number;            // Display order
}

type SourceStatus = 
  | 'collected'      // Actively collecting
  | 'partial'        // Partially collecting
  | 'planned'        // Planned for future
  | 'not-collected'  // Not being collected
  | 'blocked';       // Blocked/unable to collect
```

### Categories

| Category | Description |
|----------|-------------|
| Network | Firewalls, routers, switches, proxies |
| Endpoint | Workstations, servers, EDR |
| Cloud | Cloud provider logs (AWS, Azure, GCP) |
| Identity | Authentication, directory services |
| Application | Business applications |
| Security | Security tools (SIEM, IDS, etc.) |
| Database | Database audit logs |
| Web | Web servers, WAF |

### Log Types

| Type | Description |
|------|-------------|
| syslog | Standard syslog format |
| json | JSON formatted logs |
| cef | Common Event Format |
| leef | Log Event Extended Format |
| windows-event | Windows Event Log |
| csv | Comma-separated values |
| xml | XML formatted |
| other | Other/custom formats |

---

## Target

**File:** `data/targets.json`

A target is an ingestion destination - where logs are sent for storage/analysis.

```typescript
interface Target {
  // Identity
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description?: string;          // Description
  
  // Classification
  type: TargetType;              // Type of target
  status: TargetStatus;          // Operational status
  
  // Vendor Information
  vendor?: string;               // Vendor/product name
  version?: string;              // Software version
  
  // Connection Details
  endpoint?: string;             // URL or IP address
  port?: string;                 // Port number
  protocol?: string;             // Protocol (Syslog, HEC, etc.)
  credentials?: string;          // Credential reference
  
  // Capacity
  retentionDays?: string;        // Data retention period
  capacityGB?: string;           // Storage capacity
  
  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type TargetType = 
  | 'siem'           // SIEM platform
  | 'soar'           // SOAR platform
  | 'data-lake'      // Data lake storage
  | 'log-collector'  // Log collector/forwarder
  | 'cloud-storage'  // Cloud storage (S3, Blob)
  | 'xdr'            // XDR platform
  | 'edr'            // EDR platform
  | 'ndr'            // NDR platform
  | 'ticketing'      // Ticketing system
  | 'archive'        // Archive storage
  | 'analytics'      // Analytics platform
  | 'other';

type TargetStatus = 
  | 'active'         // Operational
  | 'maintenance'    // Under maintenance
  | 'degraded'       // Degraded performance
  | 'offline'        // Offline
  | 'planned'        // Not yet deployed
  | 'decommissioned'; // Retired
```

---

## Relationship

**File:** `data/relationships.json`

Relationships map the data flow between sources and targets.

```typescript
interface Relationship {
  id: string;
  
  // Source (can be a log source OR a target for chained flows)
  sourceId: string;              // ID of the source
  sourceType: 'source' | 'target';  // Type of source entity
  
  // Target (always a target)
  targetId: string;              // ID of the target
  targetType: 'target';          // Always 'target'
  
  // Relationship Details
  type: RelationshipType;        // Type of relationship
  description?: string;          // Description
  dataFlow?: string;             // Data flow details (port, protocol)
  protocol?: string;             // Protocol used
  
  createdAt: string;
  updatedAt: string;
}

type RelationshipType = 
  | 'feeds'          // Sends data to
  | 'enriches'       // Provides enrichment
  | 'aggregates'     // Aggregates from
  | 'filters'        // Filters data
  | 'transforms'     // Transforms data
  | 'replicates';    // Replicates to
```

**Example: Source → Target**
```json
{
  "sourceId": "firewall-source-id",
  "sourceType": "source",
  "targetId": "siem-target-id",
  "targetType": "target",
  "type": "feeds"
}
```

**Example: Target → Target (Chained Flow)**
```json
{
  "sourceId": "cribl-target-id",
  "sourceType": "target",
  "targetId": "adx-target-id",
  "targetType": "target",
  "type": "feeds"
}
```

---

## Integration

**File:** `data/integrations.json`

External system integrations for auto-discovery.

```typescript
interface Integration {
  id: string;
  name: string;
  type: 'cribl' | 'adx';
  status: 'active' | 'error' | 'inactive';
  
  // Common fields
  lastSync?: string;
  syncCount?: number;
  
  // Cribl-specific
  baseUrl?: string;              // Cribl API URL
  authType?: 'oauth' | 'bearer' | 'basic';
  workerGroup?: string;          // Worker group name
  clientId?: string;             // OAuth client ID
  clientSecret?: string;         // OAuth client secret (stored)
  bearerToken?: string;          // Direct bearer token
  
  // ADX-specific
  clusterUrl?: string;           // ADX cluster URL
  database?: string;             // Database name
  tenantId?: string;             // Azure tenant ID
  // clientId and clientSecret shared with Cribl
  
  // Metadata flags (for UI - don't expose secrets)
  hasClientId?: boolean;
  hasClientSecret?: boolean;
  hasBearerToken?: boolean;
  
  createdAt: string;
  updatedAt: string;
}
```

---

## Assessment

**File:** `data/assessments.json`

Responses to security maturity assessment questions.

```typescript
interface AssessmentResponse {
  questionId: string;            // References question in constants.js
  response: 'yes' | 'partial' | 'no' | 'na';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Audit Log Entry

**File:** `data/audit.json`

Change tracking for log sources.

```typescript
interface AuditEntry {
  id: string;
  action: AuditAction;
  entityName: string;            // Name of affected entity
  timestamp: string;
  details?: {
    field?: string;              // Changed field
    oldValue?: any;              // Previous value
    newValue?: any;              // New value
  };
}

type AuditAction = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'bulk_imported';
```

---

## Validation Test

**File:** `data/validation-tests.json`

Log collection validation test definitions.

```typescript
interface ValidationTest {
  id: string;
  sourceId: string;              // Associated log source
  name: string;
  description?: string;
  query?: string;                // Test query
  expectedResult?: string;
  status: 'pass' | 'fail' | 'pending';
  lastRun?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Validation Campaign

**File:** `data/validation-campaigns.json`

Grouped validation efforts.

```typescript
interface ValidationCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'draft';
  sourceIds: string[];           // Sources included
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Saved View

**File:** `data/views.json` (if exists)

Saved filter configurations.

```typescript
interface SavedView {
  id: string;
  name: string;
  filters: {
    status?: string;
    category?: string;
    criticalityTier?: string;
    search?: string;
  };
  createdAt: string;
}
```

---

## Entity Relationships Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  LogSource  │────────▶│ Relationship │◀────────│   Target    │
└─────────────┘         └──────────────┘         └─────────────┘
       │                                                │
       │                                                │
       ▼                                                ▼
┌─────────────┐                                 ┌─────────────┐
│ Integration │                                 │ Integration │
│   (Cribl)   │                                 │    (ADX)    │
└─────────────┘                                 └─────────────┘
       │
       ▼
┌─────────────┐
│ValidationTest│
└─────────────┘
       │
       ▼
┌─────────────┐
│  Campaign   │
└─────────────┘
```
