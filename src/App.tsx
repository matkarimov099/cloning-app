import { useState } from "react";
import { HomePage } from "./pages/home";
import { WebsiteAnalyzer } from "./features/clones/components/WebsiteAnalyzer";
import { CloneGallery } from "./features/clones/components/CloneGallery";
import { Button } from "./shared/components/ui/button";
import { Home, Search, Grid3X3, Code2, Sparkles } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState<"home" | "analyzer" | "gallery">(
    "home"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "analyzer":
        return <WebsiteAnalyzer />;
      case "gallery":
        return <CloneGallery />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CloneAI
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "home" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("home")}
                className={
                  activeTab === "home"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                <Home className="w-4 h-4 mr-2" />
                Bosh sahifa
              </Button>
              <Button
                variant={activeTab === "analyzer" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("analyzer")}
                className={
                  activeTab === "analyzer"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                <Search className="w-4 h-4 mr-2" />
                Tahlil qilish
              </Button>
              <Button
                variant={activeTab === "gallery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("gallery")}
                className={
                  activeTab === "gallery"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Galereya
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
              <Button variant="ghost" size="sm">
                Docs
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{renderContent()}</main>
    </div>
  );
}

export default App;
