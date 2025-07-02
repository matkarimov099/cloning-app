import {
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Code,
  Copy,
  Download,
  FileCode,
  Globe,
  Layers,
  Layout,
  Loader2,
  Monitor,
  Palette,
  Play,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs.tsx";
import type { GenerationResult, WebsiteAnalysis } from "../types";
import { DevelopmentConsole } from "./DevelopmentConsole";

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "loading" | "completed" | "error";
  icon: React.ReactNode;
  duration?: number;
}

interface AnalysisLog {
  id: string;
  timestamp: Date;
  type: "info" | "success" | "error" | "warning";
  message: string;
  details?: string | Record<string, unknown>;
}

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  // Yangi: usul tanlash uchun state
  const [mode, setMode] = useState<"analyze" | "clone">("analyze");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const [activeTab, setActiveTab] = useState("analyzer");

  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: "fetch",
      title: "Kontent Yuklash",
      description: "URL dan HTML tarkibni olish",
      status: "pending",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "analyze",
      title: "AI Tahlil",
      description: "Struktura va komponentlarni aniqlash",
      status: "pending",
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: "generate",
      title: "Komponent Yaratish",
      description: "AI yordamida kod generatsiyasi",
      status: "pending",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "style",
      title: "Stil berish",
      description: "Dizayn tokenlarini qo'llash",
      status: "pending",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "complete",
      title: "Yakunlash",
      description: "Fayllarni tayyorlash",
      status: "pending",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ]);

  // Log functions
  const addLog = (
    type: AnalysisLog["type"],
    message: string,
    details?: string | Record<string, unknown>
  ) => {
    const newLog: AnalysisLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type,
      message,
      details,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Step update function
  const updateStep = (
    stepIndex: number,
    status: AnalysisStep["status"],
    duration?: number
  ) => {
    setSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex ? { ...step, status, duration } : step
      )
    );
  };

  // Mock data generator - URL asosida o'zgaruvchan qilib
  const generateMockData = (): WebsiteAnalysis => {
    // URLdan domen nomini ajratib olish
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    const timestamp = new Date();

    return {
      url: url,
      title: `${domain} - Website Analysis`,
      description: `This is a detailed analysis of ${domain}. This site appears to be a ${
        domain.includes("shop") || domain.includes("store")
          ? "e-commerce"
          : "business"
      } website with modern design patterns.`,
      ai_provider: "CloneAI (Fallback Mode)",
      screenshot: "",
      analyzedAt: timestamp,
      structure: {
        layout: "multi-column",
        sections: [
          {
            id: `section-header-${Date.now()}`,
            type: "header",
            name: "Header Section",
            description: "Main website header",
            position: 0,
            content: { text: ["Main header"] },
            styling: {
              colors: {
                primary: ["#4F46E5"],
                secondary: ["#6366F1"],
                accent: ["#4F46E5"],
                neutral: ["#ffffff", "#f3f4f6"],
                semantic: {
                  success: "#10B981",
                  warning: "#FBBF24",
                  error: "#EF4444",
                  info: "#3B82F6",
                },
              },
              typography: {
                fontFamilies: ["Inter", "sans-serif"],
                fontSizes: ["16px", "18px", "24px"],
                fontWeights: [400, 500, 700],
                lineHeights: ["1.5", "1.2"],
                letterSpacing: ["normal"],
              },
              spacing: {
                margins: ["1rem"],
                paddings: ["1rem", "2rem"],
                gaps: ["0.5rem", "1rem"],
                containerWidths: ["1280px"],
              },
              layout: {
                type: "flex",
                direction: "row",
                justify: "between",
                align: "center",
              },
              effects: [],
            },
          },
        ],
        navigation: {
          type: "horizontal",
          position: "top",
          items: [
            { label: "Home", href: "/", icon: "home" },
            { label: "Features", href: "/features", icon: "star" },
            { label: "About", href: "/about", icon: "info" },
          ],
        },
      },
      components: [
        {
          id: `header-${Date.now()}`,
          name: "MainHeader",
          type: "layout",
          description: `Main navigation header for ${domain}`,
          props: [],
          styling: {
            colors: {
              primary: ["#4F46E5"],
              secondary: ["#6366F1"],
              accent: ["#4F46E5"],
              neutral: ["#ffffff", "#f3f4f6"],
              semantic: {
                success: "#10B981",
                warning: "#FBBF24",
                error: "#EF4444",
                info: "#3B82F6",
              },
            },
            typography: {
              fontFamilies: ["Inter", "sans-serif"],
              fontSizes: ["16px", "18px", "24px"],
              fontWeights: [400, 500, 700],
              lineHeights: ["1.5", "1.2"],
              letterSpacing: ["normal"],
            },
            spacing: {
              margins: ["1rem"],
              paddings: ["1rem", "2rem"],
              gaps: ["0.5rem", "1rem"],
              containerWidths: ["1280px"],
            },
            layout: {
              type: "flex",
              direction: "row",
              justify: "between",
              align: "center",
            },
            effects: [],
          },
          functionality: ["navigation", "responsive"],
          complexity: "medium",
          reusability: 0.9,
          dependencies: ["react", "tailwindcss"],
        },
        {
          id: `hero-${Date.now()}`,
          name: "HeroSection",
          type: "component",
          description: `Primary hero banner section for ${domain}`,
          props: [],
          styling: {
            colors: {
              primary: ["#4F46E5"],
              secondary: ["#6366F1"],
              accent: ["#4F46E5"],
              neutral: ["#ffffff", "#f3f4f6"],
              semantic: {
                success: "#10B981",
                warning: "#FBBF24",
                error: "#EF4444",
                info: "#3B82F6",
              },
            },
            typography: {
              fontFamilies: ["Inter", "sans-serif"],
              fontSizes: ["16px", "18px", "24px"],
              fontWeights: [400, 500, 700],
              lineHeights: ["1.5", "1.2"],
              letterSpacing: ["normal"],
            },
            spacing: {
              margins: ["1rem"],
              paddings: ["1rem", "2rem"],
              gaps: ["0.5rem", "1rem"],
              containerWidths: ["1280px"],
            },
            layout: {
              type: "flex",
              direction: "column",
              justify: "center",
              align: "center",
            },
            effects: [],
          },
          functionality: ["display", "responsive"],
          complexity: "medium",
          reusability: 0.8,
          dependencies: ["react", "tailwindcss"],
        },
        {
          id: `features-${Date.now()}`,
          name: "FeaturesList",
          type: "layout",
          description: "Interactive feature showcase grid",
          props: [],
          styling: {
            colors: {
              primary: ["#4F46E5"],
              secondary: ["#6366F1"],
              accent: ["#4F46E5"],
              neutral: ["#ffffff", "#f3f4f6"],
              semantic: {
                success: "#10B981",
                warning: "#FBBF24",
                error: "#EF4444",
                info: "#3B82F6",
              },
            },
            typography: {
              fontFamilies: ["Inter", "sans-serif"],
              fontSizes: ["16px", "18px", "24px"],
              fontWeights: [400, 500, 700],
              lineHeights: ["1.5", "1.2"],
              letterSpacing: ["normal"],
            },
            spacing: {
              margins: ["1rem"],
              paddings: ["1rem", "2rem"],
              gaps: ["0.5rem", "1rem"],
              containerWidths: ["1280px"],
            },
            layout: {
              type: "grid",
              direction: "row",
              justify: "start",
              align: "start",
            },
            effects: [],
          },
          functionality: ["display", "responsive"],
          complexity: "simple",
          reusability: 0.9,
          dependencies: ["react", "tailwindcss"],
        },
      ],
      assets: [],
      technologies: [
        {
          name: "React",
          category: "framework",
          confidence: 0.95,
          version: "18.x",
        },
        {
          name: "TypeScript",
          category: "language",
          confidence: 0.9,
          version: "5.x",
        },
        {
          name: "Tailwind CSS",
          category: "styling",
          confidence: 0.85,
          version: "3.x",
        },
        {
          name: "Next.js",
          category: "framework",
          confidence: 0.8,
          version: "14.x",
        },
        { name: "Redux", category: "state", confidence: 0.7, version: "5.x" },
      ],
      metadata: {
        keywords: [domain, "website", "business"],
        language: "en",
        theme: "light",
        responsive: true,
      },
      designSystem: {
        colors: {
          primary: "#4F46E5",
          secondary: "#6366F1",
          background: "#FFFFFF",
          text: "#1F2937",
          accents: ["#4F46E5", "#6366F1"],
        },
        typography: {
          fontFamily: "Inter, sans-serif",
          headings: {
            fontFamily: "Inter, sans-serif",
            weights: [600, 700, 800],
          },
          body: {
            fontFamily: "Inter, sans-serif",
            weights: [400, 500],
          },
        },
        spacing: {
          scale: [4, 8, 16, 24, 32, 48],
          containers: {
            max: "1280px",
            default: "1024px",
          },
        },
        borderRadius: {
          small: "0.25rem",
          default: "0.5rem",
          large: "1rem",
        },
        breakpoints: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
      raw_response: {
        websiteAnalysis: `This is an analysis of ${domain} generated in debug mode because we couldn't connect to the AI service`,
        designSystem: "Uses Tailwind CSS with custom design tokens",
        components:
          "Has multiple reusable UI components organized in a component library",
        purpose: `The website ${domain} serves as a ${
          domain.includes("shop") || domain.includes("store")
            ? "e-commerce platform"
            : "professional business website"
        } with strong emphasis on user experience and conversion optimization`,
      },
    };
  };

  // Mock component generator
  const generateMockComponents = () => {
    // URLdan domen nomini ajratib olish
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];

    return {
      success: true,
      message: "Components generated successfully",
      components: [
        {
          name: `${domain.charAt(0).toUpperCase() + domain.slice(1)}Header`,
          type: "layout",
          description: `Main header for ${domain} website`,
          dependencies: ["react", "tailwindcss"],
          code: `import React from 'react';

export function ${domain.charAt(0).toUpperCase() + domain.slice(1)}Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">${
          domain.charAt(0).toUpperCase() + domain.slice(1)
        }</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-gray-700 hover:text-blue-600">Home</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600">Features</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600">About</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}`,
        },
        {
          name: `${domain.charAt(0).toUpperCase() + domain.slice(1)}Hero`,
          type: "component",
          description: `Hero banner for ${domain} website`,
          dependencies: ["react", "tailwindcss"],
          code: `import React from 'react';
          
export function ${domain.charAt(0).toUpperCase() + domain.slice(1)}Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Welcome to ${domain}
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Your premiere destination for ${
              domain.includes("shop")
                ? "shopping and retail services"
                : "professional business solutions"
            }.
          </p>
          <div className="mt-10 flex justify-center">
            <button className="bg-white px-6 py-3 rounded-md shadow-md text-blue-700 font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </button>
            <button className="ml-4 px-6 py-3 rounded-md border-2 border-white text-white font-medium hover:bg-blue-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
        },
        {
          name: `${domain.charAt(0).toUpperCase() + domain.slice(1)}Features`,
          type: "component",
          description: `Feature showcasing for ${domain} website`,
          dependencies: ["react", "tailwindcss"],
          code: `import React from 'react';
          
export function ${domain.charAt(0).toUpperCase() + domain.slice(1)}Features() {
  const features = [
    { title: "Feature One", description: "First amazing feature of ${domain}" },
    { title: "Feature Two", description: "Second powerful capability that sets us apart" },
    { title: "Feature Three", description: "Third innovative solution for your needs" },
    { title: "Feature Four", description: "Fourth advanced tool in our platform" },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
        },
      ],
      generatedAt: new Date(),
    };
  };

  // Check if server is running
  const checkServerStatus = async () => {
    try {
      const healthResponse = await fetch("http://localhost:8000/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log("Server status:", healthData);
        addLog(
          "info",
          `Backend server available: ${healthData.message || "OK"}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Server health check failed:", error);
      addLog("error", "Backend server ishlamayapti! Mock data ishlatiladi.");
      return false;
    }
  };

  // Yangi: usulga qarab tahlil qilish yoki klonlash
  const analyzeWebsite = async () => {
    if (!url.trim()) {
      addLog("error", "URL kiritilmagan!");
      return;
    }

    // First check if the server is running
    const isServerRunning = await checkServerStatus();

    setIsAnalyzing(true);
    setAnalysis(null);
    setGenerationResult(null);
    setCurrentStep(0);
    clearLogs();
    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })));

    if (isServerRunning) {
      addLog("info", `Tahlil boshlandi (REAL API): ${url} (Rejim: ${mode})`);
    } else {
      addLog(
        "warning",
        `Tahlil boshlandi (DEMO mode): ${url} (Rejim: ${mode})`
      );
      toast.warning(
        "Backend server bilan bog'lanib bo'lmadi! Demo rejimda ishlanmoqda.",
        {
          position: "top-center",
          duration: 5000,
        }
      );
    }

    try {
      // ===== STEP 1: Fetch Content =====
      updateStep(0, "loading");
      addLog("info", "Website kontentini yuklash...");

      // HTML kontentni saqlash uchun o'zgaruvchi
      let contentData: {
        html: string;
        title?: string;
        description?: string;
        success: boolean;
        [key: string]: unknown;
      };

      try {
        console.log("Fetching content for URL:", url);
        addLog("info", `${url} manzilidan kontent yuklash...`);

        if (!isServerRunning) {
          // Skip API call if server is not running
          throw new Error("Backend server bilan bog'lanib bo'lmadi");
        }

        const contentResponse = await fetch(
          "http://localhost:8000/api/scrape-content",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          }
        );

        if (!contentResponse.ok) {
          const errorText = await contentResponse.text();
          console.error("Content fetch error:", errorText);
          throw new Error(
            `Server xatosi: ${contentResponse.status} - ${errorText}`
          );
        }

        contentData = await contentResponse.json();

        // Validate response format
        if (
          !contentData ||
          typeof contentData !== "object" ||
          !contentData.html
        ) {
          console.error("Invalid content response format:", contentData);
          throw new Error("Server noto'g'ri ma'lumot formati qaytardi");
        }

        console.log("Content fetch success:", contentData);
        addLog("success", "Kontent muvaffaqiyatli yuklandi", {
          title: contentData.title || "Unknown",
          size: contentData.html?.length || 0,
        });
      } catch (fetchError) {
        console.error("Content fetch error:", fetchError);
        addLog(
          "warning",
          `Backend serverga ulanishda muammo: ${
            fetchError instanceof Error ? fetchError.message : "Unknown error"
          }. Demo rejimda davom ettirilmoqda`
        );

        // Agar backend ishlamasa, test rejimda davom etamiz
        contentData = {
          html: `<html><body><h1>${url} sahifasi</h1><p>Bu sayt tahlil qilinmoqda...</p></body></html>`,
          title: `${url} tahlili`,
          description: `${url} sahifasi uchun demo tahlil`,
          success: true,
        };
      }

      updateStep(0, "completed");

      // ===== STEP 2: AI Analysis =====
      setCurrentStep(1);
      updateStep(1, "loading");
      addLog("info", "AI tahlilni boshlash...");

      // AI tahlil natijasi uchun o'zgaruvchi
      let analysisData: WebsiteAnalysis;

      try {
        addLog("info", "AI serveri bilan bog'lanish...");
        console.log("Sending request to AI analyze with URL:", url);

        if (!isServerRunning) {
          // Skip API call if server is not running
          throw new Error("AI serveri bilan bog'lanib bo'lmadi");
        }

        const analysisResponse = await fetch(
          "http://localhost:8000/api/analyze-website",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: url, // Production server only needs URL
            }),
          }
        );

        if (!analysisResponse.ok) {
          const errorText = await analysisResponse.text();
          console.error("AI analyze error:", errorText);
          throw new Error(
            `AI service error: ${analysisResponse.status} - ${errorText}`
          );
        }

        const responseData = await analysisResponse.json();

        // Validate analysis response
        if (!responseData || typeof responseData !== "object") {
          console.error("Invalid analysis response format:", responseData);
          throw new Error(
            "AI tahlil serveri noto'g'ri ma'lumot formati qaytardi"
          );
        }

        console.log("AI analysis response:", responseData);

        // Production server has different response structure
        // We need to adapt it to our WebsiteAnalysis interface
        if (responseData.analysis) {
          // This is the production server format
          analysisData = {
            url: url,
            title: responseData.analysis.title || "Analyzed Website",
            description:
              responseData.analysis.description || "Website has been analyzed",
            ai_provider: responseData.analysis.ai_provider || "CloneAI",
            components: responseData.analysis.components || [],
            technologies: responseData.analysis.technologies || [],
            metadata: responseData.analysis.metadata || {},
            raw_response: responseData.analysis,
            analyzedAt: new Date(),
            // Add any other fields from the response as needed
            ...responseData.analysis,
          };
        } else {
          // Use the response directly if it seems to match our interface
          analysisData = {
            ...responseData,
            url: url, // Ensure we have a URL
            analyzedAt: new Date(),
            ai_provider: responseData.ai_provider || "Unknown",
          };
        }

        addLog("success", "AI tahlil muvaffaqiyatli yakunlandi", {
          provider: analysisData.ai_provider || "Unknown",
        });
      } catch (analysisError) {
        // Real backend ishlamasa yoki xato qaytarsa
        console.error("AI analysis error:", analysisError);
        addLog(
          "warning",
          `AI tahlil serveri bilan muammo: ${
            analysisError instanceof Error
              ? analysisError.message
              : "Unknown error"
          }. Demo ma'lumotlar ishlatilmoqda`
        );

        // Generate mock data with clear indication that it's fallback data
        analysisData = generateMockData();
        analysisData.title = `[DEMO DATA] ${analysisData.title}`;
        analysisData.description = `[DEMO DATA] ${analysisData.description}`;
        console.log("Using mock analysis data:", analysisData);
      }

      setAnalysis(analysisData);
      updateStep(1, "completed");

      // Faqat tahlil (1-usul)
      if (mode === "analyze") {
        setActiveTab("results");
        // Qolgan step-larni completed qilamiz
        updateStep(2, "completed");
        updateStep(3, "completed");
        updateStep(4, "completed");
        setIsAnalyzing(false);
        return;
      }

      // ===== STEP 3: Generate Components (for 'clone' mode) =====
      setCurrentStep(2);
      updateStep(2, "loading");
      addLog("info", "React komponentlarini yaratish...");

      try {
        console.log("Starting component generation for URL:", url);
        addLog(
          "info",
          "React komponentlarini yaratish uchun AI ga so'rov yuborilmoqda..."
        );

        // Save the original API response for component generation
        const originalApiResponse = analysisData.raw_response;

        if (!isServerRunning) {
          // Skip API call if server is not running
          throw new Error(
            "Komponent generatsiyasi serveri bilan bog'lanib bo'lmadi"
          );
        }

        const generateResponse = await fetch(
          "http://localhost:8000/api/generate-components",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysis: originalApiResponse || analysisData, // Use the original response if available
              options: { url, outputFormat: "tsx" },
            }),
          }
        );

        if (!generateResponse.ok) {
          const errorText = await generateResponse.text();
          console.error("Component generation error:", errorText);
          throw new Error(
            `Komponent yaratishda xato: ${generateResponse.status} - ${errorText}`
          );
        }

        const generationData = await generateResponse.json();
        console.log("Generation result:", generationData);
        setGenerationResult(generationData);
        addLog("success", "Komponentlar muvaffaqiyatli yaratildi", {
          count: generationData.components?.length || 0,
        });
      } catch (error) {
        // Mock data for component generation
        console.error("Component generation error:", error);
        addLog(
          "warning",
          `Komponent yaratishda muammo: ${
            error instanceof Error ? error.message : "Noma'lum xato"
          }. Demo komponentlar ko'rsatilmoqda`
        );

        const mockGenerationData = generateMockComponents();
        setGenerationResult(mockGenerationData);
      }

      updateStep(2, "completed");
      updateStep(3, "completed");
      updateStep(4, "completed");
      setActiveTab("results");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Noma'lum xato";
      addLog("error", `Xato: ${errorMessage}`);
      updateStep(currentStep, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStepIcon = (status: AnalysisStep["status"]) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full space-y-6 px-6 py-6">
        {/* Header */}
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              AI Website Analyzer
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Website Clone Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har qanday websiteni React TSX komponentlarga aylantiring
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm h-14 text-base">
            <TabsTrigger
              value="analyzer"
              className="flex items-center gap-2 text-base py-3"
            >
              <Settings className="w-5 h-5" />
              Analyzer
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2 text-base py-3"
              disabled={!analysis}
            >
              <Layout className="w-5 h-5" />
              Natijalar
            </TabsTrigger>
            <TabsTrigger
              value="console"
              className="flex items-center gap-2 text-base py-3"
            >
              <Monitor className="w-5 h-5" />
              Console
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <div className="w-full space-y-6 px-0">
              {/* URL Input Card - Full Width */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl w-full mx-0">
                <CardHeader className="px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Website URL
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tahlil qilmoqchi bo'lgan website URL manzilini kiriting
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Kreativ custom radio buttonlar - w-full, zamonaviy va responsiv, kichikroq */}
                  <div className="flex flex-col md:flex-row gap-3 items-center mb-4 w-full">
                    <button
                      type="button"
                      onClick={() => setMode("analyze")}
                      disabled={isAnalyzing}
                      className={`group flex items-center gap-3 w-full md:w-1/2 px-5 py-3 rounded-2xl border-2 transition-all duration-200 shadow focus:outline-none
                      ${
                        mode === "analyze"
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg scale-[1.01]"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }
                      min-w-[180px]`}
                    >
                      <span
                        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
                      ${
                        mode === "analyze"
                          ? "bg-blue-100 text-blue-600 shadow scale-105"
                          : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                      }`}
                      >
                        <Settings className="w-5 h-5" />
                      </span>
                      <div className="flex flex-col items-start flex-1">
                        <span
                          className={`text-base font-bold ${
                            mode === "analyze"
                              ? "text-blue-700"
                              : "text-gray-800"
                          }`}
                        >
                          Faqat tahlil qilish
                        </span>
                        <span className="text-xs text-gray-500">
                          Sayt haqida ma'lumot va texnologiyalar
                        </span>
                      </div>
                      {mode === "analyze" && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-inner animate-pulse" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("clone")}
                      disabled={isAnalyzing}
                      className={`group flex items-center gap-3 w-full md:w-1/2 px-5 py-3 rounded-2xl border-2 transition-all duration-200 shadow focus:outline-none
                      ${
                        mode === "clone"
                          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg scale-[1.01]"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                      }
                      min-w-[180px]`}
                    >
                      <span
                        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
                      ${
                        mode === "clone"
                          ? "bg-purple-100 text-purple-600 shadow scale-105"
                          : "bg-gray-100 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500"
                      }`}
                      >
                        <Code className="w-5 h-5" />
                      </span>
                      <div className="flex flex-col items-start flex-1">
                        <span
                          className={`text-base font-bold ${
                            mode === "clone"
                              ? "text-purple-700"
                              : "text-gray-800"
                          }`}
                        >
                          Klonlash (tsx komponentlar)
                        </span>
                        <span className="text-xs text-gray-500">
                          AI yordamida React komponentlar yaratish
                        </span>
                      </div>
                      {mode === "clone" && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-inner animate-pulse" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 h-14 text-lg px-4"
                      disabled={isAnalyzing}
                    />
                    <Button
                      onClick={analyzeWebsite}
                      disabled={isAnalyzing || !url.trim()}
                      className="h-14 px-10 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Tahlil jarayoni...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Tahlil boshlash
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Steps - Full Width */}
                  {(isAnalyzing || analysis) && (
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Jarayon holati
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {steps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`p-4 rounded-lg border transition-all ${
                              index <= currentStep
                                ? "bg-blue-50 border-blue-200"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getStepIcon(step.status)}
                              <span className="text-sm font-medium">
                                {step.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results">
            {analysis ? (
              <div className="w-full space-y-6">
                {/* Analysis Results Card - Full Width */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Layers className="w-6 h-6 text-blue-600" />
                      Tahlil natijalari
                    </CardTitle>
                    <CardDescription className="text-base">
                      Website strukturasi va aniqlangan komponentlar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Statistics */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-b pb-2">
                          📈 Statistika
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600">
                              {analysis.components?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              Aniqlangan komponentlar
                            </div>
                          </div>
                          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="text-3xl font-bold text-purple-600">
                              {generationResult?.components?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              TSX fayllari
                            </div>
                          </div>
                        </div>

                        {/* Component List */}
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-900 text-base border-b pb-1">
                            🔍 Aniqlangan komponentlar:
                          </h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {analysis.components?.map((component) => (
                              <div
                                key={component.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Layout className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-sm">
                                    {component.name}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {component.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Technologies and Meta Info */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-b pb-2">
                          🛠️ Texnologiyalar va Ma'lumotlar
                        </h4>

                        {analysis.technologies &&
                          analysis.technologies.length > 0 && (
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-900">
                                Framework va kutubxonalar:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {analysis.technologies.map((tech) => (
                                  <Badge
                                    key={tech.name}
                                    variant="secondary"
                                    className="text-sm py-1 px-3"
                                  >
                                    {tech.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">
                            Website ma'lumotlari:
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-gray-600 font-medium">
                                Title:
                              </span>
                              <span className="font-semibold text-right">
                                {analysis.title || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-gray-600 font-medium">
                                Description:
                              </span>
                              <span className="font-normal text-right text-gray-800">
                                {analysis.description || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-gray-600 font-medium">
                                AI Provider:
                              </span>
                              <span className="font-semibold text-right text-purple-600">
                                {analysis.ai_provider || "Noma'lum"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Raw AI Response */}
                    {analysis.raw_response && (
                      <div className="mt-8">
                        <h4 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                          🤖 AI Xom Javobi
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                          <code>
                            {JSON.stringify(analysis.raw_response, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Generated Components Card - Full Width */}
                {generationResult && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        Yaratilgan komponentlar
                      </CardTitle>
                      <CardDescription>
                        React TSX formatidagi komponentlar
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {generationResult.components.length} ta komponent
                          yaratildi
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const allCode = generationResult.components
                                .map((comp) => `// ${comp.name}\n${comp.code}`)
                                .join("\n\n");
                              navigator.clipboard.writeText(allCode);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Barchasini nusxalash
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const dataStr = JSON.stringify(
                                generationResult,
                                null,
                                2
                              );
                              const dataBlob = new Blob([dataStr], {
                                type: "application/json",
                              });
                              const url = URL.createObjectURL(dataBlob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = "components.json";
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            JSON yuklash
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {generationResult.components.map((component) => (
                          <Card
                            key={component.name}
                            className="border border-gray-200"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <FileCode className="w-4 h-4 text-blue-600" />
                                  {component.name}
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      component.code
                                    )
                                  }
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                                <code>{component.code}</code>
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-0 shadow-xl max-w-md mx-auto">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tahlil natijasi yo'q
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Website tahlili uchun URL kiriting va "Tahlil boshlash"
                    tugmasini bosing
                  </p>
                  <Button
                    onClick={() => setActiveTab("analyzer")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Tahlilga o'tish
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="console">
            <DevelopmentConsole
              logs={logs}
              isRunning={isAnalyzing}
              onClear={clearLogs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
