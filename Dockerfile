# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app/backend

# Copy package files and prisma schema for dependency install + generation
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm ci --include=dev
RUN npx prisma generate

COPY backend/ .
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
