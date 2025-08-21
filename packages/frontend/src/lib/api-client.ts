const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Define types locally to avoid dependency on @prisma/client
export interface Project {
    id: string;
    name: string;
    domain: string;
    description?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Keyword {
    id: string;
    keyword: string;
    projectId: string;
    status: 'pending' | 'checked' | 'failed';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Schema {
    id: string;
    name: string;
    type: string;
    projectId: string;
    content: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    projectId: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

type ProjectCreateData = {
    name: string;
    domain: string;
    description?: string;
}

type KeywordCreateData = {
    keyword: string;
    projectId: string;
    status: 'pending' | 'checked' | 'failed';
    notes?: string;
}

type SchemaCreateData = {
    name: string;
    type: string;
    projectId: string;
    content: string;
    description?: string;
}

type TagCreateData = {
    name: string;
    color: string;
    projectId: string;
    description?: string;
}

export const apiClient = {
    getProjects: async (): Promise<Project[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    createProject: async (data: ProjectCreateData): Promise<Project> => {
        try {
            console.log('Sending project data:', data);
            
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Project created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    getKeywords: async (): Promise<Keyword[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/keywords`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching keywords:', error);
            throw error;
        }
    },

    createKeyword: async (data: KeywordCreateData): Promise<Keyword> => {
        try {
            console.log('Sending keyword data:', data);
            
            const response = await fetch(`${API_BASE_URL}/keywords`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Keyword created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating keyword:', error);
            throw error;
        }
    },

    getSchemas: async (): Promise<Schema[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/schemas`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching schemas:', error);
            throw error;
        }
    },

    createSchema: async (data: SchemaCreateData): Promise<Schema> => {
        try {
            console.log('Sending schema data:', data);
            
            const response = await fetch(`${API_BASE_URL}/schemas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Schema created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating schema:', error);
            throw error;
        }
    },

    getTags: async (): Promise<Tag[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/tags`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },

    createTag: async (data: TagCreateData): Promise<Tag> => {
        try {
            console.log('Sending tag data:', data);
            
            const response = await fetch(`${API_BASE_URL}/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Tag created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating tag:', error);
            throw error;
        }
    },
};
