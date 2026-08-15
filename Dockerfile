# Multi-stage Dockerfile for Production React SPA on Google Cloud Run
# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with clean cache
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build production bundle to /dist
RUN npm run build

# 2. Production Runtime Stage (Ultra-lightweight Nginx Alpine ~25MB)
FROM nginx:alpine AS runner

# Copy custom Nginx configuration for SPA routing & gzip compression
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Default Cloud Run port
ENV PORT=8080
EXPOSE 8080

# Substitute PORT variable dynamically if passed by Cloud Run and start Nginx
CMD ["/bin/sh", "-c", "sed -i \"s/8080/$PORT/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
