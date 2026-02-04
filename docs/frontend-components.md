# Frontend Components

Overview of React components in the Logwise frontend application.

## Component Architecture

```
App.jsx
├── Header.jsx           # Top navigation bar
├── Sidebar.jsx          # Left navigation menu
└── [Page Components]    # Main content area
    ├── Dashboard.jsx
    ├── Inventory.jsx
    ├── Onboarding.jsx
    ├── Targets.jsx
    ├── Relationships.jsx
    ├── Assessment.jsx
    ├── Validation.jsx
    ├── Integrations.jsx
    ├── AuditLog.jsx
    └── Reports.jsx
```

---

## Core Components

### App.jsx

**Purpose:** Main application container and routing.

**Key Features:**
- Manages active page state
- Renders header, sidebar, and content area
- Handles page navigation

**State:**
```javascript
const [activePage, setActivePage] = useState('dashboard');
```

---

### Header.jsx

**Purpose:** Top navigation bar with branding.

**Features:**
- Application logo/name
- Global actions (if any)
- User profile (future)

---

### Sidebar.jsx

**Purpose:** Left navigation menu.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `activePage` | string | Currently active page ID |
| `setActivePage` | function | Navigation handler |

**Navigation Items:**
- Dashboard
- Inventory
- Onboarding Wizard
- Targets
- Relationships
- Assessment
- Validation
- Integrations
- Audit Log
- Reports

---

## Page Components

### Dashboard.jsx

**Purpose:** Overview metrics and status summary.

**Data Fetched:**
- `/api/sources` - For status counts
- `/api/assessments` - For assessment progress
- `/api/targets` - For target counts

**Key Metrics:**
- Total log sources
- Collection status breakdown (collected, partial, not-collected, blocked)
- Assessment completion percentage
- Recent activity

---

### Inventory.jsx

**Purpose:** Log source management CRUD interface.

**Features:**
- Table view of all sources
- Add/Edit/Delete sources
- Status filtering
- Category filtering
- Search functionality
- Bulk CSV import
- CSV export
- Drag-and-drop reordering

**State:**
```javascript
const [sources, setSources] = useState([]);
const [filteredSources, setFilteredSources] = useState([]);
const [selectedSource, setSelectedSource] = useState(null);
const [showModal, setShowModal] = useState(false);
const [filters, setFilters] = useState({
  status: '',
  category: '',
  search: ''
});
```

**API Calls:**
- `GET /api/sources` - List sources
- `POST /api/sources` - Create source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source
- `PUT /api/sources/reorder` - Update sort order

---

### Onboarding.jsx

**Purpose:** Step-by-step wizard for adding new log sources.

**Steps:**
1. **Basic Info** - Name, description, category, type
2. **Technical Details** - Collection method, network requirements
3. **Ownership** - Owner team, contact
4. **Validation** - Test plan, expected fields
5. **Review** - Summary before submission

**State:**
```javascript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  name: '',
  description: '',
  category: '',
  logType: '',
  // ... more fields
});
```

---

### Targets.jsx

**Purpose:** Manage ingestion destinations.

**Features:**
- List targets with status indicators
- Add/Edit/Delete targets
- Show source count per target
- Status-based styling

**Derived Data:**
```javascript
// Calculate sources feeding each target
const sourcesPerTarget = relationships.reduce((acc, rel) => {
  if (rel.targetId) {
    acc[rel.targetId] = (acc[rel.targetId] || 0) + 1;
  }
  return acc;
}, {});
```

---

### Relationships.jsx

**Purpose:** Visualize data flow between sources and targets.

**Features:**
- Interactive graph visualization
- Source → Target connections
- Target → Target connections (intermediate processing)
- Drag-to-create relationships
- Legend for connection types

**Visualization:**
- Sources on left column (green nodes)
- Intermediate targets in middle (blue nodes)
- Final destinations on right (purple nodes)
- Solid lines for source→target
- Dashed lines for target→target

**Layout Algorithm:**
```javascript
// 3-column layout
const sourceX = 100;
const intermediateX = 400;  
const targetX = 700;

// Vertical spacing with minimum gaps
const minSpacing = 80;
```

---

### Assessment.jsx

**Purpose:** Security maturity self-assessment questionnaire.

**Question Categories:**
- Log Management
- SIEM Operations
- Incident Response
- Compliance
- Architecture

**Response Options:**
| Response | Points | Description |
|----------|--------|-------------|
| Yes | 3 | Fully implemented |
| Partial | 2 | Partially implemented |
| No | 1 | Not implemented |
| N/A | - | Not applicable |

**Scoring:**
```javascript
const score = responses.reduce((sum, r) => {
  if (r.response === 'yes') return sum + 3;
  if (r.response === 'partial') return sum + 2;
  if (r.response === 'no') return sum + 1;
  return sum;
}, 0);
```

