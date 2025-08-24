const http = require('http');
const url = require('url');

// Simple in-memory database
const db = {
  projects: [
    { id: '1', name: 'SEO Example Project', domain: 'example.com', status: 'active' }
  ],
  keywords: [
    { id: '1', text: 'SEO tools', projectId: '1', status: 'checked', position: 5 }
  ],
  systemConfigs: [
    { key: 'app_name', value: 'Bypass Tool Pro', type: 'string' }
  ]
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected (in-memory)',
        message: 'Backend is running successfully!'
      }));
      return;
    }
    
    // Root route
    if (path === '/' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        message: 'Bypass Tool Pro API',
        version: '1.0.0',
        status: 'running',
        database: 'PostgreSQL with Prisma (Supabase)',
        endpoints: {
          health: '/health',
          projects: '/api/projects',
          keywords: '/api/keywords',
          systemConfigs: '/api/system-configs'
        }
      }));
      return;
    }
    
    // API Routes
    if (path === '/api/projects' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: db.projects,
        count: db.projects.length
      }));
      return;
    }
    
    if (path === '/api/keywords' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: db.keywords,
        count: db.keywords.length
      }));
      return;
    }
    
    if (path === '/api/system-configs' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: db.systemConfigs,
        count: db.systemConfigs.length
      }));
      return;
    }
    
    // 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Route ${path} not found`,
      availableRoutes: ['/', '/health', '/api/projects', '/api/keywords', '/api/system-configs']
    }));
    
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }));
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`🚀 Bypass Tool Pro Backend is running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🌐 API Root: http://localhost:${port}/`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /health`);
  console.log(`   - GET /`);
  console.log(`   - GET /api/projects`);
  console.log(`   - GET /api/keywords`);
  console.log(`   - GET /api/system-configs`);
});
