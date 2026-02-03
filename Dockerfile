# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Using npm mirror for China if needed, or default
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# Copy source code
COPY . .

# Build H5
# VITE_ env vars can be passed as build args
ARG VITE_API_BASE_URL
ARG VITE_H5_DOMAIN
ARG VITE_ASSETS_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_H5_DOMAIN=$VITE_H5_DOMAIN
ENV VITE_ASSETS_URL=$VITE_ASSETS_URL

RUN npm run build:h5

# Serve Stage
FROM nginx:alpine

# Copy build artifacts
# UniApp H5 output is usually in dist/build/h5
COPY --from=builder /app/dist/build/h5 /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
