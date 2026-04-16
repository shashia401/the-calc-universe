import { useLocation } from "wouter";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { CalculatorCard } from "@/components/CalculatorCard";
import { SEOHead, generateWebsiteSchema } from "@/components/SEOHead";
import { categories, getPopularCalculators, getCalculatorCount, type CalculatorInfo } from "@/lib/calculatorData";
import { ArrowRight, Sparkles, Shield, Clock, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  PageTransition, 
  FadeInWhenVisible, 
  StaggerContainer, 
  StaggerItem,
  AnimatedCounter,
  FloatingElement
} from "@/components/ui/animations";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleCalculatorSelect = (calculator: CalculatorInfo) => {
    setLocation(`/${calculator.categoryId}/${calculator.id}`);
  };

  const popularCalculators = getPopularCalculators();

  return (
    <PageTransition className="min-h-screen">
      <SEOHead
        title="Free Online Calculators"
        description={`The Calc Universe offers ${getCalculatorCount()}+ free online calculators for math, finance, health, conversions, and more. Fast, accurate, and private calculations in your browser.`}
        canonicalUrl="https://thecalcuniverse.com"
        structuredData={generateWebsiteSchema()}
      />
      <Hero onSelectCalculator={handleCalculatorSelect} />

      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <FadeInWhenVisible className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect calculator for any task. Our tools are organized into 6 main categories for easy navigation.
            </p>
          </FadeInWhenVisible>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <CategoryCard
                    category={category}
                    onClick={() => setLocation(`/${category.id}`)}
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <FadeInWhenVisible>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">Most Used</span>
                </div>
                <h2 className="text-3xl font-bold">Popular Calculators</h2>
              </div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/math")}
                  data-testid="button-view-all"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </FadeInWhenVisible>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCalculators.slice(0, 12).map((calculator) => (
              <StaggerItem key={calculator.id}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <CalculatorCard
                    calculator={calculator}
                    onClick={() => handleCalculatorSelect(calculator)}
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-3 h-3 bg-accent/30 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <FadeInWhenVisible className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Choose The Calc Universe?</h2>
            <p className="text-muted-foreground mb-12">
              Trusted by millions of users worldwide for accurate, fast, and free calculations.
            </p>
          </FadeInWhenVisible>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <motion.div 
                className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <FloatingElement duration={4} distance={6}>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center ring-1 ring-blue-500/20">
                    <Calculator className="h-10 w-10 text-blue-500" />
                  </div>
                </FloatingElement>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  <AnimatedCounter value={getCalculatorCount()} duration={1.5} />+
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Calculators</h3>
                <p className="text-sm text-muted-foreground">
                  From basic math to complex financial planning, we have a tool for every calculation.
                </p>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div 
                className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <FloatingElement duration={4.5} distance={6}>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center ring-1 ring-green-500/20">
                    <Shield className="h-10 w-10 text-green-500" />
                  </div>
                </FloatingElement>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  <AnimatedCounter value={100} duration={1.5} />%
                </div>
                <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  All calculations happen in your browser. We never store or transmit your data.
                </p>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div 
                className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <FloatingElement duration={5} distance={6}>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center ring-1 ring-purple-500/20">
                    <Clock className="h-10 w-10 text-purple-500" />
                  </div>
                </FloatingElement>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  24/7
                </div>
                <h3 className="text-lg font-semibold mb-2">Always Available</h3>
                <p className="text-sm text-muted-foreground">
                  Access our calculators anytime, anywhere. No signup or downloads required.
                </p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
