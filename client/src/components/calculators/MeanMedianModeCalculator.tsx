import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StatResult {
  mean: number;
  median: number;
  mode: number[] | null;
  range: number;
  min: number;
  max: number;
  count: number;
  sum: number;
  sortedData: number[];
  steps: {
    mean: string[];
    median: string[];
    mode: string[];
    range: string[];
  };
}

export default function MeanMedianModeCalculator() {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<StatResult | null>(null);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n));

    if (nums.length === 0) return;

    const sortedData = [...nums].sort((a, b) => a - b);
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const min = sortedData[0];
    const max = sortedData[n - 1];
    const range = max - min;

    const meanSteps = [
      `Mean = Sum of all values ÷ Number of values`,
      `Sum = ${nums.join(" + ")} = ${sum}`,
      `Mean = ${sum} ÷ ${n} = ${mean.toFixed(4)}`,
    ];

    let median: number;
    const medianSteps: string[] = [];
    medianSteps.push(`Sorted data: ${sortedData.join(", ")}`);
    
    if (n % 2 === 0) {
      const mid1 = sortedData[n / 2 - 1];
      const mid2 = sortedData[n / 2];
      median = (mid1 + mid2) / 2;
      medianSteps.push(`Even number of values (${n})`);
      medianSteps.push(`Middle values: ${mid1} and ${mid2}`);
      medianSteps.push(`Median = (${mid1} + ${mid2}) ÷ 2 = ${median}`);
    } else {
      median = sortedData[Math.floor(n / 2)];
      medianSteps.push(`Odd number of values (${n})`);
      medianSteps.push(`Middle position: ${Math.floor(n / 2) + 1}`);
      medianSteps.push(`Median = ${median}`);
    }

    const frequency = new Map<number, number>();
    nums.forEach((num) => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });

    const maxFreq = Math.max(...frequency.values());
    const modeSteps: string[] = [];
    modeSteps.push(`Count occurrences of each value:`);
    
    frequency.forEach((count, value) => {
      modeSteps.push(`  ${value} appears ${count} time${count > 1 ? "s" : ""}`);
    });

    let mode: number[] | null = null;
    if (maxFreq > 1) {
      mode = Array.from(frequency.entries())
        .filter(([_, count]) => count === maxFreq)
        .map(([value, _]) => value);
      modeSteps.push(`Most frequent (${maxFreq} times): ${mode.join(", ")}`);
    } else {
      modeSteps.push(`No mode (all values appear only once)`);
    }

    const rangeSteps = [
      `Range = Maximum - Minimum`,
      `Range = ${max} - ${min} = ${range}`,
    ];

    setResult({
      mean,
      median,
      mode,
      range,
      min,
      max,
      count: n,
      sum,
      sortedData,
      steps: {
        mean: meanSteps,
        median: medianSteps,
        mode: modeSteps,
        range: rangeSteps,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Mean, Median, Mode, Range Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 5, 10, 15, 20, 25, 10"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              data-testid="input-numbers"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Statistics
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Mean</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-mean">
                    {result.mean.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Median</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-median">
                    {result.median.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Mode</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-mode">
                    {result.mode ? result.mode.join(", ") : "None"}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Range</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-range">
                    {result.range.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="p-2 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="font-semibold">{result.count}</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Sum</p>
                  <p className="font-semibold">{result.sum.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="font-semibold">{result.min}</p>
                </div>
                <div className="p-2 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="font-semibold">{result.max}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Mean (Average):</p>
                  {result.steps.mean.map((step, i) => (
                    <p key={i} className="text-sm text-muted-foreground ml-2">{step}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm">Median (Middle Value):</p>
                  {result.steps.median.map((step, i) => (
                    <p key={i} className="text-sm text-muted-foreground ml-2">{step}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm">Mode (Most Frequent):</p>
                  {result.steps.mode.map((step, i) => (
                    <p key={i} className="text-sm text-muted-foreground ml-2">{step}</p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm">Range (Spread):</p>
                  {result.steps.range.map((step, i) => (
                    <p key={i} className="text-sm text-muted-foreground ml-2">{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setNumbers("3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29")}>
              Example 1
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("1, 2, 3, 4, 5")}>
              Simple
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("85, 90, 78, 92, 88")}>
              Test Scores
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Central Tendency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Mean (Average)</h3>
              <p className="text-muted-foreground">
                The mean is the sum of all values divided by the count. It's sensitive to extreme 
                values (outliers).
              </p>
              <p className="font-mono text-primary mt-2">
                Mean = (x₁ + x₂ + ... + xₙ) / n
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Median (Middle Value)</h3>
              <p className="text-muted-foreground">
                The median is the middle value when data is sorted. For even-numbered sets, 
                it's the average of the two middle values. Not affected by outliers.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Example:</strong> For 1, 3, <u>5</u>, 7, 9 → median is 5
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Mode (Most Frequent)</h3>
              <p className="text-muted-foreground">
                The mode is the value that appears most often. A data set can have no mode, 
                one mode, or multiple modes.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Example:</strong> For 2, 3, 3, 5, 7, 3 → mode is 3
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Range (Spread)</h3>
              <p className="text-muted-foreground">
                The range is the difference between the largest and smallest values. 
                It shows how spread out the data is.
              </p>
              <p className="font-mono text-primary mt-2">
                Range = Maximum - Minimum
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">When to Use Each Measure</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Mean:</strong> For symmetric data without outliers (like test scores)</li>
              <li><strong>Median:</strong> For skewed data or when outliers exist (like house prices)</li>
              <li><strong>Mode:</strong> For categorical data or finding most common values</li>
              <li><strong>Range:</strong> Quick measure of data spread</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
