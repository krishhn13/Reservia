const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Predefined dummy users (for testing)
const users = {
    "testuser@reservia": "password123",
    "admin@reservia": "admin123",
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/signup') {
        // Signup logic (optional, you can comment this out for now)
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            if (!username || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username and password are required' }));
                return;
            }

            if (users[username]) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User already exists' }));
                return;
            }

            users[username] = password; // Add new user to the dummy database
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered successfully' }));
        });

    } else if (req.method === 'POST' && pathname === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            if (!username || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username and password are required' }));
                return;
            }

            if (users[username] && users[username] === password) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
        });

    } else {
        // Serve static files (HTML, CSS, JS)
        const filePath = path.join(__dirname, pathname === '/' ? '/index.html' : pathname);
        const extname = path.extname(filePath);
        const contentType = getContentType(extname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    send404(res);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf8');
            }
        });
    }
});

function getContentType(extname) {
    switch (extname) {
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        case '.wav': return 'audio/wav';
        default: return 'text/html';
    }
}

function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 - File Not Found');
    res.end();
}

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
