import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    // For local development, use service account key
    credential: admin.credential.cert(require('../../firebase-service-account.json')),
    // For production, use application default
    // credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export interface Project {
  id?: string;
  name: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}

export const projectService = {
  async findProjects(): Promise<Project[]> {
    try {
      const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async createProject(data: { name: string; domain: string }): Promise<Project> {
    try {
      const now = new Date();
      const projectData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('projects').add(projectData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
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
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
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
