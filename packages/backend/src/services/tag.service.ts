import { db } from './firebase';

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

export const tagService = {
  async findTags(): Promise<Tag[]> {
    try {
      const snapshot = await db.collection('tags').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Tag[];
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  async createTag(data: { name: string; domain: string; description?: string; createdBy: string }): Promise<Tag> {
    try {
      const now = new Date();
      const tagData = {
        ...data,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('tags').add(tagData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
      } as Tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  async findTagById(id: string): Promise<Tag | null> {
    try {
      const doc = await db.collection('tags').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
      } as Tag;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  },

  async updateTag(id: string, data: Partial<Tag>): Promise<Tag> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('tags').doc(id).update(updateData);
      return this.findTagById(id) as Promise<Tag>;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  },

  async deleteTag(id: string): Promise<void> {
    try {
      await db.collection('tags').doc(id).delete();
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
};

export default tagService;
