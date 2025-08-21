import { db } from './firebase';
import xmlExtractionService, { ExtractionResult } from './xml-extraction.service';

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

export const xmlImportService = {
  async findImports(): Promise<XMLImport[]> {
    try {
      const snapshot = await db.collection('xmlImports').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        } as XMLImport;
      });
    } catch (error) {
      console.error('Error fetching XML imports:', error);
      throw error;
    }
  },

  async createImport(data: { url: string; xpath: string; result: string; status: 'success' | 'failed'; errorMessage?: string; createdBy: string }): Promise<XMLImport> {
    try {
      const now = new Date();
      const importData = {
        ...data,
        createdAt: now,
      };

      const docRef = await db.collection('xmlImports').add(importData);
      const doc = await docRef.get();
      
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate?.() || docData?.createdAt || now,
      } as XMLImport;
    } catch (error) {
      console.error('Error creating XML import:', error);
      throw error;
    }
  },

  async findImportById(id: string): Promise<XMLImport | null> {
    try {
      const doc = await db.collection('xmlImports').doc(id).get();
      if (!doc.exists) return null;
      
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData?.createdAt?.toDate?.() || docData?.createdAt || new Date(),
      } as XMLImport;
    } catch (error) {
      console.error('Error fetching XML import:', error);
      throw error;
    }
  },

  async extractAndImport(url: string, xpath: string, createdBy: string): Promise<XMLImport> {
    try {
      console.log(`Bắt đầu trích xuất từ URL: ${url} với XPath: ${xpath}`);
      
      // Sử dụng XML Extraction service để trích xuất dữ liệu
      const extractionResult: ExtractionResult = await xmlExtractionService.extractDataByXPath(url, xpath);
      
      if (!extractionResult.success) {
        // Nếu trích xuất thất bại, lưu vào database với status failed
        const failedImport = await this.createImport({
          url,
          xpath,
          result: '',
          status: 'failed',
          errorMessage: extractionResult.error || 'Lỗi không xác định',
          createdBy
        });
        
        throw new Error(extractionResult.error || 'Lỗi không xác định');
      }
      
      // Nếu trích xuất thành công, lưu vào database
      const successfulImport = await this.createImport({
        url,
        xpath,
        result: extractionResult.data || '',
        status: 'success',
        createdBy
      });
      
      console.log(`Trích xuất và lưu thành công: ${successfulImport.id}`);
      return successfulImport;
      
    } catch (error) {
      console.error('Lỗi trong quá trình extractAndImport:', error);
      throw error;
    }
  }
};

export default xmlImportService;
