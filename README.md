# Logwise - Security Log Source Tracker

A comprehensive tool for tracking and managing your organization's security log sources with logging maturity assessment capabilities.

![Logwise](https://img.shields.io/badge/Logwise-Security%20Log%20Tracker-orange)

## Features

- **Log Source Inventory** - Track all your security log sources with status, category, and integration details
- **Logging Maturity Assessment** - Evaluate your logging program against industry best practices
- **Dashboard** - Visual overview of collection status and assessment scores
- **Audit Log** - Track all changes to your log source inventory
- **Dark Mode** - Full dark mode support
- **Keyboard Shortcuts** - Quick navigation (1-4 for tabs, D for dark mode)
- **Persistent Storage** - Data persists across restarts

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: JSON file-based persistence
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Logwise.git
cd Logwise

# Install all dependencies
npm run install:all
```

### Development

```bash
# Run both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
Logwise/
 package.json           # Root package (Express server)
 server/
    index.js          # Express API server
    db.js             # JSON file storage layer
 data/                 # Persistent data (auto-created)
 client/
    package.json      # Frontend dependencies
    src/              # React components
 logwise.html          # Legacy single-file version
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1 | Assessment tab |
| 2 | Dashboard tab |
| 3 | Inventory tab |
| 4 | Audit Log tab |
| D | Toggle dark mode |

## License

MIT License - see LICENSE for details.
