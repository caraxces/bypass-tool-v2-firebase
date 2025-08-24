const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/health') {
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running on port 3000'
    }));
  } else {
    res.end(JSON.stringify({
      message: 'Bypass Tool Pro API (Port 3000)',
      version: '1.0.0',
      status: 'running'
    }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
