#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const templatePath = process.argv[2] || path.join(process.cwd(), 'src', 'assets', 'config', 'config.template.json');
const targetPath = process.argv[3] || path.join(process.cwd(), 'src', 'assets', 'config', 'config.json');

if (!fs.existsSync(templatePath)) {
  console.error('Template not found:', templatePath);
  process.exit(1);
}

const tpl = fs.readFileSync(templatePath, 'utf8');
const out = tpl.replace(/\$\{([A-Z0-9_]+)\}/g, (m, k) => {
  return process.env[k] !== undefined ? process.env[k] : m;
});

fs.writeFileSync(targetPath, out, 'utf8');
console.log('Wrote', targetPath);
