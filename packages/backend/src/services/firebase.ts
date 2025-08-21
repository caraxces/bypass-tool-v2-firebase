// Use mock Firebase for development
import mockAdmin from './firebase-mock';

// Initialize mock Firebase Admin
mockAdmin.initializeApp();

const admin = mockAdmin;
export const db: any = admin.firestore();

// ===== INTERFACES =====

export interface Project {
  id?: string;
  name: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive';
  description?: string;
}

export interface Keyword {
  id?: string;
  projectId: string;
  keyword: string;
  mainKeyword?: string;
  position?: number;
  resultLink?: string;
  status: 'pending' | 'checked' | 'failed';
  checkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schema {
  id?: string;
  name: string;
  description?: string;
  formFields: FormField[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

export interface Tag {
  id?: string;
  name: string;
  domain: string;
  description?: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id?: string;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface XMLImport {
  id?: string;
  url: string;
  xpath: string;
  result: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  createdBy: string;
  createdAt: Date;
}

export interface LinkPosition {
  id?: string;
  projectId: string;
  keyword: string;
  domain: string;
  position: number;
  resultLink: string;
  contentArea?: string;
  status: 'checked' | 'failed';
  checkedAt: Date;
  createdAt: Date;
}

// ===== PROJECT SERVICE =====

export const projectService = {
  async findProjects(): Promise<Project[]> {
    try {
      const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        } as Project;
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async createProject(data: { name: string; domain: string; description?: string }): Promise<Project> {
    try {
      const now = new Date();
      const projectData = {
        ...data,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('projects').add(projectData);
      const doc = await docRef.get();
      
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate?.() || docData?.createdAt || now,
        updatedAt: docData?.updatedAt?.toDate?.() || docData?.updatedAt || now,
      } as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async findProjectById(id: string): Promise<Project | null> {
    try {
      const doc = await db.collection('projects').doc(id).get();
      if (!doc.exists) return null;
      
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate?.() || docData?.createdAt || new Date(),
        updatedAt: docData?.updatedAt?.toDate?.() || docData?.updatedAt || new Date(),
      } as Project;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('projects').doc(id).update(updateData);
      return this.findProjectById(id) as Promise<Project>;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await db.collection('projects').doc(id).delete();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

export default projectService;
