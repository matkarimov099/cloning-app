# 🚀 CloneAI - AI-Powered Website Cloning System

**Professional-grade AI-powered website analysis and React component generation system**

CloneAI har qanday website URL ni kiritganingizda uni AI yordamida tahlil qilib, avtomatik ravishda modern React TypeScript komponentlariga aylantiradi.

## ✨ Asosiy Imkoniyatlari

- 🤖 **AI-Powered Analysis** - Groq va OpenAI orqali chuqur website tahlili
- ⚡ **React TSX Generation** - Avtomatik React TypeScript komponentlar yaratish
- 🎨 **Design System Extraction** - Ranglar, tipografiya, spacing tahlili
- 📊 **Real-time Progress** - Jonli jarayon kuzatuvi va batafsil loglar
- 💾 **Download/Copy** - Komponentlarni nusxalash va yuklab olish
- 🛡️ **Production Ready** - Rate limiting, xatoliklar bilan ishlash, xavfsizlik
- 📱 **Responsive Design** - Mobile-friendly komponentlar
- ♿ **Accessibility** - ARIA va semantic HTML

## ⚡ Tezkor Ishga Tushirish (3 daqiqa)

### 🚀 Eng oson yo'l:

```bash
# 1. Setup scriptini ishga tushiring
chmod +x setup.sh
./setup.sh

# 2. AI kalitlarni qo'shing
cd api
cp .env.example .env
nano .env

# 3. Loyihani ishga tushiring
./start.sh

# 4. Brauzerda oching: http://localhost:3000
```

## 📋 To'liq O'rnatish Yo'riqnomasi

### 1️⃣ Talab qilinadigan dasturlar

```bash
# Tekshirish
node --version   # 18+ kerak
python --version # 3.9+ kerak
git --version
```

### 2️⃣ Loyihani yuklab olish

```bash
# Loyihani klonlash
git clone <repository-url>
cd cloning-app
```

### 3️⃣ Dependencies o'rnatish

```bash
# Frontend
npm install

# Backend
cd api
python -m venv venv
source venv/bin/activate  # Linux/Mac
# yoki Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4️⃣ Environment sozlash

```bash
# .env fayl yaratish
cd api
cp .env.example .env
nano .env

# Quyidagi kalitlarni qo'shing:
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎬 Demo va Test Qilish

### 🎯 Test Uchun Websiteler

#### Oddiy (Boshlang'ich):

```
https://example.com         - Eng oddiy website
https://google.com          - Sodda design
https://wikipedia.org       - Matn-asoslangan
```

#### O'rta murakkaklik:

```
https://github.com          - Developer platform
https://stackoverflow.com   - Q&A platform
https://medium.com          - Blog platform
```

#### Murakkab (Advanced):

```
https://tailwindui.com      - UI components
https://vercel.com          - Modern landing
https://stripe.com          - Payment platform
https://airbnb.com          - Complex UI
```

### 📊 Kutilayotgan Natijalar

Example.com uchun yaratilgan komponent:

``` tsx
// Generated: Header.tsx
export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
```

### 🎥 Qadamlab Demo

1. **Website URL Kiritish**

   - Frontend sahifasini oching
   - "Website URL" maydoniga manzil kiriting
   - Masalan: `https://github.com`

2. **Tahlil Jarayoni Kuzatuvi**

   - ✅ **1-qadam**: Website content yuklanadi (2-5s)
   - ✅ **2-qadam**: AI tahlil qiladi (3-8s)
   - ✅ **3-qadam**: Komponentlar ajratiladi (1s)
   - ✅ **4-qadam**: React kodlari yaratiladi (2-5s)
   - ✅ **5-qadam**: Design sistema tayyorlanadi (1s)

3. **Natijalarni Ko'rish**

   - Aniqlangan komponentlar soni
   - Sahifalar soni
   - Komponentlar ro'yxati (nomi, turi, murakkabligi)

4. **Kodlarni Yuklab Olish**
   - Copy tugmasini bosing - kod clipboard ga ko'chiriladi
   - "Yuklash" - har bir komponent alohida fayl sifatida

## 🔧 Texnik Tafsilotlar

### Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite (development server)
- Tailwind CSS + shadcn/ui
- Lucide React (icons)

**Backend:**

- Python Flask
- Flask-CORS, Flask-Limiter
- BeautifulSoup4 (HTML parsing)
- Requests (web scraping)
- Pillow (image processing)

**AI Integration:**

