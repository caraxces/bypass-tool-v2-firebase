import puppeteer, { Browser, Page } from 'puppeteer';

export interface HiddenLinkResult {
  keyword: string;
  domain: string;
  found: boolean;
  position?: number;
  url?: string;
  isHidden: boolean;
  hiddenMethod?: string;
  contentArea?: string;
}

export interface ContentAreaAnalysis {
  visibleLinks: string[];
  hiddenLinks: string[];
  totalLinks: number;
  hiddenPercentage: number;
}

class HiddenLinkCheckerService {
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
   * Kiểm tra vị trí link trong vùng nội dung với XPath
   */
  public async checkLinkPositionInContent(
    keyword: string, 
    domain: string, 
    contentXPath: string
  ): Promise<HiddenLinkResult> {
    let page: Page | null = null;
    
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      // Tìm kiếm Google
      await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[name=q]');
      await page.type('[name=q]', keyword);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.keyboard.press('Enter'),
      ]);

      // Lấy tất cả kết quả tìm kiếm
      const searchResults = await page.$$eval('div.g', (results) =>
        results.map((result, index) => ({
          index: index + 1,
          url: result.querySelector('a')?.href || '',
          title: result.querySelector('h3')?.textContent || '',
          snippet: result.querySelector('.VwiC3b')?.textContent || ''
        }))
      );

      // Tìm domain trong kết quả
      const domainResult = searchResults.find(result => 
        result.url.includes(domain)
      );

      if (!domainResult) {
        return {
          keyword,
          domain,
          found: false,
          isHidden: false
        };
      }

      // Kiểm tra link có ẩn không
      const isHidden = await this.checkIfLinkHidden(page, domainResult.index);
      
      return {
        keyword,
        domain,
        found: true,
        position: domainResult.index,
        url: domainResult.url,
        isHidden,
        hiddenMethod: isHidden ? await this.detectHiddenMethod(page, domainResult.index) : undefined,
        contentArea: contentXPath
      };

    } catch (error) {
      console.error(`Lỗi khi kiểm tra vị trí link cho "${keyword}":`, error);
      return {
        keyword,
        domain,
        found: false,
        isHidden: false
      };
    } finally {
      await page?.close();
    }
  }

  /**
   * Kiểm tra xem link có bị ẩn không
   */
  private async checkIfLinkHidden(page: Page, resultIndex: number): Promise<boolean> {
    try {
      // Chọn kết quả tìm kiếm theo index
      const resultSelector = `div.g:nth-child(${resultIndex})`;
      const resultElement = await page.$(resultSelector);
      
      if (!resultElement) return false;

      // Kiểm tra các thuộc tính có thể ẩn link
      const isHidden = await page.evaluate((element) => {
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
      }, resultElement);

      return isHidden;
    } catch (error) {
      console.error('Lỗi khi kiểm tra link ẩn:', error);
      return false;
    }
  }

  /**
   * Phát hiện phương pháp ẩn link
   */
  private async detectHiddenMethod(page: Page, resultIndex: number): Promise<string> {
    try {
      const resultSelector = `div.g:nth-child(${resultIndex})`;
      const resultElement = await page.$(resultSelector);
      
      if (!resultElement) return 'unknown';

      const hiddenMethod = await page.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.display === 'none') return 'display: none';
        if (computedStyle.visibility === 'hidden') return 'visibility: hidden';
        if (computedStyle.opacity === '0') return 'opacity: 0';
        if (computedStyle.position === 'absolute' && computedStyle.left === '-9999px') return 'position: absolute + left: -9999px';
        if (computedStyle.clip === 'rect(0, 0, 0, 0)') return 'clip: rect(0, 0, 0, 0)';
        
        return 'other';
      }, resultElement);

      return hiddenMethod;
    } catch (error) {
      console.error('Lỗi khi phát hiện phương pháp ẩn:', error);
      return 'unknown';
    }
  }

  /**
   * Phân tích vùng nội dung để tìm link ẩn
   */
  public async analyzeContentArea(url: string, contentXPath: string): Promise<ContentAreaAnalysis> {
    let page: Page | null = null;
    
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Lấy tất cả link trong vùng nội dung
      const links = await page.evaluate((xpath) => {
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        const links: Array<{ href: string; isHidden: boolean; hiddenMethod: string }> = [];
        
        for (let i = 0; i < result.snapshotLength; i++) {
          const element = result.snapshotItem(i);
          if (element) {
            const linkElements = element.querySelectorAll('a');
            
            linkElements.forEach(link => {
              const computedStyle = window.getComputedStyle(link);
              let isHidden = false;
              let hiddenMethod = '';

              if (computedStyle.display === 'none') {
                isHidden = true;
                hiddenMethod = 'display: none';
              } else if (computedStyle.visibility === 'hidden') {
                isHidden = true;
                hiddenMethod = 'visibility: hidden';
              } else if (computedStyle.opacity === '0') {
                isHidden = true;
                hiddenMethod = 'opacity: 0';
              }

              links.push({
                href: link.href,
                isHidden,
                hiddenMethod
              });
            });
          }
        }

        return links;
      }, contentXPath);

      const visibleLinks = links.filter(link => !link.isHidden).map(link => link.href);
      const hiddenLinks = links.filter(link => link.isHidden).map(link => link.href);
      const totalLinks = links.length;
      const hiddenPercentage = totalLinks > 0 ? (hiddenLinks.length / totalLinks) * 100 : 0;

      return {
        visibleLinks,
        hiddenLinks,
        totalLinks,
        hiddenPercentage: Math.round(hiddenPercentage * 100) / 100
      };

    } catch (error) {
      console.error(`Lỗi khi phân tích vùng nội dung từ ${url}:`, error);
      return {
        visibleLinks: [],
        hiddenLinks: [],
        totalLinks: 0,
        hiddenPercentage: 0
      };
    } finally {
      await page?.close();
    }
  }

  /**
   * Kiểm tra nhiều từ khóa cùng lúc
   */
  public async checkMultipleKeywords(
    keywords: string[], 
    domain: string, 
    contentXPath: string
  ): Promise<HiddenLinkResult[]> {
    const results: HiddenLinkResult[] = [];
    
    for (const keyword of keywords) {
      const result = await this.checkLinkPositionInContent(keyword, domain, contentXPath);
      results.push(result);
      
      // Delay để tránh bị Google block
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }
}

// Export singleton instance
export const hiddenLinkCheckerService = new HiddenLinkCheckerService();
export default hiddenLinkCheckerService;
