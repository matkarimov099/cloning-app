from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import base64
import json
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# CORS configuration
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:5173",
    os.getenv('FRONTEND_URL', 'http://localhost:3000')
])

# Simple rate limiting (in production use Redis)
request_counts = {}

def check_rate_limit(client_ip, limit=60):
    """Simple rate limiting"""
    current_time = time.time()
    if client_ip not in request_counts:
        request_counts[client_ip] = []
    
    # Clean old requests
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip] 
        if current_time - req_time < 60
    ]
    
    if len(request_counts[client_ip]) >= limit:
        return False
    
    request_counts[client_ip].append(current_time)
    return True

@app.route('/api/fetch-content', methods=['POST'])
def fetch_website_content():
    """Website HTML content ni olish"""
    client_ip = request.remote_addr
    if not check_rate_limit(client_ip, 20):
        return jsonify({
            'error': 'Rate limit exceeded. Please try again later.',
            'success': False
        }), 429
    
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL required', 'success': False}), 400
        
        # URL validation
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        print(f"Fetching content from: {url}")
        
        # Headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        timeout = int(os.getenv('API_TIMEOUT', 30))
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        
        # HTML content ni olish
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Script va style taglarni olib tashlash
        for script in soup(["script", "style", "noscript"]):
            script.decompose()
        
        # Clean text content
        content = soup.get_text(separator=' ', strip=True)
        html = str(soup.prettify())
        
        # Meta ma'lumotlarni olish
        title = soup.find('title')
        title_text = title.get_text().strip() if title else ''
        
        description = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
        description_text = description.get('content', '').strip() if description else ''
        
        # Keywords
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        keywords_text = keywords.get('content', '') if keywords else ''
        
        # Favicon olish
        favicon = soup.find('link', rel=['icon', 'shortcut icon']) or soup.find('link', rel='apple-touch-icon')
        favicon_url = ''
        if favicon:
            href = favicon.get('href', '')
            if href.startswith('//'):
                favicon_url = 'https:' + href
            elif href.startswith('/'):
                from urllib.parse import urljoin
                favicon_url = urljoin(url, href)
            elif href.startswith('http'):
                favicon_url = href
        
        # Language detection
        lang = soup.find('html', lang=True)
        language = lang.get('lang', 'en') if lang else 'en'
        
        # Open Graph data
        og_data = {}
        for meta in soup.find_all('meta', property=lambda x: x and x.startswith('og:')):
            property_name = meta.get('property', '').replace('og:', '')
            og_data[property_name] = meta.get('content', '')
        
        return jsonify({
            'content': content[:5000],  # Limit content size
            'html': html[:10000],       # Limit HTML size
            'title': title_text,
            'description': description_text,
            'keywords': keywords_text,
            'favicon': favicon_url,
            'language': language,
            'og_data': og_data,
            'url': url,
            'timestamp': int(time.time()),
            'success': True
        })
        
    except requests.RequestException as e:
        print(f"Request error: {str(e)}")
        return jsonify({
            'error': f'Website ga ulanib bo\'lmadi: {str(e)}',
            'success': False
        }), 400
        
    except Exception as e:
        print(f"Content fetch error: {str(e)}")
        return jsonify({
            'error': f'Content olishda xatolik: {str(e)}',
            'success': False
        }), 500

@app.route('/api/screenshot', methods=['POST'])
def capture_screenshot():
    """Website screenshot olish (mock implementation)"""
    client_ip = request.remote_addr
    if not check_rate_limit(client_ip, 10):
        return jsonify({
            'error': 'Rate limit exceeded. Please try again later.',
            'success': False
        }), 429
    
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL required', 'success': False}), 400
        
        # URL validation
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        print(f"Mock screenshot for: {url}")
        
        # Since this is a mock implementation, we'll return a placeholder
        # In production, you would use Playwright or Puppeteer
        mock_screenshot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        return jsonify({
            'screenshot': mock_screenshot,
            'url': url,
            'timestamp': int(time.time()),
            'success': True,
            'message': 'Mock screenshot generated (in production, this would be a real screenshot)'
        })
        
    except Exception as e:
        print(f"Screenshot error: {str(e)}")
        return jsonify({
            'error': f'Screenshot olishda xatolik: {str(e)}',
            'success': False
        }), 500

