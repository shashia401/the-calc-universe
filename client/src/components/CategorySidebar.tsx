import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, ChevronDown } from "lucide-react";
import { categories } from "@/lib/calculatorData";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useActiveCategory } from "@/contexts/ActiveCategoryContext";

export function CategorySidebar() {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const { activeScrollCategory } = useActiveCategory();

  // Get current category from URL (e.g., /math/simple-calculator -> math)
  const currentCategory = location.split("/")[1] || "";
  
  // Check if we're on the all calculators page
  const isAllCalculatorsPage = location === "/calculators";
  
  // List of valid category IDs to check against
  const validCategoryIds = categories.map(c => c.id);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    
    // Scroll to the category section on the page
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const isActive = (path: string) => location === path;
  // Highlight category based on scroll position when on /calculators page, or URL when on specific category pages
  const isCategoryActive = (categoryId: string) => {
    if (isAllCalculatorsPage) {
      return activeScrollCategory === categoryId;
    }
    return validCategoryIds.includes(currentCategory) && currentCategory === categoryId;
  };

  return (
    <aside className="hidden lg:block w-64 border-r bg-muted/30 fixed left-0 top-16 bottom-0 z-30 overflow-hidden print:!hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Calculator Categories
          </h3>
          
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            const isCategoryExpanded = expandedCategories.includes(category.id);
            
            return (
              <Collapsible
                key={category.id}
                open={isCategoryExpanded}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex items-center justify-between w-full p-2 rounded-md text-sm font-medium transition-colors hover-elevate",
                    isCategoryActive(category.id)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  )}
                  data-testid={`sidebar-category-${category.id}`}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className={cn("h-4 w-4", category.color)} />
                    <span>{category.name.replace(" Calculators", "")}</span>
                  </div>
                  {isCategoryExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => {
                    const isSubcategoryExpanded = expandedSubcategories.includes(
                      `${category.id}-${subcategory.id}`
                    );
                    
                    return (
                      <Collapsible
                        key={subcategory.id}
                        open={isSubcategoryExpanded}
                        onOpenChange={() =>
                          toggleSubcategory(`${category.id}-${subcategory.id}`)
                        }
                      >
                        <CollapsibleTrigger
                          className="flex items-center justify-between w-full p-1.5 pl-2 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover-elevate transition-colors"
                          data-testid={`sidebar-subcategory-${subcategory.id}`}
                        >
                          <span>{subcategory.name}</span>
                          {isSubcategoryExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="pl-3 mt-1 space-y-0.5">
                          {subcategory.calculators.map((calc) => (
                            <Link
                              key={calc.id}
                              href={`/${category.id}/${calc.id}`}
                              className={cn(
                                "block py-1 px-2 rounded text-xs transition-colors",
                                isActive(`/${category.id}/${calc.id}`)
                                  ? "bg-primary/15 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                              data-testid={`sidebar-calc-${calc.id}`}
                            >
                              {calc.name.replace(" Calculator", "")}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}

export function MobileCategorySidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);

  // Get current category from URL
  const currentCategory = location.split("/")[1] || "";
  const { activeScrollCategory } = useActiveCategory();
  
  // Check if we're on the all calculators page
  const isAllCalculatorsPage = location === "/calculators";
  
  // List of valid category IDs to check against
  const validCategoryIds = categories.map(c => c.id);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    
    // Scroll to the category section on the page
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const isActive = (path: string) => location === path;
  // Highlight category based on scroll position when on /calculators page, or URL when on specific category pages
  const isCategoryActive = (categoryId: string) => {
    if (isAllCalculatorsPage) {
      return activeScrollCategory === categoryId;
    }
    return validCategoryIds.includes(currentCategory) && currentCategory === categoryId;
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-16 bottom-0 w-72 bg-background border-r z-50 lg:hidden overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Calculator Categories
            </h3>
            
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              const isCategoryExpanded = expandedCategories.includes(category.id);
              
              return (
                <Collapsible
                  key={category.id}
                  open={isCategoryExpanded}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center justify-between w-full p-2 rounded-md text-sm font-medium transition-colors hover-elevate",
                      isCategoryActive(category.id)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"
                    )}
                    data-testid={`mobile-sidebar-category-${category.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={cn("h-4 w-4", category.color)} />
                      <span>{category.name.replace(" Calculators", "")}</span>
                    </div>
                    {isCategoryExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pl-4 mt-1 space-y-1">
                    {category.subcategories.map((subcategory) => {
                      const isSubcategoryExpanded = expandedSubcategories.includes(
                        `${category.id}-${subcategory.id}`
                      );
                      
                      return (
                        <Collapsible
                          key={subcategory.id}
                          open={isSubcategoryExpanded}
                          onOpenChange={() =>
                            toggleSubcategory(`${category.id}-${subcategory.id}`)
                          }
                        >
                          <CollapsibleTrigger
                            className="flex items-center justify-between w-full p-1.5 pl-2 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover-elevate transition-colors"
                            data-testid={`mobile-sidebar-subcategory-${subcategory.id}`}
                          >
                            <span>{subcategory.name}</span>
                            {isSubcategoryExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="pl-3 mt-1 space-y-0.5">
                            {subcategory.calculators.map((calc) => (
                              <Link
                                key={calc.id}
                                href={`/${category.id}/${calc.id}`}
                                onClick={onClose}
                                className={cn(
                                  "block py-1.5 px-2 rounded text-xs transition-colors",
                                  isActive(`/${category.id}/${calc.id}`)
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                data-testid={`mobile-sidebar-calc-${calc.id}`}
                              >
                                {calc.name.replace(" Calculator", "")}
                              </Link>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
