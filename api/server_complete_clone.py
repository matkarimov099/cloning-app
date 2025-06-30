#!/usr/bin/env python3
"""
CloneAI - Complete HTML Clone Generator
1. Scrape website and create full HTML clone
2. Save HTML file with all assets
3. Analyze HTML file
4. Generate React TSX components
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os
import json
import time
import uuid
from urllib.parse import urljoin, urlparse
import re
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
import openai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

# Directories
CLONE_DIR = Path("cloned_websites")
CLONE_DIR.mkdir(exist_ok=True)

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

class CompleteHTMLCloner:
    """Complete website HTML cloner with assets"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
        })
    
    def clone_website(self, url, clone_id=None):
        """Create complete HTML clone of website"""
        try:
            if not clone_id:
                clone_id = str(uuid.uuid4())[:8]
            
            # Normalize URL
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            print(f"🌐 Starting complete clone for: {url}")
            
            # Create clone directory
            clone_path = CLONE_DIR / clone_id
            clone_path.mkdir(exist_ok=True)
            
            # Step 1: Download main HTML
            html_content = self._download_html(url)
            
            # Step 2: Parse and process HTML
            soup = BeautifulSoup(html_content, 'html.parser')
            processed_html = self._process_html(soup, url, clone_path)
            
            # Step 3: Save complete HTML file
            html_file = clone_path / "index.html"
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(str(processed_html))
            
            # Step 4: Save metadata
            metadata = {
                'clone_id': clone_id,
                'original_url': url,
                'cloned_at': time.time(),
                'html_file': str(html_file),
                'title': self._safe_text(soup.find('title')),
                'description': self._get_meta_content(soup, 'description'),
                'status': 'completed'
            }
            
            metadata_file = clone_path / "metadata.json"
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"✅ Complete clone saved: {html_file}")
            
            return {
                'success': True,
                'clone_id': clone_id,
                'html_file': str(html_file),
                'clone_path': str(clone_path),
                'metadata': metadata,
                'preview_url': f'/preview/{clone_id}',
                'download_url': f'/download/{clone_id}'
            }
            
        except Exception as e:
            print(f"❌ Clone failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'clone_id': clone_id
            }
    
    def _download_html(self, url):
        """Download main HTML content"""
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        return response.text
    
    def _process_html(self, soup, base_url, clone_path):
        """Process HTML and download assets"""
        # Create assets directory
        assets_path = clone_path / "assets"
        assets_path.mkdir(exist_ok=True)
        
        # Process CSS links
        for link in soup.find_all('link', rel='stylesheet'):
            self._process_css_link(link, base_url, assets_path)
        
        # Process JavaScript files
        for script in soup.find_all('script', src=True):
            self._process_script(script, base_url, assets_path)
        
        # Process images
        for img in soup.find_all('img', src=True):
            self._process_image(img, base_url, assets_path)
        
        # Add clone metadata to HTML
        self._add_clone_metadata(soup)
        
        return soup
    
    def _process_css_link(self, link, base_url, assets_path):
        """Download and process CSS files"""
        try:
            href = link.get('href')
            if not href:
                return
            
            # Make absolute URL
            css_url = urljoin(base_url, href)
            
            # Download CSS
            response = self.session.get(css_url, timeout=10)
            if response.status_code == 200:
                # Generate local filename
                filename = self._generate_filename(href, 'css')
                css_file = assets_path / filename
                
                # Save CSS file
                with open(css_file, 'w', encoding='utf-8') as f:
                    f.write(response.text)
                
                # Update link href
                link['href'] = f'./assets/{filename}'
                print(f"✅ Downloaded CSS: {filename}")
        
        except Exception as e:
            print(f"⚠️ CSS download failed: {e}")
            # Keep original link if download fails
    
    def _process_script(self, script, base_url, assets_path):
        """Download and process JavaScript files"""
        try:
            src = script.get('src')
            if not src:
                return
            
            # Skip external CDN scripts (keep original)
            if any(cdn in src for cdn in ['cdn.', 'ajax.googleapis', 'unpkg', 'jsdelivr']):
                return
            
            # Make absolute URL
            js_url = urljoin(base_url, src)
            
            # Download JS
            response = self.session.get(js_url, timeout=10)
            if response.status_code == 200:
                # Generate local filename
                filename = self._generate_filename(src, 'js')
                js_file = assets_path / filename
                
                # Save JS file
                with open(js_file, 'w', encoding='utf-8') as f:
                    f.write(response.text)
                
                # Update script src
                script['src'] = f'./assets/{filename}'
                print(f"✅ Downloaded JS: {filename}")
        
        except Exception as e:
            print(f"⚠️ JS download failed: {e}")
            # Keep original script if download fails
    
    def _process_image(self, img, base_url, assets_path):
        """Download and process images"""
        try:
            src = img.get('src')
            if not src:
                return
            
            # Skip data URLs and external images for now
            if src.startswith('data:') or src.startswith('//'):
                return
            
            # Make absolute URL
            img_url = urljoin(base_url, src)
            
            # Download image
            response = self.session.get(img_url, timeout=10)
            if response.status_code == 200:
                # Generate local filename
                filename = self._generate_filename(src, 'img')
                img_file = assets_path / filename
                
                # Save image file
                with open(img_file, 'wb') as f:
                    f.write(response.content)
                
                # Update img src
                img['src'] = f'./assets/{filename}'
                print(f"✅ Downloaded Image: {filename}")
        
        except Exception as e:
            print(f"⚠️ Image download failed: {e}")
            # Keep original image if download fails
    
    def _generate_filename(self, url, file_type):
        """Generate safe filename for assets"""
        # Extract filename from URL
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        
        # If no filename, generate one
        if not filename or '.' not in filename:
            timestamp = int(time.time())
            if file_type == 'css':
                filename = f'style_{timestamp}.css'
            elif file_type == 'js':
                filename = f'script_{timestamp}.js'
            elif file_type == 'img':
                filename = f'image_{timestamp}.jpg'
        
        # Clean filename
        filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
        return filename
    
    def _add_clone_metadata(self, soup):
        """Add metadata to cloned HTML"""
        # Add clone info comment
        comment = soup.new_string(f'''
<!-- 
CloneAI Generated Clone
Generated at: {time.strftime('%Y-%m-%d %H:%M:%S')}
This is a complete HTML clone for analysis and component generation
-->
''')
        soup.insert(0, comment)
        
        # Add clone styles
        style_tag = soup.new_tag('style')
        style_tag.string = '''
/* CloneAI Clone Styles */
.cloneai-banner {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
'''
        soup.head.append(style_tag)
        
        # Add clone banner
        banner = soup.new_tag('div', **{'class': 'cloneai-banner'})
        banner.string = '🚀 CloneAI Clone'
        soup.body.append(banner)
    
    def _safe_text(self, element):
        """Safely extract text from element"""
        return element.get_text().strip() if element else ''
    
    def _get_meta_content(self, soup, name):
        """Get meta tag content"""
        meta = soup.find('meta', attrs={'name': name})
        return meta.get('content', '') if meta else ''

