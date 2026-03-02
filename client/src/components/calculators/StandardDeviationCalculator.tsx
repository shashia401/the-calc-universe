import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StatResult {
  mean: number;
  variance: number;
  stdDev: number;
  sampleVariance: number;
  sampleStdDev: number;
  count: number;
  sum: number;
  steps: string[];
}

export default function StandardDeviationCalculator() {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<StatResult | null>(null);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n));

    if (nums.length < 2) return;

    const steps: string[] = [];
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    steps.push(`Data set: ${nums.join(", ")}`);
    steps.push(`Number of values (n): ${n}`);
    steps.push(``);
    steps.push(`Step 1: Calculate the mean (average)`);
    steps.push(`  Sum = ${nums.join(" + ")} = ${sum}`);
    steps.push(`  Mean = ${sum} ÷ ${n} = ${mean.toFixed(4)}`);
    steps.push(``);

    const squaredDiffs = nums.map((x) => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0);

    steps.push(`Step 2: Find squared differences from mean`);
    nums.forEach((x, i) => {
      steps.push(`  (${x} - ${mean.toFixed(4)})² = ${squaredDiffs[i].toFixed(4)}`);
    });
    steps.push(``);
    steps.push(`  Sum of squared differences = ${sumSquaredDiffs.toFixed(4)}`);
    steps.push(``);

    const variance = sumSquaredDiffs / n;
    const stdDev = Math.sqrt(variance);
    const sampleVariance = sumSquaredDiffs / (n - 1);
    const sampleStdDev = Math.sqrt(sampleVariance);

    steps.push(`Step 3: Calculate variance and standard deviation`);
    steps.push(``);
    steps.push(`Population Statistics (divide by n):`);
    steps.push(`  Variance = ${sumSquaredDiffs.toFixed(4)} ÷ ${n} = ${variance.toFixed(4)}`);
    steps.push(`  Standard Deviation = √${variance.toFixed(4)} = ${stdDev.toFixed(4)}`);
    steps.push(``);
    steps.push(`Sample Statistics (divide by n-1):`);
    steps.push(`  Variance = ${sumSquaredDiffs.toFixed(4)} ÷ ${n - 1} = ${sampleVariance.toFixed(4)}`);
    steps.push(`  Standard Deviation = √${sampleVariance.toFixed(4)} = ${sampleStdDev.toFixed(4)}`);

    setResult({
      mean,
      variance,
      stdDev,
      sampleVariance,
      sampleStdDev,
      count: n,
      sum,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Standard Deviation Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 5, 10, 15, 20, 25"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              data-testid="input-numbers"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Standard Deviation
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background rounded">
                  <p className="text-sm text-muted-foreground">Mean</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-mean">
                    {result.mean.toFixed(4)}
                  </p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <p className="text-sm text-muted-foreground">Count</p>
                  <p className="text-2xl font-bold">{result.count}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm text-muted-foreground font-semibold">Population (σ)</p>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Variance</p>
                    <p className="font-mono">{result.variance.toFixed(4)}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Std Dev</p>
                    <p className="font-mono text-primary font-bold" data-testid="text-pop-stddev">
                      {result.stdDev.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm text-muted-foreground font-semibold">Sample (s)</p>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Variance</p>
                    <p className="font-mono">{result.sampleVariance.toFixed(4)}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Std Dev</p>
                    <p className="font-mono text-primary font-bold" data-testid="text-sample-stddev">
                      {result.sampleStdDev.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Calculation:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4 font-mono" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setNumbers("2, 4, 4, 4, 5, 5, 7, 9")}>
              Example 1
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("10, 20, 30, 40, 50")}>
              Example 2
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("85, 90, 78, 92, 88, 76")}>
              Test Scores
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Standard Deviation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Standard Deviation?</h3>
            <p className="text-muted-foreground">
              Standard deviation measures how spread out numbers are from their average (mean). 
              A low standard deviation means data points are close to the mean. A high standard 
              deviation means data is spread out over a wider range.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <div className="text-center py-2">
              <p className="font-mono text-primary">σ = √[Σ(xᵢ - μ)² / N]</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Where:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li><strong>σ</strong> = standard deviation</li>
              <li><strong>xᵢ</strong> = each value in the data set</li>
              <li><strong>μ</strong> = mean (average) of the data</li>
              <li><strong>N</strong> = number of values</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Population vs Sample</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Population (σ)</p>
                <p className="text-sm text-muted-foreground">Divide by N</p>
                <p className="text-sm text-muted-foreground mt-1">Use when you have ALL the data</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Sample (s)</p>
                <p className="text-sm text-muted-foreground">Divide by N-1</p>
                <p className="text-sm text-muted-foreground mt-1">Use when data is a sample</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">The 68-95-99.7 Rule</h3>
            <p className="text-muted-foreground mb-2">
              For normal (bell-shaped) distributions:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>68%</strong> of data falls within 1 standard deviation of the mean</li>
              <li><strong>95%</strong> of data falls within 2 standard deviations</li>
              <li><strong>99.7%</strong> of data falls within 3 standard deviations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Examples</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Test scores:</strong> If mean = 75 and σ = 10, most scores are 65-85</li>
              <li><strong>Quality control:</strong> Acceptable variation in product dimensions</li>
              <li><strong>Weather:</strong> How much temperatures vary from normal</li>
              <li><strong>Finance:</strong> Measuring investment risk/volatility</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
