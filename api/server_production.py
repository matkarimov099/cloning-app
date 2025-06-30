"""
🚀 CloneAI Production Server
Advanced AI-powered website cloning with Groq API

Features:
- Real website scraping with advanced parsing
- AI analysis with Groq (fastest LLM)
- React TSX component generation
- Design system extraction
- Real screenshot capture
- Professional error handling
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests
from bs4 import BeautifulSoup
import base64
import json
import os
import time
import re
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv
from groq import Groq
import logging
from dataclasses import dataclass
from typing import List, Dict, Optional
import hashlib

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS configuration
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:5173",
    os.getenv('FRONTEND_URL', 'http://localhost:3000')
])

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)

# Groq Client
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
groq_client = None

if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    logger.info("✅ Groq client initialized successfully")
else:
    logger.warning("⚠️ No Groq API key found")

@dataclass
class WebsiteData:
    """Website scraping natijasi"""
    url: str
    title: str
    html: str
    text_content: str
    links: List[Dict[str, str]]
    images: List[Dict[str, str]]
    styles: Dict[str, str]
    meta_data: Dict[str, str]
    screenshot: Optional[str] = None

@dataclass
class ComponentData:
    """Generated component ma'lumotlari"""
    name: str
    type: str
    tsx_code: str
    css_code: str
    props: List[Dict[str, str]]
    dependencies: List[str]
    description: str

