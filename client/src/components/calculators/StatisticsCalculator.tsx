import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  variance: number;
  stdDev: number;
  sampleVariance: number;
  sampleStdDev: number;
  q1: number;
  q3: number;
  iqr: number;
  steps: string[];
}

export default function StatisticsCalculator() {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<StatsResult | null>(null);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    if (nums.length === 0) return;

    const steps: string[] = [];
    const n = nums.length;

    steps.push(`Data set (sorted): ${nums.join(", ")}`);
    steps.push(`Number of values: ${n}`);
    steps.push("");

    // Basic stats
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const min = nums[0];
    const max = nums[n - 1];
    const range = max - min;

    steps.push("BASIC STATISTICS");
    steps.push(`Sum = ${nums.join(" + ")} = ${sum}`);
    steps.push(`Mean = ${sum} / ${n} = ${mean.toFixed(4)}`);
    steps.push(`Minimum = ${min}`);
    steps.push(`Maximum = ${max}`);
    steps.push(`Range = ${max} - ${min} = ${range}`);
    steps.push("");

    // Median
    let median: number;
    if (n % 2 === 0) {
      median = (nums[n / 2 - 1] + nums[n / 2]) / 2;
      steps.push(`Median (even count) = (${nums[n / 2 - 1]} + ${nums[n / 2]}) / 2 = ${median}`);
    } else {
      median = nums[Math.floor(n / 2)];
      steps.push(`Median (middle value) = ${median}`);
    }

    // Mode
    const frequency: Record<number, number> = {};
    nums.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFreq && maxFreq > 1)
      .map(([num, _]) => parseFloat(num));

    if (mode.length > 0) {
      steps.push(`Mode = ${mode.join(", ")} (appears ${maxFreq} times)`);
    } else {
      steps.push("Mode = None (no value repeats)");
    }
    steps.push("");

    // Variance and Standard Deviation
    steps.push("VARIANCE & STANDARD DEVIATION");
    const squaredDiffs = nums.map(x => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0);

    steps.push("Squared differences from mean:");
    nums.slice(0, 5).forEach((x, i) => {
      steps.push(`  (${x} - ${mean.toFixed(2)})² = ${squaredDiffs[i].toFixed(4)}`);
    });
    if (n > 5) steps.push("  ...");
    steps.push(`Sum of squared differences = ${sumSquaredDiffs.toFixed(4)}`);
    steps.push("");

    const variance = sumSquaredDiffs / n;
    const stdDev = Math.sqrt(variance);
    const sampleVariance = sumSquaredDiffs / (n - 1);
    const sampleStdDev = Math.sqrt(sampleVariance);

    steps.push("Population Statistics:");
    steps.push(`  Variance (σ²) = ${sumSquaredDiffs.toFixed(4)} / ${n} = ${variance.toFixed(4)}`);
    steps.push(`  Std Dev (σ) = √${variance.toFixed(4)} = ${stdDev.toFixed(4)}`);
    steps.push("");
    steps.push("Sample Statistics:");
    steps.push(`  Variance (s²) = ${sumSquaredDiffs.toFixed(4)} / ${n - 1} = ${sampleVariance.toFixed(4)}`);
    steps.push(`  Std Dev (s) = √${sampleVariance.toFixed(4)} = ${sampleStdDev.toFixed(4)}`);
    steps.push("");

    // Quartiles
    steps.push("QUARTILES");
    const getQuartile = (arr: number[], q: number): number => {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (arr[base + 1] !== undefined) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      }
      return arr[base];
    };

    const q1 = getQuartile(nums, 0.25);
    const q3 = getQuartile(nums, 0.75);
    const iqr = q3 - q1;

    steps.push(`Q1 (25th percentile) = ${q1.toFixed(4)}`);
    steps.push(`Q2 (Median, 50th percentile) = ${median}`);
    steps.push(`Q3 (75th percentile) = ${q3.toFixed(4)}`);
    steps.push(`IQR = Q3 - Q1 = ${q3.toFixed(4)} - ${q1.toFixed(4)} = ${iqr.toFixed(4)}`);

    setResult({
      count: n,
      sum,
      mean,
      median,
      mode,
      range,
      min,
      max,
      variance,
      stdDev,
      sampleVariance,
      sampleStdDev,
      q1,
      q3,
      iqr,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Statistics Calculator
            <Badge variant="secondary">Comprehensive</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Data Set</Label>
            <Input
              id="numbers"
              placeholder="e.g., 12, 15, 18, 22, 25, 28, 30"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              data-testid="input-numbers"
            />
            <p className="text-xs text-muted-foreground">Separate numbers with commas or spaces</p>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate All Statistics
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-xl font-bold">{result.count}</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Sum</p>
                  <p className="text-xl font-bold">{result.sum.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Mean</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-mean">{result.mean.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Median</p>
                  <p className="text-xl font-bold text-primary">{result.median.toFixed(4)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-lg font-bold">
                    {result.mode.length > 0 ? result.mode.join(", ") : "None"}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Range</p>
                  <p className="text-xl font-bold">{result.range.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="text-xl font-bold">{result.min}</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-xl font-bold">{result.max}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-accent/50 rounded">
                  <p className="font-semibold mb-2">Population (σ)</p>
                  <div className="space-y-1 text-sm">
                    <p>Variance: {result.variance.toFixed(4)}</p>
                    <p>Std Dev: <span className="text-primary font-bold">{result.stdDev.toFixed(4)}</span></p>
                  </div>
                </div>
                <div className="p-4 bg-accent/50 rounded">
                  <p className="font-semibold mb-2">Sample (s)</p>
                  <div className="space-y-1 text-sm">
                    <p>Variance: {result.sampleVariance.toFixed(4)}</p>
                    <p>Std Dev: <span className="text-primary font-bold">{result.sampleStdDev.toFixed(4)}</span></p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded">
                <p className="font-semibold mb-2">Quartiles & IQR</p>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Q1</p>
                    <p className="font-bold">{result.q1.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Q2</p>
                    <p className="font-bold">{result.median.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Q3</p>
                    <p className="font-bold">{result.q3.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IQR</p>
                    <p className="font-bold">{result.iqr.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step Calculations:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded max-h-64 overflow-y-auto">
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
          <CardTitle className="text-lg">Statistics Terms Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mean:</strong> The average - add all numbers and divide by how many there are.</p>
          <p><strong>Median:</strong> The middle number when sorted. If there are two middle numbers, take their average.</p>
          <p><strong>Mode:</strong> The number that appears most often. There can be no mode, one mode, or multiple modes.</p>
          <p><strong>Standard Deviation:</strong> How spread out the numbers are. Low = numbers are close together.</p>
          <p><strong>Quartiles:</strong> Q1, Q2, Q3 divide your data into four equal parts.</p>
          <p><strong>IQR:</strong> Interquartile Range (Q3-Q1) - the middle 50% of your data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
