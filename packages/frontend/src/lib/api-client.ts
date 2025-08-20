const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Define types locally to avoid dependency on @prisma/client
export interface Project {
    id: string;
    name: string;
    domain: string;
    createdAt: string;
    updatedAt: string;
}

type ProjectCreateData = {
    name: string;
    domain: string;
}

export const apiClient = {
    getProjects: async (): Promise<Project[]> => {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return response.json();
    },

    createProject: async (data: ProjectCreateData): Promise<Project> => {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        return response.json();
    },
};
