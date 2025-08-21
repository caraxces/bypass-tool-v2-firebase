import { FastifyRequest, FastifyReply } from 'fastify';
import keywordService from '../../services/keyword.service';

export const getKeywordsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { projectId } = request.query as { projectId?: string };
    const keywords = await keywordService.findKeywords(projectId);
    return reply.send({ success: true, data: keywords });
  } catch (error) {
    console.error('Error in getKeywordsHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createKeywordHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { projectId, keyword } = request.body as { projectId: string; keyword: string };
    
    if (!projectId || !keyword) {
      return reply.status(400).send({ success: false, error: 'Project ID and keyword are required' });
    }

    const newKeyword = await keywordService.createKeyword({ projectId, keyword });
    return reply.status(201).send({ success: true, data: newKeyword });
  } catch (error) {
    console.error('Error in createKeywordHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export   const updateKeywordHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<{ mainKeyword: string; position: number; resultLink: string; status: 'pending' | 'checked' | 'failed' }>;
      
      if (!id) {
        return reply.status(400).send({ success: false, error: 'Keyword ID is required' });
      }

      const updatedKeyword = await keywordService.updateKeyword(id, updateData);
    if (!updatedKeyword) {
      return reply.status(404).send({ success: false, error: 'Keyword not found' });
    }

    return reply.send({ success: true, data: updatedKeyword });
  } catch (error) {
    console.error('Error in updateKeywordHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteKeywordHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Keyword ID is required' });
    }

    await keywordService.deleteKeyword(id);
    return reply.send({ success: true, message: 'Keyword deleted successfully' });
  } catch (error) {
    console.error('Error in deleteKeywordHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getKeywordByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Keyword ID is required' });
    }

    const keyword = await keywordService.findKeywordById(id);
    if (!keyword) {
      return reply.status(404).send({ success: false, error: 'Keyword not found' });
    }

    return reply.send({ success: true, data: keyword });
  } catch (error) {
    console.error('Error in getKeywordByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
