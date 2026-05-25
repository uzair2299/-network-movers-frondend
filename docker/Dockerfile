# Stage 1: Build the Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
# Fix executable permissions for node modules (important in Alpine/Docker)
RUN chmod +x node_modules/.bin/* 2>/dev/null || true
COPY . .
# Build with base-href so the app expects to be served under /network-movers-portal/
# Disable font inlining to prevent fetching Google Fonts from internet during build (fails in isolated Docker)
RUN NG_BUILD_SKIP_FETCH_GOOGLE_FONTS=true npm run build -- \
    --output-path=dist/network-movers-portal \
    --base-href=/network-movers-portal/ \
    --configuration=production

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=build /app/dist/network-movers-portal /usr/share/nginx/html/network-movers-portal

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Ensure the config directory exists inside the network-movers-portal folder
RUN mkdir -p /usr/share/nginx/html/network-movers-portal/assets/config

# Copy default config.json (for local/dev use)
COPY ./src/assets/config/config.json /usr/share/nginx/html/network-movers-portal/assets/config/config.json

# Copy the config template for runtime env substitution
COPY ./src/assets/config/config.template.json /usr/share/nginx/html/network-movers-portal/assets/config/config.template.json

# Copy and set up the entrypoint script
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
