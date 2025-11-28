#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const ROOT = path.resolve(__dirname, '..', 'src');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(body);
}

function tryFile(fp) {
  try {
    const stat = fs.statSync(fp);
    if (stat.isFile()) return fp;
  } catch (_) {}
  return null;
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let fp = path.join(ROOT, url);

  // Prevent path traversal
  if (!fp.startsWith(ROOT)) {
    return send(res, 403, 'Forbidden');
  }

  // If directory, try index.html and pages
  try {
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      const idx = tryFile(path.join(fp, 'index.html'));
      if (idx) fp = idx;
    }
  } catch (_) {}

  // Try .html fallback if path without extension
  if (!path.extname(fp)) {
    const asHtml = fp + '.html';
    if (fs.existsSync(asHtml)) fp = asHtml;
  }

  fs.readFile(fp, (err, data) => {
    if (err) {
      return send(res, 404, 'Not Found');
    }
    const ext = path.extname(fp).toLowerCase();
    send(res, 200, data, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  console.log(`Serving directory: ${ROOT}`);
  console.log('Open /pages/hjem to view the home page');
});
