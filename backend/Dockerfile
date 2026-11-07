# ============================================================================
# BACKEND CONTAINER DEFINITION (Lightweight Node.js 20 Alpine image)
# ============================================================================
FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (layer cached unless package.json changes)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]

