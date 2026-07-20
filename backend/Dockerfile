# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and prisma schema for dependency install + generation
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --include=dev
RUN npx prisma generate

COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# We need the compiled JS, the Prisma client, and the schema for migrations/runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Install prisma CLI for migrations
RUN npx prisma version

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
