import { FastifyInstance } from 'fastify';
import {
  checkLinkPositionInContentHandler,
  analyzeContentAreaHandler,
  checkMultipleKeywordsHandler,
  checkIfLinkHiddenHandler
} from './hidden-link-checker.controller';

export default async function hiddenLinkCheckerRoutes(fastify: FastifyInstance) {
  // Kiểm tra vị trí link trong vùng nội dung với XPath
  fastify.post('/check-position', checkLinkPositionInContentHandler);
  
  // Phân tích vùng nội dung để tìm link ẩn
  fastify.post('/analyze-content', analyzeContentAreaHandler);
  
  // Kiểm tra nhiều từ khóa cùng lúc
  fastify.post('/check-multiple-keywords', checkMultipleKeywordsHandler);
  
  // Kiểm tra link có bị ẩn không
  fastify.post('/check-hidden', checkIfLinkHiddenHandler);
}
