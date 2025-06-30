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
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image
import io
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

# AI Imports
import openai
from anthropic import Anthropic
import google.generativeai as genai
from groq import Groq

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

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["60 per minute"]
)

# AI API Keys va Clients
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Initialize AI clients
openai_client = None
anthropic_client = None
google_client = None
groq_client = None

if OPENAI_API_KEY:
    openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)

if ANTHROPIC_API_KEY:
    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)

if GOOGLE_AI_API_KEY:
    genai.configure(api_key=GOOGLE_AI_API_KEY)
    google_client = genai.GenerativeModel('gemini-pro-vision')

if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)

def setup_chrome_driver():
    """Chrome driver ni setup qilish with improved options"""
    chrome_options = Options()
    
    # Headless mode
    if os.getenv('HEADLESS_MODE', 'true').lower() == 'true':
        chrome_options.add_argument('--headless')
    
    # Performance optimizations
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-logging')
    chrome_options.add_argument('--silent')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    # Chrome driver path
    chrome_driver_path = os.getenv('CHROME_DRIVER_PATH')
    if chrome_driver_path:
        return webdriver.Chrome(service=webdriver.ChromeService(chrome_driver_path), options=chrome_options)
    else:
        return webdriver.Chrome(options=chrome_options)

def get_ai_provider():
    """Available AI provider ni aniqlash - Groq prioritet"""
    providers = []
    if groq_client:
        providers.append('groq')
    if openai_client:
        providers.append('openai')
    if anthropic_client:
        providers.append('anthropic')
    if google_client:
        providers.append('google')
    return providers

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def safe_ai_request(provider, prompt, image=None):
    """AI API ga safe request yuborish with retry logic"""
    try:
        if provider == 'openai' and openai_client:
            return call_openai_api(prompt, image)
        elif provider == 'anthropic' and anthropic_client:
            return call_anthropic_api(prompt, image)
        elif provider == 'google' and google_client:
            return call_google_api(prompt, image)
        elif provider == 'groq' and groq_client:
            return call_groq_api(prompt, image)
        else:
            raise Exception(f"Provider {provider} not available")
    except Exception as e:
        raise Exception(f"AI API error: {str(e)}")

def call_openai_api(prompt, image=None):
    """OpenAI GPT-4 Vision API"""
    messages = [
        {
            "role": "system",
            "content": get_system_prompt()
        },
        {
            "role": "user",
            "content": [{"type": "text", "text": prompt}]
        }
    ]
    
    if image:
        messages[1]["content"].append({
            "type": "image_url",
            "image_url": {"url": image}
        })
    
    response = openai_client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=messages,
        max_tokens=4000,
        temperature=0.1
    )
    
    return response.choices[0].message.content

def call_anthropic_api(prompt, image=None):
    """Anthropic Claude API"""
    content = [{"type": "text", "text": prompt}]
    
    if image:
        # Claude uchun image format
        image_data = image.split(',')[1] if ',' in image else image
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/png",
                "data": image_data
            }
        })
    
    response = anthropic_client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=4000,
        temperature=0.1,
        system=get_system_prompt(),
        messages=[{"role": "user", "content": content}]
    )
    
    return response.content[0].text

def call_google_api(prompt, image=None):
    """Google Gemini API"""
    if image:
        # Image ni PIL.Image ga aylantirish
        image_data = image.split(',')[1] if ',' in image else image
        image_bytes = base64.b64decode(image_data)
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        response = google_client.generate_content([prompt, pil_image])
    else:
        text_model = genai.GenerativeModel('gemini-pro')
        response = text_model.generate_content(prompt)
    
    return response.text

def call_groq_api(prompt, image=None):
    """Groq API - juda tez!"""
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        max_tokens=4000,
        temperature=0.1
    )
    
    return response.choices[0].message.content

