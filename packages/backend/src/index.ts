import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
const projectRoutes = require('./modules/project/project.routes');

dotenv.config();

const server = Fastify({
  logger: true,
});

// Register CORS plugin
server.register(cors, {
  origin: '*', // Allow all origins for development
});

// Register routes
server.register(projectRoutes, { prefix: '/api/projects' });


// Declare a health check route
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: parseInt(process.env['PORT'] || '3001', 10), host: '0.0.0.0' });
    server.log.info(`Server listening on http://localhost:3001`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
