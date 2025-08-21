import { FastifyRequest, FastifyReply } from 'fastify';
import roleService from '../../services/role.service';

export const getRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const roles = await roleService.findRoles();
    return reply.send({ success: true, data: roles });
  } catch (error) {
    console.error('Error in getRolesHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createRoleHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, permissions, description } = request.body as {
      name: string;
      permissions: string[];
      description?: string;
    };
    
    if (!name || !permissions || !Array.isArray(permissions)) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Name and permissions array are required' 
      });
    }

          const newRole = await roleService.createRole({ 
        name, 
        permissions, 
        ...(description && { description })
      });
    return reply.status(201).send({ success: true, data: newRole });
  } catch (error) {
    console.error('Error in createRoleHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const updateRoleHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<{
      name: string;
      permissions: string[];
      description: string;
    }>;
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Role ID is required' });
    }

    const updatedRole = await roleService.updateRole(id, updateData);
    if (!updatedRole) {
      return reply.status(404).send({ success: false, error: 'Role not found' });
    }

    return reply.send({ success: true, data: updatedRole });
  } catch (error) {
    console.error('Error in updateRoleHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteRoleHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Role ID is required' });
    }

    await roleService.deleteRole(id);
    return reply.send({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error in deleteRoleHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getRoleByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Role ID is required' });
    }

    const role = await roleService.findRoleById(id);
    if (!role) {
      return reply.status(404).send({ success: false, error: 'Role not found' });
    }

    return reply.send({ success: true, data: role });
  } catch (error) {
    console.error('Error in getRoleByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