- Groq API (asosiy)
- OpenAI API (qo'shimcha)

### 🔌 API Endpoints

```bash
# Health check
GET /health

# Website tahlil qilish
POST /api/analyze-website
{
  "url": "https://example.com"
}

# Screenshot olish
POST /api/screenshot
{
  "url": "https://example.com"
}

# Content yuklash
POST /api/fetch-content
{
  "url": "https://example.com"
}
```

### 📁 Loyiha Tuzilishi

```
cloning-app/
├── 📁 src/                          # Frontend
│   ├── 📁 features/clones/          # Asosiy feature
│   │   ├── 📁 components/           # UI components
│   │   ├── 📁 services/             # API calls
│   │   └── types.ts                 # TypeScript types
│   ├── 📁 shared/components/ui/     # shadcn/ui components
│   └── 📁 pages/                    # Page components
├── 📁 api/                          # Backend
│   ├── server.py                    # Main server
│   ├── requirements.txt             # Python deps
│   ├── .env.example                 # Config template
│   └── venv/                        # Python virtual env
├── start.sh                         # Ishga tushirish script
├── stop.sh                          # To'xtatish script
├── setup.sh                         # O'rnatish script
└── test-integration.html            # API test sahifasi
```

## 🧪 Test va Debug

### 🔍 Manual Testing

```bash
# API ni test qilish
curl -X POST http://localhost:8000/api/analyze-website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Health check
curl http://localhost:8000/health
```

### 📊 Performance Metrics

- **Oddiy saytlar**: 5-10 soniya
- **O'rta saytlar**: 10-15 soniya
- **Murakkab saytlar**: 15-30 soniya

### 🛠️ Debug

**Backend logs:**

```bash
tail -f backend.log
```

**Frontend logs:**

```bash
tail -f frontend.log
```

**Real-time monitoring:**

- Console tabni oching frontend da
- Network requests ni kuzating
- Error messages ni o'qing

## 🛡️ Xavfsizlik va Performance

### Security Features:

- Rate limiting (API abuse oldini olish)
- Input validation va sanitization
- CORS protection
- Error handling (ma'lumot oshkor qilmaslik)

### Best Practices:

- Environment variables (.env)
- Virtual environment (Python)
- Process management (PID files)
- Logging va monitoring

## 🚨 Muammolarni Hal Qilish

### 1. Port band bo'lsa:

```bash
# Jarayonlarni to'xtatish
./stop.sh

# yoki manual:
pkill -f "server.py"
pkill -f "vite"
```

### 2. Dependencies xatoligi:

```bash
# Node.js cache tozalash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Python venv qayta yaratish
rm -rf api/venv
cd api && python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. AI API xatoliklari:

- `.env` faylida kalitlar to'g'ri kiritilganini tekshiring
- Groq/OpenAI hisob hisobingizda mablag' borligini tekshiring
- Internet aloqasi barqarorligini tekshiring

### 4. Permission error:

```bash
# Script fayllariga ruxsat berish
chmod +x setup.sh start.sh stop.sh
```

## 📚 Qo'shimcha Ma'lumotlar

### AI API Kalitlarni Olish:

**Groq (Tavsiya etiladi - tez va arzon):**

1. https://console.groq.com ga boring
2. Account yarating
3. API key oling

**OpenAI (Qo'shimcha):**

1. https://platform.openai.com ga boring
2. Account yarating
3. Billing sozlang
4. API key oling

### 🎯 Real Misollar

**GitHub.com tahlil natijasi:**

```json
{
  "analysis": {
    "title": "GitHub · Build and ship software...",
    "components": [
      {
        "name": "Header",
        "type": "navigation",
        "description": "Main navigation header"
      },
      {
        "name": "HeroSection",
        "type": "layout",
        "description": "Main landing page hero"
      }
    ],
    "designSystem": {
      "colors": {
        "primary": "#0969da",
        "secondary": "#656d76"
      }
    }
  }
}
```

## 🎉 Muvaffaqiyat!

Endi sizda to'liq ishlaydigan AI-powered website cloning tizimi bor!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Logs**: `tail -f backend.log frontend.log`
- **Stop**: `./stop.sh`

**Happy coding! 🚀**

---

## 🤝 Yordam va Qo'llab-quvvatlash

Savollar yoki muammolar bo'lsa:

1. Ushbu README ni qaytadan o'qing
2. `test-integration.html` ni ochib API ni test qiling
3. Log fayllarni tekshiring
4. GitHub Issues da savol qoldiring

Made with ❤️ by CloneAI team