class HTMLAnalyzer:
    """Analyze cloned HTML and generate React components"""
    
    def __init__(self):
        self.groq_client = groq_client
        self.openai_client = openai_client
    
    def analyze_html_file(self, html_file_path, clone_id):
        """Analyze HTML file and generate React components"""
        try:
            print(f"🔍 Analyzing HTML file: {html_file_path}")
            
            # Read HTML file
            with open(html_file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Parse HTML
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract analysis data
            analysis_data = self._extract_analysis_data(soup)
            
            # Generate components with AI
            components = self._generate_components_ai(analysis_data, html_content)
            
            # Save analysis results
            results = {
                'clone_id': clone_id,
                'analyzed_at': time.time(),
                'html_file': html_file_path,
                'analysis': analysis_data,
                'components': components,
                'success': True
            }
            
            # Save to file
            analysis_file = Path(html_file_path).parent / "analysis.json"
            with open(analysis_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2)
            
            print(f"✅ Analysis completed: {len(components)} components generated")
            
            return results
            
        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'clone_id': clone_id
            }
    
    def _extract_analysis_data(self, soup):
        """Extract structural data from HTML"""
        return {
            'title': self._safe_text(soup.find('title')),
            'description': self._get_meta_content(soup, 'description'),
            'structure': {
                'has_header': bool(soup.find(['header', '.header', 'nav'])),
                'has_main': bool(soup.find(['main', '.main', '#main'])),
                'has_footer': bool(soup.find(['footer', '.footer'])),
                'sections': len(soup.find_all(['section', 'article', '.section'])),
                'forms': len(soup.find_all('form')),
                'images': len(soup.find_all('img')),
                'links': len(soup.find_all('a'))
            },
            'components_detected': self._detect_components(soup),
            'styling': self._analyze_styling(soup)
        }
    
    def _detect_components(self, soup):
        """Detect UI components in HTML"""
        components = []
        
        # Header
        header = soup.find(['header', '.header', 'nav'])
        if header:
            components.append({
                'name': 'Header',
                'type': 'navigation',
                'description': 'Main navigation header',
                'element': str(header)[:500]
            })
        
        # Hero/Banner
        hero_selectors = ['.hero', '.banner', '.jumbotron', 'section:first-of-type']
        for selector in hero_selectors:
            hero = soup.select_one(selector)
            if hero:
                components.append({
                    'name': 'HeroSection',
                    'type': 'layout',
                    'description': 'Main hero/banner section',
                    'element': str(hero)[:500]
                })
                break
        
        # Cards
        cards = soup.find_all(['.card', '.post', '.item', 'article'])[:3]
        if cards:
            components.append({
                'name': 'Card',
                'type': 'content',
                'description': f'Content cards ({len(cards)} found)',
                'element': str(cards[0])[:500] if cards else ''
            })
        
        # Forms
        forms = soup.find_all('form')
        if forms:
            components.append({
                'name': 'ContactForm',
                'type': 'interactive',
                'description': f'Forms ({len(forms)} found)',
                'element': str(forms[0])[:500]
            })
        
        # Footer
        footer = soup.find(['footer', '.footer'])
        if footer:
            components.append({
                'name': 'Footer',
                'type': 'layout',
                'description': 'Page footer',
                'element': str(footer)[:500]
            })
        
        return components
    
    def _analyze_styling(self, soup):
        """Analyze styling information"""
        # Extract inline styles and classes
        classes = set()
        styles = []
        
        for element in soup.find_all(attrs={'class': True}):
            if isinstance(element.get('class'), list):
                classes.update(element.get('class'))
        
        for element in soup.find_all(attrs={'style': True}):
            styles.append(element.get('style'))
        
        return {
            'classes_count': len(classes),
            'inline_styles_count': len(styles),
            'css_frameworks': self._detect_css_frameworks(classes),
            'color_scheme': self._detect_color_scheme(styles)
        }
    
    def _detect_css_frameworks(self, classes):
        """Detect CSS frameworks"""
        frameworks = []
        
        # Check for common frameworks
        if any('bootstrap' in cls.lower() for cls in classes):
            frameworks.append('Bootstrap')
        if any(cls.startswith(('bg-', 'text-', 'p-', 'm-')) for cls in classes):
            frameworks.append('Tailwind CSS')
        if any('mui' in cls.lower() for cls in classes):
            frameworks.append('Material-UI')
        
        return frameworks
    
    def _detect_color_scheme(self, styles):
        """Detect color scheme from styles"""
        colors = []
        for style in styles[:10]:  # Analyze first 10 styles
            color_matches = re.findall(r'color:\s*([^;]+)', style)
            bg_matches = re.findall(r'background-color:\s*([^;]+)', style)
            colors.extend(color_matches + bg_matches)
        
        return {
            'detected_colors': colors[:5],  # First 5 colors
            'scheme': 'light' if any('white' in c.lower() for c in colors) else 'mixed'
        }
    
    def _generate_components_ai(self, analysis_data, html_content):
        """Generate React components using AI"""
        try:
            prompt = self._create_component_prompt(analysis_data, html_content)
            
            # Try Groq first
            if self.groq_client:
                try:
                    result = self._call_groq(prompt)
                    if result:
                        return self._parse_ai_components(result)
                except Exception as e:
                    print(f"Groq failed: {e}")
            
            # Fallback to OpenAI
            if self.openai_client:
                try:
                    result = self._call_openai(prompt)
                    if result:
                        return self._parse_ai_components(result)
                except Exception as e:
                    print(f"OpenAI failed: {e}")
            
            # Fallback to detected components
            return analysis_data.get('components_detected', [])
            
        except Exception as e:
            print(f"AI component generation failed: {e}")
            return analysis_data.get('components_detected', [])
    
    def _create_component_prompt(self, analysis_data, html_content):
        """Create AI prompt for component generation"""
        return f"""
Analyze this complete HTML file and create professional React TypeScript components.

HTML ANALYSIS:
Title: {analysis_data.get('title', 'Unknown')}
Description: {analysis_data.get('description', 'No description')}
Structure: {json.dumps(analysis_data.get('structure', {}), indent=2)}
Components Detected: {json.dumps(analysis_data.get('components_detected', []), indent=2)}

HTML CONTENT (first 3000 chars):
{html_content[:3000]}

REQUIREMENTS:
1. Create 3-5 professional React TypeScript components
2. Use the EXACT HTML structure and styling
3. Convert HTML classes to Tailwind CSS equivalents
4. Add proper TypeScript interfaces
5. Include React hooks for interactivity
6. Make components responsive and accessible
7. Generate COMPLETE, WORKING code (100+ lines per component)

OUTPUT FORMAT (JSON):
{{
  "components": [
    {{
      "name": "ComponentName",
      "type": "navigation|layout|content|interactive",
      "description": "Component description",
      "complexity": "simple|medium|complex",
      "code": "// COMPLETE React TypeScript component code here",
      "props": [
        {{"name": "propName", "type": "string", "required": true}}
      ],
      "dependencies": ["react", "@types/react", "lucide-react"]
    }}
  ]
}}

Generate REAL, WORKING React components based on the actual HTML structure!
"""
    
    def _call_groq(self, prompt):
        """Call Groq API"""
        response = self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert React TypeScript developer. Create professional, production-ready components based on HTML analysis."},
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
                {"role": "system", "content": "You are an expert React TypeScript developer. Create professional, production-ready components based on HTML analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.1
        )
        return response.choices[0].message.content
    
    def _parse_ai_components(self, ai_response):
        """Parse AI response to extract components"""
        try:
            # Try to extract JSON from response
            json_start = ai_response.find('{')
            json_end = ai_response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = ai_response[json_start:json_end]
                result = json.loads(json_str)
                return result.get('components', [])
        
        except json.JSONDecodeError:
            pass
        
        # Return fallback components if parsing fails
        return [
            {
                'name': 'AIGeneratedComponent',
                'type': 'layout',
                'description': 'AI generated component',
                'code': f'// AI Response:\n{ai_response[:1000]}...',
                'complexity': 'medium'
            }
        ]
    
    def _safe_text(self, element):
        """Safely extract text from element"""
        return element.get_text().strip() if element else ''
    
    def _get_meta_content(self, soup, name):
        """Get meta tag content"""
        meta = soup.find('meta', attrs={'name': name})
        return meta.get('content', '') if meta else ''

