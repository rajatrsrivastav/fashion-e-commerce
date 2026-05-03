# Stage 1: install dependencies and prepare the app.
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm prune --omit=dev

# Stage 2: run a smaller production image.
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache curl openssl \
  && addgroup -S appgroup \
  && adduser -S appuser -G appgroup

COPY --from=build --chown=appuser:appgroup /app/package*.json ./
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=build --chown=appuser:appgroup /app/src ./src

USER appuser

EXPOSE 4000

# Docker checks this URL to know if the container is healthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl --fail "http://localhost:${PORT}/" || exit 1

CMD ["npm", "start"]
