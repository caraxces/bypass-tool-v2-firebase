// Mock Firebase for development
interface MockDoc {
  id: string;
  data: () => any;
  exists: boolean;
}

interface MockSnapshot {
  docs: MockDoc[];
  empty: boolean;
}

class MockCollection {
  private data: Map<string, any> = new Map();
  private collectionName: string;

  constructor(name: string) {
    this.collectionName = name;
  }

  add(data: any) {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    const docData = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.set(id, docData);
    
    return Promise.resolve({
      id,
      get: () => Promise.resolve({
        id,
        exists: true,
        data: () => docData,
      }),
    });
  }

  doc(id: string) {
    return {
      get: () => {
        const data = this.data.get(id);
        return Promise.resolve({
          id,
          exists: !!data,
          data: () => data,
        });
      },
      update: (updateData: any) => {
        const existing = this.data.get(id);
        if (existing) {
          this.data.set(id, {
            ...existing,
            ...updateData,
            updatedAt: new Date(),
          });
        }
        return Promise.resolve();
      },
      delete: () => {
        this.data.delete(id);
        return Promise.resolve();
      },
    };
  }

  where(field: string, operator: string, value: any) {
    return {
      orderBy: (field: string, direction?: string) => ({
        get: () => {
          const filteredData = Array.from(this.data.values()).filter(item => {
            if (operator === '==') {
              return item[field] === value;
            }
            return true;
          });

          const docs = filteredData.map(item => ({
            id: item.id,
            data: () => item,
            exists: true,
          }));

          return Promise.resolve({ docs, empty: docs.length === 0 });
        },
      }),
    };
  }

  orderBy(field: string, direction?: string) {
    return {
      get: () => {
        const sortedData = Array.from(this.data.values()).sort((a, b) => {
          const aValue = a[field];
          const bValue = b[field];
          
          if (direction === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });

        const docs = sortedData.map(item => ({
          id: item.id,
          data: () => item,
          exists: true,
        }));

        return Promise.resolve({ docs, empty: docs.length === 0 });
      },
    };
  }

  get() {
    const docs = Array.from(this.data.values()).map(item => ({
      id: item.id,
      data: () => item,
      exists: true,
    }));

    return Promise.resolve({ docs, empty: docs.length === 0 });
  }
}

class MockFirestore {
  private collections: Map<string, MockCollection> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection(name));
    }
    return this.collections.get(name)!;
  }
}

// Initialize mock admin
const mockAdmin = {
  initializeApp: () => {
    console.log('Mock Firebase Admin initialized.');
  },
  apps: [], // Simulate no apps initialized initially
  credential: {
    cert: (serviceAccount: any) => ({
      // Mock credential object
    }),
  },
  firestore: () => new MockFirestore(),
};

export default mockAdmin;
