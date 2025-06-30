import type { WebsiteAnalysis, GenerationResult, GenerationOptions } from '../types';

export class AIWebsiteAnalyzer {
  private apiKey?: string;
  private baseUrl = 'http://localhost:8000'; // Backend server URL

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Website URL ni analiz qiladi va strukturasini oladi
   */
  async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
    try {
      // 1. Website screenshot olish
      const screenshot = await this.captureScreenshot(url);
      
      // 2. HTML content olish
      const htmlContent = await this.fetchWebsiteContent(url);
      
      // 3. AI orqali analiz qilish
      const analysis = await this.performAIAnalysis(url, htmlContent, screenshot);
      
      return {
        ...analysis,
        url,
        screenshot,
        analyzedAt: new Date()
      };
    } catch (error) {
      console.error('Website analysis failed:', error);
      throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Website screenshot oladi
   */
  private async captureScreenshot(url: string): Promise<string> {
    // Puppeteer yoki Playwright ishlatish mumkin
    const response = await fetch(`${this.baseUrl}/api/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error('Screenshot capture failed');
    }
    
    const { screenshot } = await response.json();
    return screenshot;
  }

  /**
   * Website HTML content ni oladi
   */
  private async fetchWebsiteContent(url: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/fetch-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error('Content fetch failed');
    }
    
    const { content } = await response.json();
    return content;
  }

  /**
   * AI orqali website ni analiz qiladi
   */
  private async performAIAnalysis(
    url: string, 
    htmlContent: string, 
    screenshot: string
  ): Promise<Omit<WebsiteAnalysis, 'url' | 'screenshot' | 'analyzedAt'>> {
    const prompt = this.buildAnalysisPrompt(url, htmlContent);
    
    const response = await fetch(`${this.baseUrl}/api/ai-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        prompt,
        image: screenshot,
        html: htmlContent
      })
    });
    
    if (!response.ok) {
      throw new Error('AI analysis failed');
    }
    
    return await response.json();
  }

  /**
   * AI uchun analysis prompt yaratadi
   */
  private buildAnalysisPrompt(url: string, htmlContent: string): string {
    return `
Bu website ni tahlil qiling va quyidagi ma'lumotlarni JSON formatda qaytaring:

Website URL: ${url}
HTML Content: ${htmlContent.slice(0, 10000)}...

Tahlil qilish kerak:
1. Website title va description
2. Metadata (keywords, language, theme)
3. Page structure (layout, sections)
4. Navigation structure
5. Har bir komponent tahlili (type, props, styling)
6. Color palette va typography
7. Detected technologies
8. Assets (images, fonts, icons)

JSON format:
{
  "title": "...",
  "description": "...",
  "metadata": { ... },
  "structure": { ... },
  "components": [ ... ],
  "designSystem": { ... },
  "technologies": [ ... ],
  "assets": [ ... ]
}

Har bir komponent uchun React TypeScript kod generatsiya qilish uchun kerakli barcha ma'lumotlarni qaytaring.
    `.trim();
  }

  /**
   * Komponentlar kodini generate qiladi
   */
  async generateComponents(
    analysis: WebsiteAnalysis, 
    options: GenerationOptions
  ): Promise<GenerationResult> {
    try {
      // Remove unused variable
      const response = await fetch(`${this.baseUrl}/api/generate-components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          analysis,
          options
        })
      });

      if (!response.ok) {
        throw new Error('Component generation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Component generation failed:', error);
      throw new Error(`Failed to generate components: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
