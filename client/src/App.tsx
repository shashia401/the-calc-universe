import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ActiveCategoryProvider } from "@/contexts/ActiveCategoryContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategorySidebar, MobileCategorySidebar } from "@/components/CategorySidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import CalculatorPage from "@/pages/CalculatorPage";
import EmbedPage from "@/pages/EmbedPage";
import TopicPage, { TopicsListPage } from "@/pages/TopicPage";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}

function MainRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calculators" component={CategoryPage} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:postId" component={BlogPost} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/topics" component={TopicsListPage} />
      <Route path="/topics/:topicId" component={TopicPage} />
      <Route path="/:categoryId/:calculatorId" component={CalculatorPage} />
      <Route path="/:categoryId" component={CategoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const isHomePage = location === "/";
  const showSidebar = !isHomePage;

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          {showSidebar && <CategorySidebar />}
          {showSidebar && (
            <MobileCategorySidebar 
              isOpen={mobileSidebarOpen} 
              onClose={() => setMobileSidebarOpen(false)} 
            />
          )}
          <div className={`flex-1 flex flex-col min-w-0 ${showSidebar ? 'lg:ml-64 print:!ml-0' : ''}`}>
            {showSidebar && (
              <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-b bg-muted/30 sticky top-0 z-10 print:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSidebarOpen(true)}
                  data-testid="button-mobile-sidebar"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Browse Categories
                </Button>
              </div>
            )}
            <main className="flex-1">
              <MainRouter />
            </main>
            <Footer />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

function App() {
  const isEmbedRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/embed/");

  if (isEmbedRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Route path="/embed/:categoryId/:calculatorId" component={EmbedPage} />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ActiveCategoryProvider>
            <AppContent />
          </ActiveCategoryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
