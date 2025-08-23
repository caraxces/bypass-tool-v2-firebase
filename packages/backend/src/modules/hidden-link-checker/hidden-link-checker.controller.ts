import { FastifyRequest, FastifyReply } from 'fastify';
import hiddenLinkCheckerService from '../../services/hidden-link-checker.service';

export const checkLinkPositionInContentHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keyword, domain, contentXPath } = request.body as {
      keyword: string;
      domain: string;
      contentXPath: string;
    };
    
    if (!keyword || !domain || !contentXPath) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Keyword, domain, và contentXPath là bắt buộc' 
      });
    }

    console.log(`Kiểm tra vị trí link cho: "${keyword}" trên domain "${domain}"`);

    const result = await hiddenLinkCheckerService.checkLinkPositionInContent(keyword, domain, contentXPath);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: 'Kiểm tra vị trí link thành công'
    });
  } catch (error) {
    console.error('Error in checkLinkPositionInContentHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const analyzeContentAreaHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { url, contentXPath } = request.body as {
      url: string;
      contentXPath: string;
    };
    
    if (!url || !contentXPath) {
      return reply.status(400).send({ 
        success: false, 
        error: 'URL và contentXPath là bắt buộc' 
      });
    }

    console.log(`Phân tích vùng nội dung từ: ${url}`);

    const result = await hiddenLinkCheckerService.analyzeContentArea(url, contentXPath);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: 'Phân tích vùng nội dung thành công'
    });
  } catch (error) {
    console.error('Error in analyzeContentAreaHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const checkMultipleKeywordsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keywords, domain, contentXPath } = request.body as {
      keywords: string[];
      domain: string;
      contentXPath: string;
    };
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0 || !domain || !contentXPath) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Keywords array, domain, và contentXPath là bắt buộc' 
      });
    }

    console.log(`Kiểm tra ${keywords.length} từ khóa cho domain: ${domain}`);

    const result = await hiddenLinkCheckerService.checkMultipleKeywords(keywords, domain, contentXPath);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: `Kiểm tra ${keywords.length} từ khóa thành công`
    });
  } catch (error) {
    console.error('Error in checkMultipleKeywordsHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const checkIfLinkHiddenHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { url, selector } = request.body as {
      url: string;
      selector: string;
    };
    
    if (!url || !selector) {
      return reply.status(400).send({ 
        success: false, 
        error: 'URL và selector là bắt buộc' 
      });
    }

    console.log(`Kiểm tra link ẩn tại: ${url} với selector: ${selector}`);

    // Tạo một page mới để kiểm tra link ẩn
    const browser = await hiddenLinkCheckerService['getBrowser']();
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      const isHidden = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        
        const computedStyle = window.getComputedStyle(element);
        
        // Kiểm tra các thuộc tính ẩn
        const hiddenProperties = [
          'display: none',
          'visibility: hidden',
          'opacity: 0',
          'position: absolute',
          'left: -9999px',
          'clip: rect(0, 0, 0, 0)'
        ];

        return hiddenProperties.some(prop => {
          const [property, value] = prop.split(': ');
          return computedStyle[property as any] === value;
        });
      }, selector);

      const hiddenMethod = isHidden ? await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) return 'unknown';
        
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.display === 'none') return 'display: none';
        if (computedStyle.visibility === 'hidden') return 'visibility: hidden';
        if (computedStyle.opacity === '0') return 'opacity: 0';
        if (computedStyle.position === 'absolute' && computedStyle.left === '-9999px') return 'position: absolute + left: -9999px';
        if (computedStyle.clip === 'rect(0, 0, 0, 0)') return 'clip: rect(0, 0, 0, 0)';
        
        return 'other';
      }, selector) : undefined;

      return reply.send({ 
        success: true, 
        data: {
          url,
          selector,
          isHidden,
          hiddenMethod
        },
        message: 'Kiểm tra link ẩn thành công'
      });
    } finally {
      await page.close();
    }
  } catch (error) {
    console.error('Error in checkIfLinkHiddenHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};
