import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import projectRoutes from '../../src/modules/project/project.routes';

// Initialize Firebase Admin
admin.initializeApp();

// Create Fastify app
const app = Fastify({
  logger: true,
});

// Register CORS plugin
app.register(cors, {
  origin: true, // Allow all origins for Firebase Functions
});

// Register routes
app.register(projectRoutes, { prefix: '/api/projects' });

// Health check route
app.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Export the Fastify app as a Firebase Function
export const api = functions.https.onRequest(app);