@app.route('/api/ai-analyze', methods=['POST'])
def ai_analyze_website():
    """AI analiz - hozircha mock data"""
    client_ip = request.remote_addr
    if not check_rate_limit(client_ip, 5):
        return jsonify({
            'error': 'Rate limit exceeded. Please try again later.',
            'success': False
        }), 429
    
    try:
        data = request.get_json()
        prompt = data.get('prompt', 'Website ni tahlil qiling')
        
        # Mock analysis result - haqiqiy AI API integratsiyasi uchun
        analysis_result = {
            "title": "Modern Website Analysis",
            "description": "AI-powered analysis of the provided website",
            "metadata": {
                "keywords": ["modern", "responsive", "web design"],
                "language": "en",
                "theme": "light",
                "responsive": True,
                "framework": "react"
            },
            "structure": {
                "layout": "multi-column",
                "sections": [
                    {
                        "id": "header",
                        "type": "header",
                        "name": "Header Section",
                        "description": "Navigation and branding area",
                        "position": 0,
                        "className": "header-section"
                    },
                    {
                        "id": "hero",
                        "type": "hero",
                        "name": "Hero Section",
                        "description": "Main call-to-action area",
                        "position": 1,
                        "className": "hero-section"
                    },
                    {
                        "id": "features",
                        "type": "features",
                        "name": "Features Section",
                        "description": "Product features showcase",
                        "position": 2,
                        "className": "features-section"
                    }
                ],
                "navigation": {
                    "type": "horizontal",
                    "position": "top",
                    "items": [
                        {"label": "Home", "href": "/", "icon": "home"},
                        {"label": "About", "href": "/about", "icon": "info"},
                        {"label": "Contact", "href": "/contact", "icon": "mail"}
                    ]
                }
            },
            "components": [
                {
                    "id": "navigation-bar",
                    "name": "NavigationBar",
                    "type": "navigation",
                    "description": "Responsive navigation component",
                    "category": "layout",
                    "props": [
                        {
                            "name": "items",
                            "type": "array",
                            "required": True,
                            "description": "Navigation menu items",
                            "defaultValue": []
                        },
                        {
                            "name": "logo",
                            "type": "string",
                            "required": False,
                            "description": "Logo text or image URL",
                            "defaultValue": "Logo"
                        }
                    ],
                    "styling": {
                        "colors": {
                            "primary": ["#3b82f6"],
                            "secondary": ["#64748b"],
                            "background": ["#ffffff"],
                            "text": ["#1f2937"]
                        },
                        "typography": {
                            "fontFamilies": ["Inter", "sans-serif"],
                            "fontSizes": ["text-base", "text-lg"],
                            "fontWeights": ["font-medium", "font-bold"]
                        },
                        "spacing": {
                            "margins": ["mx-auto"],
                            "paddings": ["px-4", "py-3"]
                        },
                        "layout": {
                            "display": ["flex"],
                            "flexbox": {
                                "direction": ["flex-row"],
                                "justify": ["justify-between"],
                                "align": ["items-center"]
                            }
                        },
                        "responsive": {
                            "breakpoints": ["sm:", "md:", "lg:"],
                            "variations": ["hidden md:flex", "md:px-6"]
                        }
                    },
                    "functionality": ["click", "hover", "navigate"],
                    "complexity": "medium",
                    "reusability": 0.9,
                    "dependencies": ["react", "@types/react", "tailwindcss", "lucide-react"]
                },
                {
                    "id": "hero-section",
                    "name": "HeroSection",
                    "type": "layout",
                    "description": "Main hero/banner component",
                    "category": "layout",
                    "props": [
                        {
                            "name": "title",
                            "type": "string",
                            "required": True,
                            "description": "Main hero title",
                            "defaultValue": "Welcome"
                        },
                        {
                            "name": "subtitle",
                            "type": "string",
                            "required": False,
                            "description": "Hero subtitle",
                            "defaultValue": ""
                        },
                        {
                            "name": "backgroundImage",
                            "type": "string",
                            "required": False,
                            "description": "Background image URL",
                            "defaultValue": ""
                        }
                    ],
                    "styling": {
                        "colors": {
                            "primary": ["#3b82f6"],
                            "background": ["#f8fafc"],
                            "text": ["#1f2937"]
                        },
                        "typography": {
                            "fontSizes": ["text-4xl", "text-6xl"],
                            "fontWeights": ["font-bold"]
                        },
                        "spacing": {
                            "paddings": ["py-16", "px-4"]
                        },
                        "layout": {
                            "display": ["flex"],
                            "flexbox": {
                                "direction": ["flex-col"],
                                "justify": ["justify-center"],
                                "align": ["items-center"]
                            }
                        }
                    },
                    "functionality": ["scroll"],
                    "complexity": "simple",
                    "reusability": 0.8,
                    "dependencies": ["react", "@types/react", "tailwindcss"]
                }
            ],
            "designSystem": {
                "tokens": [
                    {
                        "name": "primary-blue",
                        "value": "#3b82f6",
                        "category": "color",
                        "description": "Primary brand color",
                        "usage": "buttons, links, accents"
                    },
                    {
                        "name": "text-primary",
                        "value": "#1f2937",
                        "category": "color",
                        "description": "Primary text color",
                        "usage": "headings, body text"
                    },
                    {
                        "name": "spacing-lg",
                        "value": "2rem",
                        "category": "spacing",
                        "description": "Large spacing unit",
                        "usage": "section padding, margins"
                    }
                ],
                "patterns": [
                    {
                        "name": "Card Layout",
                        "description": "Consistent card styling pattern",
                        "components": ["card", "feature-card"]
                    }
                ]
            },
            "technologies": [
                {
                    "name": "React",
                    "category": "framework",
                    "confidence": 0.9,
                    "version": "18.x"
                },
                {
                    "name": "TypeScript",
                    "category": "language",
                    "confidence": 0.9,
                    "version": "5.x"
                },
                {
                    "name": "Tailwind CSS",
                    "category": "styling",
                    "confidence": 0.9,
                    "version": "3.x"
                }
            ],
            "accessibility": {
                "level": "AA",
                "features": ["keyboard-navigation", "screen-reader", "color-contrast"],
                "aria": ["aria-label", "aria-describedby"]
            },
            "performance": {
                "optimization": ["lazy-loading", "code-splitting"],
                "metrics": {
                    "bundleSize": "120kb",
                    "renderTime": "150ms"
                }
            },
            "ai_provider": "mock",
            "timestamp": int(time.time()),
            "success": True
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        print(f"Analyze error: {str(e)}")
        return jsonify({
            'error': f'Tahlil qilishda xatolik: {str(e)}',
            'success': False
        }), 500

@app.route('/api/generate-components', methods=['POST'])
def generate_components():
    """Component generation - hozircha mock data"""
    client_ip = request.remote_addr
    if not check_rate_limit(client_ip, 3):
        return jsonify({
            'error': 'Rate limit exceeded. Please try again later.',
            'success': False
        }), 429
    
    try:
        data = request.get_json()
        analysis = data.get('analysis', {})
        options = data.get('options', {})
        
        # Mock component generation
        generation_result = {
            "files": [
                {
                    "path": "src/components/NavigationBar.tsx",
                    "content": '''import React from 'react';
import { Menu, X, Home, Info, Mail } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: string;
}

interface NavigationBarProps {
  items?: NavigationItem[];
  logo?: string;
}

export function NavigationBar({ 
  items = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'About', href: '/about', icon: 'info' },
    { label: 'Contact', href: '/contact', icon: 'mail' }
  ], 
  logo = 'Logo' 
}: NavigationBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      case 'mail': return <Mail className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-900">{logo}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}''',
                    "type": "component",
                    "description": "Responsive navigation bar component with mobile menu"
                },
                {
                    "path": "src/components/HeroSection.tsx",
                    "content": '''import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroSection({
  title = "Welcome to Our Platform",
  subtitle = "Build amazing things with our powerful tools",
  backgroundImage,
  onPrimaryClick,
  onSecondaryClick
}: HeroSectionProps) {
  const backgroundStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section 
      className="relative py-16 px-4 sm:py-24 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-100"
      style={backgroundStyle}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
      
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onPrimaryClick}
            className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={onSecondaryClick}
            className="flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}''',
                    "type": "component",
                    "description": "Hero section component with call-to-action buttons"
                }
            ],
            "dependencies": ["react", "@types/react", "tailwindcss", "lucide-react"],
            "instructions": [
                "1. Make sure you have React and TypeScript set up",
                "2. Install Tailwind CSS in your project",
                "3. Install lucide-react for icons: npm install lucide-react",
                "4. Copy the components to your src/components directory",
                "5. Import and use them in your pages"
            ],
            "estimatedTime": 15,
            "difficulty": "medium",
            "success": True
        }
        
        return jsonify(generation_result)
        
    except Exception as e:
        print(f"Generation error: {str(e)}")
        return jsonify({
            'error': f'Komponent yaratishda xatolik: {str(e)}',
            'success': False
        }), 500

@app.route('/api/providers', methods=['GET'])
def get_available_providers():
    """Available AI providers ro'yxati"""
    providers = []
    
    if os.getenv('OPENAI_API_KEY'):
        providers.append({
            'name': 'openai',
            'displayName': 'OpenAI GPT-4',
            'available': True,
            'features': ['vision', 'text', 'code-generation']
        })
    
    if os.getenv('ANTHROPIC_API_KEY'):
        providers.append({
            'name': 'anthropic',
            'displayName': 'Anthropic Claude',
            'available': True,
            'features': ['vision', 'text', 'code-generation']
        })
    
    if os.getenv('GOOGLE_AI_API_KEY'):
        providers.append({
            'name': 'google',
            'displayName': 'Google Gemini',
            'available': True,
            'features': ['vision', 'text']
        })
    
    if os.getenv('GROQ_API_KEY'):
        providers.append({
            'name': 'groq',
            'displayName': 'Groq Mixtral',
            'available': True,
            'features': ['text', 'code-generation']
        })
    
    # Mock provider for demo
    providers.append({
        'name': 'mock',
        'displayName': 'Demo Mode',
        'available': True,
        'features': ['demo', 'testing']
    })
    
    return jsonify({
        'providers': providers,
        'total': len(providers),
        'success': True
    })

@app.route('/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'OK', 
        'message': 'CloneAI API is running',
        'timestamp': int(time.time()),
        'version': '1.0.0'
    })

@app.route('/', methods=['GET'])
def home():
    """API home page"""
    return jsonify({
        'message': 'CloneAI Backend API',
        'version': '1.0.0',
        'endpoints': [
            '/health',
            '/api/fetch-content',
            '/api/ai-analyze', 
            '/api/generate-components',
            '/api/providers'
        ],
        'status': 'running'
    })

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    host = os.getenv('API_HOST', '0.0.0.0')
    
    print(f"🚀 CloneAI Backend starting...")
    print(f"📡 Server: http://{host}:{port}")
    print(f"🔗 Health check: http://{host}:{port}/health")
    
    app.run(debug=True, host=host, port=port)
