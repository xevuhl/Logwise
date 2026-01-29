# Logwise - Security Log Source Tracker

A comprehensive tool for tracking and managing your organization's security log sources with MITRE ATT&CK mappings, logging maturity assessments, validation testing, and coverage analysis.

![Logwise](https://img.shields.io/badge/Logwise-Security%20Log%20Tracker-orange)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

### Core Capabilities
- **Log Source Inventory** - Track all security log sources with status, category, MITRE ATT&CK mappings, and integration details
- **Target Inventory** - Manage ingestion destinations (SIEMs, data lakes, log collectors, etc.)
- **Relationship Mapping** - Visualize data flows and dependencies between log sources and targets
- **Logging Maturity Assessment** - Evaluate your logging program against NIST CSF framework
- **Validation Testing** - Test and validate detection capabilities with campaigns
- **Reports** - Generate executive, onboarding, gap analysis, and validation reports
- **Dashboard** - Visual overview of collection status, coverage gaps, and assessment scores
- **Audit Log** - Track all changes with full audit trail

### User Experience
- **Dark Mode** - Full dark mode support
- **Keyboard Shortcuts** - Quick navigation between all sections
- **Persistent Storage** - JSON file-based storage that persists across restarts
- **Responsive Design** - Works on desktop and tablet screens

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: JSON file-based persistence (SQLite-ready architecture)
- **Icons**: Lucide React

---

## Quick Start

### Option 1: Docker (Recommended)

No Node.js installation required - just Docker!

```bash
# Clone the repository
git clone https://github.com/xevuhl/Logwise.git
cd Logwise

# Run with Docker Compose
docker compose up --build
```

Visit http://localhost:3000

**Development mode with hot-reload:**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

### Option 2: npm

#### Prerequisites

- Node.js 18+
- npm

#### Installation

```bash
# Clone the repository
git clone https://github.com/xevuhl/Logwise.git
cd Logwise

# Install all dependencies
npm run install:all
```

#### Development

```bash
# Run both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

#### Production Build

```bash
npm run build
npm start
```

---

## Application Guide

### Navigation

The sidebar provides access to all application sections. Use keyboard shortcuts for quick navigation:

| Key | Section |
|-----|---------|
| 1 | Dashboard |
| 2 | Inventory |
| 3 | Targets |
| 4 | Relationships |
| 5 | Assessment |
| 6 | Validation |
| 7 | Reports |
| 8 | Audit Log |
| D | Toggle dark mode |

---

### 1. Dashboard

The dashboard provides an at-a-glance view of your logging program:

- **Collection Status** - Pie chart showing collected, partial, planned, not collected, and blocked sources
- **Category Breakdown** - Distribution of log sources by category (Network, Endpoint, Cloud, etc.)
- **Assessment Score** - Overall logging maturity score based on your assessment responses
- **Quick Stats** - Total sources, collection rates, and coverage metrics

---

### 2. Inventory (Log Sources)

Manage your log source inventory with full CRUD operations.

#### Adding a Log Source

1. Click **"Add Source"** or **"Onboarding Wizard"** for guided setup
2. Fill in required fields:
   - **Name** - Descriptive name for the log source
   - **Category** - Network, Endpoint, Application, Cloud, Identity, Security, Database, Email, Web, Other
   - **Status** - Collected, Partial, Planned, Not Collected, Blocked
3. Optional fields:
   - **Description** - Detailed description
   - **MITRE ATT&CK Tactics** - Map to relevant tactics
   - **Integration Type** - API, Syslog, Agent, File, etc.
   - **Target** - Select ingestion destination
   - **Owner/Contact** - Responsible team or person
   - **Tags** - Custom labels for filtering
   - **JSON Mapping Schema** - Paste field mappings

#### Filtering & Search

- Use the search bar to find sources by name
- Filter by status, category, or tags
- Sort by name, status, or date

#### Bulk Operations

- **Import** - Upload JSON file with multiple sources
- **Export** - Download all sources as JSON

---

### 3. Targets (Ingestion Destinations)

Track where your logs are being sent.

#### Target Types

| Type | Description |
|------|-------------|
| SIEM | Security Information and Event Management (Splunk, Sentinel, etc.) |
| SOAR | Security Orchestration, Automation and Response |
| Data Lake | Centralized data repository (Snowflake, Databricks, etc.) |
| Log Collector | Log aggregation service (Cribl, Fluentd, etc.) |
| Cloud Storage | S3, Azure Blob, Google Cloud Storage |
| XDR | Extended Detection and Response platform |
| EDR | Endpoint Detection and Response |
| NDR | Network Detection and Response |
| Ticketing | ServiceNow, Jira, etc. |
| Archive | Long-term storage |
| Analytics | BI and analytics platforms |

#### Target Status

- **Active** - Operational and receiving logs
- **Maintenance** - Under maintenance
- **Degraded** - Operational with issues
- **Offline** - Not operational
- **Planned** - Future deployment
- **Decommissioned** - No longer in use

---

### 4. Relationships

Map data flows between log sources and targets.

#### Relationship Types

| Type | Description |
|------|-------------|
| Feeds Into | Source sends logs/data to target |
| Enriches | Source provides context/enrichment |
| Triggers | Source events trigger actions |
| Depends On | Source depends on target |
| Aggregates | Source aggregates from target |
| Normalizes | Source normalizes/parses logs |
| Correlates With | Source correlates events with target |
| Mirrors | Source replicates target data |

#### Views

- **List View** - Flat list of all relationships
- **Graph View** - Hierarchical view grouped by source

---

### 5. Assessment

Evaluate your logging maturity against the NIST Cybersecurity Framework.

#### Assessment Categories

- **Identify (CSF)** - Asset management and risk assessment
- **Protect (CSF)** - Data security and access control
- **Detect (CSF)** - SIEM configuration and monitoring
- **Respond (CSF)** - Response planning and analysis
- **Recover (CSF)** - Recovery planning and improvements

#### Response Options

- **Yes** - Fully implemented (2 points)
- **Partial** - Partially implemented (1 point)
- **No** - Not implemented (0 points)
- **N/A** - Not applicable (excluded from scoring)

#### Adding Evidence

For each question, you can add:
- Notes explaining your response
- Evidence or documentation references

---

### 6. Validation

Test and validate your detection capabilities.

#### Campaigns

Create validation campaigns to organize testing:
1. Click **"New Campaign"**
2. Set name, description, and status
3. Add validation tests to the campaign

#### Validation Tests

Each test includes:
- **Test ID** - Unique identifier (e.g., T1059.001)
- **MITRE Technique** - Associated ATT&CK technique
- **Status** - Pass, Fail, Partial, Not Tested
- **Guidance** - What to look for, how to test, expected alerts
- **SIEM Query Examples** - Sample queries
- **Atomic Test References** - Links to Atomic Red Team tests

---

### 7. Reports

Generate professional reports for stakeholders.

#### Report Types

| Report | Purpose |
|--------|---------|
| **Executive Summary** | High-level overview for leadership |
| **Onboarding Report** | New log source integration details |
| **Gap Analysis** | Coverage gaps by MITRE ATT&CK |
| **Validation Report** | Detection testing results |

#### Export Options

- Print directly from the browser
- Save as PDF using browser print dialog

---

### 8. Audit Log

Track all changes made in the application:

- Source created/updated/deleted
- Target created/updated/deleted
- Assessment responses saved
- Validation results recorded
- Campaign changes

Each entry includes timestamp, action type, and details.

---

## API Reference

The backend exposes a REST API at `http://localhost:3001/api`:

### Log Sources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sources` | List all sources |
| GET | `/api/sources/:id` | Get single source |
| POST | `/api/sources` | Create source |
| PUT | `/api/sources/:id` | Update source |
| DELETE | `/api/sources/:id` | Delete source |
| POST | `/api/sources/bulk` | Bulk import |

### Targets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/targets` | List all targets |
| GET | `/api/targets/:id` | Get single target |
| POST | `/api/targets` | Create target |
| PUT | `/api/targets/:id` | Update target |
| DELETE | `/api/targets/:id` | Delete target |

### Relationships
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/relationships` | List all relationships |
| GET | `/api/relationships/source/:id` | Get by source |
| POST | `/api/relationships` | Create relationship |
| PUT | `/api/relationships/:id` | Update relationship |
| DELETE | `/api/relationships/:id` | Delete relationship |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assessments` | List all responses |
| POST | `/api/assessments/:questionId` | Save response |

### Validation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/validation` | List all tests |
| POST | `/api/validation/:testId` | Save test result |
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit` | Get audit log |
| GET | `/api/export` | Export all data |

---

## Project Structure

```
Logwise/
├── package.json              # Root package (scripts & server deps)
├── server/
│   ├── index.js              # Express API server
│   └── db.js                 # JSON file storage layer
├── data/                     # Persistent data (auto-created)
│   ├── sources.json
│   ├── targets.json
│   ├── relationships.json
│   ├── assessments.json
│   ├── validation-tests.json
│   ├── campaigns.json
│   └── audit.json
├── client/
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── src/
│       ├── App.jsx           # Main application component
│       ├── api.js            # API client functions
│       ├── constants.js      # Application constants
│       └── components/       # React components
│           ├── Dashboard.jsx
│           ├── Inventory.jsx
│           ├── Targets.jsx
│           ├── Relationships.jsx
│           ├── Assessment.jsx
│           ├── Validation.jsx
│           ├── Reports.jsx
│           └── AuditLog.jsx
├── Dockerfile                # Production Docker image
├── Dockerfile.dev            # Development Docker image
├── docker-compose.yml        # Production compose
└── docker-compose.dev.yml    # Development compose override
```

---

## Data Storage

All data is stored in JSON files in the `/data` directory:

- Data persists across application restarts
- Files are human-readable and can be edited manually if needed
- Back up the `/data` directory to preserve your data

### Backup

```bash
# Create backup
cp -r data/ data-backup-$(date +%Y%m%d)/

# Restore backup
cp -r data-backup-YYYYMMDD/* data/
```

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

**npm SSL errors (corporate proxy/Zscaler):**
```bash
npm config set strict-ssl false
```

**Fresh start (reset all data):**
```bash
rm -rf data/
npm run dev
```

**Docker permission issues:**
```bash
# Linux/Mac: Run with sudo or add user to docker group
sudo docker compose up --build
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [MITRE ATT&CK](https://attack.mitre.org/) - Threat framework
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Assessment framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
