import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";

export function PercentageCalculator() {
  const [mode, setMode] = useState("basic");
  const { saveCalculation } = useCalculatorHistory("percentage-calculator");
  
  const [basicValue, setBasicValue] = useState("");
  const [basicPercent, setBasicPercent] = useState("");
  const [basicResult, setBasicResult] = useState<number | null>(null);

  const [changeFrom, setChangeFrom] = useState("");
  const [changeTo, setChangeTo] = useState("");
  const [changeResult, setChangeResult] = useState<{ percent: number; isIncrease: boolean } | null>(null);

  const [whatValue, setWhatValue] = useState("");
  const [whatTotal, setWhatTotal] = useState("");
  const [whatResult, setWhatResult] = useState<number | null>(null);

  const calculateBasic = () => {
    const value = parseFloat(basicValue);
    const percent = parseFloat(basicPercent);
    if (!isNaN(value) && !isNaN(percent)) {
      const result = (value * percent) / 100;
      const intermediate = percent * value;
      setBasicResult(result);
      saveCalculation({
        calculatorName: "Percentage Calculator",
        categoryId: "math",
        inputs: { percent: basicPercent, value: basicValue },
        result: `${result.toFixed(2)}`,
        formula: "(Percent × Value) ÷ 100",
        steps: [
          { label: "Step 1", value: `Write down your numbers: ${percent}% of ${value}` },
          { label: "Step 2", value: `Multiply: ${percent} × ${value} = ${intermediate.toFixed(2)}` },
          { label: "Step 3", value: `Divide by 100: ${intermediate.toFixed(2)} ÷ 100 = ${result.toFixed(2)}` },
        ],
      });
    }
  };

  const calculateChange = () => {
    const from = parseFloat(changeFrom);
    const to = parseFloat(changeTo);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const change = ((to - from) / from) * 100;
      const diff = to - from;
      const ratio = diff / from;
      setChangeResult({ percent: Math.abs(change), isIncrease: change >= 0 });
      saveCalculation({
        calculatorName: "Percentage Calculator",
        categoryId: "math",
        inputs: { from: changeFrom, to: changeTo },
        result: `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(2)}%`,
        formula: "((New - Old) ÷ Old) × 100",
        steps: [
          { label: "Step 1", value: `Find the difference: ${to} - ${from} = ${diff.toFixed(2)}` },
          { label: "Step 2", value: `Divide by original: ${diff.toFixed(2)} ÷ ${from} = ${ratio.toFixed(4)}` },
          { label: "Step 3", value: `Multiply by 100: ${ratio.toFixed(4)} × 100 = ${change >= 0 ? "+" : ""}${change.toFixed(2)}% (${change >= 0 ? "increase" : "decrease"})` },
        ],
      });
    }
  };

  const calculateWhat = () => {
    const value = parseFloat(whatValue);
    const total = parseFloat(whatTotal);
    if (!isNaN(value) && !isNaN(total) && total !== 0) {
      const result = (value / total) * 100;
      const ratio = value / total;
      setWhatResult(result);
      saveCalculation({
        calculatorName: "Percentage Calculator",
        categoryId: "math",
        inputs: { value: whatValue, total: whatTotal },
        result: `${result.toFixed(2)}%`,
        formula: "(Part ÷ Whole) × 100",
        steps: [
          { label: "Step 1", value: `Identify the part (${value}) and whole (${total})` },
          { label: "Step 2", value: `Divide: ${value} ÷ ${total} = ${ratio.toFixed(4)}` },
          { label: "Step 3", value: `Multiply by 100: ${ratio.toFixed(4)} × 100 = ${result.toFixed(2)}%` },
        ],
      });
    }
  };

  return (
    <Card data-testid="calculator-percentage">
      <CardContent className="pt-6">
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" data-testid="tab-basic">Basic %</TabsTrigger>
            <TabsTrigger value="change" data-testid="tab-change">% Change</TabsTrigger>
            <TabsTrigger value="what" data-testid="tab-what">What %</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              What is X% of Y?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-percent">Percentage (%)</Label>
                <Input
                  id="basic-percent"
                  type="number"
                  placeholder="e.g., 15"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value)}
                  data-testid="input-basic-percent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basic-value">of Value</Label>
                <Input
                  id="basic-value"
                  type="number"
                  placeholder="e.g., 200"
                  value={basicValue}
                  onChange={(e) => setBasicValue(e.target.value)}
                  data-testid="input-basic-value"
                />
              </div>
            </div>
            <Button onClick={calculateBasic} className="w-full" data-testid="button-calculate-basic">
              Calculate
            </Button>
            {basicResult !== null && (
              <div className="space-y-4" data-testid="result-basic">
                <div className="p-4 rounded-lg bg-accent text-center">
                  <p className="text-sm text-muted-foreground">Result</p>
                  <p className="text-3xl font-bold">{basicResult.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold text-sm mb-2">Step-by-Step Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-background p-2 rounded">Formula: (Percent x Value) / 100</p>
                    <p><span className="font-medium">Step 1:</span> Write down your numbers: {basicPercent}% of {basicValue}</p>
                    <p><span className="font-medium">Step 2:</span> Multiply: {basicPercent} x {basicValue} = {(parseFloat(basicPercent) * parseFloat(basicValue)).toFixed(2)}</p>
                    <p><span className="font-medium">Step 3:</span> Divide by 100: {(parseFloat(basicPercent) * parseFloat(basicValue)).toFixed(2)} / 100 = <strong>{basicResult.toFixed(2)}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="change" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              What is the percentage change from X to Y?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="change-from">From</Label>
                <Input
                  id="change-from"
                  type="number"
                  placeholder="e.g., 100"
                  value={changeFrom}
                  onChange={(e) => setChangeFrom(e.target.value)}
                  data-testid="input-change-from"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="change-to">To</Label>
                <Input
                  id="change-to"
                  type="number"
                  placeholder="e.g., 125"
                  value={changeTo}
                  onChange={(e) => setChangeTo(e.target.value)}
                  data-testid="input-change-to"
                />
              </div>
            </div>
            <Button onClick={calculateChange} className="w-full" data-testid="button-calculate-change">
              Calculate
            </Button>
            {changeResult !== null && (
              <div className="space-y-4" data-testid="result-change">
                <div className="p-4 rounded-lg bg-accent text-center">
                  <p className="text-sm text-muted-foreground">Percentage Change</p>
                  <p className={`text-3xl font-bold ${changeResult.isIncrease ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {changeResult.isIncrease ? "+" : "-"}{changeResult.percent.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold text-sm mb-2">Step-by-Step Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-background p-2 rounded">Formula: ((New - Old) / Old) x 100</p>
                    <p><span className="font-medium">Step 1:</span> Find the difference: {changeTo} - {changeFrom} = {(parseFloat(changeTo) - parseFloat(changeFrom)).toFixed(2)}</p>
                    <p><span className="font-medium">Step 2:</span> Divide by original: {(parseFloat(changeTo) - parseFloat(changeFrom)).toFixed(2)} / {changeFrom} = {((parseFloat(changeTo) - parseFloat(changeFrom)) / parseFloat(changeFrom)).toFixed(4)}</p>
                    <p><span className="font-medium">Step 3:</span> Multiply by 100: <strong>{changeResult.isIncrease ? "+" : "-"}{changeResult.percent.toFixed(2)}%</strong> {changeResult.isIncrease ? "(increase)" : "(decrease)"}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="what" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              X is what percent of Y?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="what-value">Value</Label>
                <Input
                  id="what-value"
                  type="number"
                  placeholder="e.g., 25"
                  value={whatValue}
                  onChange={(e) => setWhatValue(e.target.value)}
                  data-testid="input-what-value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="what-total">Total</Label>
                <Input
                  id="what-total"
                  type="number"
                  placeholder="e.g., 200"
                  value={whatTotal}
                  onChange={(e) => setWhatTotal(e.target.value)}
                  data-testid="input-what-total"
                />
              </div>
            </div>
            <Button onClick={calculateWhat} className="w-full" data-testid="button-calculate-what">
              Calculate
            </Button>
            {whatResult !== null && (
              <div className="space-y-4" data-testid="result-what">
                <div className="p-4 rounded-lg bg-accent text-center">
                  <p className="text-sm text-muted-foreground">Result</p>
                  <p className="text-3xl font-bold">{whatResult.toFixed(2)}%</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold text-sm mb-2">Step-by-Step Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-background p-2 rounded">Formula: (Part / Whole) x 100</p>
                    <p><span className="font-medium">Step 1:</span> Identify the part ({whatValue}) and whole ({whatTotal})</p>
                    <p><span className="font-medium">Step 2:</span> Divide: {whatValue} / {whatTotal} = {(parseFloat(whatValue) / parseFloat(whatTotal)).toFixed(4)}</p>
                    <p><span className="font-medium">Step 3:</span> Multiply by 100: {(parseFloat(whatValue) / parseFloat(whatTotal)).toFixed(4)} x 100 = <strong>{whatResult.toFixed(2)}%</strong></p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
