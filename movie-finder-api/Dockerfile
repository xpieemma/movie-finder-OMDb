FROM node:18-alpine

WORKDIR /app

# 1. Copy package files from the subfolder
COPY movie-finder-api/package*.json ./
COPY movie-finder-api/tsconfig.json ./

# 2. Install dependencies
RUN npm ci

# 3. Copy source code from the subfolder
COPY movie-finder-api/src/ ./src/
COPY movie-finder-api/swagger/ ./swagger/

# 4. Build TypeScript
RUN npm run build

# 5. Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3001

# Health check (matches your internal port)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start server
CMD ["node", "dist/server.js"]
