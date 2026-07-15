const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
// Absolute path or relative path to images folder
const IMAGES_DIR = path.join(__dirname, '..', 'amul animate website 2', 'images');

const server = http.createServer((req, res) => {
    // Decoded URL to handle spaces or special characters
    const decodedUrl = decodeURIComponent(req.url);
    
    // Default file is index.html
    let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
    
    // Check if the request is for an image frame
    if (decodedUrl.startsWith('/images/')) {
        const fileName = path.basename(decodedUrl);
        filePath = path.join(IMAGES_DIR, fileName);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.woff2':
            contentType = 'font/woff2';
            break;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found: ' + filePath);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
