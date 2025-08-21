import { db } from './firebase';

export interface Role {
  id?: string;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const roleService = {
  async findRoles(): Promise<Role[]> {
    try {
      const snapshot = await db.collection('roles').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as Role[];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async createRole(data: { name: string; permissions: string[]; description?: string }): Promise<Role> {
    try {
      const now = new Date();
      const roleData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('roles').add(roleData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
      } as Role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  async findRoleById(id: string): Promise<Role | null> {
    try {
      const doc = await db.collection('roles').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
      } as Role;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('roles').doc(id).update(updateData);
      return this.findRoleById(id) as Promise<Role>;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  async deleteRole(id: string): Promise<void> {
    try {
      await db.collection('roles').doc(id).delete();
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }
};

export default roleService;
