import puppeteer, { Browser, Page } from 'puppeteer';

class ScrapingService {
  private browser: Browser | null = null;

  private async getBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    return this.browser;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async resolveCaptcha(page: Page): Promise<void> {
    // Basic captcha detection: check for a title that suggests a captcha
    const title = await page.title();
    if (title.includes('reCAPTCHA')) {
      // In a real-world scenario, you would integrate a captcha solving service here.
      // For now, we'll just log it and wait, assuming manual intervention or failure.
      console.log('Captcha detected. Manual intervention may be required.');
      // Wait for a long time to allow for manual solving if not headless
      await new Promise(resolve => setTimeout(resolve, 60000)); 
    }
  }

  public async getKeywordRank(keyword: string, domain: string): Promise<{ position: number; url: string } | null> {
    let page: Page | null = null;
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded' });
      
      // Type the keyword
      await page.waitForSelector('[name=q]');
      await page.type('[name=q]', keyword);
      
      // Wait for navigation after pressing Enter
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.keyboard.press('Enter'),
      ]);

      await this.resolveCaptcha(page);

      // Add &num=100 to get top 100 results to increase chances of finding the domain
      const searchUrl = page.url() + '&num=100';
      await page.goto(searchUrl, { waitUntil: 'load' });
      
      await this.resolveCaptcha(page);

      const GOOGLE_MAIN_LINK_SELECTOR = 'div.g a'; // A more robust selector

      const links = await page.$$eval(GOOGLE_MAIN_LINK_SELECTOR, (anchors) =>
        anchors.map((a) => a.href).filter(href => href.startsWith('http'))
      );
      
      const foundIndex = links.findIndex(link => link.includes(domain));

      if (foundIndex !== -1) {
        const foundUrl = links[foundIndex];
        if (foundUrl) {
          return {
            position: foundIndex + 1,
            url: foundUrl,
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to get rank for keyword "${keyword}" and domain "${domain}":`, error);
      return null;
    } finally {
      await page?.close();
    }
  }
}

// Export a singleton instance
export const scrapingService = new ScrapingService();
