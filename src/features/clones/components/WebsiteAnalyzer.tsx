import { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Separator } from "../../../shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/ui/tabs";
import {
  Loader2,
  Globe,
  Code,
  Palette,
  Layout,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  Cpu,
  Monitor,
  Settings,
  ArrowRight,
  FileCode,
  Image,
  Layers,
  Brain,
} from "lucide-react";
import { AIWebsiteAnalyzer } from "../services/ai-analyzer";
import { ComponentGenerator } from "../services/component-generator";
import { DevelopmentConsole } from "./DevelopmentConsole";
import type {
  WebsiteAnalysis,
  GenerationOptions,
  GenerationResult,
} from "../types";

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
  type: "info" | "warning" | "error" | "success";
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

  const [options] = useState<GenerationOptions>({
    framework: "react",
    styling: "tailwind",
    typescript: true,
    responsive: true,
    accessibility: true,
    optimization: true,
    componentLibrary: "shadcn",
  });

  const analyzer = new AIWebsiteAnalyzer();
  const generator = new ComponentGenerator();

  // Log funksiyasi
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

  // Step update funksiyasi
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
    setCurrentStep(0);
    clearLogs();

    // Reset steps
    setSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" as const }))
    );

    try {
      addLog("info", `Website tahlili boshlandi: ${url}`);

      // Step 1: Fetch
      setCurrentStep(0);
      updateStep(0, "loading");
      addLog("info", "Website content va screenshot yuklanmoqda...");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateStep(0, "completed", 2.1);
      addLog("success", "Website content muvaffaqiyatli yuklandi");

      // Step 2: Analyze
      setCurrentStep(1);
      updateStep(1, "loading");
      addLog("info", "AI tahlil boshlandi...");

      const websiteAnalysis = await analyzer.analyzeWebsite(url);
      setAnalysis(websiteAnalysis);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      updateStep(1, "completed", 3.2);
      addLog(
        "success",
        `${websiteAnalysis.components.length} ta komponent aniqlandi`
      );

      // Step 3: Extract
      setCurrentStep(2);
      updateStep(2, "loading");
      addLog("info", "Komponentlar ajratilmoqda...");

      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateStep(2, "completed", 1.7);
      addLog("success", "Komponentlar muvaffaqiyatli ajratildi");

      // Step 4: Generate
      setCurrentStep(3);
      updateStep(3, "loading");
      addLog("info", "React komponentlar yaratilmoqda...");

      const result = await generator.generateComponents(
        websiteAnalysis,
        options
      );
      setGenerationResult(result);

      await new Promise((resolve) => setTimeout(resolve, 2500));
      updateStep(3, "completed", 2.8);
      addLog(
        "success",
        `${result.components.length} ta React komponent yaratildi`
      );

      // Step 5: Style
      setCurrentStep(4);
      updateStep(4, "loading");
      addLog("info", "Dizayn sistemi yaratilmoqda...");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateStep(4, "completed", 1.2);
      addLog("success", "Dizayn sistemi tayyor");

      addLog("success", "Website tahlili muvaffaqiyatli yakunlandi!");
      setActiveTab("results");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Noma'lum xato";
      updateStep(currentStep, "error");
      addLog("error", "Tahlil jarayonida xato yuz berdi", errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStepIcon = (step: AnalysisStep, index: number) => {
    if (step.status === "loading") {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
    }
    if (step.status === "completed") {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (step.status === "error") {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    return (
      <div
        className={`w-4 h-4 ${
          index <= currentStep ? "text-blue-600" : "text-gray-400"
        }`}
      >
        {step.icon}
      </div>
    );
  };

  const getLogIcon = (type: AnalysisLog["type"]) => {
    switch (type) {
      case "success":
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              AI Website Analyzer
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Website ni React komponentlarga aylantiring
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har qanday website URL ni kiritib, AI yordamida uning barcha
            komponentlarini avtomatik React TSX formatida oling
          </p>
        </div>

        {/* URL Input */}
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
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-lg"
                  disabled={isAnalyzing}
                />
              </div>
              <Button
                onClick={analyzeWebsite}
                disabled={isAnalyzing || !url.trim()}
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Tahlil qilinmoqda...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Tahlil boshlash
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger
              value="analyzer"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Tahlil jarayoni
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!analysis}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <FileCode className="w-4 h-4 mr-2" />
              Natijalar
            </TabsTrigger>
            <TabsTrigger
              value="console"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Console
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Steps */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    Tahlil bosqichlari
                  </CardTitle>
                  <CardDescription>
                    Website tahlilining har bir bosqichi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        step.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : step.status === "loading"
                          ? "bg-blue-50 border-blue-200"
                          : step.status === "error"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="mt-0.5">{getStepIcon(step, index)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {step.title}
                          </h4>
                          {step.status === "completed" && step.duration && (
                            <Badge variant="secondary" className="text-xs">
                              {step.duration}s
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                      {step.status === "loading" && (
                        <div className="mt-1">
                          <div className="w-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-blue-600 animate-pulse rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Logs */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-blue-600" />
                        Live loglar
                      </CardTitle>
                      <CardDescription>
                        Tahlil jarayonining batafsil loglari
                      </CardDescription>
                    </div>
                    {logs.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearLogs}>
                        Tozalash
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Loglar bu yerda ko'rsatiladi</p>
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {log.message}
                              </span>
                              <span className="text-xs text-gray-500">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            {log.details && (
                              <pre className="text-xs text-gray-600 mt-1 font-mono">
                                {typeof log.details === "string"
                                  ? log.details
                                  : JSON.stringify(log.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {analysis ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Analysis Results */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-600" />
                      Tahlil natijalari
                    </CardTitle>
                    <CardDescription>
                      Aniqlangan komponentlar va strukturalar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysis.components.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Komponentlar
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analysis.pages?.length || 1}
                        </div>
                        <div className="text-sm text-gray-600">Sahifalar</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Aniqlangan komponentlar:
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {analysis.components.map((component) => (
                          <div
                            key={component.name}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                {component.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {component.type}
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {component.complexity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Components */}
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
                    {generationResult ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {generationResult.components.length} ta komponent
                            yaratildi
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Copy className="w-4 h-4 mr-2" />
                              Nusxalash
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Yuklash
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {generationResult.components.map((component) => (
                            <div
                              key={component.name}
                              className="p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {component.name}.tsx
                                </span>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                              <pre className="text-xs text-gray-600 font-mono overflow-x-auto">
                                {component.code.slice(0, 150)}...
                              </pre>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Komponentlar hali yaratilmagan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
