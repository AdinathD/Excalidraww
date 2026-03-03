FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune excalidraw-frontend --docker

FROM node:20-alpine AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
RUN cd packages/db && npx prisma generate

# Build the frontend
RUN npx turbo run build --filter=excalidraw-frontend

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the built app
COPY --from=installer /app .

WORKDIR /app/apps/excalidraw-frontend
# Start Next.js server
CMD ["npm", "run", "start"]
