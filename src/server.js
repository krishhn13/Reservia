let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path'); // Added to handle file paths and extensions

let server = http.createServer((req, res) => {
    // Parse the URL
    let parsedUrl = url.parse(req.url, true); 
    let pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname; // Default to index.html for "/"

    // Resolve the file path
    let filePath = path.join(__dirname, pathname);

    // Determine the content type based on file extension
    let extname = path.extname(filePath);
    let contentType = 'text/html'; // Default content type

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

    // Check if the file exists and serve it
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, send 404
                send404(res);
            } else {
                // Some server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // File found, serve it with correct content type
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
