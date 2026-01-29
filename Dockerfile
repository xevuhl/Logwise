# Build stage for React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install all client dependencies including devDependencies (needed for Vite build)
RUN npm install --include=dev

# Copy client source
COPY client/ ./

# Build the frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy server files
COPY server/ ./server/

# Copy built frontend from build stage
COPY --from=frontend-build /app/client/dist ./client/dist

# Create data directory for SQLite persistence
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"]
