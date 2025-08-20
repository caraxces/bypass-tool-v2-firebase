import { FastifyInstance } from 'fastify';
import { createProjectHandler, getProjectsHandler } from './project.controller';

async function projectRoutes(server: FastifyInstance) {
  server.post('/', createProjectHandler);
  server.get('/', getProjectsHandler);
}

module.exports = projectRoutes;
