# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy source code
COPY . .

# Build the Nest app
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# If you need any other runtime files, copy them too
# Example:
# COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node", "dist/main"]