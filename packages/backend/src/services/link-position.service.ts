import { db } from './firebase';

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

export const linkPositionService = {
  async findLinkPositions(projectId?: string): Promise<LinkPosition[]> {
    try {
      let query: any = db.collection('linkPositions');
      if (projectId) {
        query = query.where('projectId', '==', projectId);
      }
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        checkedAt: doc.data()['checkedAt']?.toDate() || new Date(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
      })) as LinkPosition[];
    } catch (error) {
      console.error('Error fetching link positions:', error);
      throw error;
    }
  },

  async createLinkPosition(data: { projectId: string; keyword: string; domain: string; position: number; resultLink: string; contentArea?: string }): Promise<LinkPosition> {
    try {
      const now = new Date();
      const positionData = {
        ...data,
        status: 'checked',
        checkedAt: now,
        createdAt: now,
      };

      const docRef = await db.collection('linkPositions').add(positionData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        checkedAt: doc.data()?.['checkedAt']?.toDate() || now,
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
      } as LinkPosition;
    } catch (error) {
      console.error('Error creating link position:', error);
      throw error;
    }
  },

  async findLinkPositionById(id: string): Promise<LinkPosition | null> {
    try {
      const doc = await db.collection('linkPositions').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        checkedAt: doc.data()?.['checkedAt']?.toDate() || new Date(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
      } as LinkPosition;
    } catch (error) {
      console.error('Error fetching link position:', error);
      throw error;
    }
  },

  async updateLinkPosition(id: string, data: Partial<LinkPosition>): Promise<LinkPosition> {
    try {
      const updateData = {
        ...data,
        checkedAt: new Date(),
      };

      await db.collection('linkPositions').doc(id).update(updateData);
      return this.findLinkPositionById(id) as Promise<LinkPosition>;
    } catch (error) {
      console.error('Error updating link position:', error);
      throw error;
    }
  },

  async deleteLinkPosition(id: string): Promise<void> {
    try {
      await db.collection('linkPositions').doc(id).delete();
    } catch (error) {
      console.error('Error deleting link position:', error);
      throw error;
    }
  }
};

export default linkPositionService;
