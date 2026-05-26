#!/bin/sh

# Set default values if environment variables are not provided
export API_BASE_URL=${API_BASE_URL:-"http://localhost:8080/api"}
export AUTH_BASE_URL=${AUTH_BASE_URL:-"http://localhost:8080/auth"}
export ENABLE_LOGS=${ENABLE_LOGS:-true}

echo "Replacing environment variables in config.json..."

# Use envsubst to replace placeholders in the template and write to the actual config.json
# Using the template as source avoids overwriting placeholders on subsequent restarts
envsubst < /usr/share/nginx/html/assets/config/config.template.json \
         > /usr/share/nginx/html/assets/config/config.json

echo "Configuration updated. Starting Nginx..."

# Execute the CMD from the Dockerfile (nginx -g 'daemon off;')
exec "$@"
