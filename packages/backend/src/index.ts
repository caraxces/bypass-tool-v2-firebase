import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

// Import all routes
const projectRoutes = require('./modules/project/project.routes');
const keywordRoutes = require('./modules/keyword/keyword.routes');
const schemaRoutes = require('./modules/schema/schema.routes');
const tagRoutes = require('./modules/tag/tag.routes');
const userRoutes = require('./modules/user/user.routes');
const roleRoutes = require('./modules/role/role.routes');
import xmlImportRoutes from './modules/xml-import/xml-import.routes';
const linkPositionRoutes = require('./modules/link-position/link-position.routes');

dotenv.config();

const server = Fastify({
  logger: true,
});

// Register CORS plugin
server.register(cors, {
  origin: '*', // Allow all origins for development
});

// Register all routes
server.register(projectRoutes, { prefix: '/api/projects' });
server.register(keywordRoutes, { prefix: '/api/keywords' });
server.register(schemaRoutes, { prefix: '/api/schemas' });
server.register(tagRoutes, { prefix: '/api/tags' });
server.register(userRoutes, { prefix: '/api/users' });
server.register(roleRoutes, { prefix: '/api/roles' });
server.register(xmlImportRoutes, { prefix: '/api/xml-imports' });
server.register(linkPositionRoutes, { prefix: '/api/link-positions' });

// Health check route
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root route
server.get('/', async (request, reply) => {
  return { 
    message: 'Bypass Tool Pro API', 
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      keywords: '/api/keywords',
      schemas: '/api/schemas',
      tags: '/api/tags',
      users: '/api/users',
      roles: '/api/roles',
      xmlImports: '/api/xml-imports',
      linkPositions: '/api/link-positions'
    }
  };
});

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: parseInt(process.env['PORT'] || '3001', 10), host: '0.0.0.0' });
    server.log.info(`🚀 Server listening on http://localhost:3001`);
    server.log.info(`📚 API Documentation available at http://localhost:3001`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
