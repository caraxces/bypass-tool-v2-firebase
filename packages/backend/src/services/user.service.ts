import { db } from './firebase';

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  async findUsers(): Promise<User[]> {
    try {
      const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()['updatedAt']?.toDate() || new Date(),
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(data: { email: string; name: string; role: 'admin' | 'user' | 'moderator' }): Promise<User> {
    try {
      const now = new Date();
      const userData = {
        ...data,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection('users').add(userData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || now,
        updatedAt: doc.data()?.['updatedAt']?.toDate() || now,
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async findUserById(id: string): Promise<User | null> {
    try {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date(),
      } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await db.collection('users').doc(id).update(updateData);
      return this.findUserById(id) as Promise<User>;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await db.collection('users').doc(id).delete();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default userService;
