#!/usr/bin/env python3
"""
CloneAI - Enhanced Web Scraping & Component Generation
Professional-grade web scraping with AI-powered React component generation
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests
from bs4 import BeautifulSoup
import json
import os
import time
import random
from urllib.parse import urljoin, urlparse
import re
from dotenv import load_dotenv
from groq import Groq
import openai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["30 per minute"]
)

# AI Clients
groq_client = None
openai_client = None

try:
    if os.getenv('GROQ_API_KEY'):
        groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        print("✅ Groq client initialized")
except Exception as e:
    print(f"❌ Groq initialization failed: {e}")

try:
    if os.getenv('OPENAI_API_KEY'):
        openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        print("✅ OpenAI client initialized")
except Exception as e:
    print(f"❌ OpenAI initialization failed: {e}")

class WebsiteScraper:
    """Professional web scraping class"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
    
    def scrape_website(self, url, timeout=15):
        """Advanced website scraping with comprehensive data extraction"""
        try:
            # Normalize URL
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            print(f"🕷️ Scraping: {url}")
            
            # Add delay to be respectful
            time.sleep(random.uniform(0.5, 1.5))
            
            # Make request
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract comprehensive data
            data = self._extract_website_data(soup, url)
            data['url'] = url
            data['success'] = True
            
            print(f"✅ Successfully scraped: {url}")
            return data
            
        except requests.RequestException as e:
            print(f"❌ Network error for {url}: {e}")
            return {'error': f'Network error: {str(e)}', 'success': False}
        except Exception as e:
            print(f"❌ Scraping error for {url}: {e}")
            return {'error': f'Scraping failed: {str(e)}', 'success': False}
    
    def _extract_website_data(self, soup, url):
        """Extract comprehensive website data"""
        # Remove unwanted elements
        for element in soup(['script', 'style', 'noscript', 'meta']):
            element.decompose()
        
        # Basic metadata
        title = self._safe_extract(soup.find('title'))
        description = self._extract_description(soup)
        keywords = self._extract_keywords(soup)
        
        # Structural analysis
        structure = self._analyze_structure(soup)
        
        # Design system extraction
        design_system = self._extract_design_system(soup)
        
        # Component detection
        components = self._detect_components(soup)
        
        # Content analysis
        content = {
            'text': soup.get_text(separator=' ', strip=True)[:3000],
            'images': self._extract_images(soup, url),
            'links': self._extract_links(soup, url),
            'forms': self._extract_forms(soup)
        }
        
        return {
            'title': title,
            'description': description,
            'keywords': keywords,
            'structure': structure,
            'design_system': design_system,
            'components': components,
            'content': content,
            'timestamp': int(time.time())
        }
    
    def _safe_extract(self, element):
        """Safely extract text from element"""
        return element.get_text().strip() if element else ''
    
    def _extract_description(self, soup):
        """Extract page description"""
        desc = soup.find('meta', attrs={'name': 'description'})
        if desc:
            return desc.get('content', '').strip()
        
        # Try Open Graph
        og_desc = soup.find('meta', attrs={'property': 'og:description'})
        if og_desc:
            return og_desc.get('content', '').strip()
        
        return ''
    
    def _extract_keywords(self, soup):
        """Extract keywords"""
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        return keywords.get('content', '') if keywords else ''
    
    def _analyze_structure(self, soup):
        """Analyze page structure"""
        return {
            'headers': [self._safe_extract(h) for h in soup.find_all(['h1', 'h2', 'h3'])[:10]],
            'nav_items': [self._safe_extract(a) for a in soup.select('nav a')[:20]],
            'sections': len(soup.find_all(['section', 'article', 'div.section'])),
            'layout_type': self._detect_layout_type(soup)
        }
    
    def _detect_layout_type(self, soup):
        """Detect layout type"""
        if soup.find('nav'):
            if soup.find(['aside', '.sidebar']):
                return 'sidebar'
            elif soup.find(['header', '.header']):
                return 'header-main'
        return 'simple'
    
    def _extract_design_system(self, soup):
        """Extract design system information"""
        # This is a simplified version - in reality, you'd need more sophisticated analysis
        return {
            'colors': self._extract_colors(soup),
            'typography': self._extract_typography(soup),
            'spacing': 'modern',  # Would analyze actual spacing
            'style': 'clean'  # Would analyze design style
        }
    
    def _extract_colors(self, soup):
        """Extract color information from CSS and styles"""
        # Simplified color extraction
        colors = {
            'primary': '#2563eb',  # Default blue
            'secondary': '#64748b',  # Default gray
            'accent': '#10b981'  # Default green
        }
        
        # Try to find actual colors from style attributes
        styled_elements = soup.find_all(attrs={'style': True})
        for element in styled_elements[:10]:  # Limit analysis
            style = element.get('style', '')
            # Simple color extraction from inline styles
            color_match = re.search(r'color:\s*([^;]+)', style)
            if color_match:
                colors['text'] = color_match.group(1).strip()
                break
        
        return colors
    
    def _extract_typography(self, soup):
        """Extract typography information"""
        return {
            'primary_font': 'Inter, system-ui, sans-serif',
            'heading_font': 'Inter, system-ui, sans-serif',
            'font_sizes': {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem'
            }
        }
    
    def _detect_components(self, soup):
        """Detect UI components on the page"""
        components = []
        
        # Header detection
        header = soup.find(['header', '.header', 'nav'])
        if header:
            components.append({
                'name': 'Header',
                'type': 'navigation',
                'description': 'Main navigation header',
                'complexity': 'medium',
                'elements': self._analyze_header(header)
            })
        
        # Hero section detection
        hero_selectors = ['.hero', '.jumbotron', '.banner', 'section:first-of-type']
        for selector in hero_selectors:
            hero = soup.select_one(selector)
            if hero:
                components.append({
                    'name': 'HeroSection',
                    'type': 'layout',
                    'description': 'Main hero/banner section',
                    'complexity': 'medium',
                    'elements': self._analyze_hero(hero)
                })
                break
        
        # Card detection
        cards = soup.find_all(['article', '.card', '.post', '.item'])[:3]
        if cards:
            components.append({
                'name': 'Card',
                'type': 'content',
                'description': 'Content cards or items',
                'complexity': 'simple',
                'count': len(cards)
            })
        
        # Form detection
        forms = soup.find_all('form')
        if forms:
            components.append({
                'name': 'ContactForm',
                'type': 'interactive',
                'description': 'Forms for user interaction',
                'complexity': 'medium',
                'count': len(forms)
            })
        
        # Footer detection
        footer = soup.find(['footer', '.footer'])
        if footer:
            components.append({
                'name': 'Footer',
                'type': 'layout',
                'description': 'Page footer with links',
                'complexity': 'simple',
                'elements': self._analyze_footer(footer)
            })
        
        return components
    
    def _analyze_header(self, header):
        """Analyze header structure"""
        return {
            'logo': bool(header.find(['img', '.logo'])),
            'navigation': len(header.find_all('a')),
            'cta_buttons': len(header.find_all(['button', '.btn', '.cta']))
        }
    
    def _analyze_hero(self, hero):
        """Analyze hero section"""
        return {
            'title': bool(hero.find(['h1', 'h2'])),
            'subtitle': bool(hero.find('p')),
            'cta_buttons': len(hero.find_all(['button', '.btn', '.cta'])),
            'background_image': bool(hero.find('img'))
        }
    
    def _analyze_footer(self, footer):
        """Analyze footer structure"""
        return {
            'links': len(footer.find_all('a')),
            'social_links': len(footer.find_all(['.social', '[href*="facebook"]', '[href*="twitter"]', '[href*="linkedin"]'])),
            'sections': len(footer.find_all(['section', 'div']))
        }
    
    def _extract_images(self, soup, base_url):
        """Extract image information"""
        images = []
        img_tags = soup.find_all('img')[:5]  # Limit to first 5 images
        
        for img in img_tags:
            src = img.get('src', '')
            if src:
                # Convert relative URLs to absolute
                if src.startswith('/'):
                    src = urljoin(base_url, src)
                
                images.append({
                    'src': src,
                    'alt': img.get('alt', ''),
                    'width': img.get('width'),
                    'height': img.get('height')
                })
        
        return images
    
    def _extract_links(self, soup, base_url):
        """Extract navigation links"""
        links = []
        link_tags = soup.find_all('a', href=True)[:10]  # Limit to first 10 links
        
        for link in link_tags:
            href = link.get('href', '')
            text = self._safe_extract(link)
            
            if href and text:
                # Convert relative URLs to absolute
                if href.startswith('/'):
                    href = urljoin(base_url, href)
                
                links.append({
                    'href': href,
                    'text': text,
                    'external': not href.startswith(base_url)
                })
        
        return links
    
    def _extract_forms(self, soup):
        """Extract form information"""
        forms = []
        form_tags = soup.find_all('form')[:3]  # Limit to first 3 forms
        
        for form in form_tags:
            inputs = form.find_all(['input', 'textarea', 'select'])
            forms.append({
                'action': form.get('action', ''),
                'method': form.get('method', 'GET'),
                'fields': len(inputs),
                'field_types': [inp.get('type', 'text') for inp in inputs]
            })
        
        return forms

