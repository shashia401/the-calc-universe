import { SearchBar } from "./SearchBar";
import { type CalculatorInfo, getCalculatorCount, getCategoryCount } from "@/lib/calculatorData";
import { Calculator, Zap, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingElement } from "@/components/ui/animations";

interface HeroProps {
  onSelectCalculator?: (calculator: CalculatorInfo) => void;
}

export function Hero({ onSelectCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10 py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[15%] w-1 h-1 bg-primary/40 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-32 right-[20%] w-1.5 h-1.5 bg-accent/50 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-24 left-[25%] w-1 h-1 bg-primary/30 rounded-full"
          animate={{ y: [0, -25, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 right-[30%] w-2 h-2 bg-accent/40 rounded-full"
          animate={{ y: [0, -18, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div 
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calculator className="h-4 w-4" />
            </motion.div>
            <span>{getCalculatorCount()}+ Free Online Calculators</span>
          </motion.div>

          <motion.h1 
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Calculate{" "}
            <span className="text-primary relative">
              Anything
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-primary/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>,{" "}
            <span className="text-primary relative">
              Anywhere
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-primary/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.7 }}
              />
            </span>
          </motion.h1>

          <motion.p 
            className="mb-8 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your go-to destination for accurate calculations. From basic math to complex
            financial planning, we've got you covered with {getCategoryCount()} categories
            of powerful tools.
          </motion.p>

          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SearchBar variant="hero" onSelectCalculator={onSelectCalculator} />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="flex flex-col items-center gap-2 text-center p-4 rounded-xl hover:bg-card/50 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FloatingElement duration={3} distance={4}>
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 ring-2 ring-green-500/20">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </FloatingElement>
              <span className="font-medium">Instant Results</span>
              <span className="text-sm text-muted-foreground">Real-time calculations</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center gap-2 text-center p-4 rounded-xl hover:bg-card/50 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FloatingElement duration={3.5} distance={4}>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 ring-2 ring-blue-500/20">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </FloatingElement>
              <span className="font-medium">100% Private</span>
              <span className="text-sm text-muted-foreground">No data stored</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center gap-2 text-center p-4 rounded-xl hover:bg-card/50 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FloatingElement duration={4} distance={4}>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 ring-2 ring-purple-500/20">
                  <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </FloatingElement>
              <span className="font-medium">Always Free</span>
              <span className="text-sm text-muted-foreground">No signup required</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
