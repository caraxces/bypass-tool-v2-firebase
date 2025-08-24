const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running!'
    }));
  } else if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Bypass Tool Pro API',
      version: '1.0.0',
      status: 'running'
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const port = 3001;
server.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log('Press Ctrl+C to stop');
});
