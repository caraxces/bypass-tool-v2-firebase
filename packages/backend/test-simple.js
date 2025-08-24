const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/health') {
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running (Node.js)'
    }));
  } else if (req.url === '/') {
    res.end(JSON.stringify({
      message: 'Bypass Tool Pro API (Node.js)',
      version: '1.0.0',
      status: 'running'
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
