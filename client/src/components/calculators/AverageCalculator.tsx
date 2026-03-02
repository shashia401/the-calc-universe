import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface WeightedEntry {
  id: number;
  value: string;
  weight: string;
}

interface AverageResult {
  average: number;
  count: number;
  sum: number;
  min: number;
  max: number;
  steps: string[];
}

export default function AverageCalculator() {
  const [mode, setMode] = useState("simple");
  const [numbers, setNumbers] = useState("");
  const [weightedEntries, setWeightedEntries] = useState<WeightedEntry[]>([
    { id: 1, value: "", weight: "1" },
    { id: 2, value: "", weight: "1" },
    { id: 3, value: "", weight: "1" },
  ]);
  const [result, setResult] = useState<AverageResult | null>(null);

  let nextId = weightedEntries.length > 0 ? Math.max(...weightedEntries.map((e) => e.id)) + 1 : 1;

  const addWeightedEntry = () => {
    setWeightedEntries([...weightedEntries, { id: nextId, value: "", weight: "1" }]);
  };

  const removeWeightedEntry = (id: number) => {
    if (weightedEntries.length > 2) {
      setWeightedEntries(weightedEntries.filter((e) => e.id !== id));
    }
  };

  const updateWeightedEntry = (id: number, field: "value" | "weight", val: string) => {
    setWeightedEntries(weightedEntries.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  };

  const calculateSimple = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n));

    if (nums.length === 0) return;

    const steps: string[] = [];
    const sum = nums.reduce((a, b) => a + b, 0);
    const average = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);

    steps.push("Simple Average (Arithmetic Mean)");
    steps.push(`Values: ${nums.join(", ")}`);
    steps.push(`Count: ${nums.length}`);
    steps.push("");
    steps.push(`Sum = ${nums.join(" + ")} = ${sum}`);
    steps.push(`Average = ${sum} / ${nums.length} = ${average.toFixed(4)}`);
    steps.push("");
    steps.push(`Min: ${sorted[0]}, Max: ${sorted[sorted.length - 1]}`);
    steps.push(`Range: ${(sorted[sorted.length - 1] - sorted[0]).toFixed(4)}`);

    setResult({
      average,
      count: nums.length,
      sum,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      steps,
    });
  };

  const calculateWeighted = () => {
    const validEntries = weightedEntries
      .map((e) => ({ value: parseFloat(e.value), weight: parseFloat(e.weight) }))
      .filter((e) => !isNaN(e.value) && !isNaN(e.weight) && e.weight > 0);

    if (validEntries.length === 0) return;

    const steps: string[] = [];
    steps.push("Weighted Average");
    steps.push("");

    let weightedSum = 0;
    let totalWeight = 0;
    const values: number[] = [];

    validEntries.forEach((entry, i) => {
      weightedSum += entry.value * entry.weight;
      totalWeight += entry.weight;
      values.push(entry.value);
      steps.push(`Entry ${i + 1}: ${entry.value} x weight ${entry.weight} = ${(entry.value * entry.weight).toFixed(4)}`);
    });

    steps.push("");
    steps.push(`Sum of weighted values: ${weightedSum.toFixed(4)}`);
    steps.push(`Sum of weights: ${totalWeight.toFixed(4)}`);

    const average = weightedSum / totalWeight;
    steps.push(`Weighted Average = ${weightedSum.toFixed(4)} / ${totalWeight.toFixed(4)} = ${average.toFixed(4)}`);

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    setResult({
      average,
      count: validEntries.length,
      sum,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      steps,
    });
  };

  const calculate = () => {
    if (mode === "simple") {
      calculateSimple();
    } else {
      calculateWeighted();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Average Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calculation Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger data-testid="select-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple Average</SelectItem>
                <SelectItem value="weighted">Weighted Average</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "simple" ? (
            <div className="space-y-2">
              <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
              <Input
                id="numbers"
                placeholder="e.g., 85, 90, 78, 92, 88"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                data-testid="input-numbers"
              />
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setNumbers("85, 90, 78, 92, 88")} data-testid="button-example-1">
                  Test Scores
                </Button>
                <Button variant="outline" size="sm" onClick={() => setNumbers("10, 20, 30, 40, 50")} data-testid="button-example-2">
                  Simple Set
                </Button>
                <Button variant="outline" size="sm" onClick={() => setNumbers("3.5, 4.0, 3.8, 3.2, 3.9")} data-testid="button-example-3">
                  GPA Values
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Enter values and their corresponding weights. Higher weights give more influence to that value.
              </p>
              {weightedEntries.map((entry, index) => (
                <div key={entry.id} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Value {index + 1}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Value"
                      value={entry.value}
                      onChange={(e) => updateWeightedEntry(entry.id, "value", e.target.value)}
                      data-testid={`input-value-${entry.id}`}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Weight</Label>
                    <Input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Weight"
                      value={entry.weight}
                      onChange={(e) => updateWeightedEntry(entry.id, "weight", e.target.value)}
                      data-testid={`input-weight-${entry.id}`}
                    />
                  </div>
                  {weightedEntries.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWeightedEntry(entry.id)}
                      data-testid={`button-remove-${entry.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addWeightedEntry} className="w-full" data-testid="button-add-entry">
                <Plus className="h-4 w-4 mr-2" /> Add Entry
              </Button>
            </div>
          )}

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Average
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === "simple" ? "Simple" : "Weighted"} Average
                </p>
                <p className="text-3xl font-bold" data-testid="text-average">
                  {result.average.toFixed(4)}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-lg font-bold" data-testid="text-count">{result.count}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Sum</p>
                  <p className="text-lg font-bold" data-testid="text-sum">{result.sum.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="text-lg font-bold" data-testid="text-min">{result.min}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-lg font-bold" data-testid="text-max">{result.max}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Calculation Steps:</p>
                <div className="text-sm font-mono">
                  {result.steps.map((step, i) => (
                    <div key={i}>{step || <br />}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding Averages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold text-foreground mb-2">Simple Average (Arithmetic Mean)</p>
            <p>The sum of all values divided by the number of values. Each value contributes equally.</p>
            <p className="font-mono mt-2">Average = (x1 + x2 + ... + xn) / n</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold text-foreground mb-2">Weighted Average</p>
            <p>Each value is multiplied by its weight before summing. Useful for grades (where assignments have different point values), portfolio returns, or survey responses.</p>
            <p className="font-mono mt-2">Weighted Avg = (w1*x1 + w2*x2 + ... + wn*xn) / (w1 + w2 + ... + wn)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">When to Use Each</p>
            <p><strong>Simple average:</strong> Equal importance - test scores, daily temperatures</p>
            <p><strong>Weighted average:</strong> Different importance - college GPA (credits vary), investment returns (different amounts invested)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
