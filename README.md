# AI Website Cloning App 🚀

Bu loyiha AI (GPT-4 Vision) yordamida har qanday saytni analiz qilib, React TypeScript komponentlariga avtomatik aylantirish imkonini beradi.

## ✨ Xususiyatlari

- 🤖 **AI-powered Analysis** - GPT-4 Vision orqali sayt tahlili
- 🎨 **Component Generation** - Avtomatik React TSX komponentlar yaratish
- 🎯 **Modern Stack** - React 19, TypeScript, Tailwind CSS, shadcn/ui
- 📱 **Responsive Design** - Barcha qurilmalarda ishlaydi
- 🔧 **Clean Code** - TypeScript, ESLint, Prettier
- 🌐 **Multi-language** - O'zbek, Ingliz tillarini qo'llab-quvvatlaydi

## 🛠 Texnologiyalar

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Query
- React Router

### Backend

- Python Flask
- OpenAI GPT-4 Vision API
- Selenium (screenshot uchun)
- BeautifulSoup (HTML parsing)
- Flask-CORS

## 🚀 O'rnatish va Ishga Tushirish

### 1. Repository ni klonlash

```bash
git clone <repository-url>
cd cloning-app
```

### 2. Frontend dependencies o'rnatish

```bash
npm install
```

### 3. Backend dependencies o'rnatish

```bash
npm run api:install
# yoki
cd api && pip install -r requirements.txt
```

### 4. Environment variables sozlash

```bash
cd api
cp .env.example .env
# .env faylida OPENAI_API_KEY ni sozlang
```

### 5. Loyihani ishga tushirish

#### Barcha servislarni bir vaqtda:

```bash
npm run full:dev
```

#### Alohida ishga tushirish:

```bash
# Frontend (port 5173)
npm run dev

# Backend (port 5000)
npm run api:dev
```

## 📖 Foydalanish

1. **Website URL kiriting** - Analiz qilmoqchi bo'lgan sayt manzilini kiriting
2. **AI Tahlil** - GPT-4 Vision saytni analiz qiladi va komponentlarni aniqlaydi
3. **Komponentlar Generatsiyasi** - Har bir komponent uchun React TSX kod yaratiladi
4. **Yuklab olish** - Tayyor komponentlarni loyihangizga yuklab oling

## 🎯 Asosiy Fayllar

```
src/
├── features/clones/
│   ├── components/
│   │   ├── CloneGallery.tsx      # Klonlar galereyasi
│   │   └── WebsiteAnalyzer.tsx   # URL analiz qilish interfeysi
│   ├── services/
│   │   ├── ai-analyzer.ts        # AI tahlil servisi
│   │   └── component-generator.ts # Komponent yaratish servisi
│   └── types.ts                  # TypeScript interfaces
├── pages/home/
│   └── HomePage.tsx              # Asosiy sahifa
└── shared/components/ui/         # shadcn/ui komponentlari

api/
├── server.py                     # Flask backend serveri
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment variables namunasi
```

## 🔧 API Endpoints

- `POST /api/screenshot` - Website screenshot olish
- `POST /api/fetch-content` - HTML content olish
- `POST /api/ai-analyze` - AI orqali tahlil qilish
- `POST /api/generate-components` - Komponentlar yaratish
- `GET /health` - API health check

## 🎨 Komponent Tiplari

Loyiha quyidagi komponent tiplarini qo'llab-quvvatlaydi:

- **Layout** - Header, Footer, Sidebar
- **Navigation** - Navbar, Menu, Breadcrumb
- **Form** - Input, Button, Select, Checkbox
- **Display** - Card, Modal, Toast, Badge
- **Media** - Image, Video, Gallery
- **Data** - Table, List, Grid

## 🌟 Qo'llab-quvvatlanadigan Saytlar

Deyarli barcha zamonaviy saytlar:

- E-commerce (Amazon, eBay)
- Social Media (Instagram, Twitter)
- Streaming (YouTube, Netflix)
- Productivity (Notion, Trello)
- News & Blogs (Medium, CNN)

## 🤝 Hissa Qo'shish

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 🎉 Demo

Loyihani sinab ko'rish uchun:

1. Loyihani ishga tushiring
2. `https://tailwindui.com` kabi sayt URL ini kiriting
3. AI tahlilini kuzating
4. Yaratilgan komponentlarni ko'ring

## ⚙️ Konfiguratsiya

### OpenAI API

```bash
# .env faylida
OPENAI_API_KEY=sk-your-api-key-here
```

### Chrome Driver

Selenium uchun Chrome driver avtomatik yuklanadi. Agar muammo bo'lsa:

```bash
# Ubuntu/Debian
sudo apt-get install chromium-browser

# macOS
brew install chromedriver
```

---

**Yaratuvchi:** [Sizning ismingiz]
**Telegram:** [@username]
**GitHub:** [@username]

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
