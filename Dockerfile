# =======================
# --- stage1: build --- #
# =======================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma.config.* ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci --legacy-peer-deps

# Copy Prisma schema and source code to the container
COPY prisma/ ./prisma/
COPY src/ ./src/

# Generate Prisma Client for the configured schema
RUN npx prisma generate

# Build the application
RUN npm run build

# =======================
# --- stage2: production --- #
# =======================
FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=builder /app/dist ./dist
COPY prisma/ ./prisma/
COPY prisma.config.* ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
