import { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserByIdHandler
} from './user.controller';

async function userRoutes(server: FastifyInstance) {
  // Get all users
  server.get('/', getUsersHandler);
  
  // Get user by ID
  server.get('/:id', getUserByIdHandler);
  
  // Create new user
  server.post('/', createUserHandler);
  
  // Update user
  server.put('/:id', updateUserHandler);
  
  // Delete user
  server.delete('/:id', deleteUserHandler);
}

module.exports = userRoutes;
