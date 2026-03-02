import { useEffect, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CalculatorCard } from "@/components/CalculatorCard";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import { getCategoryById, categories, type CalculatorInfo, getCategoryCalculatorCount } from "@/lib/calculatorData";
import { Button } from "@/components/ui/button";
import { useActiveCategory } from "@/contexts/ActiveCategoryContext";

export default function CategoryPage() {
  const [, params] = useRoute("/:categoryId");
  const [location, setLocation] = useLocation();
  const categoryId = params?.categoryId;
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingRef = useRef(false);
  const initialScrollDone = useRef(false);
  const { setActiveScrollCategory } = useActiveCategory();
  
  // Check if we're on the calculators page or a specific category
  const isAllCalculatorsPage = location === "/calculators";
  const validCategoryId = isAllCalculatorsPage ? null : categoryId;
  const currentCategory = validCategoryId ? getCategoryById(validCategoryId) : null;
  
  const [activeCategory, setActiveCategory] = useState<string>(validCategoryId || categories[0]?.id || "");

  // Scroll to the selected category only on initial page load
  useEffect(() => {
    if (!initialScrollDone.current && validCategoryId && categoryRefs.current[validCategoryId]) {
      initialScrollDone.current = true;
      isScrollingRef.current = true;
      
      setTimeout(() => {
        categoryRefs.current[validCategoryId]?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }, 100);
    }
  }, [validCategoryId]);

  // Initialize scroll category on page load for /calculators page
  useEffect(() => {
    if (isAllCalculatorsPage && categories.length > 0) {
      setActiveScrollCategory(categories[0].id);
    }
    // Clear the scroll category when leaving the page
    return () => {
      setActiveScrollCategory("");
    };
  }, [isAllCalculatorsPage, setActiveScrollCategory]);

  // Intersection Observer to highlight active category based on scroll
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;

      let topMostId = "";
      let topMostTop = Infinity;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          if (rect.top < topMostTop) {
            topMostTop = rect.top;
            topMostId = entry.target.id;
          }
        }
      });

      if (topMostId) {
        setActiveCategory(topMostId);
        if (isAllCalculatorsPage) {
          setActiveScrollCategory(topMostId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0,
    });

    const timer = requestAnimationFrame(() => {
      Object.values(categoryRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    });

    return () => {
      cancelAnimationFrame(timer);
      observer.disconnect();
    };
  }, [isAllCalculatorsPage, setActiveScrollCategory]);

  // Only show "not found" if we have a specific categoryId that doesn't match any category
  if (validCategoryId && !currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleCalculatorSelect = (calculator: CalculatorInfo) => {
    setLocation(`/${calculator.categoryId}/${calculator.id}`);
  };

  const scrollToCategory = (catId: string) => {
    isScrollingRef.current = true;
    setActiveCategory(catId);
    
    if (categoryRefs.current[catId]) {
      categoryRefs.current[catId]?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
    
    // Reset scrolling flag after animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  const totalCalculators = categories.reduce(
    (sum, cat) => sum + getCategoryCalculatorCount(cat.id), 
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Calculators - ${totalCalculators} Free Tools`}
        description={`Browse ${totalCalculators} free calculators across Math, Health & Fitness, Finance, Conversions, Date & Time, and Education. Fast, accurate calculations in your browser.`}
        canonicalUrl={`https://calchub.com/calculators`}
        structuredData={generateBreadcrumbSchema([
          { name: "Home", url: "https://calchub.com" },
          { name: "Calculators", url: "https://calchub.com/calculators" },
        ])}
      />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Calculators" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Calculators</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse {totalCalculators} free calculators across all categories. Scroll through or use the sidebar to jump to a specific category.
          </p>
        </div>

        <div>
          {/* Main Content - All Categories */}
          <div className="space-y-16">
            {categories.map((category) => {
              const Icon = category.icon;
              const calculatorCount = getCategoryCalculatorCount(category.id);
              
              return (
                <section
                  key={category.id}
                  id={category.id}
                  ref={(el) => { categoryRefs.current[category.id] = el; }}
                  className="scroll-mt-24"
                >
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="rounded-lg bg-accent p-3">
                      <Icon className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
                      <p className="text-muted-foreground text-sm">
                        {category.description} ({calculatorCount} calculators)
                      </p>
                    </div>
                  </div>

                  {/* Subcategories and Calculators */}
                  <div className="space-y-8">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id}>
                        <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                          {subcategory.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subcategory.calculators.map((calculator) => (
                            <CalculatorCard
                              key={calculator.id}
                              calculator={calculator}
                              onClick={() => handleCalculatorSelect(calculator)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider between categories */}
                  <div className="mt-12 border-b border-border" />
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