class AdvancedWebScraper:
    """Professional web scraping va analysis"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    
    def scrape_website(self, url: str) -> WebsiteData:
        """Website ni to'liq analiz qilish"""
        try:
            # URL ni normalize qilish
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            logger.info(f"🌐 Scraping website: {url}")
            
            # Main page ni olish
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else 'Untitled'
            
            # Meta data
            meta_data = self._extract_meta_data(soup)
            
            # Text content
            text_content = self._extract_text_content(soup)
            
            # Links
            links = self._extract_links(soup, url)
            
            # Images
            images = self._extract_images(soup, url)
            
            # Styles
            styles = self._extract_styles(soup, url)
            
            # Debug info
            logger.info(f"🔍 Scraped title: {title_text}")
            logger.info(f"🔍 Scraped text length: {len(text_content)}")
            logger.info(f"🔍 Links found: {len(links)}")
            logger.info(f"🔍 Images found: {len(images)}")

            return WebsiteData(
                url=url,
                title=title_text,
                html=str(soup)[:50000],  # Limit size
                text_content=text_content[:10000],  # Limit size
                links=links[:20],  # Limit number
                images=images[:50],  # Limit number
                styles=styles,
                meta_data=meta_data
            )
            
        except Exception as e:
            logger.error(f"❌ Scraping error: {str(e)}")
            raise Exception(f"Website scraping failed: {str(e)}")
    
    def _extract_meta_data(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Meta ma'lumotlarni olish"""
        meta_data = {}
        
        # Description
        description = soup.find('meta', attrs={'name': 'description'})
        if description:
            meta_data['description'] = description.get('content', '')
        
        # Keywords
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        if keywords:
            meta_data['keywords'] = keywords.get('content', '')
        
        # Open Graph
        og_tags = soup.find_all('meta', property=lambda x: x and x.startswith('og:'))
        for tag in og_tags:
            property_name = tag.get('property', '').replace('og:', '')
            meta_data[f'og_{property_name}'] = tag.get('content', '')
        
        # Language
        html_tag = soup.find('html')
        if html_tag and html_tag.get('lang'):
            meta_data['language'] = html_tag.get('lang')
        
        return meta_data
    
    def _extract_text_content(self, soup: BeautifulSoup) -> str:
        """Matn kontent ni olish"""
        # Script va style taglarini olib tashlash
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Text ni olish
        text = soup.get_text()
        
        # Tozalash
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    
    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """Linklar ni olish"""
        links = []
        
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            text = link.get_text().strip()
            
            if href:
                # Absolute URL yasash
                absolute_url = urljoin(base_url, href)
                
                links.append({
                    'text': text,
                    'href': href,
                    'absolute_url': absolute_url,
                    'is_external': not absolute_url.startswith(base_url.split('/')[0] + '//' + urlparse(base_url).netloc)
                })
        
        return links
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """Rasmlar ni olish"""
        images = []
        
        for img in soup.find_all('img'):
            src = img.get('src')
            alt = img.get('alt', '')
            
            if src:
                # Absolute URL yasash
                absolute_url = urljoin(base_url, src)
                
                images.append({
                    'src': src,
                    'absolute_url': absolute_url,
                    'alt': alt,
                    'width': img.get('width', ''),
                    'height': img.get('height', '')
                })
        
        return images
    
    def _extract_styles(self, soup: BeautifulSoup, base_url: str) -> Dict[str, str]:
        """CSS styles ni olish"""
        styles = {}
        
        # Inline styles
        style_tags = soup.find_all('style')
        inline_css = ''
        for style in style_tags:
            inline_css += style.get_text() + '\n'
        
        if inline_css.strip():
            styles['inline'] = inline_css[:5000]  # Limit size
        
        # External stylesheets
        link_tags = soup.find_all('link', rel='stylesheet')
        external_css = []
        
        for link in link_tags:
            href = link.get('href')
            if href:
                absolute_url = urljoin(base_url, href)
                external_css.append(absolute_url)
        
        styles['external'] = external_css[:10]  # Limit number
        
        return styles

class AIComponentGenerator:
    """AI bilan React komponent yaratish"""
    
    def __init__(self, groq_client):
        self.groq_client = groq_client
    
    def analyze_website(self, website_data: WebsiteData) -> Dict:
        """Website ni AI bilan tahlil qilish"""
        if not self.groq_client:
            return self._fallback_analysis(website_data)
        
        try:
            logger.info("🤖 Starting AI analysis with Groq...")
            
            prompt = self._create_analysis_prompt(website_data)
            
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system", 
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=8000,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content
            logger.info("✅ AI analysis completed")
            logger.info(f"🔍 AI Analysis Response (first 500 chars): {ai_response[:500] if ai_response else 'None'}")
            
            # JSON parse qilish - improved
            try:
                # Clean the response - remove markdown code blocks if any
                cleaned_response = ai_response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]  # Remove ```json
                if cleaned_response.startswith('```'):
                    cleaned_response = cleaned_response[3:]  # Remove ```
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]  # Remove ending ```
                
                # Try to find JSON content between braces
                start_idx = cleaned_response.find('{')
                end_idx = cleaned_response.rfind('}')
                
                if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                    json_content = cleaned_response[start_idx:end_idx+1]
                    result = json.loads(json_content)
                    result['ai_provider'] = 'groq'
                    result['timestamp'] = int(time.time())
                    logger.info("✅ AI JSON successfully parsed")
                    return result
                else:
                    logger.warning("⚠️ No valid JSON found in AI response")
                    return self._fallback_analysis(website_data)
                    
            except json.JSONDecodeError as e:
                logger.warning(f"⚠️ JSON parse failed: {str(e)}, using fallback")
                logger.debug(f"AI Response (first 500 chars): {ai_response[:500]}")
                return self._fallback_analysis(website_data)
                
        except Exception as e:
            logger.error(f"❌ AI analysis failed: {str(e)}")
            return self._fallback_analysis(website_data)
    
    def generate_components(self, analysis: Dict) -> List[ComponentData]:
        """Komponentlar yaratish"""
        if not self.groq_client:
            return self._fallback_components()
        
        try:
            logger.info("🛠️ Generating React components...")
            
            prompt = self._create_generation_prompt(analysis)
            
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a SENIOR REACT TYPESCRIPT ARCHITECT. CRITICAL INSTRUCTIONS: 1) Return ONLY valid JSON 2) No markdown blocks, no explanations, no text before/after JSON 3) Start directly with { and end with } 4) Follow exact schema in prompt 5) Generate real production components based on actual website content. VIOLATING THESE RULES WILL RESULT IN SYSTEM FAILURE."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=8000,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content
            logger.info("✅ Component generation completed")
            logger.info(f"🔍 Component Generation Response (first 500 chars): {ai_response[:500] if ai_response else 'None'}")
            
            # Parse response - advanced cleaning
            try:
                # Clean the response - remove markdown code blocks if any
                cleaned_response = ai_response.strip()
                
                # Remove all variations of markdown code blocks and explanations
                patterns_to_remove = [
                    'Based on the provided website analysis data, I will generate',
                    'Here is the output in the exact format specified:',
                    'Based on the website analysis',
                    'Here are the components',
                    '```json\n',
                    '```json',
                    '```typescript',
                    '```tsx',
                    '```\n',
                    '```',
                    '`',  # Remove single backticks
                ]
                
                for pattern in patterns_to_remove:
                    cleaned_response = cleaned_response.replace(pattern, '')
                
                # Remove any text before first {
                start_idx = cleaned_response.find('{')
                if start_idx > 0:
                    cleaned_response = cleaned_response[start_idx:]
                
                # Remove any text after last }
                end_idx = cleaned_response.rfind('}')
                if end_idx != -1 and end_idx < len(cleaned_response) - 1:
                    cleaned_response = cleaned_response[:end_idx+1]
                
                # Remove newlines and extra spaces inside JSON
                cleaned_response = re.sub(r'\n\s*', ' ', cleaned_response)
                cleaned_response = re.sub(r'\s+', ' ', cleaned_response)
                
                logger.info(f"🔧 Cleaned JSON (first 300 chars): {cleaned_response[:300]}")
                
                # Try to parse JSON
                result = json.loads(cleaned_response)
                
                if 'components' in result:
                    components = []
                    
                    for comp_data in result.get('components', []):
                        component = ComponentData(
                            name=comp_data.get('name', 'UnknownComponent'),
                            type=comp_data.get('type', 'component'),
                            tsx_code=comp_data.get('tsx_code', ''),
                            css_code=comp_data.get('css_code', ''),
                            props=comp_data.get('props', []),
                            dependencies=comp_data.get('dependencies', []),
                            description=comp_data.get('description', '')
                        )
                        components.append(component)
                    
                    logger.info(f"✅ Generated {len(components)} components from AI response")
                    return components
                else:
                    logger.warning("⚠️ No 'components' key found in AI response")
                    return self._fallback_components()
                
                return components
                
            except json.JSONDecodeError as e:
                logger.error(f"❌ JSON parse failed: {str(e)}")
                logger.error(f"🔍 Raw AI response (first 1000 chars): {ai_response[:1000]}")
                logger.error(f"🔧 Cleaned response (first 500 chars): {cleaned_response[:500] if 'cleaned_response' in locals() else 'Not available'}")
                return self._fallback_components()
                
        except Exception as e:
            logger.error(f"❌ Component generation failed: {str(e)}")
            return self._fallback_components()
    
    def _create_analysis_prompt(self, website_data: WebsiteData) -> str:
        """Professional website analysis uchun mukammal prompt"""
        return f"""
You are a SENIOR UI/UX ARCHITECT and REACT EXPERT analyzing websites for component generation.

=== WEBSITE DATA TO ANALYZE ===

URL: {website_data.url}
Title: {website_data.title}

HTML STRUCTURE (First 4000 chars):
{website_data.html[:4000]}

TEXT CONTENT (First 1500 chars):
{website_data.text_content[:1500]}

META DATA:
{json.dumps(website_data.meta_data, indent=2)}

LINKS ANALYSIS ({len(website_data.links)} total):
{json.dumps(website_data.links[:10], indent=2)}

IMAGES ANALYSIS ({len(website_data.images)} total):
{json.dumps(website_data.images[:10], indent=2)}

STYLES DETECTED:
{json.dumps(website_data.styles, indent=2)}

=== ANALYSIS REQUIREMENTS ===

Perform DEEP ARCHITECTURAL ANALYSIS:

🏗️ STRUCTURAL ANALYSIS:
- Identify layout patterns (header, nav, hero, content, sidebar, footer)
- Detect grid systems and responsive breakpoints
- Analyze information hierarchy
- Map component relationships and nesting

🎨 DESIGN SYSTEM EXTRACTION:
- Color palette (primary, secondary, accent, neutral)
- Typography system (headings, body text, font families)
- Spacing system (margins, padding, gaps)
- Border radius, shadows, transitions
- Button styles and states
- Form input designs

🧩 COMPONENT IDENTIFICATION:
- Navigation patterns (mega menu, dropdowns, breadcrumbs)
- Content blocks (cards, tiles, sections)
- Interactive elements (buttons, forms, modals)
- Media components (image galleries, videos)
- Data display (tables, lists, grids)

🚀 TECHNICAL RECOMMENDATIONS:
- State management needs
- Required React hooks
- Performance optimizations
- Accessibility considerations
- SEO requirements

Return COMPREHENSIVE JSON analysis:

{{
  "structure": {{
    "layout_type": "multi-column|single-column|dashboard",
    "sections": [
      {{
        "id": "header",
        "type": "navigation",
        "name": "Header",
        "description": "Main site header with navigation",
        "complexity": "simple|medium|complex",
        "interactive_elements": ["dropdown", "search", "mobile-menu"],
        "recommended_components": ["Header", "Navigation", "MobileMenu"]
      }}
    ],
    "responsive_breakpoints": ["mobile", "tablet", "desktop"],
    "navigation_pattern": "horizontal|vertical|mega-menu|sidebar"
  }},
  "design_system": {{
    "colors": {{
      "primary": "#hexcode",
      "secondary": "#hexcode",
      "accent": "#hexcode",
      "neutral": ["#hex1", "#hex2", "#hex3"],
      "semantic": {{
        "success": "#hexcode",
        "warning": "#hexcode",
        "error": "#hexcode"
      }}
    }},
    "typography": {{
      "font_families": ["primary-font", "secondary-font"],
      "headings": {{
        "h1": {{"size": "text-4xl", "weight": "font-bold"}},
        "h2": {{"size": "text-3xl", "weight": "font-semibold"}},
        "h3": {{"size": "text-2xl", "weight": "font-medium"}}
      }},
      "body": {{"size": "text-base", "weight": "font-normal", "line_height": "leading-relaxed"}}
    }},
    "spacing": {{
      "base_unit": "4px",
      "scale": ["xs", "sm", "md", "lg", "xl", "2xl"],
      "container_max_width": "max-w-7xl"
    }},
    "components": {{
      "buttons": {{
        "primary": "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg",
        "secondary": "bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg"
      }},
      "cards": {{
        "default": "bg-white rounded-lg shadow-md border border-gray-200 p-6"
      }}
    }}
  }},
  "components_needed": [
    {{
      "name": "Header",
      "type": "layout",
      "priority": "high|medium|low",
      "complexity": "simple|medium|complex",
      "features": ["responsive", "dropdown", "search"],
      "props_needed": ["logo", "navigationItems", "isMenuOpen"],
      "state_requirements": ["activeDropdown", "mobileMenuOpen"],
      "dependencies": ["react", "lucide-react"]
    }}
  ],
  "technical_requirements": {{
    "react_hooks": ["useState", "useEffect", "useCallback"],
    "accessibility": ["ARIA labels", "keyboard navigation", "screen reader support"],
    "performance": ["lazy loading", "image optimization", "bundle splitting"],
    "responsive": ["mobile-first", "flexible layouts", "touch-friendly"]
  }},
  "content_patterns": {{
    "has_forms": true|false,
    "has_search": true|false,
    "has_authentication": true|false,
    "has_e_commerce": true|false,
    "content_types": ["blog", "portfolio", "corporate", "e-commerce", "documentation"]
  }}
}}

=== CRITICAL INSTRUCTIONS ===

1. Analyze EVERY aspect of the website structure
2. Extract REAL design tokens from the HTML/CSS
3. Identify ALL component opportunities
4. Provide ACTIONABLE technical recommendations
5. Return ONLY valid JSON - no markdown, no explanations

Make this analysis COMPREHENSIVE and ENTERPRISE-LEVEL!

CRITICAL: Return ONLY valid JSON format. Start with {{ and end with }}. NO markdown code blocks, NO explanations, NO text before or after JSON.
"""
    
    def _create_generation_prompt(self, analysis: Dict) -> str:
        """Professional component generation uchun mukammal prompt"""
        return f"""
You are a SENIOR REACT TYPESCRIPT DEVELOPER and UI/UX ARCHITECT with 10+ years experience at top tech companies.

Your task: Generate PRODUCTION-READY, ENTERPRISE-LEVEL React TypeScript components based on this website analysis.

=== WEBSITE ANALYSIS DATA ===
{json.dumps(analysis, indent=2)[:3000]}

=== REQUIREMENTS ===

🎯 COMPONENT ARCHITECTURE:
- Create a COMPLETE component library (5-8 components minimum)
- Include layout components (Header, Navigation, Hero, Content sections, Footer)
- Include reusable UI components (Button, Card, Modal, Form elements)
- Include specialized feature components based on website content
- EACH component must be 50-200+ lines of REAL, FUNCTIONAL code

💡 TYPESCRIPT EXCELLENCE:
- Full TypeScript interfaces for ALL props
- Proper generic types where applicable
- Strict typing for event handlers
- Optional vs required props clearly defined
- Export all types for reusability

🎨 STYLING & DESIGN:
- Use Tailwind CSS for ALL styling
- Implement responsive design (mobile-first)
- Add hover/focus states and animations
- Include proper spacing, typography, and color schemes
- Extract design tokens from the analyzed website

🚀 MODERN REACT PATTERNS:
- Only functional components with React Hooks
- Use useState, useEffect, useCallback, useMemo where appropriate
- Custom hooks for complex logic
- Proper component composition
- Event handling with TypeScript

♿ ACCESSIBILITY & BEST PRACTICES:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Proper heading hierarchy

🔧 ADVANCED FEATURES:
- Form validation (if forms detected)
- Loading states and error handling
- Search functionality (if applicable)
- Navigation with active states
- Modal/dropdown interactions
- Image optimization

=== OUTPUT FORMAT ===

Return ONLY valid JSON in this EXACT format:

{{
  "components": [
    {{
      "name": "Header",
      "type": "layout", 
      "tsx_code": "FULL TSX COMPONENT CODE HERE",
      "css_code": "",
      "props": [
        {{"name": "logo", "type": "string", "required": false, "description": "Logo image URL"}},
        {{"name": "navigationItems", "type": "NavigationItem[]", "required": true, "description": "Array of navigation items"}}
      ],
      "dependencies": ["react", "lucide-react", "@types/react"],
      "description": "Responsive header component with dropdown navigation and mobile menu support"
    }}
  ]
}}

=== CRITICAL INSTRUCTIONS ===

1. Generate 5-8 COMPLETE components minimum
2. Each TSX code must be 50-200+ lines of REAL, FUNCTIONAL code
3. Include proper TypeScript interfaces for ALL props
4. Use REAL Tailwind classes, not placeholders
5. Include interactive features (dropdowns, modals, forms)
6. Make components RESPONSIVE and ACCESSIBLE
7. Extract actual design elements from the website analysis
8. NO placeholder comments like "// Add more functionality"
9. Return ONLY valid JSON - no markdown, no explanations

MAKE EVERY COMPONENT PRODUCTION-READY AND ENTERPRISE-LEVEL QUALITY!

CRITICAL: Return ONLY valid JSON format. Start with {{ and end with }}. NO markdown code blocks, NO explanations, NO text before or after JSON.
"""
    
    def _get_system_prompt(self) -> str:
        """Professional system prompt for enterprise-level development"""
        return """
You are a SENIOR REACT TYPESCRIPT ARCHITECT with 10+ years at companies like Google, Facebook, Netflix.

EXPERTISE AREAS:
- Enterprise-level React TypeScript applications
- Scalable component architecture and design systems  
- Performance optimization and accessibility
- Modern frontend patterns and best practices
- UI/UX design and responsive development

CORE PRINCIPLES:
🚀 PRODUCTION EXCELLENCE:
- Write enterprise-grade, maintainable code
- Follow strict TypeScript best practices
- Implement comprehensive error handling
- Include proper testing considerations

🎨 DESIGN SYSTEM MASTERY:
- Extract and systematize design tokens
- Create consistent, reusable components
- Implement responsive, mobile-first design
- Follow accessibility guidelines (WCAG 2.1)

⚡ PERFORMANCE & OPTIMIZATION:
- Optimize for Core Web Vitals
- Implement lazy loading and code splitting
- Use React best practices (memo, callback, useMemo)
- Consider bundle size and runtime performance

🧩 ARCHITECTURE EXCELLENCE:
- Create modular, composable components
- Implement proper separation of concerns
- Use TypeScript generics and advanced types
- Design for scalability and maintainability

RESPONSE REQUIREMENTS:
- Return ONLY valid JSON (no markdown, no explanations)
- Provide comprehensive, detailed analysis
- Generate 50-200+ lines of functional code per component
- Include proper TypeScript interfaces and types
- Implement real interactivity and state management

QUALITY STANDARDS:
- Enterprise-level code quality
- Production-ready components
- Comprehensive prop interfaces
- Proper error boundaries and validation
- Accessible and responsive design
"""
    
    def _fallback_analysis(self, website_data: WebsiteData) -> Dict:
        """Fallback analysis agar AI fail bo'lsa"""
        return {
            "title": website_data.title,
            "description": "Website analysis completed",
            "ai_provider": "fallback",
            "metadata": website_data.meta_data,
            "structure": {
                "layout": "single-column",
                "sections": [
                    {"id": "header", "type": "header", "name": "Header"},
                    {"id": "main", "type": "content", "name": "Main Content"},
                    {"id": "footer", "type": "footer", "name": "Footer"}
                ]
            },
            "components": [
                {
                    "id": "header-nav",
                    "name": "Header",
                    "type": "navigation",
                    "description": "Main website header with navigation"
                },
                {
                    "id": "main-content",
                    "name": "MainContent", 
                    "type": "layout",
                    "description": "Main page content area"
                },
                {
                    "id": "footer",
                    "name": "Footer",
                    "type": "layout", 
                    "description": "Website footer"
                }
            ],
            "designSystem": {
                "colors": {"primary": "#3B82F6", "secondary": "#64748B"},
                "typography": {"fontFamily": "Inter, sans-serif"},
                "spacing": {"unit": "8px"}
            },
            "timestamp": int(time.time())
        }
    
    def _fallback_components(self) -> List[ComponentData]:
        """Professional fallback komponentlar - enterprise darajada"""
        return [
            ComponentData(
                name="Header",
                type="layout",
                tsx_code=self._get_professional_header_template(),
                css_code="",
                props=[
                    {"name": "logo", "type": "string", "required": False},
                    {"name": "navigationItems", "type": "NavigationItem[]", "required": True},
                    {"name": "onMenuToggle", "type": "() => void", "required": False},
                    {"name": "isMenuOpen", "type": "boolean", "required": False}
                ],
                dependencies=["react", "@types/react", "lucide-react"],
                description="Professional responsive header with navigation and mobile menu"
            ),
            ComponentData(
                name="HeroSection",
                type="feature",
                tsx_code=self._get_professional_hero_template(),
                css_code="",
                props=[
                    {"name": "title", "type": "string", "required": True},
                    {"name": "subtitle", "type": "string", "required": False},
                    {"name": "description", "type": "string", "required": False},
                    {"name": "primaryAction", "type": "ButtonProps", "required": False},
                    {"name": "secondaryAction", "type": "ButtonProps", "required": False},
                    {"name": "backgroundImage", "type": "string", "required": False}
                ],
                dependencies=["react", "@types/react", "lucide-react"],
                description="Professional hero section with call-to-action buttons"
            ),
            ComponentData(
                name="FeatureCard",
                type="ui",
                tsx_code=self._get_professional_card_template(),
                css_code="",
                props=[
                    {"name": "icon", "type": "React.ComponentType", "required": False},
                    {"name": "title", "type": "string", "required": True},
                    {"name": "description", "type": "string", "required": True},
                    {"name": "href", "type": "string", "required": False},
                    {"name": "variant", "type": "'default' | 'highlighted' | 'minimal'", "required": False}
                ],
                dependencies=["react", "@types/react", "lucide-react"],
                description="Professional feature card component with multiple variants"
            ),
            ComponentData(
                name="ContactForm",
                type="feature",
                tsx_code=self._get_professional_form_template(),
                css_code="",
                props=[
                    {"name": "onSubmit", "type": "(data: ContactFormData) => Promise<void>", "required": True},
                    {"name": "isLoading", "type": "boolean", "required": False},
                    {"name": "className", "type": "string", "required": False}
                ],
                dependencies=["react", "@types/react", "lucide-react"],
                description="Professional contact form with validation and loading states"
            ),
            ComponentData(
                name="Footer",
                type="layout",
                tsx_code=self._get_professional_footer_template(),
                css_code="",
                props=[
                    {"name": "companyName", "type": "string", "required": True},
                    {"name": "socialLinks", "type": "SocialLink[]", "required": False},
                    {"name": "footerSections", "type": "FooterSection[]", "required": False}
                ],
                dependencies=["react", "@types/react", "lucide-react"],
                description="Professional footer with social links and navigation sections"
            )
        ]
    
    def _get_professional_header_template(self) -> str:
        """Professional header component template"""
        return '''import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  children?: NavigationItem[];
}

interface HeaderProps {
  logo?: string;
  navigationItems: NavigationItem[];
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navigationItems,
  onMenuToggle,
  isMenuOpen = false
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto mr-4"
              />
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 ${item.isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                  >
                    {item.label}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-6">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};'''

    def _get_professional_hero_template(self) -> str:
        """Professional hero section template"""
        return '''import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
  backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage
}) => {
  const renderButton = (button: ButtonProps, isPrimary: boolean = false) => {
    const baseClasses = "inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200";
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
      secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
      ghost: "text-gray-600 hover:text-gray-900"
    };
    
    const variant = button.variant || (isPrimary ? 'primary' : 'secondary');
    const classes = `${baseClasses} ${variants[variant]}`;

    if (button.href) {
      return (
        <a href={button.href} className={classes}>
          {button.label}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      );
    }

    return (
      <button onClick={button.onClick} className={classes}>
        {button.label}
        {variant === 'ghost' ? <Play className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
      </button>
    );
  };

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `linear-gradient(rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8)), url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4 tracking-wide uppercase">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryAction && renderButton(primaryAction, true)}
            {secondaryAction && renderButton(secondaryAction, false)}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10"></div>
      </div>
    </section>
  );
};'''

    def _get_professional_card_template(self) -> str:
        """Professional feature card template"""
        return '''import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  variant?: 'default' | 'highlighted' | 'minimal';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  variant = 'default'
}) => {
  const variants = {
    default: "bg-white border border-gray-200 hover:shadow-lg",
    highlighted: "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 hover:shadow-xl",
    minimal: "bg-transparent hover:bg-gray-50"
  };

  const CardContent = () => (
    <div className={`p-6 rounded-lg transition-all duration-300 ${variants[variant]}`}>
      {Icon && (
        <div className={`mb-4 ${variant === 'highlighted' ? 'text-blue-600' : 'text-gray-600'}`}>
          <Icon className="h-8 w-8" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>
      
      {href && (
        <div className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
          <span>Learn more</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block group">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};'''

    def _get_professional_form_template(self) -> str:
        """Professional contact form template"""
        return '''import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
  className = ""
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700">Thank you for your message. We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange('name')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={handleChange('subject')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.subject ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter the subject"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={handleChange('message')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors.message ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your message"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};'''

    def _get_professional_footer_template(self) -> str:
        """Professional footer template"""
        return '''import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  url: string;
}

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  companyName: string;
  socialLinks?: SocialLink[];
  footerSections?: FooterSection[];
}

export const Footer: React.FC<FooterProps> = ({
  companyName,
  socialLinks = [],
  footerSections = []
}) => {
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin
  };

  const defaultSections: FooterSection[] = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Team", href: "/team" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "/services/web" },
        { label: "Mobile Apps", href: "/services/mobile" },
        { label: "Consulting", href: "/services/consulting" },
        { label: "Support", href: "/support" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" }
      ]
    }
  ];

  const sections = footerSections.length > 0 ? footerSections : defaultSections;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building innovative solutions for the digital world. 
              We help businesses grow through technology and creativity.
            </p>
            
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>hello@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Business St, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};'''

