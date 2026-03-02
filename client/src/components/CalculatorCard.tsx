import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type CalculatorInfo, getCategoryById } from "@/lib/calculatorData";

interface CalculatorCardProps {
  calculator: CalculatorInfo;
  onClick?: () => void;
  compact?: boolean;
}

export function CalculatorCard({ calculator, onClick, compact = false }: CalculatorCardProps) {
  const category = getCategoryById(calculator.categoryId);
  const Icon = category?.icon;

  if (compact) {
    return (
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-md hover-elevate"
        onClick={onClick}
        data-testid={`card-calc-${calculator.id}`}
      >
        <CardContent className="p-4 flex items-center gap-3">
          {Icon && <Icon className={`h-5 w-5 ${category?.color}`} />}
          <span className="font-medium text-sm">{calculator.name}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover-elevate"
      onClick={onClick}
      data-testid={`card-calc-${calculator.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          {Icon && (
            <div className={`rounded-lg bg-accent p-2`}>
              <Icon className={`h-5 w-5 ${category?.color}`} />
            </div>
          )}
          <div className="flex gap-1 flex-wrap">
            {calculator.popular && (
              <Badge variant="default" className="text-xs">Popular</Badge>
            )}
            {calculator.new && (
              <Badge variant="secondary" className="text-xs">New</Badge>
            )}
          </div>
        </div>
        <h3 className="font-semibold mb-1">{calculator.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {calculator.shortDescription}
        </p>
      </CardContent>
    </Card>
  );
}
