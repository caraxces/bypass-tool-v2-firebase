import { FastifyInstance } from 'fastify';
import {
  compareKeywordsHandler,
  analyzeKeywordListHandler,
  findSimilarKeywordsHandler,
  getSearchResultsHandler
} from './keyword-analysis.controller';

export default async function keywordAnalysisRoutes(fastify: FastifyInstance) {
  // So sánh hai từ khóa
  fastify.post('/compare', compareKeywordsHandler);
  
  // Phân tích danh sách từ khóa
  fastify.post('/analyze-list', analyzeKeywordListHandler);
  
  // Tìm từ khóa tương tự
  fastify.post('/find-similar', findSimilarKeywordsHandler);
  
  // Lấy kết quả tìm kiếm cho một từ khóa
  fastify.get('/search-results', getSearchResultsHandler);
}
