import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.ELE_PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.zip':'application/zip','.md':'text/markdown; charset=utf-8','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
  try {
    const url = new URL(req.url,'http://127.0.0.1');
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.includes('..') || decoded.includes('\\') || decoded.includes('\0')) {res.writeHead(403);res.end();return;}
    const filename = path.resolve(root, '.' + (decoded.endsWith('/') ? decoded + 'index.html' : decoded));
    if (!filename.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    const data = await fs.readFile(filename);
    res.writeHead(200, {'Content-Type':types[path.extname(filename)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:' + port));
