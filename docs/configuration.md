# Configuration Guide

This document covers all configuration options for Logwise.

## Environment Variables

### Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP server port |
| `NODE_ENV` | `development` | Environment mode |
| `DATA_DIR` | `./data` | Path to JSON data storage |

### Setting Environment Variables

**Windows (PowerShell):**
```powershell
$env:PORT = "3001"
npm run server
```

**Linux/Mac:**
```bash
PORT=3001 npm run server
```

**Using .env file (requires dotenv):**
```env
PORT=3001
NODE_ENV=production
DATA_DIR=/var/lib/logwise/data
```

---

## Server Configuration

### Port Configuration

The Express server listens on port 3001 by default. To change:

```javascript
// server/index.js
const PORT = process.env.PORT || 3001;
```

### CORS Configuration

The server allows cross-origin requests from the Vite dev server:

```javascript
app.use(cors());  // Allows all origins in development
```

For production, restrict to specific origins:

```javascript
app.use(cors({
  origin: ['https://logwise.yourcompany.com'],
  credentials: true
}));
```

---

## Client Configuration

### Vite Configuration

**File:** `client/vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,           // Dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',       // Build output directory
    sourcemap: true       // Enable source maps
  }
});
```

### API Base URL

**File:** `client/src/api.js`

```javascript
const API_BASE = 'http://localhost:3001/api';
```

For production, use environment variable:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

Then in `.env`:
```env
VITE_API_URL=https://api.logwise.yourcompany.com
```

---

## Tailwind CSS Configuration

**File:** `client/tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Custom colors if needed
      }
    },
  },
  plugins: [],
}
```

---

## Docker Configuration

### Development

**File:** `docker-compose.dev.yml`

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"    # Backend
      - "5173:5173"    # Frontend (Vite)
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

### Production

**File:** `docker-compose.yml`

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data    # Persist data
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

---

## Data Storage Configuration

### Default Location

Data files are stored in the `data/` directory:

```
data/
├── sources.json
├── targets.json
├── relationships.json
├── integrations.json
├── assessments.json
├── audit.json
├── validation-tests.json
├── validation-campaigns.json
├── validation-history.json
└── integration-sync-history.json
```

### Custom Data Directory

To use a different directory:

1. Set environment variable:
   ```bash
   DATA_DIR=/path/to/data npm run server
   ```

2. Or modify `server/db.js`:
   ```javascript
   const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
   ```

### Data Backup

The JSON files can be backed up with simple file copy:

```bash
# Backup
cp -r data/ backup/data-$(date +%Y%m%d)/

# Restore
cp -r backup/data-20240115/ data/
```

---

## Security Configuration

### Rate Limiting (Recommended for Production)

Add express-rate-limit:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                   // 100 requests per window
});

app.use('/api/', limiter);
```

### HTTPS (Production)

Use a reverse proxy (nginx, Caddy) for HTTPS:

**nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name logwise.yourcompany.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Application Constants

**File:** `client/src/constants.js`

### Categories

```javascript
export const CATEGORIES = [
  'Network',
  'Endpoint', 
  'Cloud',
  'Identity',
  'Application',
  'Security',
  'Database',
  'Web',
  'Other'
];
```

### Status Options

```javascript
export const STATUS_OPTIONS = [
  { value: 'collected', label: 'Collected', color: 'green' },
  { value: 'partial', label: 'Partial', color: 'yellow' },
  { value: 'planned', label: 'Planned', color: 'blue' },
  { value: 'not-collected', label: 'Not Collected', color: 'gray' },
  { value: 'blocked', label: 'Blocked', color: 'red' }
];
```

### Criticality Tiers

```javascript
export const CRITICALITY_TIERS = [
  { value: 'tier-1', label: 'Tier 1 - Critical', description: 'Must have for security operations' },
  { value: 'tier-2', label: 'Tier 2 - Important', description: 'High value for detection' },
  { value: 'tier-3', label: 'Tier 3 - Nice to Have', description: 'Additional context' },
  { value: 'tier-4', label: 'Tier 4 - Low Priority', description: 'Minimal security value' }
];
```

### Log Types

```javascript
export const LOG_TYPES = [
  'syslog',
  'json',
  'cef',
  'leef',
  'windows-event',
  'csv',
  'xml',
  'other'
];
```

---

## Customization

### Adding New Categories

1. Update `constants.js`:
   ```javascript
   export const CATEGORIES = [
     // ...existing
     'IoT',
     'OT/ICS'
   ];
   ```

2. Categories are used in dropdowns throughout the app automatically.

### Adding New Status Options

1. Update `constants.js`:
   ```javascript
   export const STATUS_OPTIONS = [
     // ...existing
     { value: 'deprecated', label: 'Deprecated', color: 'purple' }
   ];
   ```

2. Update Tailwind safelist if using dynamic colors:
   ```javascript
   // tailwind.config.js
   safelist: [
     'bg-purple-500',
     'text-purple-500'
   ]
   ```

### Custom Branding

**Logo/Title:**
Update `Header.jsx`:
```jsx
<h1 className="text-xl font-bold">Your Company - Logwise</h1>
```

**Colors:**
Update Tailwind config:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-brand-color',
    }
  }
}
```

---

## Logging Configuration

### Server Logging

The server uses console logging. For production, consider:

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Replace console.log with logger.info
```

### Audit Logging

Changes to log sources are automatically tracked in `data/audit.json`. 

Configure what's tracked in `server/index.js`:
```javascript
function logAudit(action, entityName, details = {}) {
  const entry = {
    id: uuidv4(),
    action,
    entityName,
    timestamp: new Date().toISOString(),
    details
  };
  // ... save to audit.json
}
```

---

## Performance Tuning

### Large Datasets

For workspaces with many sources (>1000):

1. **Add pagination to API:**
   ```javascript
   app.get('/api/sources', (req, res) => {
     const { page = 1, limit = 100 } = req.query;
     const start = (page - 1) * limit;
     const paginated = sources.slice(start, start + limit);
     res.json({ data: paginated, total: sources.length });
   });
   ```

2. **Add virtual scrolling to frontend:**
   Use `react-window` or `react-virtualized` for tables.

3. **Consider SQLite:**
   The application is designed for easy migration to SQLite for larger scale.

### Caching

Add response caching for read-heavy endpoints:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // 60 second TTL

app.get('/api/sources', (req, res) => {
  const cached = cache.get('sources');
  if (cached) return res.json(cached);
  
  const sources = readSources();
  cache.set('sources', sources);
  res.json(sources);
});
```
