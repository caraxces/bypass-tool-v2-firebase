import { FastifyRequest, FastifyReply } from 'fastify';
import xmlImportService from '../../services/xml-import.service';
import xmlExtractionService from '../../services/xml-extraction.service';

export const getImportsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const imports = await xmlImportService.findImports();
    return reply.send({ success: true, data: imports });
  } catch (error) {
    console.error('Error in getImportsHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const createImportHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { url, xpath, result, status, errorMessage, createdBy } = request.body as {
      url: string;
      xpath: string;
      result: string;
      status: 'success' | 'failed';
      errorMessage?: string;
      createdBy: string;
    };
    
    if (!url || !xpath || !result || !status || !createdBy) {
      return reply.status(400).send({ 
        success: false, 
        error: 'URL, XPath, result, status, and createdBy are required' 
      });
    }

    const newImport = await xmlImportService.createImport({ 
      url, 
      xpath, 
      result, 
      status, 
      createdBy,
      ...(errorMessage && { errorMessage })
    });
    return reply.status(201).send({ success: true, data: newImport });
  } catch (error) {
    console.error('Error in createImportHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};

export const extractDataHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { url, xpath, createdBy } = request.body as {
      url: string;
      xpath: string;
      createdBy: string;
    };
    
    if (!url || !xpath || !createdBy) {
      return reply.status(400).send({ 
        success: false, 
        error: 'URL, XPath, and createdBy are required' 
      });
    }

    console.log(`Nhận yêu cầu trích xuất từ: ${url} với XPath: ${xpath}`);

    // Sử dụng method mới để trích xuất và lưu dữ liệu
    const newImport = await xmlImportService.extractAndImport(url, xpath, createdBy);
    
    return reply.status(201).send({ 
      success: true, 
      data: newImport,
      message: 'Trích xuất dữ liệu thành công'
    });
  } catch (error) {
    console.error('Error in extractDataHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const getPageStructureHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { url } = request.query as { url: string };
    
    if (!url) {
      return reply.status(400).send({ 
        success: false, 
        error: 'URL parameter is required' 
      });
    }

    console.log(`Nhận yêu cầu lấy cấu trúc trang từ: ${url}`);

    // Sử dụng service để lấy cấu trúc trang
    const result = await xmlExtractionService.getPageStructure(url);
    
    if (result.success) {
      return reply.send({ 
        success: true, 
        data: result.structure,
        message: 'Lấy cấu trúc trang thành công'
      });
    } else {
      return reply.status(500).send({ 
        success: false, 
        error: result.error || 'Không thể lấy cấu trúc trang'
      });
    }
  } catch (error) {
    console.error('Error in getPageStructureHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const getImportByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    
    if (!id) {
      return reply.status(400).send({ success: false, error: 'Import ID is required' });
    }

    const importData = await xmlImportService.findImportById(id);
    if (!importData) {
      return reply.status(404).send({ success: false, error: 'Import not found' });
    }

    return reply.send({ success: true, data: importData });
  } catch (error) {
    console.error('Error in getImportByIdHandler:', error);
    return reply.status(500).send({ success: false, error: 'Internal server error' });
  }
};
