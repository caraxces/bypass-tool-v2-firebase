import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

// Import all routes
import projectRoutes from '../../src/modules/project/project.routes';
import keywordRoutes from '../../src/modules/keyword/keyword.routes';
import schemaRoutes from '../../src/modules/schema/schema.routes';
import tagRoutes from '../../src/modules/tag/tag.routes';
import userRoutes from '../../src/modules/user/user.routes';
import roleRoutes from '../../src/modules/role/role.routes';
import xmlImportRoutes from '../../src/modules/xml-import/xml-import.routes';
import linkPositionRoutes from '../../src/modules/link-position/link-position.routes';
import keywordAnalysisRoutes from '../../src/modules/keyword-analysis/keyword-analysis.routes';
import hiddenLinkCheckerRoutes from '../../src/modules/hidden-link-checker/hidden-link-checker.routes';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Fastify app
const app = Fastify({
  logger: true,
});

// Register CORS plugin
app.register(cors, {
  origin: true, // Allow all origins for Firebase Functions
});

// Add Prisma to app context
app.decorate('prisma', prisma);

// Register all routes
app.register(projectRoutes, { prefix: '/api/projects' });
app.register(keywordRoutes, { prefix: '/api/keywords' });
app.register(schemaRoutes, { prefix: '/api/schemas' });
app.register(tagRoutes, { prefix: '/api/tags' });
app.register(userRoutes, { prefix: '/api/users' });
app.register(roleRoutes, { prefix: '/api/roles' });
app.register(xmlImportRoutes, { prefix: '/api/xml-imports' });
app.register(linkPositionRoutes, { prefix: '/api/link-positions' });
app.register(keywordAnalysisRoutes, { prefix: '/api/keyword-analysis' });
app.register(hiddenLinkCheckerRoutes, { prefix: '/api/hidden-link-checker' });

// Health check route with database connection
app.get('/health', async (request, reply) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      deployment: 'firebase-functions'
    };
  } catch (error) {
    app.log.error('Database connection failed:', error);
    return reply.status(500).send({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Root route
app.get('/', async (request, reply) => {
  return { 
    message: 'Bypass Tool Pro API - Firebase Functions', 
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

// Graceful shutdown for Firebase Functions
const gracefulShutdown = async () => {
  app.log.info('Shutting down gracefully...');
  await prisma.$disconnect();
};

// Export the Fastify app as a Firebase Function
export const api = functions.https.onRequest(async (req, res) => {
  try {
    await app.ready();
    app.server.emit('request', req, res);
  } catch (error) {
    app.log.error('Request handling error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Cleanup on function termination
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
