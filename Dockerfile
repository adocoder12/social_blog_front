# syntax=docker/dockerfile:1

# Build stage
FROM node:26-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# Keep npm's download cache between builds
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

# Serve stage
FROM nginx:1.30-alpine

# Fallback backend when the image runs without compose; compose sets the real one from .env
ENV API_TARGET=http://api:8080

# nginx fills ${API_TARGET} in this template at startup
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
