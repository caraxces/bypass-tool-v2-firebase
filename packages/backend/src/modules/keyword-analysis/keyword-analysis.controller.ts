import { FastifyRequest, FastifyReply } from 'fastify';
import keywordAnalysisService from '../../services/keyword-analysis.service';

export const compareKeywordsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keyword1, keyword2 } = request.body as {
      keyword1: string;
      keyword2: string;
    };
    
    if (!keyword1 || !keyword2) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Keyword1 và Keyword2 là bắt buộc' 
      });
    }

    console.log(`So sánh từ khóa: "${keyword1}" với "${keyword2}"`);

    const result = await keywordAnalysisService.compareKeywords(keyword1, keyword2);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: 'So sánh từ khóa thành công'
    });
  } catch (error) {
    console.error('Error in compareKeywordsHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const analyzeKeywordListHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keywords } = request.body as {
      keywords: string[];
    };
    
    if (!keywords || !Array.isArray(keywords) || keywords.length < 2) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Danh sách từ khóa phải có ít nhất 2 từ khóa' 
      });
    }

    console.log(`Phân tích danh sách ${keywords.length} từ khóa`);

    const result = await keywordAnalysisService.analyzeKeywordList(keywords);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: 'Phân tích danh sách từ khóa thành công'
    });
  } catch (error) {
    console.error('Error in analyzeKeywordListHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const findSimilarKeywordsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keyword, keywordList } = request.body as {
      keyword: string;
      keywordList: string[];
    };
    
    if (!keyword || !keywordList || !Array.isArray(keywordList)) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Keyword và danh sách từ khóa là bắt buộc' 
      });
    }

    console.log(`Tìm từ khóa tương tự cho: "${keyword}"`);

    const result = await keywordAnalysisService.findMostSimilarKeywords(keyword, keywordList);
    
    return reply.send({ 
      success: true, 
      data: result,
      message: 'Tìm từ khóa tương tự thành công'
    });
  } catch (error) {
    console.error('Error in findSimilarKeywordsHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};

export const getSearchResultsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { keyword, maxResults } = request.query as {
      keyword: string;
      maxResults?: string;
    };
    
    if (!keyword) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Keyword là bắt buộc' 
      });
    }

    const max = maxResults ? parseInt(maxResults, 10) : 10;
    console.log(`Lấy kết quả tìm kiếm cho: "${keyword}" (tối đa ${max} kết quả)`);

    const result = await keywordAnalysisService.getSearchResults(keyword, max);
    
    return reply.send({ 
      success: true, 
      data: {
        keyword,
        results: result,
        count: result.length
      },
      message: 'Lấy kết quả tìm kiếm thành công'
    });
  } catch (error) {
    console.error('Error in getSearchResultsHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(500).send({ 
      success: false, 
      error: errorMessage 
    });
  }
};
