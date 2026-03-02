import { useState, useEffect, useCallback } from "react";
import {
  getHistory,
  getHistoryByCalculator,
  addToHistory,
  removeFromHistory,
  clearHistory,
  type CalculationRecord,
  type CalculationStep,
} from "@/lib/calculatorHistory";

export function useCalculatorHistory(calculatorId?: string) {
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  const refreshHistory = useCallback(() => {
    if (calculatorId) {
      setHistory(getHistoryByCalculator(calculatorId));
    } else {
      setHistory(getHistory());
    }
  }, [calculatorId]);

  useEffect(() => {
    refreshHistory();

    const handleUpdate = () => refreshHistory();
    window.addEventListener("historyUpdated", handleUpdate);
    return () => window.removeEventListener("historyUpdated", handleUpdate);
  }, [refreshHistory]);

  const saveCalculation = useCallback(
    (data: {
      calculatorName: string;
      categoryId: string;
      inputs: Record<string, string | number>;
      result: string;
      steps?: CalculationStep[];
      formula?: string;
    }) => {
      if (!calculatorId) return;
      addToHistory({
        calculatorId,
        ...data,
      });
    },
    [calculatorId]
  );

  const removeCalculation = useCallback((id: string) => {
    removeFromHistory(id);
  }, []);

  const clearAllHistory = useCallback(() => {
    clearHistory();
  }, []);

  return {
    history,
    saveCalculation,
    removeCalculation,
    clearAllHistory,
  };
}
