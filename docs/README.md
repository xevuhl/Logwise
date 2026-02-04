# Logwise Documentation

Logwise is a full-stack web application for tracking security log sources with MITRE ATT&CK mappings, security assessments, and coverage analysis.

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture Overview](./architecture.md) | System architecture, components, and data flow |
| [Getting Started](./getting-started.md) | Installation, setup, and running the application |
| [API Reference](./api-reference.md) | Complete REST API documentation |
| [Data Models](./data-models.md) | Database schemas and entity relationships |
| [Integrations](./integrations.md) | External integrations (Cribl, Azure Data Explorer) |
| [Frontend Components](./frontend-components.md) | React components and UI architecture |
| [Configuration](./configuration.md) | Environment variables and configuration options |

## Quick Start

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: JSON file-based storage (no external database required)
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Deployment**: Docker support included

## Key Features

- 📋 **Log Source Inventory** - Track all security log sources
- 🎯 **Target Management** - Manage ingestion destinations (SIEMs, data lakes)
- 🔗 **Relationship Mapping** - Visualize data flows between sources and targets
- 📊 **Security Assessments** - NIST CSF-aligned maturity questionnaire
- 🛡️ **MITRE ATT&CK Coverage** - Map log sources to techniques
- ✅ **Validation Campaigns** - Test and verify log collection
- 🔌 **Integrations** - Connect to Cribl and Azure Data Explorer
- 📈 **Reports** - Executive summaries, gap analysis, onboarding reports
- 📝 **Audit Trail** - Track all changes to log sources
