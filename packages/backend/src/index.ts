import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import all routes
import projectRoutes from './modules/project/project.routes';
const keywordRoutes = require('./modules/keyword/keyword.routes');
const schemaRoutes = require('./modules/schema/schema.routes');
const tagRoutes = require('./modules/tag/tag.routes');
const userRoutes = require('./modules/user/user.routes');
const roleRoutes = require('./modules/role/role.routes');
import xmlImportRoutes from './modules/xml-import/xml-import.routes';
const linkPositionRoutes = require('./modules/link-position/link-position.routes');
import keywordAnalysisRoutes from './modules/keyword-analysis/keyword-analysis.routes';
import hiddenLinkCheckerRoutes from './modules/hidden-link-checker/hidden-link-checker.routes';

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const server = Fastify({
  logger: true,
});

// Register CORS plugin
server.register(cors, {
  origin: process.env['CORS_ORIGIN'] || '*', // Use environment variable
});

// Add Prisma to server context
server.decorate('prisma', prisma);

// Register all routes
server.register(projectRoutes, { prefix: '/api/projects' });
server.register(keywordRoutes, { prefix: '/api/keywords' });
server.register(schemaRoutes, { prefix: '/api/schemas' });
server.register(tagRoutes, { prefix: '/api/tags' });
server.register(userRoutes, { prefix: '/api/users' });
server.register(roleRoutes, { prefix: '/api/roles' });
server.register(xmlImportRoutes, { prefix: '/api/xml-imports' });
server.register(linkPositionRoutes, { prefix: '/api/link-positions' });
server.register(keywordAnalysisRoutes, { prefix: '/api/keyword-analysis' });
server.register(hiddenLinkCheckerRoutes, { prefix: '/api/hidden-link-checker' });

// Health check route with database connection
server.get('/health', async (request, reply) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    };
  } catch (error) {
    server.log.error('Database connection failed:', error as any);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return reply.status(500).send({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: errorMessage
    });
  }
});

// Root route
server.get('/', async (request, reply) => {
  return { 
    message: 'Bypass Tool Pro API', 
    version: '1.0.0',
    database: 'PostgreSQL with Prisma',
    deployment: 'Firebase Functions + Supabase',
    endpoints: {
      projects: '/api/projects',
      keywords: '/api/keywords',
      schemas: '/api/schemas',
      tags: '/api/tags',
      users: '/api/users',
      roles: '/api/roles',
      xmlImports: '/api/xml-imports',
      linkPositions: '/api/link-positions',
      keywordAnalysis: '/api/keyword-analysis',
      hiddenLinkChecker: '/api/hidden-link-checker'
    }
  };
});

// Graceful shutdown
const gracefulShutdown = async () => {
  server.log.info('Shutting down gracefully...');
  await prisma.$disconnect();
  await server.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Run the server!
const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    server.log.info('✅ Database connected successfully');
    
    await server.listen({ port: parseInt(process.env['PORT'] || '3001', 10), host: '0.0.0.0' });
    server.log.info(`🚀 Server listening on http://localhost:${process.env['PORT'] || '3001'}`);
    server.log.info(`📚 API Documentation available at http://localhost:${process.env['PORT'] || '3001'}`);
    server.log.info(`🗄️  Database: PostgreSQL with Prisma`);
  } catch (err) {
    server.log.error('Failed to start server:', err as any);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
