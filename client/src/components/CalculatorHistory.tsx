import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { History, Trash2, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { formatTimestamp, type CalculationRecord } from "@/lib/calculatorHistory";

interface CalculatorHistoryProps {
  calculatorId?: string;
  showTitle?: boolean;
  maxItems?: number;
  compact?: boolean;
}

export function CalculatorHistory({
  calculatorId,
  showTitle = true,
  maxItems = 10,
  compact = false,
}: CalculatorHistoryProps) {
  const { history, removeCalculation, clearAllHistory } = useCalculatorHistory(calculatorId);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedHistory = isExpanded ? history : history.slice(0, maxItems);
  const hasMore = history.length > maxItems;
  const shouldScroll = history.length > 10;

  if (history.length === 0) {
    return (
      <Card className="mt-6" data-testid="calculator-history-empty">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No calculations saved yet.</p>
            <p className="text-xs mt-1">Your calculation history will appear here as you use this calculator.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatInputs = (inputs: Record<string, string | number>) => {
    return Object.entries(inputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <Card className="mt-6" data-testid="calculator-history">
      {showTitle && (
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Calculations
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-clear-history">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear calculation history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your saved calculations. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllHistory}>Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      )}
      <CardContent className={showTitle ? "" : "pt-4"}>
        {shouldScroll ? (
          <ScrollArea className="max-h-[600px] print:max-h-none print:overflow-visible" data-testid="history-scroll-area">
            <div className="space-y-3 pr-4">
              {displayedHistory.map((record, index) => (
                <HistoryItem
                  key={record.id}
                  record={record}
                  onRemove={removeCalculation}
                  showCalculatorName={!calculatorId}
                  compact={compact}
                  autoExpandSteps={index < 10}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="space-y-3">
            {displayedHistory.map((record, index) => (
              <HistoryItem
                key={record.id}
                record={record}
                onRemove={removeCalculation}
                showCalculatorName={!calculatorId}
                compact={compact}
                autoExpandSteps={index < 10}
              />
            ))}
          </div>
        )}
        {hasMore && !isExpanded && (
          <Button
            variant="ghost"
            className="w-full mt-3"
            onClick={() => setIsExpanded(true)}
            data-testid="button-show-more-history"
          >
            Show {history.length - maxItems} more
          </Button>
        )}
        {isExpanded && hasMore && (
          <Button
            variant="ghost"
            className="w-full mt-3"
            onClick={() => setIsExpanded(false)}
            data-testid="button-show-less-history"
          >
            Show less
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface HistoryItemProps {
  record: CalculationRecord;
  onRemove: (id: string) => void;
  showCalculatorName?: boolean;
  compact?: boolean;
  autoExpandSteps?: boolean;
}

function HistoryItem({ record, onRemove, showCalculatorName, compact, autoExpandSteps = false }: HistoryItemProps) {
  const hasSteps = record.steps && record.steps.length > 0;
  const [isOpen, setIsOpen] = useState(hasSteps && autoExpandSteps);

  return (
    <div
      className="group rounded-lg bg-muted/50 hover-elevate overflow-visible"
      data-testid={`history-item-${record.id}`}
    >
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="flex-1 min-w-0">
          {showCalculatorName && (
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/${record.categoryId}/${record.calculatorId}`}>
                <span className="text-sm font-medium hover:text-primary flex items-center gap-1">
                  {record.calculatorName}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </Link>
            </div>
          )}
          <div className="text-sm text-muted-foreground truncate">
            {formatInputsCompact(record.inputs)}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="font-mono text-xs" data-testid={`text-result-${record.id}`}>
              {record.result}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(record.timestamp)}
            </span>
            {hasSteps && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-xs"
                onClick={() => setIsOpen(!isOpen)}
                data-testid={`button-toggle-steps-${record.id}`}
              >
                {isOpen ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide Steps
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show Steps
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity print:opacity-100"
          onClick={() => onRemove(record.id)}
          data-testid={`button-remove-history-${record.id}`}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {hasSteps && (
        <div 
          className={`px-3 pb-3 ${isOpen ? '' : 'hidden'} print:block`} 
          data-testid={`steps-${record.id}`}
        >
          <div className="p-3 rounded border bg-background text-sm space-y-2">
            {record.formula && (
              <p className="font-mono text-xs bg-muted p-2 rounded" data-testid={`formula-${record.id}`}>
                Formula: {record.formula}
              </p>
            )}
            {record.steps?.map((step, idx) => (
              <p key={idx} className="text-sm" data-testid={`step-${record.id}-${idx}`}>
                <span className="font-medium">{step.label}:</span> {step.value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatInputsCompact(inputs: Record<string, string | number>): string {
  const entries = Object.entries(inputs);
  if (entries.length === 0) return "";
  
  const formatted = entries
    .slice(0, 3)
    .map(([key, value]) => {
      const cleanKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return `${cleanKey}: ${value}`;
    })
    .join(" | ");
  
  if (entries.length > 3) {
    return formatted + ` (+${entries.length - 3} more)`;
  }
  return formatted;
}

export function HistoryPanel() {
  const { history, clearAllHistory } = useCalculatorHistory();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No calculations yet</p>
        <p className="text-sm">Your calculation history will appear here</p>
      </div>
    );
  }

  return (
    <CalculatorHistory
      showTitle={true}
      maxItems={20}
    />
  );
}
