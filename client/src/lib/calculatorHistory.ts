export interface CalculationStep {
  label: string;
  value: string;
  formula?: string;
}

export interface CalculationRecord {
  id: string;
  calculatorId: string;
  calculatorName: string;
  categoryId: string;
  inputs: Record<string, string | number>;
  result: string;
  steps?: CalculationStep[];
  formula?: string;
  timestamp: number;
}

const HISTORY_KEY = "calc_universe_history";
const MAX_HISTORY_ITEMS = 50;

export function getHistory(): CalculationRecord[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToHistory(record: Omit<CalculationRecord, "id" | "timestamp">): void {
  try {
    const history = getHistory();
    const newRecord: CalculationRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const updatedHistory = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    window.dispatchEvent(new CustomEvent("historyUpdated"));
  } catch {
    console.warn("Failed to save calculation to history");
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent("historyUpdated"));
  } catch {
    console.warn("Failed to clear history");
  }
}

export function removeFromHistory(id: string): void {
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("historyUpdated"));
  } catch {
    console.warn("Failed to remove item from history");
  }
}

export function getHistoryByCalculator(calculatorId: string): CalculationRecord[] {
  return getHistory().filter((item) => item.calculatorId === calculatorId);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
