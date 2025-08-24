const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running on port 8080!'
    }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Bypass Tool Pro API (Port 8080)',
      version: '1.0.0',
      status: 'running'
    }));
  }
});

const port = 8080;
server.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log('Press Ctrl+C to stop');
});
