import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../../services/user.service';

export const getUsersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.findUsers();
    return reply.send({ success: true, data: users });
  } catch (error) {
    console.error('Error in getUsersHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, name, role } = request.body as {
      email: string;
      name: string;
      role: 'admin' | 'user' | 'moderator';
    };
    
    if (!email || !name || !role) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Email, name, and role are required' 
      });
    }

    const newUser = await userService.createUser({ email, name, role });
    return reply.status(201).send({ success: true, data: newUser });
  } catch (error) {
    console.error('Error in createUserHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const updateUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<{
      email: string;
      name: string;
      role: 'admin' | 'user' | 'moderator';
      status: 'active' | 'inactive';
    }>;
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'User ID is required' });
    }

    const updatedUser = await userService.updateUser(id, updateData);
    if (!updatedUser) {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }

    return reply.send({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error in updateUserHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'User ID is required' });
    }

    await userService.deleteUser(id);
    return reply.send({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUserHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getUserByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'User ID is required' });
    }

    const user = await userService.findUserById(id);
    if (!user) {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }

    return reply.send({ success: true, data: user });
  } catch (error) {
    console.error('Error in getUserByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