# Initialize services
scraper = AdvancedWebScraper()
ai_generator = AIComponentGenerator(groq_client)

# API Routes
@app.route('/health', methods=['GET'])
def health_check():
    """Server health check"""
    return jsonify({
        'status': 'OK',
        'message': 'CloneAI Production Server is running',
        'groq_available': groq_client is not None,
        'timestamp': int(time.time()),
        'version': '2.0.0'
    })

@app.route('/api/analyze-website', methods=['POST'])
@limiter.limit("10 per minute")
def analyze_website():
    """To'liq website analiz qilish - MAIN ENDPOINT"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        logger.info(f"🚀 Starting full website analysis: {url}")
        
        # 1. Website scraping
        website_data = scraper.scrape_website(url)
        logger.info("✅ Website scraping completed")
        
        # 2. AI analysis
        analysis = ai_generator.analyze_website(website_data)
        logger.info("✅ AI analysis completed")
        
        # 3. Component generation
        components = ai_generator.generate_components(analysis)
        logger.info("✅ Component generation completed")
        
        # 4. Response yaratish
        result = {
            'success': True,
            'url': url,
            'analysis': analysis,
            'components': [
                {
                    'name': comp.name,
                    'type': comp.type,
                    'tsx_code': comp.tsx_code,
                    'css_code': comp.css_code,
                    'props': comp.props,
                    'dependencies': comp.dependencies,
                    'description': comp.description
                }
                for comp in components
            ],
            'website_data': {
                'title': website_data.title,
                'meta_data': website_data.meta_data,
                'links_count': len(website_data.links),
                'images_count': len(website_data.images)
            },
            'stats': {
                'total_components': len(components),
                'processing_time': time.time(),
                'ai_provider': analysis.get('ai_provider', 'unknown')
            },
            'timestamp': int(time.time())
        }
        
        logger.info(f"🎉 Website cloning completed! Generated {len(components)} components")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"❌ Website analysis failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': int(time.time())
        }), 500

@app.route('/api/scrape-content', methods=['POST'])
@limiter.limit("20 per minute")
def scrape_content():
    """Website content ni olish"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        website_data = scraper.scrape_website(url)
        
        return jsonify({
            'success': True,
            'url': url,
            'title': website_data.title,
            'text_content': website_data.text_content[:2000],  # Limit for API
            'meta_data': website_data.meta_data,
            'links': website_data.links[:10],  # Limit for API
            'images': website_data.images[:10],  # Limit for API
            'timestamp': int(time.time())
        })
        
    except Exception as e:
        logger.error(f"❌ Content scraping failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate-components', methods=['POST'])
@limiter.limit("5 per minute")
def generate_components():
    """Komponentlar yaratish"""
    try:
        data = request.get_json()
        analysis = data.get('analysis')
        
        if not analysis:
            return jsonify({'error': 'Analysis data is required'}), 400
        
        components = ai_generator.generate_components(analysis)
        
        return jsonify({
            'success': True,
            'components': [
                {
                    'name': comp.name,
                    'type': comp.type,
                    'tsx_code': comp.tsx_code,
                    'css_code': comp.css_code,
                    'props': comp.props,
                    'dependencies': comp.dependencies,
                    'description': comp.description
                }
                for comp in components
            ],
            'total_components': len(components),
            'timestamp': int(time.time())
        })
        
    except Exception as e:
        logger.error(f"❌ Component generation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/providers', methods=['GET'])
def get_providers():
    """Available AI providers"""
    providers = []
    if groq_client:
        providers.append('groq')
    
    return jsonify({
        'providers': providers,
        'active_provider': 'groq' if groq_client else None,
        'timestamp': int(time.time())
    })

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 8000))
    host = os.getenv('API_HOST', '0.0.0.0')
    
    logger.info("🚀 Starting CloneAI Production Server...")
    logger.info(f"📡 Server: http://{host}:{port}")
    logger.info(f"🔗 Health check: http://{host}:{port}/health")
    logger.info(f"🤖 Groq AI: {'✅ Available' if groq_client else '❌ Not configured'}")
    
    app.run(host=host, port=port, debug=True)
