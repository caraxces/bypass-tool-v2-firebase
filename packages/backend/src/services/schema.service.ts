import { db } from './firebase';

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

export const schemaService = {
  async findSchemas(): Promise<Schema[]> {
    try {
      const snapshot = await db.collection('schemas').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Schema[];
    } catch (error) {
      console.error('Error fetching schemas:', error);
      throw error;
    }
  },

  async createSchema(data: { name: string; description?: string; formFields: FormField[]; isPublic: boolean; createdBy: string }): Promise<Schema> {
    try {
      const now = new Date();
      const schemaData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('schemas').add(schemaData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
      } as Schema;
    } catch (error) {
      console.error('Error creating schema:', error);
      throw error;
    }
  },

  async findSchemaById(id: string): Promise<Schema | null> {
    try {
      const doc = await db.collection('schemas').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
      } as Schema;
    } catch (error) {
      console.error('Error fetching schema:', error);
      throw error;
    }
  },

  async updateSchema(id: string, data: Partial<Schema>): Promise<Schema> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('schemas').doc(id).update(updateData);
      return this.findSchemaById(id) as Promise<Schema>;
    } catch (error) {
      console.error('Error updating schema:', error);
      throw error;
    }
  },

  async deleteSchema(id: string): Promise<void> {
    try {
      await db.collection('schemas').doc(id).delete();
    } catch (error) {
      console.error('Error deleting schema:', error);
      throw error;
    }
  }
};

export default schemaService;