def get_system_prompt():
    """AI uchun system prompt"""
    return """Siz professional web developer va UI/UX analyst siz. Berilgan website screenshot va HTML kodini tahlil qilib, React TypeScript komponentlari yaratish uchun to'liq ma'lumot bering.

Qaytaradigan JSON format:
{
  "title": "string",
  "description": "string", 
  "metadata": {
    "keywords": ["string"],
    "language": "string",
    "theme": "light|dark|auto",
    "responsive": true,
    "framework": "react"
  },
  "structure": {
    "layout": "single-column|multi-column|grid",
    "sections": [
      {
        "id": "string",
        "type": "header|hero|features|content|footer|navigation",
        "name": "string",
        "description": "string",
        "position": 0,
        "className": "string"
      }
    ],
    "navigation": {
      "type": "horizontal|vertical|sidebar|mobile",
      "position": "top|bottom|left|right",
      "items": [{"label": "string", "href": "string", "icon": "string"}]
    }
  },
  "components": [
    {
      "id": "string",
      "name": "string", 
      "type": "button|input|card|navigation|layout|form",
      "description": "string",
      "category": "ui|layout|form|display",
      "props": [
        {
          "name": "string",
          "type": "string|number|boolean|object|array",
          "required": true|false,
          "description": "string",
          "defaultValue": "any"
        }
      ],
      "styling": {
        "colors": {
          "primary": ["#hexcode"],
          "secondary": ["#hexcode"],
          "background": ["#hexcode"],
          "text": ["#hexcode"]
        },
        "typography": {
          "fontFamilies": ["string"],
          "fontSizes": ["text-sm", "text-lg"],
          "fontWeights": ["font-normal", "font-bold"]
        },
        "spacing": {
          "margins": ["m-4", "mx-auto"],
          "paddings": ["p-6", "px-4"]
        },
        "layout": {
          "display": ["flex", "grid", "block"],
          "flexbox": {
            "direction": ["flex-row", "flex-col"],
            "justify": ["justify-center", "justify-between"],
            "align": ["items-center", "items-start"]
          },
          "grid": {
            "cols": ["grid-cols-1", "grid-cols-12"],
            "rows": ["grid-rows-auto"],
            "gap": ["gap-4", "gap-8"]
          }
        },
        "responsive": {
          "breakpoints": ["sm:", "md:", "lg:", "xl:"],
          "variations": ["hidden md:block", "col-span-6 lg:col-span-4"]
        }
      },
      "functionality": ["click", "hover", "submit", "navigate"],
      "complexity": "simple|medium|complex",
      "reusability": 0.8,
      "dependencies": ["react", "@types/react", "tailwindcss", "lucide-react"]
    }
  ],
  "designSystem": {
    "tokens": [
      {
        "name": "string",
        "value": "string", 
        "category": "color|spacing|typography|shadow|border",
        "description": "string",
        "usage": "string"
      }
    ],
    "patterns": [
      {
        "name": "string",
        "description": "string",
        "components": ["string"]
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
    "level": "AA|AAA",
    "features": ["keyboard-navigation", "screen-reader", "color-contrast"],
    "aria": ["aria-label", "aria-describedby"]
  },
  "performance": {
    "optimization": ["lazy-loading", "code-splitting", "image-optimization"],
    "metrics": {
      "bundleSize": "estimated kb",
      "renderTime": "estimated ms"
    }
  }
}

Faqat valid JSON qaytaring, boshqa matn yo'q."""

@app.route('/api/screenshot', methods=['POST'])
@limiter.limit("10 per minute")
def capture_screenshot():
    """Website screenshot olish with improved error handling"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL required', 'success': False}), 400
        
        # URL validation
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        print(f"Taking screenshot of: {url}")
        
        # Setup Chrome driver
        driver = None
        try:
            driver = setup_chrome_driver()
            
            # Website ni yuklash
            driver.get(url)
            
            # Page loading ni kutish
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Extra wait for dynamic content
            time.sleep(3)
            
            # Screenshot olish
            screenshot = driver.get_screenshot_as_png()
            
            # Base64 ga aylantirish
            screenshot_base64 = base64.b64encode(screenshot).decode('utf-8')
            screenshot_url = f"data:image/png;base64,{screenshot_base64}"
            
            return jsonify({
                'screenshot': screenshot_url,
                'url': url,
                'timestamp': int(time.time()),
                'success': True
            })
            
        except Exception as e:
            print(f"Screenshot error: {str(e)}")
            return jsonify({
                'error': f'Screenshot olishda xatolik: {str(e)}',
                'success': False
            }), 500
            
        finally:
            if driver:
                driver.quit()
            
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({
            'error': f'Server xatoligi: {str(e)}',
            'success': False
        }), 500

@app.route('/api/fetch-content', methods=['POST'])
@limiter.limit("20 per minute")
def fetch_website_content():
    """Website HTML content ni olish with enhanced parsing"""
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

@app.route('/api/ai-analyze', methods=['POST'])
def ai_analyze_website():
    """AI orqali website ni analiz qilish - Dynamic provider"""
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        image = data.get('image')
        html_content = data.get('html')
        
        if not prompt:
            return jsonify({'error': 'Prompt required'}), 400
        
        # Available providerlarni olish
        available_providers = get_ai_provider()
        
        if not available_providers:
            return jsonify({'error': 'No AI providers available'}), 500
        
        # Birinchi available provider bilan urinish
        for provider in available_providers:
            try:
                print(f"Trying provider: {provider}")
                
                # Full prompt yaratish
                full_prompt = f"""
Website HTML: {html_content[:5000] if html_content else 'Not provided'}

User Request: {prompt}

