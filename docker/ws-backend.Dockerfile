FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune ws-backend --docker

FROM node:20-alpine AS installer
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
RUN cd packages/db && npx prisma generate

# Build the backend
RUN npx turbo run build --filter=ws-backend

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the built app
COPY --from=installer /app .

WORKDIR /app/apps/ws-backend
# Start websocket server
CMD ["npm", "run", "start"]
