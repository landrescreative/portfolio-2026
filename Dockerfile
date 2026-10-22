# syntax=docker/dockerfile:1
# Portfolio 2026 — TanStack Start + Nitro (node-server preset)
#
# Why a Dockerfile instead of Nixpacks: Nixpacks copied the whole working tree
# into the image three times (512 MB + 669 MB + 523 MB layers) and produced a
# 3.95 GB image per deploy, with no reusable dependency layer. On the 1 vCPU
# VPS that meant 17-30 minute deploys. This build is cached and ships ~0.8 GB.

FROM node:22-bookworm-slim AS builder
WORKDIR /app

ENV CI=true

# Dependency layer: only re-runs when the lockfile changes
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Source + build (prebuild regenerates sitemap.xml and imageSizes.json)
COPY . .
RUN npm run build

# ---------------------------------------------------------------- runtime
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Nitro bundles the server and copies public/ into .output/public,
# so no node_modules are needed at runtime.
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
