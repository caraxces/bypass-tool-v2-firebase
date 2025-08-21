import { FastifyInstance } from 'fastify';
import {
  getSchemasHandler,
  createSchemaHandler,
  updateSchemaHandler,
  deleteSchemaHandler,
  getSchemaByIdHandler
} from './schema.controller';

async function schemaRoutes(server: FastifyInstance) {
  // Get all schemas
  server.get('/', getSchemasHandler);
  
  // Get schema by ID
  server.get('/:id', getSchemaByIdHandler);
  
  // Create new schema
  server.post('/', createSchemaHandler);
  
  // Update schema
  server.put('/:id', updateSchemaHandler);
  
  // Delete schema
  server.delete('/:id', deleteSchemaHandler);
}

module.exports = schemaRoutes;