# Initialize classes
html_cloner = CompleteHTMLCloner()
html_analyzer = HTMLAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'CloneAI Complete HTML Cloner is running',
        'version': '4.0.0',
        'features': [
            'Complete HTML Cloning',
            'Asset Download',
            'HTML Analysis',
            'React Component Generation'
        ],
        'ai_providers': {
            'groq': groq_client is not None,
            'openai': openai_client is not None
        },
        'timestamp': int(time.time())
    })

@app.route('/api/analyze-url', methods=['POST'])
def analyze_url():
    """Analyze URL without cloning - just get basic info about the website"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
        
        print(f"🔍 Starting URL analysis for: {url}")
        
        # Fetch basic page content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract basic information
        title = soup.find('title')
        title_text = title.get_text().strip() if title else 'No title found'
        
        # Get meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc.get('content', '').strip() if meta_desc else ''
        
        # Detect technologies (basic detection)
        technologies = []
        
        # Check for common frameworks and libraries
        scripts = soup.find_all('script')
        for script in scripts:
            src = script.get('src', '')
            if 'react' in src.lower():
                technologies.append('React')
            elif 'vue' in src.lower():
                technologies.append('Vue.js')
            elif 'angular' in src.lower():
                technologies.append('Angular')
            elif 'jquery' in src.lower():
                technologies.append('jQuery')
            elif 'bootstrap' in src.lower():
                technologies.append('Bootstrap')
        
        # Check for CSS frameworks
        links = soup.find_all('link', rel='stylesheet')
        for link in links:
            href = link.get('href', '')
            if 'bootstrap' in href.lower():
                technologies.append('Bootstrap')
            elif 'tailwind' in href.lower():
                technologies.append('Tailwind CSS')
            elif 'bulma' in href.lower():
                technologies.append('Bulma')
        
        # Remove duplicates
        technologies = list(set(technologies))
        
        # Determine website type based on content
        website_type = "General Website"
        body_text = soup.get_text().lower()
        
        if 'blog' in body_text or 'article' in body_text:
            website_type = "Blog/News Site"
        elif 'shop' in body_text or 'cart' in body_text or 'buy' in body_text:
            website_type = "E-commerce"
        elif 'portfolio' in body_text or 'work' in body_text or 'project' in body_text:
            website_type = "Portfolio"
        elif 'about us' in body_text or 'contact' in body_text or 'service' in body_text:
            website_type = "Business/Corporate"
        elif 'login' in body_text or 'dashboard' in body_text:
            website_type = "Web Application"
        
        # Get meta information
        meta_info = {}
        for meta in soup.find_all('meta'):
            name = meta.get('name') or meta.get('property')
            content = meta.get('content')
            if name and content:
                meta_info[name] = content[:100]  # Limit length
        
        # Basic performance info
        performance_info = {
            'content_length': len(response.content),
            'response_time_ms': response.elapsed.total_seconds() * 1000,
            'status_code': response.status_code,
            'num_scripts': len(scripts),
            'num_stylesheets': len(links),
            'num_images': len(soup.find_all('img'))
        }
        
        analysis_result = {
            'website_type': website_type,
            'technologies': technologies,
            'title': title_text,
            'description': description,
            'meta_info': meta_info,
            'performance_info': performance_info
        }
        
        print(f"✅ URL analysis completed for: {url}")
        
        return jsonify({
            'success': True,
            'analysis': analysis_result,
            'timestamp': int(time.time())
        })
        
    except requests.RequestException as e:
        print(f"❌ Request error during URL analysis: {e}")
        return jsonify({'success': False, 'error': f'Failed to fetch URL: {str(e)}'}), 400
    except Exception as e:
        print(f"❌ Error during URL analysis: {e}")
        return jsonify({'success': False, 'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/clone-website', methods=['POST'])
def clone_website():
    """Step 1: Create complete HTML clone"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required', 'success': False}), 400
        
        print(f"🚀 Starting complete clone for: {url}")
        
        result = html_cloner.clone_website(url)
        
        if result['success']:
            print(f"✅ Clone completed: {result['clone_id']}")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Clone failed: {e}")
        return jsonify({
            'error': f'Clone failed: {str(e)}',
            'success': False,
            'timestamp': int(time.time())
        }), 500

