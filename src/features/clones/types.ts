// AI Website Analysis Types
export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  screenshot?: string;
  favicon?: string;
  metadata: {
    keywords: string[];
    author?: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  structure: PageStructure;
  components: ComponentAnalysis[];
  pages?: PageInfo[];
  assets: AssetInfo[];
  technologies: DetectedTechnology[];
  designSystem: DesignSystem;
  analyzedAt: Date;
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
  type: ComponentType;
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
  defaultValue?: any;
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
}

export interface LayoutInfo {
  display: string[];
  positioning: string[];
  flexbox?: FlexboxInfo;
  grid?: GridInfo;
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
  category: 'framework' | 'library' | 'tool' | 'service';
  confidence: number; // 0-1
  version?: string;
}

export interface DesignSystem {
  tokens: DesignToken[];
  components: ComponentTemplate[];
  patterns: DesignPattern[];
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
  files: GeneratedFile[];
  success: boolean;
  message: string;
  generatedAt: Date;
}

export interface GeneratedComponent {
  name: string;
  code: string;
  type: ComponentType;
  description: string;
  dependencies: string[];
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
export type LayoutType = 'single-column' | 'multi-column' | 'grid' | 'masonry' | 'custom';
export type SectionType = 'header' | 'hero' | 'features' | 'content' | 'sidebar' | 'footer' | 'navigation' | 'form' | 'gallery' | 'testimonials' | 'pricing' | 'contact';
export type ComponentType = 'layout' | 'navigation' | 'form' | 'display' | 'feedback' | 'overlay' | 'media' | 'data' | 'input' | 'button' | 'text';
export type ProjectStatus = 'pending' | 'analyzing' | 'analyzed' | 'generating' | 'generated' | 'building' | 'completed' | 'error';

export interface NavigationInfo {
  type: 'horizontal' | 'vertical' | 'sidebar' | 'hamburger';
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
  data?: any;
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