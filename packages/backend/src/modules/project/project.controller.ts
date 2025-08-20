import { FastifyRequest, FastifyReply } from 'fastify';
import { createProject, findProjects } from './project.service';

export const getProjectsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const projects = await findProjects();
    return reply.send(projects);
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const createProjectHandler = async (
  request: FastifyRequest<{ Body: { name: string; domain: string } }>,
  reply: FastifyReply
) => {
  try {
    const project = await createProject(request.body);
    return reply.status(201).send(project);
  } catch (error) {
    // You might want to add more specific error handling, e.g., for unique constraint violation
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
