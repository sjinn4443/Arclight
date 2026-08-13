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
RUN if [ -d .git ]; then \
      echo "[version-debug] .git present"; \
      git rev-parse --is-shallow-repository || true; \
      git log --first-parent --format=%cI -n 8 || true; \
    else \
      echo "[version-debug] .git missing"; \
    fi
RUN npm run build
RUN echo "[version-debug] dist/version.json" && cat dist/version.json || true

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
COPY --chown=node:node --from=build /app/server.cjs ./server.cjs
COPY --chown=node:node --from=build /app/security ./security
COPY --chown=node:node --from=build /app/storage ./storage
COPY --chown=node:node --from=build /app/utils ./utils
COPY --chown=node:node --from=build /app/reports ./reports
COPY --chown=node:node --from=build /app/dist ./dist

# NDJSON remains opt-in; when enabled, only this directory needs write access.
RUN mkdir -p /app/reports/data && chown node:node /app/reports/data

# Expose default port; Railway sets PORT env var at runtime
EXPOSE 8080
ENV PORT=8080

USER node

CMD ["node", "server.cjs"]
