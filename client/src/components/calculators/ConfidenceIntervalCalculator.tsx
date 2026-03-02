import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfidenceIntervalCalculator() {
  const [mode, setMode] = useState("mean");
  const [sampleMean, setSampleMean] = useState("");
  const [sampleStdDev, setSampleStdDev] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [successes, setSuccesses] = useState("");
  const [result, setResult] = useState<{ lower: number; upper: number; marginError: number; steps: string[] } | null>(null);

  const getZScore = (confidence: string): number => {
    const zScores: Record<string, number> = {
      "90": 1.645,
      "95": 1.96,
      "99": 2.576,
    };
    return zScores[confidence] || 1.96;
  };

  const calculateMean = () => {
    const mean = parseFloat(sampleMean);
    const stdDev = parseFloat(sampleStdDev);
    const n = parseInt(sampleSize);
    const z = getZScore(confidenceLevel);

    if (isNaN(mean) || isNaN(stdDev) || isNaN(n) || n <= 0 || stdDev < 0) return;

    const steps: string[] = [];
    steps.push("Confidence Interval for Population Mean");
    steps.push("Formula: x̄ ± Z × (σ/√n)");
    steps.push("");
    steps.push("Given values:");
    steps.push(`  Sample Mean (x̄) = ${mean}`);
    steps.push(`  Standard Deviation (σ) = ${stdDev}`);
    steps.push(`  Sample Size (n) = ${n}`);
    steps.push(`  Z-score for ${confidenceLevel}% = ${z}`);
    steps.push("");

    const standardError = stdDev / Math.sqrt(n);
    steps.push("Step 1: Calculate Standard Error");
    steps.push(`  SE = σ / √n`);
    steps.push(`  SE = ${stdDev} / √${n}`);
    steps.push(`  SE = ${stdDev} / ${Math.sqrt(n).toFixed(4)}`);
    steps.push(`  SE = ${standardError.toFixed(4)}`);
    steps.push("");

    const marginError = z * standardError;
    steps.push("Step 2: Calculate Margin of Error");
    steps.push(`  ME = Z × SE`);
    steps.push(`  ME = ${z} × ${standardError.toFixed(4)}`);
    steps.push(`  ME = ${marginError.toFixed(4)}`);
    steps.push("");

    const lower = mean - marginError;
    const upper = mean + marginError;
    steps.push("Step 3: Calculate Confidence Interval");
    steps.push(`  Lower bound = x̄ - ME = ${mean} - ${marginError.toFixed(4)} = ${lower.toFixed(4)}`);
    steps.push(`  Upper bound = x̄ + ME = ${mean} + ${marginError.toFixed(4)} = ${upper.toFixed(4)}`);
    steps.push("");
    steps.push(`${confidenceLevel}% Confidence Interval: (${lower.toFixed(4)}, ${upper.toFixed(4)})`);

    setResult({ lower, upper, marginError, steps });
  };

  const calculateProportion = () => {
    const x = parseInt(successes);
    const n = parseInt(sampleSize);
    const z = getZScore(confidenceLevel);

    if (isNaN(x) || isNaN(n) || n <= 0 || x < 0 || x > n) return;

    const steps: string[] = [];
    const p = x / n;

    steps.push("Confidence Interval for Population Proportion");
    steps.push("Formula: p̂ ± Z × √(p̂(1-p̂)/n)");
    steps.push("");
    steps.push("Given values:");
    steps.push(`  Successes (x) = ${x}`);
    steps.push(`  Sample Size (n) = ${n}`);
    steps.push(`  Sample Proportion (p̂) = ${x}/${n} = ${p.toFixed(4)}`);
    steps.push(`  Z-score for ${confidenceLevel}% = ${z}`);
    steps.push("");

    const standardError = Math.sqrt((p * (1 - p)) / n);
    steps.push("Step 1: Calculate Standard Error");
    steps.push(`  SE = √(p̂ × (1-p̂) / n)`);
    steps.push(`  SE = √(${p.toFixed(4)} × ${(1 - p).toFixed(4)} / ${n})`);
    steps.push(`  SE = √(${(p * (1 - p)).toFixed(6)} / ${n})`);
    steps.push(`  SE = ${standardError.toFixed(6)}`);
    steps.push("");

    const marginError = z * standardError;
    steps.push("Step 2: Calculate Margin of Error");
    steps.push(`  ME = Z × SE`);
    steps.push(`  ME = ${z} × ${standardError.toFixed(6)}`);
    steps.push(`  ME = ${marginError.toFixed(6)}`);
    steps.push("");

    const lower = Math.max(0, p - marginError);
    const upper = Math.min(1, p + marginError);
    steps.push("Step 3: Calculate Confidence Interval");
    steps.push(`  Lower bound = p̂ - ME = ${p.toFixed(4)} - ${marginError.toFixed(6)} = ${lower.toFixed(4)}`);
    steps.push(`  Upper bound = p̂ + ME = ${p.toFixed(4)} + ${marginError.toFixed(6)} = ${upper.toFixed(4)}`);
    steps.push("");
    steps.push(`${confidenceLevel}% CI: (${(lower * 100).toFixed(2)}%, ${(upper * 100).toFixed(2)}%)`);

    setResult({ lower, upper, marginError, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Confidence Interval Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mean" data-testid="tab-mean">For Mean</TabsTrigger>
              <TabsTrigger value="proportion" data-testid="tab-proportion">For Proportion</TabsTrigger>
            </TabsList>

            <TabsContent value="mean" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mean">Sample Mean (x̄)</Label>
                  <Input
                    id="mean"
                    type="number"
                    step="any"
                    placeholder="e.g., 75.5"
                    value={sampleMean}
                    onChange={(e) => setSampleMean(e.target.value)}
                    data-testid="input-mean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stddev">Standard Deviation (σ)</Label>
                  <Input
                    id="stddev"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 10"
                    value={sampleStdDev}
                    onChange={(e) => setSampleStdDev(e.target.value)}
                    data-testid="input-stddev"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size-mean">Sample Size (n)</Label>
                  <Input
                    id="size-mean"
                    type="number"
                    min="1"
                    placeholder="e.g., 100"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(e.target.value)}
                    data-testid="input-size-mean"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confidence Level</Label>
                  <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                    <SelectTrigger data-testid="select-confidence-mean">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateMean} className="w-full" data-testid="button-calculate-mean">
                Calculate Confidence Interval
              </Button>
            </TabsContent>

            <TabsContent value="proportion" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="successes">Number of Successes</Label>
                  <Input
                    id="successes"
                    type="number"
                    min="0"
                    placeholder="e.g., 60"
                    value={successes}
                    onChange={(e) => setSuccesses(e.target.value)}
                    data-testid="input-successes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size-prop">Sample Size (n)</Label>
                  <Input
                    id="size-prop"
                    type="number"
                    min="1"
                    placeholder="e.g., 100"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(e.target.value)}
                    data-testid="input-size-prop"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Confidence Level</Label>
                  <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                    <SelectTrigger data-testid="select-confidence-prop">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={calculateProportion} className="w-full" data-testid="button-calculate-prop">
                Calculate Confidence Interval
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{confidenceLevel}% Confidence Interval</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-result">
                  ({result.lower.toFixed(4)}, {result.upper.toFixed(4)})
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Margin of Error: ±{result.marginError.toFixed(4)}
                </p>
              </div>

              <div className="w-full bg-background rounded p-3">
                <div className="relative h-8">
                  <div className="absolute inset-x-0 top-1/2 h-1 bg-muted-foreground/30 -translate-y-1/2" />
                  <div 
                    className="absolute top-1/2 h-3 bg-primary -translate-y-1/2 rounded"
                    style={{
                      left: "20%",
                      right: "20%",
                    }}
                  />
                  <div className="absolute left-[20%] top-0 text-xs">{result.lower.toFixed(2)}</div>
                  <div className="absolute right-[20%] top-0 text-xs">{result.upper.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded max-h-64 overflow-y-auto">
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
          <CardTitle className="text-lg">Understanding Confidence Intervals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>What is it?</strong> A confidence interval is a range where the true population value is likely to fall.</p>
          <p><strong>95% confidence:</strong> If we repeated this study 100 times, about 95 of those intervals would contain the true value.</p>
          <p><strong>Wider vs Narrower:</strong> Higher confidence = wider interval. Larger sample = narrower interval.</p>
          <p><strong>Margin of Error:</strong> The "plus or minus" amount. Smaller is better because it means more precision!</p>
        </CardContent>
      </Card>
    </div>
  );
}
