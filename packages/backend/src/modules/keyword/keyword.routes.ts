import { FastifyInstance } from 'fastify';
import {
  getKeywordsHandler,
  createKeywordHandler,
  updateKeywordHandler,
  deleteKeywordHandler,
  getKeywordByIdHandler
} from './keyword.controller';

async function keywordRoutes(server: FastifyInstance) {
  // Get all keywords (with optional projectId filter)
  server.get('/', getKeywordsHandler);
  
  // Get keyword by ID
  server.get('/:id', getKeywordByIdHandler);
  
  // Create new keyword
  server.post('/', createKeywordHandler);
  
  // Update keyword
  server.put('/:id', updateKeywordHandler);
  
  // Delete keyword
  server.delete('/:id', deleteKeywordHandler);
}

export default keywordRoutes;
