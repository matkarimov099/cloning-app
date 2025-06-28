# 🚀 CloneAI - AI-Powered Website Cloning Platform

CloneAI is a modern, AI-powered platform that analyzes websites and automatically generates React TypeScript components with Tailwind CSS styling. Turn any website into reusable, production-ready React components with just a URL!

## ✨ Features

### 🎯 Core Functionality

- **AI Website Analysis**: Advanced AI-powered analysis of website structure, components, and design systems
- **Screenshot Capture**: Automatic website screenshot generation for visual analysis
- **Content Extraction**: Smart HTML content parsing and metadata extraction
- **Component Generation**: Auto-generation of React TypeScript components with proper props and types
- **Tailwind CSS Integration**: Modern styling with Tailwind CSS utility classes
- **Responsive Design**: Generated components are fully responsive and mobile-friendly
- **Accessibility**: Built-in accessibility features and ARIA compliance

### 🤖 AI Provider Support

- **OpenAI GPT-4/GPT-3.5**: Advanced language models for code generation
- **Anthropic Claude**: High-quality code analysis and generation
- **Google Gemini**: Google's latest AI model integration
- **Groq**: Lightning-fast AI inference
- **Mock Provider**: Testing and development without API keys

### 🎨 Modern UI/UX

- **Beautiful Interface**: Modern, gradient-based design with glassmorphism effects
- **Real-time Progress**: Live progress tracking with step-by-step analysis
- **Interactive Gallery**: Browse and manage generated components
- **Development Console**: Real-time logs and debugging information
- **Responsive Layout**: Perfect on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful UI components
- **Lucide React** for consistent iconography
- **React Router** for client-side routing

### Backend

- **Python Flask** for robust API development
- **Flask-CORS** for cross-origin resource sharing
- **Flask-Limiter** for rate limiting and security
- **Requests** for web scraping capabilities
- **BeautifulSoup4** for HTML parsing
- **Pillow** for image processing
- **python-dotenv** for environment management

### AI Integration

- **OpenAI API** for GPT models
- **Anthropic API** for Claude models
- **Google Generative AI** for Gemini
- **Groq API** for fast inference

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cloning-app
```

### 2. Quick Setup

```bash
# Run the automated setup script
./setup.sh
```

### 3. Configure AI APIs (Optional)

```bash
# Copy environment template
cp api/.env.example api/.env

# Edit with your API keys
nano api/.env
```

Add your API keys:

```env
# OpenAI
OPENAI_API_KEY=your_openai_key_here

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key_here

# Google Gemini
GOOGLE_API_KEY=your_google_key_here

# Groq
GROQ_API_KEY=your_groq_key_here
```

### 4. Start the Application

```bash
# Start both frontend and backend
./start.sh
```

### 5. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Integration Test**: Open `test-integration.html` in your browser

## 📖 Manual Setup

If you prefer manual setup:

### Backend Setup

```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python server_simple.py
```

### Frontend Setup

```bash
npm install
npm run dev
```

## 🔧 Project Structure

```
cloning-app/
├── 📁 src/                          # Frontend source code
│   ├── 📁 app/                      # App configuration
│   │   ├── 📁 context/              # React contexts
│   │   ├── 📁 providers/            # Context providers
│   │   └── 📁 router/               # App routing
│   ├── 📁 features/                 # Feature modules
│   │   └── 📁 clones/               # Website cloning feature
│   │       ├── 📁 components/       # React components
│   │       ├── 📁 services/         # API services
│   │       ├── 📁 data/            # Data management
│   │       └── 📁 types.ts         # TypeScript types
│   ├── 📁 pages/                    # Page components
│   │   └── 📁 home/                # Homepage
│   ├── 📁 shared/                   # Shared components
│   │   ├── 📁 components/ui/        # UI components (shadcn/ui)
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 lib/                 # Utility libraries
│   │   └── 📁 utils/               # Helper functions
│   └── 📁 styles/                   # Global styles
├── 📁 api/                          # Backend source code
│   ├── 📄 server.py                # Full AI server
│   ├── 📄 server_simple.py         # Mock/testing server
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 .env.example            # Environment template
│   └── 📁 venv/                    # Python virtual environment
├── 📄 test-integration.html        # API integration test
├── 📄 setup.sh                     # Setup script
├── 📄 start.sh                     # Start script
├── 📄 stop.sh                      # Stop script
└── 📄 README.md                    # This file
```

## 🎯 Usage

### Basic Website Analysis

1. Open the application at http://localhost:3001
2. Navigate to the "Try It Now" section
3. Switch to the "Website Analyzer" tab
4. Enter a website URL (e.g., https://www.google.com)
5. Click "Analyze Website"
6. Watch the real-time progress as AI analyzes the site
7. View generated components and download the code

### Component Gallery

- Browse pre-generated components
- View component previews
- Download component code
- Copy code snippets

### Development Console

- Monitor real-time analysis logs
- Debug API responses
- Track analysis progress
- View error messages and warnings

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

### Screenshot Capture

```http
POST /api/screenshot
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Content Fetching

```http
POST /api/fetch-content
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### AI Analysis

```http
POST /api/ai-analyze
Content-Type: application/json

{
  "prompt": "Analyze this website",
  "html": "<html>...</html>",
  "image": "data:image/png;base64,..."
}
```

### Component Generation

```http
POST /api/generate-components
Content-Type: application/json

{
  "analysis": { ... },
  "options": {
    "framework": "react",
    "styling": "tailwind",
    "typescript": true
  }
}
```

## 🧪 Testing

### Integration Test

Open `test-integration.html` in your browser to test all API endpoints:

- Health check
- Screenshot capture
- Content fetching
- AI analysis
- Full website analysis workflow

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test screenshot endpoint
curl -X POST http://localhost:5000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

## 🛡️ Security Features

- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling with detailed logging
- **Environment Variables**: Secure API key management

## 🌐 Deployment

### Development

```bash
./start.sh
```

### Production

For production deployment, consider:

- Using a production WSGI server like Gunicorn
- Setting up reverse proxy with Nginx
- Configuring environment variables
- Setting up SSL certificates
- Using a process manager like PM2 or systemd

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Kill existing processes
./stop.sh
# Or manually kill processes
pkill -f "server_simple.py"
pkill -f "vite"
```

**Backend Won't Start**

```bash
# Check Python virtual environment
cd api
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend Build Errors**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Key Issues**

- Make sure your API keys are correctly set in `api/.env`
- Test with the mock provider first (no API keys needed)
- Check API key permissions and quotas

### Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the integration test results
3. Check log files: `backend.log` and `frontend.log`
4. Open an issue on GitHub

## 🎉 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Lucide** for consistent iconography
- **OpenAI, Anthropic, Google, Groq** for AI API access
- **React** and **Vite** teams for excellent development tools

---

Made with ❤️ by the CloneAI team