@app.route('/api/analyze-clone/<clone_id>', methods=['POST'])
def analyze_clone(clone_id):
    """Step 2: Analyze HTML clone and generate components"""
    try:
        print(f"🔍 Starting analysis for clone: {clone_id}")
        
        # Find HTML file
        clone_path = CLONE_DIR / clone_id
        html_file = clone_path / "index.html"
        
        if not html_file.exists():
            return jsonify({
                'error': f'Clone {clone_id} not found',
                'success': False
            }), 404
        
        result = html_analyzer.analyze_html_file(str(html_file), clone_id)
        
        if result['success']:
            print(f"✅ Analysis completed: {clone_id}")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'success': False,
            'timestamp': int(time.time())
        }), 500

@app.route('/api/clone-and-analyze', methods=['POST'])
def clone_and_analyze():
    """Combined: Clone website and analyze (Steps 1+2)"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required', 'success': False}), 400
        
        print(f"🚀 Starting complete clone + analysis for: {url}")
        
        # Step 1: Clone website
        clone_result = html_cloner.clone_website(url)
        
        if not clone_result['success']:
            return jsonify(clone_result), 400
        
        clone_id = clone_result['clone_id']
        print(f"✅ Clone completed: {clone_id}")
        
        # Step 2: Analyze HTML
        html_file = clone_result['html_file']
        analysis_result = html_analyzer.analyze_html_file(html_file, clone_id)
        
        if not analysis_result['success']:
            return jsonify(analysis_result), 500
        
        print(f"✅ Analysis completed: {clone_id}")
        
        # Combine results
        final_result = {
            'success': True,
            'clone_id': clone_id,
            'url': url,
            'timestamp': int(time.time()),
            'clone': clone_result,
            'analysis': analysis_result,
            'components': analysis_result.get('components', []),
            'preview_url': f'/preview/{clone_id}',
            'download_url': f'/download/{clone_id}'
        }
        
        return jsonify(final_result)
        
    except Exception as e:
        print(f"❌ Complete process failed: {e}")
        return jsonify({
            'error': f'Process failed: {str(e)}',
            'success': False,
            'timestamp': int(time.time())
        }), 500

@app.route('/preview/<clone_id>')
def preview_clone(clone_id):
    """Preview cloned HTML file"""
    try:
        html_file = CLONE_DIR / clone_id / "index.html"
        
        if not html_file.exists():
            return f"Clone {clone_id} not found", 404
        
        return send_file(str(html_file))
        
    except Exception as e:
        return f"Preview failed: {str(e)}", 500

@app.route('/download/<clone_id>')
def download_clone(clone_id):
    """Download cloned website as ZIP"""
    try:
        import zipfile
        import io
        
        clone_path = CLONE_DIR / clone_id
        
        if not clone_path.exists():
            return f"Clone {clone_id} not found", 404
        
        # Create ZIP file in memory
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_path in clone_path.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(clone_path)
                    zip_file.write(file_path, arcname)
        
        zip_buffer.seek(0)
        
        return send_file(
            io.BytesIO(zip_buffer.read()),
            as_attachment=True,
            download_name=f'clone_{clone_id}.zip',
            mimetype='application/zip'
        )
        
    except Exception as e:
        return f"Download failed: {str(e)}", 500

@app.route('/api/list-clones', methods=['GET'])
def list_clones():
    """List all cloned websites"""
    try:
        clones = []
        
        for clone_dir in CLONE_DIR.iterdir():
            if clone_dir.is_dir():
                metadata_file = clone_dir / "metadata.json"
                if metadata_file.exists():
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                        clones.append(metadata)
        
        return jsonify({
            'success': True,
            'clones': clones,
            'count': len(clones)
        })
        
    except Exception as e:
        return jsonify({
            'error': f'List failed: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    print("🚀 CloneAI Complete HTML Cloner starting...")
    print("📁 Clone Directory:", CLONE_DIR)
    print("🌐 HTML Cloner: Ready")
    print("🔍 HTML Analyzer: Ready")
    print("🤖 AI Generator: Ready")
    print("🔗 Server: http://0.0.0.0:9001")
    
    app.run(debug=True, host='0.0.0.0', port=9001)
