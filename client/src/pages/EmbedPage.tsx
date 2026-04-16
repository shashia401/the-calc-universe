import { useRoute } from "wouter";
import { getCalculatorById } from "@/lib/calculatorData";
import { LazyCalculator } from "@/lib/calculatorLoader";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";

export default function EmbedPage() {
  const [, params] = useRoute("/embed/:categoryId/:calculatorId");
  const calculatorId = params?.calculatorId;
  const calculator = calculatorId ? getCalculatorById(calculatorId) : undefined;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("theme");
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (!calculator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Calculator not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-embed="true">
      <SEOHead
        title={`${calculator.name} - Embed`}
        description={calculator.description}
        noindex={true}
      />

      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <LazyCalculator calculatorId={calculatorId || ""} />
        </div>
      </div>

      <div 
        className="sticky bottom-0 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-t py-2 px-4"
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground">Powered by</span>
          <a
            href="https://thecalcuniverse.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
            data-testid="link-powered-by-embed"
          >
            The Calc Universe
          </a>
        </div>
      </div>
    </div>
  );
}
