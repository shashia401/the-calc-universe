import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Category, getCategoryCalculatorCount } from "@/lib/calculatorData";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const count = getCategoryCalculatorCount(category.id);
  const Icon = category.icon;

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover-elevate"
      onClick={onClick}
      data-testid={`card-category-${category.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`rounded-lg bg-accent p-3`}>
            <Icon className={`h-8 w-8 ${category.color}`} />
          </div>
          <Badge variant="secondary">{count} tools</Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
}
