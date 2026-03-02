import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Menu, X, ChevronDown, ChevronRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { categories, getCategoryCalculatorCount, type CalculatorInfo } from "@/lib/calculatorData";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCalculatorSelect = (calculator: CalculatorInfo) => {
    const path = `/${calculator.categoryId}/${calculator.id}`;
    setLocation(path);
    onNavigate?.(path);
  };

  const handleNavClick = (path: string) => {
    setLocation(path);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    onNavigate?.(path);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 print:hidden ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-lg shadow-sm border-border/50" 
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <motion.a 
              href="/"
              onClick={(e) => { e.preventDefault(); handleNavClick("/"); }}
              className="flex items-center gap-2 cursor-pointer" 
              data-testid="link-home"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Calculator className="h-7 w-7 text-primary" />
              </motion.div>
              <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">The Calc Universe</span>
            </motion.a>

            <nav className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="gap-1"
                  data-testid="button-calculators-menu"
                  onClick={() => handleNavClick("/calculators")}
                >
                  Calculators
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
                </Button>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div 
                      className="absolute left-0 top-full pt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-[800px] rounded-xl border bg-popover/95 backdrop-blur-lg p-6 shadow-xl" data-testid="mega-menu">
                        <div className="grid grid-cols-3 gap-6">
                          {categories.map((category, index) => (
                            <motion.div 
                              key={category.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <button
                                onClick={() => handleNavClick(`/${category.id}`)}
                                className="flex items-center gap-2 mb-3 hover:text-primary transition-colors"
                                data-testid={`menu-category-${category.id}`}
                              >
                                <category.icon className={`h-5 w-5 ${category.color}`} />
                                <span className="font-semibold">{category.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({getCategoryCalculatorCount(category.id)})
                                </span>
                              </button>
                              <ul className="space-y-1">
                                {category.subcategories.slice(0, 1).map((sub) =>
                                  sub.calculators.slice(0, 3).map((calc) => (
                                    <li key={calc.id}>
                                      <button
                                        onClick={() => handleNavClick(`/${category.id}/${calc.id}`)}
                                        className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all"
                                        data-testid={`menu-calc-${calc.id}`}
                                      >
                                        {calc.name}
                                      </button>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button variant="ghost" onClick={() => handleNavClick("/about")} data-testid="link-about">
                About
              </Button>
              <Button variant="ghost" onClick={() => handleNavClick("/blog")} data-testid="link-blog">
                Blog
              </Button>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <SearchBar onSelectCalculator={handleCalculatorSelect} />
            <ThemeToggle />
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden border-t bg-background/95 backdrop-blur-lg" 
            data-testid="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <ScrollArea className="h-full">
              <div className="px-4 py-4 space-y-4">
                <SearchBar onSelectCalculator={(calc) => { handleCalculatorSelect(calc); setIsMobileMenuOpen(false); }} />
                
                <nav className="space-y-1">
                  {categories.map((category, index) => {
                    const isExpanded = expandedMobileCategories.includes(category.id);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.04 }}
                      >
                        <button
                          onClick={() => {
                            setExpandedMobileCategories((prev) =>
                              prev.includes(category.id)
                                ? prev.filter((id) => id !== category.id)
                                : [...prev, category.id]
                            );
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 hover-elevate"
                          data-testid={`mobile-category-${category.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className={`h-5 w-5 ${category.color}`} />
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({getCategoryCalculatorCount(category.id)})
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-2 space-y-1">
                                {category.subcategories.map((sub) => (
                                  <div key={sub.id}>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1.5 mt-1">
                                      {sub.name}
                                    </p>
                                    {sub.calculators.map((calc) => (
                                      <button
                                        key={calc.id}
                                        onClick={() => handleNavClick(`/${category.id}/${calc.id}`)}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover-elevate"
                                        data-testid={`mobile-calc-${calc.id}`}
                                      >
                                        {calc.name}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  
                  <div className="border-t pt-2 mt-2">
                    <motion.button
                      onClick={() => handleNavClick("/about")}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover-elevate"
                      data-testid="mobile-link-about"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      About
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick("/blog")}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover-elevate"
                      data-testid="mobile-link-blog"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.35 }}
                    >
                      Blog
                    </motion.button>
                  </div>
                </nav>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
