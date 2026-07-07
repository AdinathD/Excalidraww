FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune excalidraw-frontend --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install pnpm matching the project version
RUN npm install -g pnpm@9.0.0

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
RUN pnpm --filter db exec prisma generate

# Build the frontend
ARG NEXT_PUBLIC_HTTP_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_HTTP_URL=$NEXT_PUBLIC_HTTP_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN echo "Build Arg NEXT_PUBLIC_HTTP_URL is: ${NEXT_PUBLIC_HTTP_URL}"
RUN echo "Build Arg NEXT_PUBLIC_WS_URL is: ${NEXT_PUBLIC_WS_URL}"

RUN pnpm turbo run build --filter=excalidraw-frontend

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

# Install pnpm matching the project version in runner stage as well
RUN npm install -g pnpm@9.0.0

# Copy the built app
COPY --from=installer /app .

WORKDIR /app/apps/excalidraw-frontend
# Start Next.js server using pnpm
CMD ["pnpm", "start"]
