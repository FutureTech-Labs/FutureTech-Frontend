# ==========================================================
# Stage 1: Dependencies Installation Stage
# Installs all dependencies
# ==========================================================

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS dependencies

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies using npm ci (fast + deterministic install)
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
    else \
    echo "No lockfile found." && exit 1; \
    fi


# ==========================================================
# Stage 2: Build Next.js Application
# Builds production optimized Next.js standalone output
# ==========================================================

FROM node:${NODE_VERSION} AS builder

# Set working directory inside the container
WORKDIR /app

# Copy installed dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy full application source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Disable Next.js telemetry collection
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time arguments (injected during docker build)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
# ARG EDGE_STORE_ACCESS_KEY
# ARG EDGE_STORE_SECRET_KEY

# Convert build args into environment variables for Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
# ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
# ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY

# Build the Next.js application
RUN npm run build


# ==========================================================
# Stage 3: Production Runtime Stage
# Runs optimized standalone Next.js server
# ==========================================================

FROM node:${NODE_VERSION} AS runner

# Set working directory inside the container
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production

# Disable telemetry in production runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Application runtime configuration
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy static public assets
COPY --from=builder --chown=node:node /app/public ./public

# Copy Next.js standalone server output
COPY --from=builder --chown=node:node /app/.next/standalone ./

# Copy static build assets
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Ensure .next directory exists with correct permissions
RUN mkdir -p .next && chown node:node .next

# Switch to non-root user for security best practices
USER node

# Expose application port
EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]