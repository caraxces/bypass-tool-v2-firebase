import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true,
});

// Register CORS plugin
server.register(cors, {
  origin: process.env['CORS_ORIGIN'] || '*',
});

// Simple health check route
server.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running without database'
  };
});

// Root route
server.get('/', async (request, reply) => {
  return { 
    message: 'Bypass Tool Pro API (Simple)', 
    version: '1.0.0',
    status: 'running'
  };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env['PORT'] || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server is running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
