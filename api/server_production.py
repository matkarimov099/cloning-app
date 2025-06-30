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
                max_tokens=4000,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content
            logger.info("✅ AI analysis completed")
            
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
                        "content": "You are an expert React TypeScript developer. Generate clean, modern, reusable components with TypeScript and Tailwind CSS."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=4000,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content
            logger.info("✅ Component generation completed")
            
            # Parse response - improved
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
                else:
                    logger.warning("⚠️ No valid JSON found in component generation response")
                    return self._fallback_components()
                
                return components
                
            except json.JSONDecodeError:
                return self._fallback_components()
                
        except Exception as e:
            logger.error(f"❌ Component generation failed: {str(e)}")
            return self._fallback_components()
    
    def _create_analysis_prompt(self, website_data: WebsiteData) -> str:
        """Analysis uchun prompt yaratish"""
        return f"""
Analyze this website data and provide a comprehensive analysis for React component generation:

URL: {website_data.url}
Title: {website_data.title}

HTML Structure (excerpt):
{website_data.html[:3000]}

Text Content:
{website_data.text_content[:1000]}

Meta Data:
{json.dumps(website_data.meta_data, indent=2)}

Links ({len(website_data.links)} total):
{json.dumps(website_data.links[:5], indent=2)}

Images ({len(website_data.images)} total):
{json.dumps(website_data.images[:5], indent=2)}

Please analyze and return a JSON response with:
1. Website structure analysis
2. Component identification
3. Design system elements
4. Recommended React components
5. Styling approach
"""
    
    def _create_generation_prompt(self, analysis: Dict) -> str:
        """Component generation uchun prompt"""
        return f"""
Based on this website analysis, generate React TypeScript components:

Analysis:
{json.dumps(analysis, indent=2)[:2000]}

Generate:
1. Main page components (Header, Hero, Content, Footer)
2. Reusable UI components (Button, Card, Navigation)
3. TypeScript interfaces for props
4. Tailwind CSS styling
5. Modern React patterns (hooks, functional components)

Return JSON format:
{{
  "components": [
    {{
      "name": "ComponentName",
      "type": "layout|ui|feature",
      "tsx_code": "full tsx code here",
      "css_code": "additional css if needed",
      "props": [{{ "name": "propName", "type": "string", "required": true }}],
      "dependencies": ["react", "@types/react"],
      "description": "Component description"
    }}
  ]
}}
"""
    
    def _get_system_prompt(self) -> str:
        """System prompt"""
        return """
You are a senior React TypeScript developer and UI/UX expert. 
Analyze websites and generate production-ready React components.

Key principles:
1. Modern React patterns (functional components, hooks)
2. TypeScript for type safety
3. Tailwind CSS for styling
4. Responsive design
5. Accessibility best practices
6. Clean, maintainable code
7. Reusable component architecture

Always return valid JSON responses.
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
        """Fallback komponentlar"""
        return [
            ComponentData(
                name="Header",
                type="layout",
                tsx_code=self._get_header_template(),
                css_code="",
                props=[{"name": "title", "type": "string", "required": False}],
                dependencies=["react", "@types/react"],
                description="Website header component"
            ),
            ComponentData(
                name="MainContent",
                type="layout", 
                tsx_code=self._get_main_template(),
                css_code="",
                props=[{"name": "children", "type": "ReactNode", "required": False}],
                dependencies=["react", "@types/react"],
                description="Main content area component"
            )
        ]
    
    def _get_header_template(self) -> str:
        """Header component template"""
        return '''import React from 'react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Website" }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};'''
    
    def _get_main_template(self) -> str:
        """Main content template"""
        return '''import React from 'react';

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Our Website
            </h2>
            <p className="text-lg text-gray-600">
              This is the main content area of your website.
            </p>
          </div>
        )}
      </div>
    </main>
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
