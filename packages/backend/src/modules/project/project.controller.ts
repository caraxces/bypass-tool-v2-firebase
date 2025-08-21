import { FastifyRequest, FastifyReply } from 'fastify';
import { createProject, findProjects } from './project.service';

export const getProjectsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const projects = await findProjects();
    return reply.send({ 
      success: true, 
      data: projects,
      message: 'Lấy danh sách dự án thành công'
    });
  } catch (error) {
    console.error('Error in getProjectsHandler:', error);
    return reply.status(500).send({ 
      success: false, 
      error: 'Lỗi server nội bộ' 
    });
  }
};

export const createProjectHandler = async (
  request: FastifyRequest<{ Body: { name: string; domain: string; description?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { name, domain, description } = request.body;
    
    // Validation
    if (!name || !domain) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Tên dự án và domain là bắt buộc' 
      });
    }
    
    console.log('Đang tạo dự án:', { name, domain, description });
    
    const projectData: { name: string; domain: string; description?: string } = {
      name,
      domain,
      ...(description && { description })
    };
    
    const project = await createProject(projectData);
    
    console.log('Dự án đã được tạo:', project);
    
    return reply.status(201).send({ 
      success: true, 
      data: project,
      message: 'Dự án đã được tạo thành công'
    });
  } catch (error) {
    console.error('Error in createProjectHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Lỗi server nội bộ';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};
