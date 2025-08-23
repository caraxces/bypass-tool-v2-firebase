import puppeteer, { Browser, Page } from 'puppeteer';

export interface KeywordAnalysisResult {
  keyword: string;
  searchResults: string[];
  similarityScore: number;
  duplicateResults: string[];
}

export interface KeywordComparisonResult {
  keyword1: string;
  keyword2: string;
  similarityScore: number;
  commonResults: string[];
  isDuplicate: boolean;
}

class KeywordAnalysisService {
  private browser: Browser | null = null;

  private async getBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ],
    });
    
    return this.browser;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Lấy kết quả tìm kiếm Google cho một từ khóa
   */
  public async getSearchResults(keyword: string, maxResults: number = 10): Promise<string[]> {
    let page: Page | null = null;
    
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      // Điều hướng đến Google
      await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded' });
      
      // Nhập từ khóa
      await page.waitForSelector('[name=q]');
      await page.type('[name=q]', keyword);
      
      // Tìm kiếm
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.keyboard.press('Enter'),
      ]);

      // Lấy kết quả tìm kiếm
      const results = await page.$$eval('div.g a', (anchors) =>
        anchors
          .map((a) => a.href)
          .filter(href => href.startsWith('http') && !href.includes('google.com'))
          .slice(0, maxResults)
      );

      return results;
    } catch (error) {
      console.error(`Lỗi khi lấy kết quả tìm kiếm cho "${keyword}":`, error);
      return [];
    } finally {
      await page?.close();
    }
  }

  /**
   * So sánh hai từ khóa và tính điểm tương đồng
   */
  public async compareKeywords(keyword1: string, keyword2: string): Promise<KeywordComparisonResult> {
    try {
      const [results1, results2] = await Promise.all([
        this.getSearchResults(keyword1, 20),
        this.getSearchResults(keyword2, 20)
      ]);

      // Tìm kết quả chung
      const commonResults = results1.filter(url => results2.includes(url));
      
      // Tính điểm tương đồng (0-100)
      const similarityScore = this.calculateSimilarityScore(results1, results2, commonResults);
      
      // Xác định có phải duplicate không (điểm > 70%)
      const isDuplicate = similarityScore > 70;

      return {
        keyword1,
        keyword2,
        similarityScore,
        commonResults,
        isDuplicate
      };
    } catch (error) {
      console.error(`Lỗi khi so sánh từ khóa "${keyword1}" và "${keyword2}":`, error);
      return {
        keyword1,
        keyword2,
        similarityScore: 0,
        commonResults: [],
        isDuplicate: false
      };
    }
  }

  /**
   * Phân tích danh sách từ khóa và tìm các cặp duplicate
   */
  public async analyzeKeywordList(keywords: string[]): Promise<KeywordComparisonResult[]> {
    const results: KeywordComparisonResult[] = [];
    
    try {
      // So sánh từng cặp từ khóa
      for (let i = 0; i < keywords.length; i++) {
        for (let j = i + 1; j < keywords.length; j++) {
          const comparison = await this.compareKeywords(keywords[i], keywords[j]);
          results.push(comparison);
        }
      }
      
      // Sắp xếp theo điểm tương đồng giảm dần
      results.sort((a, b) => b.similarityScore - a.similarityScore);
      
      return results;
    } catch (error) {
      console.error('Lỗi khi phân tích danh sách từ khóa:', error);
      return [];
    }
  }

  /**
   * Tính điểm tương đồng giữa hai danh sách kết quả
   */
  private calculateSimilarityScore(results1: string[], results2: string[], commonResults: string[]): number {
    if (results1.length === 0 || results2.length === 0) {
      return 0;
    }

    // Sử dụng Jaccard similarity
    const union = new Set([...results1, ...results2]);
    const intersection = new Set(commonResults);
    
    const similarity = intersection.size / union.size;
    return Math.round(similarity * 100);
  }

  /**
   * Tìm từ khóa có kết quả tìm kiếm tương tự nhất
   */
  public async findMostSimilarKeywords(keyword: string, keywordList: string[]): Promise<KeywordComparisonResult[]> {
    try {
      const comparisons = await Promise.all(
        keywordList
          .filter(k => k !== keyword)
          .map(k => this.compareKeywords(keyword, k))
      );
      
      // Sắp xếp theo điểm tương đồng giảm dần
      comparisons.sort((a, b) => b.similarityScore - a.similarityScore);
      
      return comparisons;
    } catch (error) {
      console.error(`Lỗi khi tìm từ khóa tương tự cho "${keyword}":`, error);
      return [];
    }
  }
}

// Export singleton instance
export const keywordAnalysisService = new KeywordAnalysisService();
export default keywordAnalysisService;
