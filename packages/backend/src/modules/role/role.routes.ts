import { FastifyInstance } from 'fastify';
import {
  getRolesHandler,
  createRoleHandler,
  updateRoleHandler,
  deleteRoleHandler,
  getRoleByIdHandler
} from './role.controller';

async function roleRoutes(server: FastifyInstance) {
  // Get all roles
  server.get('/', getRolesHandler);
  
  // Get role by ID
  server.get('/:id', getRoleByIdHandler);
  
  // Create new role
  server.post('/', createRoleHandler);
  
  // Update role
  server.put('/:id', updateRoleHandler);
  
  // Delete role
  server.delete('/:id', deleteRoleHandler);
}

module.exports = roleRoutes;
