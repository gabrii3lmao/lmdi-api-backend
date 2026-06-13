# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER appuser

CMD ["node", "dist/index.js"]
