import { FastifyInstance } from 'fastify';
import {
  getImportsHandler,
  createImportHandler,
  getImportByIdHandler,
  extractDataHandler,
  getPageStructureHandler
} from './xml-import.controller';

async function xmlImportRoutes(server: FastifyInstance) {
  // Get all XML imports
  server.get('/', getImportsHandler);
  
  // Get XML import by ID
  server.get('/:id', getImportByIdHandler);
  
  // Create new XML import
  server.post('/', createImportHandler);
  
  // Extract data from URL using XPath
  server.post('/extract', extractDataHandler);
  
  // Get page structure
  server.get('/structure', getPageStructureHandler);
}

export default xmlImportRoutes;
