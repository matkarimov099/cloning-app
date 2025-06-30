import type {
	ComponentAnalysis,
	ComponentType,
	GenerationOptions,
	GenerationResult,
	LayoutType,
	WebsiteAnalysis,
} from '../types';

export class AIWebsiteAnalyzer {
	private apiKey?: string;
	private baseUrl = 'http://localhost:9001'; // Complete Clone server URL
	private fallbackUrl = 'http://localhost:8080'; // Enhanced server fallback

	constructor(apiKey?: string) {
		this.apiKey = apiKey;
	}

	/**
	 * Website URL ni analiz qiladi va strukturasini oladi (Enhanced Method)
	 */
	async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
		try {
			console.log(`🚀 Starting enhanced analysis for: ${url}`);
			
			// Enhanced single API call - includes scraping + AI analysis
			const response = await fetch(`${this.baseUrl}/api/analyze-website`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				// Try fallback server
				console.log('Trying fallback server...');
				return await this.analyzeWebsiteFallback(url);
			}

			const result = await response.json();
			
			if (!result.success) {
				throw new Error(result.error || 'Analysis failed');
			}

			console.log(`✅ Enhanced analysis completed for: ${url}`);

			// Transform enhanced response to our format
			return this.transformEnhancedResponse(result);

		} catch (error) {
			console.error('Enhanced analysis failed:', error);
			// Try fallback method
			return await this.analyzeWebsiteFallback(url);
		}
	}

	/**
	 * Transform enhanced server response to our WebsiteAnalysis format
	 */
	private transformEnhancedResponse(result: Record<string, unknown>): WebsiteAnalysis {
		const scraping = result.scraping as Record<string, unknown> || {};
		const analysis = result.analysis as Record<string, unknown> || {};
		const components = result.components as Array<Record<string, unknown>> || [];
		const rawData = result.raw_data as Record<string, unknown> || {};
		
		// Transform components to our format
		const transformedComponents: ComponentAnalysis[] = components.map((comp, index) => ({
			id: `comp-${index}`,
			name: (comp.name as string) || 'UnknownComponent',
			type: (comp.type as ComponentType) || 'layout',
			description: (comp.description as string) || '',
			props: [],
			styling: {
				colors: {
					primary: ['#2563eb'],
					secondary: ['#64748b'],
					accent: ['#10b981'],
					neutral: ['#f8fafc'],
					semantic: {
						success: '#10b981',
						warning: '#f59e0b',
						error: '#ef4444',
						info: '#3b82f6',
					},
				},
				typography: {
					fontFamilies: ['Inter', 'system-ui', 'sans-serif'],
					fontSizes: ['0.875rem', '1rem', '1.125rem', '1.25rem'],
					fontWeights: [400, 500, 600, 700],
					lineHeights: ['1.25', '1.5', '1.75'],
					letterSpacing: ['0', '0.025em'],
				},
				spacing: {
					margins: ['0', '0.5rem', '1rem', '1.5rem', '2rem'],
					paddings: ['0', '0.5rem', '1rem', '1.5rem', '2rem'],
					gaps: ['0', '0.5rem', '1rem', '1.5rem'],
				},
				layout: {
					display: ['block', 'flex', 'grid'],
					positioning: ['relative', 'absolute'],
				},
				effects: [],
			},
			functionality: ['display', 'interaction'],
			complexity: (comp.complexity as 'simple' | 'medium' | 'complex') || 'medium',
			reusability: 8,
			dependencies: ['react', '@types/react'],
			generatedCode: (comp.code as string) || '',
		}));

		return {
			url: result.url as string,
			title: (scraping.title || analysis.title || 'Unknown') as string,
			description: (scraping.description || analysis.description || '') as string,
			metadata: {
				keywords: [],
				language: 'en',
				theme: 'light' as const,
			},
			structure: {
				layout: 'single-column' as LayoutType,
				sections: [],
				navigation: {
					type: 'horizontal',
					items: [],
				},
			},
			components: transformedComponents,
			assets: [],
			technologies: [
				{ name: 'React', category: 'framework', confidence: 0.9 },
				{ name: 'TypeScript', category: 'library', confidence: 0.9 },
				{ name: 'Tailwind CSS', category: 'library', confidence: 0.9 },
			],
			designSystem: {
				tokens: [
					{
						name: 'primary-color',
						value: '#2563eb',
						category: 'color',
						description: 'Primary brand color',
					},
				],
				components: [],
				patterns: [],
			},
			screenshot: '', // Enhanced server doesn't provide screenshot yet
			analyzedAt: new Date(),
			// Store raw data for debugging (will be added to WebsiteAnalysis interface if needed)
			...(rawData && { rawData }),
		};
	}

	/**
	 * Fallback method using original server
	 */
	private async analyzeWebsiteFallback(url: string): Promise<WebsiteAnalysis> {
		try {
			console.log(`🔄 Using fallback analysis for: ${url}`);

			// 1. Website screenshot olish
			const screenshot = await this.captureScreenshot(url);

			// 2. HTML content olish
			const htmlContent = await this.fetchWebsiteContent(url);

			// 3. AI orqali analiz qilish
			const analysis = await this.performAIAnalysis(
				url,
				htmlContent,
				screenshot,
			);

			return {
				...analysis,
				url,
				screenshot,
				analyzedAt: new Date(),
			};
		} catch (error) {
			console.error('Fallback analysis failed:', error);
			throw new Error(
				`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
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
			body: JSON.stringify({ url }),
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
			body: JSON.stringify({ url }),
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
		screenshot: string,
	): Promise<Omit<WebsiteAnalysis, 'url' | 'screenshot' | 'analyzedAt'>> {
		const prompt = this.buildAnalysisPrompt(url, htmlContent);

		const response = await fetch(`${this.baseUrl}/api/ai-analyze`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				prompt,
				image: screenshot,
				html: htmlContent,
			}),
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
		options: GenerationOptions,
	): Promise<GenerationResult> {
		try {
			// Remove unused variable
			const response = await fetch(`${this.baseUrl}/api/generate-components`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					analysis,
					options,
				}),
			});

			if (!response.ok) {
				throw new Error('Component generation failed');
			}

			return await response.json();
		} catch (error) {
			console.error('Component generation failed:', error);
			throw new Error(
				`Failed to generate components: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Website ni to'liq klonlaydi va saqlaydi (yangi metod)
	 */
	async cloneWebsite(url: string): Promise<{
		success: boolean;
		clone_id: string;
		message: string;
		clone_info: {
			url: string;
			timestamp: string;
			total_size: number;
			asset_count: number;
		};
		preview_url: string;
		download_url: string;
	}> {
		try {
			const response = await fetch(`${this.baseUrl}/api/clone-website`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Clone website error:', error);
			throw new Error(`Website klonlashda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`);
		}
	}

	/**
	 * Saqlangan HTML klonni tahlil qilib komponentlar yaratadi
	 */
	async analyzeClone(cloneId: string): Promise<GenerationResult> {
		try {
			const response = await fetch(`${this.baseUrl}/api/analyze-clone/${cloneId}`, {
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (!data.success) {
				throw new Error(data.error || 'Tahlil jarayonida xatolik');
			}

			return {
				success: true,
				components: data.components || [],
				analysis: data.analysis,
				metadata: {
					url: data.metadata?.url || '',
					timestamp: data.metadata?.timestamp || new Date().toISOString(),
					processingTime: data.metadata?.processing_time || 0,
					model: data.metadata?.model || 'unknown',
				},
			};
		} catch (error) {
			console.error('Analyze clone error:', error);
			throw new Error(`Klon tahlilida xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`);
		}
	}

	/**
	 * To'liq jarayon: klon + tahlil (yangi metod)
	 */
	async cloneAndAnalyze(url: string): Promise<{
		success: boolean;
		clone_id: string;
		components: ComponentAnalysis[];
		analysis: WebsiteAnalysis;
		metadata: {
			url: string;
			timestamp: string;
			processing_time: number;
			model: string;
		};
		preview_url: string;
		download_url: string;
	}> {
		try {
			const response = await fetch(`${this.baseUrl}/api/clone-and-analyze`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (!data.success) {
				throw new Error(data.error || 'To\'liq jarayonda xatolik');
			}

			return data;
		} catch (error) {
			console.error('Clone and analyze error:', error);
			throw new Error(`To'liq jarayonda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`);
		}
	}

	/**
	 * Barcha klonlar ro'yxatini oladi
	 */
	async listClones(): Promise<{
		success: boolean;
		clones: Array<{
			clone_id: string;
			url: string;
			timestamp: string;
			size: number;
			asset_count: number;
		}>;
	}> {
		try {
			const response = await fetch(`${this.baseUrl}/api/list-clones`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('List clones error:', error);
			throw new Error(`Klonlar ro'yxatini olishda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`);
		}
	}
}
