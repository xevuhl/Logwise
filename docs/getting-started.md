# Getting Started

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: For cloning the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/xevuhl/Logwise.git
cd Logwise
```

### 2. Install Dependencies

```bash
# Install all dependencies (server and client)
npm run install:all
```

This runs `npm install` in the root directory and `cd client && npm install` for the frontend.

### 3. Environment Configuration (Optional)

Create a `.env` file in the root directory for optional configuration:

```env
# Server port (default: 3001)
PORT=3001

# Skip SSL verification for corporate proxies
SKIP_SSL_VERIFY=false
```

## Running the Application

### Development Mode

Start both the backend and frontend in development mode:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:3001 (Express server)
- **Frontend**: http://localhost:5173 (Vite dev server with HMR)

### Individual Services

```bash
# Backend only
npm run server

# Frontend only (requires backend running)
npm run client
```

### Production Mode

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

In production, the Express server serves the built React app from `client/dist`.

## Docker Deployment

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production with Docker

```bash
docker-compose up --build -d
```

The application will be available at http://localhost:3001

## First-Time Setup

1. **Open the Application**: Navigate to http://localhost:5173 (dev) or http://localhost:3001 (prod)

2. **Add Your First Log Source**: 
   - Click "Inventory" in the sidebar
   - Click "Add Source" or use the Onboarding wizard

3. **Add Ingestion Targets**:
   - Click "Targets" in the sidebar
   - Add your SIEM, data lake, or log collectors

4. **Create Relationships**:
   - Click "Relationships" in the sidebar
   - Map which sources feed into which targets

5. **Configure Integrations** (Optional):
   - Click "Integrations" in the sidebar
   - Connect to Cribl or Azure Data Explorer to auto-discover sources

## Verifying Installation

### Check Backend Health

```bash
curl http://localhost:3001/api/sources
# Should return: [] (empty array if no sources)
```

### Check Frontend

Open http://localhost:5173 in your browser. You should see the Logwise dashboard.

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Kill the process or use a different port
PORT=3002 npm run server
```

### SSL Certificate Errors (Corporate Proxy)

If you encounter SSL errors when connecting to integrations:

```env
# Add to .env file
SKIP_SSL_VERIFY=true
```

⚠️ Only use this in development/testing environments.

### Missing Data Directory

The `/data` directory is created automatically on first run. If you encounter permission issues:

```bash
mkdir -p data
chmod 755 data
```

## Next Steps

- Read the [API Reference](./api-reference.md) to understand available endpoints
- Check [Data Models](./data-models.md) to understand the data structure
- Configure [Integrations](./integrations.md) to connect external systems
