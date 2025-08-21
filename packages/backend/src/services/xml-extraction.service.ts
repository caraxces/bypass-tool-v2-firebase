import puppeteer, { Browser, Page } from 'puppeteer';

export interface ExtractionResult {
  success: boolean;
  data?: string;
  error?: string;
  statusCode?: number;
}

class XMLExtractionService {
  private browser: Browser | null = null;

  private validateXPath(xpath: string): boolean {
    try {
      // Kiểm tra XPath cơ bản
      if (!xpath || typeof xpath !== 'string') {
        return false;
      }
      
      // Loại bỏ các XPath không hợp lệ
      const invalidPatterns = [
        /^\/html\//,  // /html/ không hợp lệ
        /^\/html$/,   // /html không hợp lệ
        /^\/$/,       // / không hợp lệ
      ];
      
      for (const pattern of invalidPatterns) {
        if (pattern.test(xpath)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }
    
    try {
      // Thử sử dụng Chrome đã có sẵn trước
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ],
      });
    } catch (error) {
      console.log('Không thể khởi động Chrome, thử sử dụng executable path...');
      
      // Thử tìm Chrome trong các đường dẫn phổ biến
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\laptop Lenovo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        process.env['CHROME_PATH']
      ].filter((path): path is string => Boolean(path));
      
      for (const chromePath of chromePaths) {
        try {
          console.log(`Thử khởi động Chrome từ: ${chromePath}`);
          this.browser = await puppeteer.launch({
            headless: true,
            executablePath: chromePath,
            args: [
              '--no-sandbox', 
              '--disable-setuid-sandbox',
              '--disable-web-security',
              '--disable-features=VizDisplayCompositor',
              '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
          });
          console.log('Khởi động Chrome thành công từ executable path');
          break;
        } catch (pathError) {
          console.log(`Không thể khởi động từ ${chromePath}:`, pathError instanceof Error ? pathError.message : 'Lỗi không xác định');
          continue;
        }
      }
      
      // Nếu vẫn không được, thử sử dụng puppeteer-core với Chrome đã cài
      if (!this.browser) {
        try {
          console.log('Thử sử dụng puppeteer-core...');
          const puppeteerCore = require('puppeteer-core');
          this.browser = await puppeteerCore.launch({
            headless: true,
            args: [
              '--no-sandbox', 
              '--disable-setuid-sandbox',
              '--disable-web-security',
              '--disable-features=VizDisplayCompositor',
              '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
          });
        } catch (coreError) {
          console.log('Không thể sử dụng puppeteer-core:', coreError instanceof Error ? coreError.message : 'Lỗi không xác định');
          throw new Error('Không thể khởi động browser. Vui lòng cài đặt Chrome hoặc chạy: npx puppeteer browsers install chrome');
        }
      }
    }
    
    if (!this.browser) {
      throw new Error('Không thể khởi động browser');
    }
    
    return this.browser;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  public async extractDataByXPath(url: string, xpath: string): Promise<ExtractionResult> {
    let page: Page | null = null;
    
    try {
      console.log(`Đang truy cập URL: ${url}`);
      console.log(`Sử dụng XPath: ${xpath}`);
      
      // Validate XPath
      if (!this.validateXPath(xpath)) {
        throw new Error(`XPath không hợp lệ: ${xpath}. Vui lòng sử dụng XPath hợp lệ như: //h1, //title, //p, //div, etc.`);
      }
      
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      // Set viewport và user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set timeout cho navigation
      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);
      
      // Truy cập URL
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      if (!response) {
        throw new Error('Không thể tải trang');
      }
      
      const statusCode = response.status();
      console.log(`Status code: ${statusCode}`);
      
      if (statusCode >= 400) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }
      
      // Đợi một chút để trang load hoàn toàn
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra xem XPath có tồn tại không
      const elementExists = await page.evaluate((xpath) => {
        try {
          const result = document.evaluate(
            xpath, 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
          );
          return result.singleNodeValue !== null;
        } catch (error) {
          console.error('Lỗi khi evaluate XPath:', error);
          return false;
        }
      }, xpath);
      
      if (!elementExists) {
        throw new Error(`Không tìm thấy element với XPath: ${xpath}. Vui lòng kiểm tra lại XPath hoặc thử các XPath khác như: //h1, //title, //p, //div`);
      }
      
      // Trích xuất dữ liệu bằng XPath
      const extractedData = await page.evaluate((xpath) => {
        try {
          const result = document.evaluate(
            xpath, 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
          );
          
          const node = result.singleNodeValue;
          if (!node) return null;
          
          // Lấy text content
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent?.trim() || '';
          }
          
          // Lấy text content của element
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            return element.textContent?.trim() || '';
          }
          
          return node.textContent?.trim() || '';
        } catch (error) {
          console.error('Lỗi khi trích xuất dữ liệu:', error);
          return null;
        }
      }, xpath);
      
      if (!extractedData) {
        throw new Error('Không thể trích xuất dữ liệu từ element. Element có thể rỗng hoặc không có text content.');
      }
      
      console.log(`Trích xuất thành công: ${extractedData.substring(0, 100)}...`);
      
      return {
        success: true,
        data: extractedData,
        statusCode
      };
      
    } catch (error) {
      console.error('Lỗi khi trích xuất dữ liệu:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  public async extractMultipleXPaths(url: string, xpaths: string[]): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];
    
    for (const xpath of xpaths) {
      const result = await this.extractDataByXPath(url, xpath);
      results.push(result);
      
      // Đợi một chút giữa các request để tránh bị block
      if (xpath !== xpaths[xpaths.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Thêm method để lấy cấu trúc HTML cơ bản của trang
  public async getPageStructure(url: string): Promise<{ success: boolean; structure?: any; error?: string }> {
    let page: Page | null = null;
    
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      if (!response || response.status() >= 400) {
        throw new Error('Không thể tải trang');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Lấy cấu trúc cơ bản của trang
      const structure = await page.evaluate(() => {
        const elements = {
          title: document.title,
          h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()).filter(Boolean),
          h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()).filter(Boolean),
          h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent?.trim()).filter(Boolean),
          p: Array.from(document.querySelectorAll('p')).map(p => p.textContent?.trim()).filter(Boolean).slice(0, 5), // Chỉ lấy 5 p đầu tiên
          div: Array.from(document.querySelectorAll('div')).map(d => d.textContent?.trim()).filter(Boolean).slice(0, 3), // Chỉ lấy 3 div đầu tiên
          meta: {
            description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
            keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
          }
        };
        
        return elements;
      });
      
      return {
        success: true,
        structure
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}

// Export singleton instance
export const xmlExtractionService = new XMLExtractionService();
export default xmlExtractionService;
