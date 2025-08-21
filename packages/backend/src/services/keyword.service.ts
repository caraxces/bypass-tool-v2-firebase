import { db } from './firebase';

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

export const keywordService = {
  async findKeywords(projectId?: string): Promise<Keyword[]> {
    try {
      let query: any = db.collection('keywords');
      if (projectId) {
        query = query.where('projectId', '==', projectId);
      }
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
        checkedAt: doc.data()['checkedAt']?.toDate(),
      })) as Keyword[];
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  },

  async createKeyword(data: { projectId: string; keyword: string }): Promise<Keyword> {
    try {
      const now = new Date();
      const keywordData = {
        ...data,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('keywords').add(keywordData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
      } as Keyword;
    } catch (error) {
      console.error('Error creating keyword:', error);
      throw error;
    }
  },

  async updateKeyword(id: string, data: Partial<Keyword>): Promise<Keyword> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('keywords').doc(id).update(updateData);
      return this.findKeywordById(id) as Promise<Keyword>;
    } catch (error) {
      console.error('Error updating keyword:', error);
      throw error;
    }
  },

  async findKeywordById(id: string): Promise<Keyword | null> {
    try {
      const doc = await db.collection('keywords').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
        checkedAt: doc.data()?.['checkedAt']?.toDate(),
      } as Keyword;
    } catch (error) {
      console.error('Error fetching keyword:', error);
      throw error;
    }
  },

  async deleteKeyword(id: string): Promise<void> {
    try {
      await db.collection('keywords').doc(id).delete();
    } catch (error) {
      console.error('Error deleting keyword:', error);
      throw error;
    }
  }
};

export default keywordService;
