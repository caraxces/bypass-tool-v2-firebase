import { FastifyInstance } from 'fastify';
import {
  getLinkPositionsHandler,
  createLinkPositionHandler,
  updateLinkPositionHandler,
  deleteLinkPositionHandler,
  getLinkPositionByIdHandler
} from './link-position.controller';

async function linkPositionRoutes(server: FastifyInstance) {
  // Get all link positions (with optional projectId filter)
  server.get('/', getLinkPositionsHandler);
  
  // Get link position by ID
  server.get('/:id', getLinkPositionByIdHandler);
  
  // Create new link position
  server.post('/', createLinkPositionHandler);
  
  // Update link position
  server.put('/:id', updateLinkPositionHandler);
  
  // Delete link position
  server.delete('/:id', deleteLinkPositionHandler);
}

export default linkPositionRoutes;
