import { FastifyRequest, FastifyReply } from 'fastify';
import schemaService from '../../services/schema.service';

export const getSchemasHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const schemas = await schemaService.findSchemas();
    return reply.send({ success: true, data: schemas });
  } catch (error) {
    console.error('Error in getSchemasHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createSchemaHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, description, formFields, isPublic, createdBy } = request.body as {
      name: string;
      description?: string;
      formFields: any[];
      isPublic: boolean;
      createdBy: string;
    };
    
    if (!name || !formFields || typeof isPublic !== 'boolean' || !createdBy) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Name, formFields, isPublic, and createdBy are required' 
      });
    }

          const newSchema = await schemaService.createSchema({ 
        name, 
        formFields, 
        isPublic, 
        createdBy,
        ...(description && { description })
      });
    return reply.status(201).send({ success: true, data: newSchema });
  } catch (error) {
    console.error('Error in createSchemaHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const updateSchemaHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<{
      name: string;
      description: string;
      formFields: any[];
      isPublic: boolean;
    }>;
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Schema ID is required' });
    }

    const updatedSchema = await schemaService.updateSchema(id, updateData);
    if (!updatedSchema) {
      return reply.status(404).send({ success: false, error: 'Schema not found' });
    }

    return reply.send({ success: true, data: updatedSchema });
  } catch (error) {
    console.error('Error in updateSchemaHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteSchemaHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Schema ID is required' });
    }

    await schemaService.deleteSchema(id);
    return reply.send({ success: true, message: 'Schema deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSchemaHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getSchemaByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Schema ID is required' });
    }

    const schema = await schemaService.findSchemaById(id);
    if (!schema) {
      return reply.status(404).send({ success: false, error: 'Schema not found' });
    }

    return reply.send({ success: true, data: schema });
  } catch (error) {
    console.error('Error in getSchemaByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
