# Logwise - Security Log Source Tracker

## Project Overview
Logwise is a full-stack web application for tracking security log sources with MITRE ATT&CK mappings, security assessments, and coverage analysis.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite with better-sqlite3
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS or inline styles (JetBrains Mono font)

## Project Structure
```
logwise/
├── server/           # Express backend
│   ├── index.js      # Main server entry
│   ├── db.js         # SQLite database setup
│   └── routes/       # API routes
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
├── data/             # SQLite database files
└── package.json      # Root package.json
```

## Key Features
- Log source inventory management
- MITRE ATT&CK tactic/technique mapping
- Security assessment questionnaire
- Coverage gap analysis
- Roadmap planning
- Audit trail logging
- Report generation (Executive, Onboarding, Gap Analysis)

## Development Commands
- `npm install` - Install all dependencies
- `npm run dev` - Start both backend and frontend in development
- `npm run server` - Start only the backend
- `npm run client` - Start only the frontend

## API Endpoints
- `GET/POST /api/sources` - Log sources CRUD
- `GET/POST /api/assessments` - Assessment responses
- `GET /api/audit` - Audit log
- `GET/POST /api/views` - Saved filter views