class AIComponentGenerator:
    """AI-powered React component generator"""
    
    def __init__(self):
        self.groq_client = groq_client
        self.openai_client = openai_client
    
    def generate_components(self, scraped_data):
        """Generate React components from scraped data"""
        try:
            # Create analysis prompt
            prompt = self._create_analysis_prompt(scraped_data)
            
            # Try Groq first (faster)
            if self.groq_client:
                try:
                    result = self._call_groq(prompt)
                    if result:
                        return self._parse_ai_response(result)
                except Exception as e:
                    print(f"Groq failed: {e}")
            
            # Fallback to OpenAI
            if self.openai_client:
                try:
                    result = self._call_openai(prompt)
                    if result:
                        return self._parse_ai_response(result)
                except Exception as e:
                    print(f"OpenAI failed: {e}")
            
            # If all AI fails, return fallback
            return self._create_fallback_response(scraped_data)
            
        except Exception as e:
            print(f"Component generation failed: {e}")
            return self._create_fallback_response(scraped_data)
    
    def _create_analysis_prompt(self, data):
        """Create comprehensive prompt for AI"""
        return f"""
Analyze this website data and create React TypeScript components:

WEBSITE DATA:
Title: {data.get('title', 'Unknown')}
Description: {data.get('description', 'No description')}
Components detected: {json.dumps(data.get('components', []), indent=2)}
Structure: {json.dumps(data.get('structure', {}), indent=2)}
Design System: {json.dumps(data.get('design_system', {}), indent=2)}

REQUIREMENTS:
1. Create 3-5 professional React TypeScript components
2. Use Tailwind CSS for styling
3. Include proper TypeScript interfaces
4. Add accessibility features (ARIA labels)
5. Make components responsive
6. Include React hooks (useState, useEffect)
7. Add proper error handling
8. Write production-ready code (100+ lines per component)

COMPONENTS TO CREATE:
- Header: Navigation with logo, menu, responsive mobile menu
- HeroSection: Main landing area with title, subtitle, CTA buttons
- FeatureCard: Reusable card component for content
- ContactForm: Interactive form with validation
- Footer: Page footer with links and social media

Return JSON response:
{{
  "analysis": {{
    "title": "Website title",
    "description": "Website purpose",
    "componentCount": 5,
    "designSystem": {{
      "colors": {{"primary": "#color", "secondary": "#color"}},
      "typography": "font details",
      "spacing": "spacing system"
    }}
  }},
  "components": [
    {{
      "name": "Header",
      "fileName": "Header.tsx",
      "description": "Navigation header component",
      "complexity": "medium",
      "code": "// Complete React TypeScript component code with 100+ lines",
      "props": {{
        "logo": "string",
        "navigationItems": "NavigationItem[]",
        "onMenuToggle": "() => void"
      }}
    }}
  ],
  "types": "// TypeScript interface definitions",
  "instructions": [
    "1. Copy components to your project",
    "2. Install dependencies: npm install lucide-react",
    "3. Configure Tailwind CSS"
  ]
}}

Generate REAL, WORKING React components with actual implementation, not placeholders!
"""
    
    def _call_groq(self, prompt):
        """Call Groq API"""
        response = self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert React TypeScript developer. Create professional, production-ready components with complete implementations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.1
        )
        return response.choices[0].message.content
    
    def _call_openai(self, prompt):
        """Call OpenAI API"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert React TypeScript developer. Create professional, production-ready components with complete implementations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.1
        )
        return response.choices[0].message.content
    
    def _parse_ai_response(self, response):
        """Parse AI response into structured format"""
        try:
            # Try to extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                result = json.loads(json_str)
                result['success'] = True
                return result
            
        except json.JSONDecodeError:
            pass
        
        # If JSON parsing fails, create structured response
        return {
            'success': True,
            'analysis': {
                'title': 'AI Generated Analysis',
                'componentCount': 3,
                'description': 'Components generated from website analysis'
            },
            'components': [
                {
                    'name': 'Header',
                    'description': 'Navigation header',
                    'code': '// AI response: ' + response[:500] + '...'
                }
            ],
            'raw_response': response
        }
    
    def _create_fallback_response(self, data):
        """Create fallback response when AI fails"""
        components = data.get('components', [])
        
        return {
            'success': True,
            'analysis': {
                'title': data.get('title', 'Unknown Website'),
                'description': data.get('description', 'Website analysis'),
                'componentCount': len(components)
            },
            'components': [
                {
                    'name': comp['name'],
                    'description': comp['description'],
                    'type': comp['type'],
                    'complexity': comp.get('complexity', 'medium'),
                    'code': f'// {comp["name"]} component would be generated here'
                } for comp in components
            ],
            'fallback': True
        }

# Initialize classes
scraper = WebsiteScraper()
ai_generator = AIComponentGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'CloneAI Enhanced Server is running',
        'version': '3.0.0',
        'ai_providers': {
            'groq': groq_client is not None,
            'openai': openai_client is not None
        },
        'timestamp': int(time.time())
    })

@app.route('/api/analyze-website', methods=['POST'])
@limiter.limit("10 per minute")
def analyze_website():
    """Main endpoint: Scrape website and generate components"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required', 'success': False}), 400
        
        print(f"🚀 Starting analysis for: {url}")
        
        # Step 1: Scrape website
        scraped_data = scraper.scrape_website(url)
        
        if not scraped_data.get('success'):
            return jsonify(scraped_data), 400
        
        print(f"✅ Scraping completed for: {url}")
        
        # Step 2: Generate components with AI
        ai_result = ai_generator.generate_components(scraped_data)
        
        print(f"✅ AI analysis completed for: {url}")
        
        # Combine results
        result = {
            'success': True,
            'url': url,
            'timestamp': int(time.time()),
            'scraping': {
                'title': scraped_data.get('title'),
                'description': scraped_data.get('description'),
                'components_detected': len(scraped_data.get('components', [])),
                'structure': scraped_data.get('structure')
            },
            'analysis': ai_result.get('analysis', {}),
            'components': ai_result.get('components', []),
            'types': ai_result.get('types', ''),
            'instructions': ai_result.get('instructions', []),
            'raw_data': scraped_data  # Include for debugging
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'success': False,
            'timestamp': int(time.time())
        }), 500

@app.route('/api/scrape-only', methods=['POST'])
@limiter.limit("20 per minute")
def scrape_only():
    """Endpoint for scraping only (no AI)"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required', 'success': False}), 400
        
        result = scraper.scrape_website(url)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'Scraping failed: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    print("🚀 CloneAI Enhanced Server starting...")
    print("📡 Web Scraper: Ready")
    print("🤖 AI Generator: Ready")
    print("🔗 Server: http://0.0.0.0:8080")
    
    app.run(debug=True, host='0.0.0.0', port=8080)
