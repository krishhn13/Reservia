let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');

let server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true); 
    let pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

    let filePath = path.join(__dirname, pathname);

    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'application/javascript';
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
        case '.wav':
            contentType = 'audio/wav';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                send404(res);
            } 
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf8');
        }
    });
});

function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 - File Not Found');
    res.end();
}

server.listen(3000);
console.log('Server running at http://localhost:3000/');