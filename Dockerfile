FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN corepack enable

FROM base AS deps
WORKDIR /app

# Install dependencies based on pnpm
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments received from deployment (EasyPanel / Docker build args)
ARG API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CACHE_REVALIDATE
ARG STORAGE_PROVIDER
ARG IMAGEKIT_URL_ENDPOINT
ARG IMAGEKIT_PUBLIC_KEY
ARG IMAGEKIT_PRIVATE_KEY
ARG NEXT_IMAGE_REMOTE_HOSTS
ARG MINIO_ENDPOINT
ARG MINIO_PUBLIC_URL
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG MINIO_BUCKET
ARG MINIO_REGION
ARG GIT_SHA

# Environment variables needed at build time by Next.js
ENV API_URL=$API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_CACHE_REVALIDATE=$NEXT_PUBLIC_CACHE_REVALIDATE \
    STORAGE_PROVIDER=$STORAGE_PROVIDER \
    IMAGEKIT_URL_ENDPOINT=$IMAGEKIT_URL_ENDPOINT \
    IMAGEKIT_PUBLIC_KEY=$IMAGEKIT_PUBLIC_KEY \
    IMAGEKIT_PRIVATE_KEY=$IMAGEKIT_PRIVATE_KEY \
    NEXT_IMAGE_REMOTE_HOSTS=$NEXT_IMAGE_REMOTE_HOSTS \
    MINIO_ENDPOINT=$MINIO_ENDPOINT \
    MINIO_PUBLIC_URL=$MINIO_PUBLIC_URL \
    MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY \
    MINIO_SECRET_KEY=$MINIO_SECRET_KEY \
    MINIO_BUCKET=$MINIO_BUCKET \
    MINIO_REGION=$MINIO_REGION \
    GIT_SHA=$GIT_SHA \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048"

RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy static public assets
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]