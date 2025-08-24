import { FastifyInstance } from 'fastify';
import {
  getTagsHandler,
  createTagHandler,
  updateTagHandler,
  deleteTagHandler,
  getTagByIdHandler
} from './tag.controller';

async function tagRoutes(server: FastifyInstance) {
  // Get all tags
  server.get('/', getTagsHandler);
  
  // Get tag by ID
  server.get('/:id', getTagByIdHandler);
  
  // Create new tag
  server.post('/', createTagHandler);
  
  // Update tag
  server.put('/:id', updateTagHandler);
  
  // Delete tag
  server.delete('/:id', deleteTagHandler);
}

export default tagRoutes;
