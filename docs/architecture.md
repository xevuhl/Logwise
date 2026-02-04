# Architecture Overview

## System Architecture

Logwise follows a traditional client-server architecture with a React frontend and Express.js backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React Application                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │    │
│  │  │Dashboard │ │Inventory │ │ Targets  │ │  Reports │    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │    │
│  │  │Relations │ │Validation│ │Assessment│ │Integrations   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                         API Calls                                │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express.js Server                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     REST API Layer                        │    │
│  │   /api/sources    /api/targets    /api/relationships     │    │
│  │   /api/integrations    /api/validation    /api/audit     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Data Access Layer                       │    │
│  │              db.js (JSON File Operations)                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               External Integration Layer                  │    │
│  │         Cribl API        Azure Data Explorer API          │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Storage                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    /data Directory                         │   │
│  │   sources.json    targets.json    relationships.json      │   │
│  │   integrations.json    assessments.json    audit.json     │   │
│  │   validation-tests.json    validation-campaigns.json      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
logwise/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Assessment.jsx     # Security maturity assessment
│   │   │   ├── AuditLog.jsx       # Change history viewer
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Header.jsx         # App header
│   │   │   ├── Integrations.jsx   # External integrations
│   │   │   ├── Inventory.jsx      # Log source inventory
│   │   │   ├── Onboarding.jsx     # New source wizard
│   │   │   ├── Relationships.jsx  # Data flow mapping
│   │   │   ├── Reports.jsx        # Report generation
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Targets.jsx        # Ingestion targets
│   │   │   └── Validation.jsx     # Log validation tests
│   │   ├── api.js             # API client functions
│   │   ├── App.jsx            # Main application component
│   │   ├── constants.js       # Shared constants and config
│   │   └── main.jsx           # Application entry point
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── server/
│   ├── index.js               # Express server & API routes
│   └── db.js                  # Data access layer
│
├── data/                      # JSON data storage
│   ├── sources.json           # Log sources
│   ├── targets.json           # Ingestion targets
│   ├── relationships.json     # Source-target relationships
│   ├── integrations.json      # External integrations
│   ├── assessments.json       # Assessment responses
│   ├── audit.json             # Audit trail
│   ├── validation-tests.json  # Validation test definitions
│   └── validation-campaigns.json  # Validation campaigns
│
├── docs/                      # Documentation
├── docker-compose.yml         # Production Docker config
├── docker-compose.dev.yml     # Development Docker config
├── Dockerfile                 # Production Dockerfile
├── Dockerfile.dev             # Development Dockerfile
└── package.json               # Project configuration
```

## Component Interactions

### Data Flow

1. **User Interaction** → React component captures user action
2. **API Call** → Component calls function in `api.js`
3. **HTTP Request** → Request sent to Express server
4. **Route Handler** → Express routes request to appropriate handler
5. **Data Operation** → Handler uses `db.js` to read/write JSON files
6. **Response** → Data returned through the chain to update UI

### State Management

The application uses React's built-in state management:
- `App.jsx` maintains global application state
- State is passed down to child components as props
- Callback functions are passed for state updates

```javascript
// App.jsx state structure
const [sources, setSources] = useState([]);
const [targets, setTargets] = useState([]);
const [relationships, setRelationships] = useState([]);
const [integrations, setIntegrations] = useState([]);
const [auditLog, setAuditLog] = useState([]);
// ... etc
```

## Key Design Decisions

### JSON File Storage
- **Why**: Simplicity, no database setup required, easy to backup/version
- **Trade-off**: Not suitable for high-concurrency or large datasets
- **Location**: All data stored in `/data` directory

### No Authentication
- **Current State**: No built-in authentication
- **Recommendation**: Deploy behind a reverse proxy with authentication (e.g., nginx + OAuth)

### External Integrations
- **Cribl**: OAuth2 client credentials flow
- **Azure Data Explorer**: Azure AD service principal authentication
- **Design**: Token caching, automatic retry, detailed error messages