---

### Validation.jsx

**Purpose:** Log collection validation testing.

**Features:**
- Create validation tests per source
- Group tests into campaigns
- Track pass/fail status
- Run test queries (manual)

**Test States:**
- Pending - Not yet run
- Pass - Test successful
- Fail - Test failed

---

### Integrations.jsx

**Purpose:** External system integration management.

**Supported Integrations:**
- Cribl Stream/Cloud
- Azure Data Explorer (ADX)

**Features:**
- Add/configure integrations
- Test connection
- Trigger sync
- View sync history

**State:**
```javascript
const [integrations, setIntegrations] = useState([]);
const [showAddModal, setShowAddModal] = useState(false);
const [selectedType, setSelectedType] = useState('cribl');
const [testResult, setTestResult] = useState(null);
```

---

### AuditLog.jsx

**Purpose:** View change history for log sources.

**Features:**
- Chronological list of changes
- Filter by action type
- Filter by entity
- Timestamp display

**Action Types:**
- Created
- Updated
- Deleted
- Status Changed
- Bulk Imported

---

### Reports.jsx

**Purpose:** Generate security reports.

**Report Types:**

1. **Executive Summary**
   - High-level metrics
   - Risk assessment
   - Recommendations

2. **Onboarding Status**
   - Source collection progress
   - Pending sources
   - Blocked sources

3. **Gap Analysis**
   - MITRE ATT&CK coverage
   - Missing data sources
   - Recommended additions

**Export Formats:**
- PDF (via print dialog)
- CSV data export

---

## Shared Utilities

### api.js

**Purpose:** Centralized API client.

**Base Configuration:**
```javascript
const API_BASE = 'http://localhost:3001/api';

export async function fetchSources() {
  const response = await fetch(`${API_BASE}/sources`);
  return response.json();
}
```

**Available Functions:**
- `fetchSources()` / `createSource()` / `updateSource()` / `deleteSource()`
- `fetchTargets()` / `createTarget()` / `updateTarget()` / `deleteTarget()`
- `fetchRelationships()` / `createRelationship()` / `deleteRelationship()`
- `fetchIntegrations()` / `createIntegration()` / `testIntegration()` / `syncIntegration()`
- `fetchAssessments()` / `saveAssessment()`
- `fetchAudit()`

---

### constants.js

**Purpose:** Shared constants and configuration.

**Contains:**
- `CATEGORIES` - Log source categories
- `LOG_TYPES` - Log format types
- `STATUS_OPTIONS` - Source status values
- `CRITICALITY_TIERS` - Tier definitions
- `ASSESSMENT_QUESTIONS` - Assessment questionnaire
- `COLLECTION_METHODS` - How logs are collected

---

## Styling

### Approach

Logwise uses **Tailwind CSS** for styling with these conventions:

**Colors by Entity:**
| Entity | Primary Color |
|--------|---------------|
| Sources | Green (`green-500`) |
| Targets | Blue (`blue-500`) |
| Intermediate Targets | Purple (`purple-500`) |
| Warnings | Yellow (`yellow-500`) |
| Errors | Red (`red-500`) |

**Status Colors:**
| Status | Color |
|--------|-------|
| Collected/Active | Green |
| Partial/Degraded | Yellow |
| Not Collected/Offline | Gray |
| Blocked/Error | Red |
| Planned | Blue |

### Font

The application uses **JetBrains Mono** for a technical/engineering aesthetic:

```css
font-family: 'JetBrains Mono', monospace;
```

---

## State Management

### Pattern

Components manage their own state using React `useState` and `useEffect`.

```javascript
function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData().then(setData).finally(() => setLoading(false));
  }, []);
  
  // ...
}
```

### Data Flow

1. **Initial Load**: `useEffect` fetches data on component mount
2. **User Actions**: Event handlers call API, then refresh local state
3. **Optimistic Updates**: Some components update UI before API confirms

### Future Improvements

For larger scale, consider:
- React Context for shared state
- React Query for data fetching/caching
- Zustand or Jotai for global state

---

## Adding New Components

### 1. Create Component File

```jsx
// client/src/components/MyComponent.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../api';

export default function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch initial data
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Component</h1>
      {/* Content */}
    </div>
  );
}
```

### 2. Add to App.jsx

```jsx
import MyComponent from './components/MyComponent';

// In render:
{activePage === 'my-component' && <MyComponent />}
```

### 3. Add to Sidebar.jsx

```jsx
const navItems = [
  // ...existing items
  { id: 'my-component', label: 'My Component', icon: '📦' }
];
```

### 4. Add API Functions (if needed)

```javascript
// api.js
export async function fetchMyData() {
  const response = await fetch(`${API_BASE}/my-endpoint`);
  return response.json();
}
```
