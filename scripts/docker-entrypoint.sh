#!/bin/sh
set -e

# Docker entrypoint to generate runtime config.json from config.template.json
# Expects environment variables matching placeholders in the template, e.g. API_BASE_URL

TEMPLATE="/usr/share/nginx/html/assets/config/config.template.json"
TARGET="/usr/share/nginx/html/assets/config/config.json"

if [ -f "$TEMPLATE" ]; then
  echo "Generating runtime config from template: $TEMPLATE -> $TARGET"
  node -e "const fs=require('fs'); const tpl=fs.readFileSync('$TEMPLATE','utf8'); const out=tpl.replace(/\$\{([A-Z0-9_]+)\}/g,(m,k)=>process.env[k]!==undefined?process.env[k]:m); fs.writeFileSync('$TARGET',out); console.log('Wrote', '$TARGET');"
else
  echo "Template not found at $TEMPLATE, skipping generation"
fi

exec "$@"
