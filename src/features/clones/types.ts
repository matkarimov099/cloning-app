// AI Website Analysis Types
export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  screenshot?: string;
  favicon?: string;
  metadata?: {
    keywords?: string[];
    author?: string;
    language?: string;
    theme?: 'light' | 'dark' | 'auto';
    responsive?: boolean;
    [key: string]: unknown;
  };
  structure?: PageStructure;
  components?: ComponentAnalysis[];
  extracted_components?: ComponentAnalysis[]; // For backend compatibility
  pages?: PageInfo[];
  assets?: AssetInfo[];
  technologies?: DetectedTechnology[];
  designSystem?: DesignSystem;
  analyzedAt?: Date;

  // AI natijalari uchun qo'shimcha maydonlar (optional)
  ai_provider?: string;
  raw_response?: Record<string, unknown>;
  [key: string]: unknown; // Allow any additional fields for flexibility with different API responses
}

export interface PageStructure {
	layout: LayoutType;
	sections: PageSection[];
	navigation: NavigationInfo;
	footer?: FooterInfo;
}

export interface PageSection {
	id: string;
	type: SectionType;
	name: string;
	description: string;
	position: number;
	content: SectionContent;
	styling: StylingInfo;
}

export interface ComponentAnalysis {
	id: string;
	name: string;
	component_name?: string; // For backend compatibility
	type: ComponentType;
	component_type?: string; // For backend compatibility
	description: string;
	props: ComponentProp[];
	children?: ComponentAnalysis[];
	styling: StylingInfo;
	functionality: string[];
	complexity: 'simple' | 'medium' | 'complex';
	reusability: number; // 1-10 scale
	dependencies: string[];
	generatedCode?: string;
}

export interface ComponentProp {
	name: string;
	type: string;
	required: boolean;
	defaultValue?: string | number | boolean | null;
	description: string;
}

export interface StylingInfo {
	colors: ColorPalette;
	typography: TypographyInfo;
	spacing: SpacingInfo;
	layout: LayoutInfo;
	effects: EffectInfo[];
}

export interface ColorPalette {
	primary: string[];
	secondary: string[];
	accent: string[];
	neutral: string[];
	semantic: {
		success: string;
		warning: string;
		error: string;
		info: string;
	};
}

export interface TypographyInfo {
	fontFamilies: string[];
	fontSizes: string[];
	fontWeights: number[];
	lineHeights: string[];
	letterSpacing: string[];
}

export interface SpacingInfo {
	margins: string[];
	paddings: string[];
	gaps: string[];
	containerWidths?: string[]; // Mock data uchun qo'shimcha maydon
}

export interface LayoutInfo {
	display?: string[];
	positioning?: string[];
	flexbox?: FlexboxInfo;
	grid?: GridInfo;
	type?: string; // Mock data uchun qo'shimcha maydon
	direction?: string; // Mock data uchun qo'shimcha maydon
	justify?: string; // Mock data uchun qo'shimcha maydon
	align?: string; // Mock data uchun qo'shimcha maydon
}

export interface FlexboxInfo {
	direction: string[];
	justify: string[];
	align: string[];
	wrap: string[];
}

export interface GridInfo {
	templateColumns: string[];
	templateRows: string[];
	gap: string[];
	areas?: string[];
}

export interface EffectInfo {
	type: 'shadow' | 'gradient' | 'border' | 'animation' | 'transition';
	properties: Record<string, string>;
}

export interface AssetInfo {
	type: 'image' | 'video' | 'audio' | 'font' | 'icon';
	url: string;
	localPath?: string;
	description: string;
	optimized: boolean;
}

export interface DetectedTechnology {
	name: string;
	category: 'framework' | 'library' | 'tool' | 'service' | 'language' | 'styling' | 'state'; // Mock data uchun qo'shimcha kategoriyalar
	confidence: number; // 0-1
	version?: string;
}

export interface DesignSystem {
	tokens?: DesignToken[];
	components?: ComponentTemplate[];
	patterns?: DesignPattern[];
	// Mock data uchun qo'shimcha maydonlar
	colors?: {
		primary?: string;
		secondary?: string;
		background?: string;
		text?: string;
		accents?: string[];
	};
	typography?: {
		fontFamily?: string;
		headings?: {
			fontFamily?: string;
			weights?: number[];
		};
		body?: {
			fontFamily?: string;
			weights?: number[];
		};
	};
	spacing?: {
		scale?: number[];
		containers?: {
			max?: string;
			default?: string;
		};
	};
	borderRadius?: {
		small?: string;
		default?: string;
		large?: string;
	};
	breakpoints?: {
		sm?: string;
		md?: string;
		lg?: string;
		xl?: string;
	};
}

