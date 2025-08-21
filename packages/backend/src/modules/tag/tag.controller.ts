import { FastifyRequest, FastifyReply } from 'fastify';
import tagService from '../../services/tag.service';

export const getTagsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const tags = await tagService.findTags();
    return reply.send({ success: true, data: tags });
  } catch (error) {
    console.error('Error in getTagsHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, domain, description, createdBy } = request.body as {
      name: string;
      domain: string;
      description?: string;
      createdBy: string;
    };
    
    if (!name || !domain || !createdBy) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Name, domain, and createdBy are required' 
      });
    }

          const newTag = await tagService.createTag({ 
        name, 
        domain, 
        createdBy,
        ...(description && { description })
      });
    return reply.status(201).send({ success: true, data: newTag });
  } catch (error) {
    console.error('Error in createTagHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const updateTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<{
      name: string;
      domain: string;
      description: string;
      status: 'active' | 'inactive';
    }>;
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Tag ID is required' });
    }

    const updatedTag = await tagService.updateTag(id, updateData);
    if (!updatedTag) {
      return reply.status(404).send({ success: false, error: 'Tag not found' });
    }

    return reply.send({ success: true, data: updatedTag });
  } catch (error) {
    console.error('Error in updateTagHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Tag ID is required' });
    }

    await tagService.deleteTag(id);
    return reply.send({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTagHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getTagByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Tag ID is required' });
    }

    const tag = await tagService.findTagById(id);
    if (!tag) {
      return reply.status(404).send({ success: false, error: 'Tag not found' });
    }

    return reply.send({ success: true, data: tag });
  } catch (error) {
    console.error('Error in getTagByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
