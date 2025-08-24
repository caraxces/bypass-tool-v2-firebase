console.log('Starting simple test...');

try {
  const http = require('http');
  console.log('HTTP module loaded successfully');
  
  const server = http.createServer((req, res) => {
    console.log('Request received:', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from test server!');
  });
  
  server.listen(3001, '127.0.0.1', () => {
    console.log('✅ Server is running on http://127.0.0.1:3001');
    console.log('✅ Press Ctrl+C to stop');
  });
  
  server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
