import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchCalculators, type CalculatorInfo, getCategoryById, getCalculatorCount } from "@/lib/calculatorData";

interface SearchBarProps {
  variant?: "hero" | "navbar";
  onSelectCalculator?: (calculator: CalculatorInfo) => void;
}

export function SearchBar({ variant = "navbar", onSelectCalculator }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CalculatorInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchCalculators(query).slice(0, 8);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (calculator: CalculatorInfo) => {
    setQuery("");
    setIsOpen(false);
    onSelectCalculator?.(calculator);
  };

  const isHero = variant === "hero";

  return (
    <div className={`relative ${isHero ? "w-full max-w-2xl" : "w-full max-w-md"}`}>
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isHero ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder={`Search ${getCalculatorCount()}+ calculators...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className={`${isHero ? "h-14 pl-12 pr-12 text-lg" : "h-10 pl-10 pr-10"}`}
          data-testid="input-search"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            data-testid="button-clear-search"
          >
            <X className={isHero ? "h-5 w-5" : "h-4 w-4"} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute z-50 mt-2 w-full rounded-lg border bg-popover p-2 shadow-lg"
          data-testid="search-results"
        >
          {results.map((calculator, index) => {
            const category = getCategoryById(calculator.categoryId);
            return (
              <button
                key={calculator.id}
                onClick={() => handleSelect(calculator)}
                className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover-elevate ${
                  index === selectedIndex ? "bg-accent" : ""
                }`}
                data-testid={`search-result-${calculator.id}`}
              >
                {category && <category.icon className={`mt-0.5 h-4 w-4 ${category.color}`} />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{calculator.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {calculator.shortDescription}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
