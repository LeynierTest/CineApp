import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const port = Number(process.env.PORT) || 5173;

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
};

function send(res, status, body, headers = {}) {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
    res.end(body);
}

const server = createServer((request, response) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    let filePath = normalize(join(root, decodeURIComponent(pathname)));

    if (filePath !== root && !filePath.startsWith(root + sep)) {
        send(response, 403, 'Forbidden');
        return;
    }

    try {
        if (statSync(filePath).isDirectory()) {
            filePath = join(filePath, 'index.html');
        }

        const contentType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
        response.writeHead(200, { 'Content-Type': contentType });
        createReadStream(filePath).pipe(response);
    } catch {
        send(response, 404, 'Not found');
    }
});

server.listen(port, () => {
    console.log(`CineApp disponible en http://localhost:${port}`);
});
