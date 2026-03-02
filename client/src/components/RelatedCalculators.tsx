import { CalculatorCard } from "./CalculatorCard";
import { getRelatedCalculators, type CalculatorInfo } from "@/lib/calculatorData";

interface RelatedCalculatorsProps {
  calculatorId: string;
  onSelectCalculator?: (calculator: CalculatorInfo) => void;
  limit?: number;
}

export function RelatedCalculators({ calculatorId, onSelectCalculator, limit = 4 }: RelatedCalculatorsProps) {
  const relatedCalculators = getRelatedCalculators(calculatorId, limit);

  if (relatedCalculators.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-4">Related Calculators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedCalculators.map((calc) => (
          <CalculatorCard
            key={calc.id}
            calculator={calc}
            compact
            onClick={() => onSelectCalculator?.(calc)}
          />
        ))}
      </div>
    </section>
  );
}
