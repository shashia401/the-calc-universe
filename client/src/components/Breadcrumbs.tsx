import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/">
            <button className="flex items-center hover:text-foreground transition-colors" data-testid="breadcrumb-home">
              <Home className="h-4 w-4" />
            </button>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            {item.href ? (
              <Link href={item.href}>
                <button className="hover:text-foreground transition-colors" data-testid={`breadcrumb-${index}`}>
                  {item.label}
                </button>
              </Link>
            ) : (
              <span className="text-foreground font-medium" data-testid={`breadcrumb-${index}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