{get_system_prompt()}
"""
                
                # AI provider chaqirish
                result = safe_ai_request(provider, full_prompt, image)
                
                # JSON parse qilishga urinish
                try:
                    analysis_data = json.loads(result)
                    # Provider ma'lumotini qo'shish
                    analysis_data['ai_provider'] = provider
                    analysis_data['timestamp'] = int(time.time())
                    return jsonify(analysis_data)
                except json.JSONDecodeError:
                    print(f"JSON parse error with {provider}, trying fallback...")
                    # Fallback response
                    return jsonify({
                        'title': 'Analyzed Website',
                        'description': 'Website structure analyzed successfully',
                        'ai_provider': provider,
                        'raw_response': result[:1000],  # First 1000 chars
                        'components': [
                            {
                                'id': 'nav-1',
                                'name': 'Navigation',
                                'type': 'navigation',
                                'description': 'Main navigation component'
                            },
                            {
                                'id': 'hero-1', 
                                'name': 'Hero Section',
                                'type': 'layout',
                                'description': 'Main hero/banner section'
                            }
                        ],
                        'metadata': {
                            'language': 'en',
                            'theme': 'light'
                        },
                        'timestamp': int(time.time())
                    })
                    
            except Exception as e:
                print(f"Provider {provider} failed: {str(e)}")
                continue
        
        # Hech qaysi provider ishlamasa
        return jsonify({
            'error': f'All AI providers failed. Available: {available_providers}',
            'providers_tried': available_providers
        }), 500
        
    except Exception as e:
        print(f"AI analyze error: {str(e)}")
        return jsonify({'error': str(e)}), 500
          "secondary": ["#color"]
        },
        "typography": {
          "fontFamilies": ["string"],
          "fontSizes": ["string"]
        },
        "spacing": {
          "margins": ["string"],
          "paddings": ["string"]
        },
        "layout": {
          "display": ["flex|grid|block"],
          "flexbox": {
            "direction": ["row|column"],
            "justify": ["center|start|end"],
            "align": ["center|start|end"]
          }
        }
      },
      "functionality": ["click", "hover", "submit"],
      "complexity": "simple|medium|complex",
      "reusability": 8,
      "dependencies": ["string"]
    }
  ],
  "designSystem": {
    "tokens": [
      {
        "name": "string",
        "value": "string", 
        "category": "color|spacing|typography",
        "description": "string"
      }
    ]
  },
  "technologies": [
    {
      "name": "React",
      "category": "framework", 
      "confidence": 0.9
    }
  ]
}"""
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
        
        # Agar screenshot mavjud bo'lsa, uni ham qo'shamiz
        if image:
            messages[1]["content"].append({
                "type": "image_url",
                "image_url": {
                    "url": image
                }
            })
        
        # OpenAI API ga so'rov
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=4000,
            temperature=0.1
        )
        
        # Response ni parse qilish
        ai_response = response.choices[0].message.content
        
        try:
            analysis_result = json.loads(ai_response)
        except json.JSONDecodeError:
            # Agar JSON parse qila olmasa, default response qaytarish
            analysis_result = {
                "title": "Analysis Failed",
                "description": "AI tahlil qilishda xatolik yuz berdi",
                "metadata": {"keywords": [], "language": "en", "theme": "light"},
                "structure": {"layout": "single-column", "sections": [], "navigation": {"type": "horizontal", "items": []}},
                "components": [],
                "designSystem": {"tokens": []},
                "technologies": []
            }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-components', methods=['POST'])
def generate_components():
    """Komponentlar kodini generate qilish"""
    try:
        data = request.get_json()
        analysis = data.get('analysis')
        options = data.get('options')
        
        if not analysis or not options:
            return jsonify({'error': 'Analysis and options required'}), 400
        
        # Component generation prompt
        generation_prompt = f"""
Quyidagi analiz asosida React TypeScript komponentlarini yarating:

Analysis: {json.dumps(analysis, indent=2)}
Options: {json.dumps(options, indent=2)}

Har bir komponent uchun:
1. TypeScript interfaces
2. Modern React hooks
3. Tailwind CSS styling
4. Accessibility support
5. Responsive design
6. Clean, maintainable code

File format:
{{
  "files": [
    {{
      "path": "src/components/ComponentName.tsx",
      "content": "// React component code",
      "type": "component",
      "description": "Component description"
    }}
  ],
  "dependencies": ["react", "@types/react", "tailwindcss"],
  "instructions": [
    "1. Install dependencies",
    "2. Copy components to your project"
  ],
  "estimatedTime": 30,
  "difficulty": "medium"
}}
"""
        
        # OpenAI ga komponent yaratish uchun so'rov
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Siz expert React TypeScript developer siz. Clean, modern va reusable komponentlar yarating."},
                {"role": "user", "content": generation_prompt}
            ],
            max_tokens=4000,
            temperature=0.1
        )
        
        ai_response = response.choices[0].message.content
        
        try:
            generation_result = json.loads(ai_response)
        except json.JSONDecodeError:
            # Fallback response
            generation_result = {
                "files": [],
                "dependencies": ["react", "@types/react", "tailwindcss"],
                "instructions": ["AI generation failed"],
                "estimatedTime": 0,
                "difficulty": "unknown"
            }
        
        return jsonify(generation_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({'status': 'OK', 'message': 'API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