export interface DesignToken {
	name: string;
	value: string;
	category: 'color' | 'spacing' | 'typography' | 'border' | 'shadow';
	description: string;
}

export interface ComponentTemplate {
	name: string;
	category: string;
	variants: string[];
	usage: string;
}

export interface DesignPattern {
	name: string;
	description: string;
	usage: string[];
	components: string[];
}

// Generation Types
export interface GenerationRequest {
	url: string;
	options: GenerationOptions;
}

export interface GenerationOptions {
	framework: 'react' | 'vue' | 'angular' | 'svelte';
	styling: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion';
	typescript: boolean;
	responsive: boolean;
	accessibility: boolean;
	optimization: boolean;
	componentLibrary?: 'shadcn' | 'mui' | 'chakra' | 'ant' | 'mantine';
}

// Generation Result Types
export interface GenerationResult {
	components: GeneratedComponent[];
	analysis?: WebsiteAnalysis; // Added analysis field
	files?: GeneratedFile[];
	designSystem?: DesignSystem;
	metadata?: {
		url?: string;
		timestamp?: string;
		processingTime?: number;
		model?: string;
		[key: string]: unknown;
	};
	stats?: Record<string, unknown>;
	success: boolean;
	message?: string;
	generatedAt?: Date;
}

export interface GeneratedComponent {
	name: string;
	code: string;
	tsx_code?: string; // For backend compatibility
	css_code?: string; // For backend compatibility
	type: ComponentType | string; // Allow string for backend compatibility
	description: string;
	dependencies: string[];
	props?: Array<{ name: string; type: string; required: boolean }>;
}

export interface GeneratedFile {
	path: string;
	content: string;
	type: 'component' | 'style' | 'type' | 'config';
	description: string;
}

// Project Management Types
export interface CloneProject {
	id: string;
	name: string;
	url: string;
	status: ProjectStatus;
	analysis?: WebsiteAnalysis;
	generation?: GenerationResult;
	progress: ProjectProgress;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProjectProgress {
	analyzed: boolean;
	generated: boolean;
	components: ComponentProgress[];
	overall: number; // 0-100 percentage
}

export interface ComponentProgress {
	componentId: string;
	completed: boolean;
	tested: boolean;
	optimized: boolean;
}

// Enums and Unions
export type LayoutType =
	| 'single-column'
	| 'multi-column'
	| 'grid'
	| 'masonry'
	| 'custom';
export type SectionType =
	| 'header'
	| 'hero'
	| 'features'
	| 'content'
	| 'sidebar'
	| 'footer'
	| 'navigation'
	| 'form'
	| 'gallery'
	| 'testimonials'
	| 'pricing'
	| 'contact';
export type ComponentType =
	| 'layout'
	| 'navigation'
	| 'form'
	| 'display'
	| 'feedback'
	| 'overlay'
	| 'media'
	| 'data'
	| 'input'
	| 'button'
	| 'text'
	| 'component'; // Mock data uchun qo'shimcha tip
export type ProjectStatus =
	| 'pending'
	| 'analyzing'
	| 'analyzed'
	| 'generating'
	| 'generated'
	| 'building'
	| 'completed'
	| 'error';

export interface NavigationInfo {
	type: 'horizontal' | 'vertical' | 'sidebar' | 'hamburger';
	position?: string; // Mock data uchun qo'shimcha maydon
	items: NavigationItem[];
	branding?: BrandingInfo;
}

export interface NavigationItem {
	label: string;
	href: string;
	children?: NavigationItem[];
	icon?: string;
}

export interface BrandingInfo {
	logo?: string;
	title: string;
	tagline?: string;
}

export interface FooterInfo {
	sections: FooterSection[];
	social?: SocialLink[];
	copyright: string;
}

export interface FooterSection {
	title: string;
	links: NavigationItem[];
}

export interface SocialLink {
	platform: string;
	url: string;
	icon: string;
}

export interface SectionContent {
	text?: string[];
	images?: string[];
	links?: NavigationItem[];
	forms?: FormInfo[];
	data?: Record<string, unknown>;
}

export interface FormInfo {
	fields: FormField[];
	action: string;
	method: string;
}

export interface FormField {
	name: string;
	type: string;
	label: string;
	required: boolean;
	placeholder?: string;
	validation?: string;
}

export interface PageInfo {
	name: string;
	url: string;
	title: string;
	description?: string;
}
