import { FastifyRequest, FastifyReply } from 'fastify';
import linkPositionService from '../../services/link-position.service';

export const getLinkPositionsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { projectId } = request.query as { projectId?: string };
    const positions = await linkPositionService.findLinkPositions(projectId);
    return reply.send({ success: true, data: positions });
  } catch (error) {
    console.error('Error in getLinkPositionsHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createLinkPositionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { projectId, keyword, domain, position, resultLink, contentArea } = request.body as {
      projectId: string;
      keyword: string;
      domain: string;
      position: number;
      resultLink: string;
      contentArea?: string;
    };
    
    if (!projectId || !keyword || !domain || typeof position !== 'number' || !resultLink) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Project ID, keyword, domain, position, and resultLink are required' 
      });
    }

          const newPosition = await linkPositionService.createLinkPosition({ 
        projectId, 
        keyword, 
        domain, 
        position, 
        resultLink, 
        ...(contentArea && { contentArea })
      });
    return reply.status(201).send({ success: true, data: newPosition });
  } catch (error) {
    console.error('Error in createLinkPositionHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const updateLinkPositionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const updateData = request.body as Partial<{
      position: number;
      resultLink: string;
      contentArea: string;
      status: 'checked' | 'failed';
    }>;
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Position ID is required' });
    }

    const updatedPosition = await linkPositionService.updateLinkPosition(id, updateData);
    if (!updatedPosition) {
      return reply.status(404).send({ success: false, error: 'Position not found' });
    }

    return reply.send({ success: true, data: updatedPosition });
  } catch (error) {
    console.error('Error in updateLinkPositionHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const deleteLinkPositionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Position ID is required' });
    }

    await linkPositionService.deleteLinkPosition(id);
    return reply.send({ success: true, message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error in deleteLinkPositionHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const getLinkPositionByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Position ID is required' });
    }

    const position = await linkPositionService.findLinkPositionById(id);
    if (!position) {
      return reply.status(404).send({ success: false, error: 'Position not found' });
    }

    return reply.send({ success: true, data: position });
  } catch (error) {
    console.error('Error in getLinkPositionByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
