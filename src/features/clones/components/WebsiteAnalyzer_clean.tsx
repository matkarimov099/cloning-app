import {
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Code,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  Image,
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
import { Separator } from "@/shared/components/ui/separator.tsx";
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
      title: "Website ni yuklash",
      description: "HTML content va screenshot olish",
      status: "pending",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "analyze",
      title: "AI tahlil",
      description: "Struktura va komponentlarni aniqlash",
      status: "pending",
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: "extract",
      title: "Komponentlar",
      description: "UI komponentlarini ajratish",
      status: "pending",
      icon: <Layout className="w-4 h-4" />,
    },
    {
      id: "generate",
      title: "Kod yaratish",
      description: "React TSX komponentlar generatsiya",
      status: "pending",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "style",
      title: "Dizayn sistemi",
      description: "Colors, typography, spacing",
      status: "pending",
      icon: <Palette className="w-4 h-4" />,
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

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      addLog("error", "URL kiritilmagan!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setGenerationResult(null);
    setCurrentStep(0);
    clearLogs();

    // Reset all steps
    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })));

    addLog("info", `Tahlil boshlandi: ${url}`);

    try {
      // Step 1: Fetch website
      setCurrentStep(0);
      updateStep(0, "loading");
      addLog("info", "Website HTML va screenshot olish...");

      const analysisResponse = await fetch(
        "http://localhost:3001/api/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.statusText}`);
      }

      const analysisData = await analysisResponse.json();
      updateStep(0, "completed");
      addLog("success", "Website muvaffaqiyatli yuklandi");

      // Step 2: AI Analysis
      setCurrentStep(1);
      updateStep(1, "loading");
      addLog("info", "AI tahlil jarayoni...");

      setAnalysis(analysisData);
      updateStep(1, "completed");
      addLog("success", "AI tahlil yakunlandi", {
        components: analysisData.components?.length || 0,
      });

      // Step 3: Component Generation
      setCurrentStep(2);
      updateStep(2, "loading");
      addLog("info", "React komponentlar yaratish...");

      const generateResponse = await fetch(
        "http://localhost:3001/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysis: analysisData,
            url: url,
          }),
        }
      );

      if (!generateResponse.ok) {
        throw new Error(`Generation failed: ${generateResponse.statusText}`);
      }

      const generationData = await generateResponse.json();
      updateStep(2, "completed");
      updateStep(3, "completed");
      updateStep(4, "completed");

      setGenerationResult(generationData);
      addLog("success", "Komponentlar muvaffaqiyatli yaratildi", {
        components: generationData.components.length,
      });

      // Switch to results tab
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
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2">
      <div className="w-full max-w-none mx-auto space-y-4 px-2">
        {/* Header */}
        <div className="text-center space-y-4">
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
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Analyzer
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2"
              disabled={!analysis}
            >
              <Layout className="w-4 h-4" />
              Natijalar
            </TabsTrigger>
            <TabsTrigger value="console" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Console
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <div className="w-full space-y-6">
              {/* URL Input Card - Full Width */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Website URL
                  </CardTitle>
                  <CardDescription>
                    Tahlil qilmoqchi bo'lgan website URL manzilini kiriting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 h-12 text-base"
                      disabled={isAnalyzing}
                    />
                    <Button
                      onClick={analyzeWebsite}
                      disabled={isAnalyzing || !url.trim()}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                            {analysis.components?.map((component, index) => (
                              <div
                                key={index}
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
                          🛠️ Texnologiyalar
                        </h4>

                        {analysis.technologies && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">
                              Framework va kutubxonalar:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {analysis.technologies.map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {analysis.meta_info && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">
                              Website ma'lumotlari:
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Title:</span>
                                <span className="font-medium text-right max-w-xs truncate">
                                  {analysis.meta_info.title}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Description:
                                </span>
                                <span className="font-medium text-right max-w-xs truncate">
                                  {analysis.meta_info.description}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
                        {generationResult.components.map((component, index) => (
                          <Card key={index} className="border border-gray-200">
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
