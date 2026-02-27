# Multi-stage Dockerfile for reliable Railway builds

# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Needed for build-time version sequence calculation from git history.
RUN apk add --no-cache git

# Install full deps (incl. dev) for building
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest and build
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime

# Keep npm cache out of node_modules to prevent EBUSY on cleanups
ENV npm_config_cache=/tmp/.npm
ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app

# Install only production dependencies for smaller, stable image
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy only runtime source from build stage (keeps .git out of final image)
COPY --from=build /app/server.cjs ./server.cjs
COPY --from=build /app/storage ./storage
COPY --from=build /app/utils ./utils
COPY --from=build /app/reports ./reports
COPY --from=build /app/dist ./dist

# Expose default port; Railway sets PORT env var at runtime
EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.cjs"]
