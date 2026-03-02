import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SampleSizeCalculator() {
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [marginOfError, setMarginOfError] = useState("5");
  const [populationProportion, setPopulationProportion] = useState("50");
  const [populationSize, setPopulationSize] = useState("");
  const [result, setResult] = useState<{ sampleSize: number; adjustedSize: number | null; steps: string[] } | null>(null);

  const getZScore = (confidence: string): number => {
    const zScores: Record<string, number> = {
      "90": 1.645,
      "95": 1.96,
      "99": 2.576,
    };
    return zScores[confidence] || 1.96;
  };

  const calculate = () => {
    const z = getZScore(confidenceLevel);
    const e = parseFloat(marginOfError) / 100;
    const p = parseFloat(populationProportion) / 100;
    const N = populationSize ? parseInt(populationSize) : null;

    if (isNaN(e) || isNaN(p) || e <= 0 || p < 0 || p > 1) return;

    const steps: string[] = [];

    steps.push("Sample Size Formula (infinite population):");
    steps.push("n = (Z² × p × (1-p)) / E²");
    steps.push("");
    steps.push("Where:");
    steps.push(`  Z = ${z} (z-score for ${confidenceLevel}% confidence)`);
    steps.push(`  p = ${p} (expected proportion, ${populationProportion}%)`);
    steps.push(`  E = ${e} (margin of error, ${marginOfError}%)`);
    steps.push("");

    const numerator = z * z * p * (1 - p);
    const denominator = e * e;
    const n0 = numerator / denominator;

    steps.push("Step 1: Calculate Z²");
    steps.push(`  Z² = ${z}² = ${(z * z).toFixed(4)}`);
    steps.push("");
    steps.push("Step 2: Calculate p × (1-p)");
    steps.push(`  ${p} × ${1 - p} = ${(p * (1 - p)).toFixed(4)}`);
    steps.push("");
    steps.push("Step 3: Calculate E²");
    steps.push(`  ${e}² = ${(e * e).toFixed(6)}`);
    steps.push("");
    steps.push("Step 4: Calculate sample size");
    steps.push(`  n = (${(z * z).toFixed(4)} × ${(p * (1 - p)).toFixed(4)}) / ${(e * e).toFixed(6)}`);
    steps.push(`  n = ${numerator.toFixed(4)} / ${denominator.toFixed(6)}`);
    steps.push(`  n = ${n0.toFixed(2)}`);
    steps.push(`  n = ${Math.ceil(n0)} (rounded up)`);

    let adjustedSize: number | null = null;

    if (N && N > 0) {
      steps.push("");
      steps.push("Step 5: Adjust for finite population");
      steps.push(`  Population size N = ${N}`);
      steps.push("  Adjusted formula: n' = n / (1 + (n-1)/N)");
      
      const nAdjusted = n0 / (1 + (n0 - 1) / N);
      adjustedSize = Math.ceil(nAdjusted);
      
      steps.push(`  n' = ${n0.toFixed(2)} / (1 + (${n0.toFixed(2)}-1)/${N})`);
      steps.push(`  n' = ${n0.toFixed(2)} / ${(1 + (n0 - 1) / N).toFixed(4)}`);
      steps.push(`  n' = ${nAdjusted.toFixed(2)}`);
      steps.push(`  n' = ${adjustedSize} (rounded up)`);
    }

    setResult({
      sampleSize: Math.ceil(n0),
      adjustedSize,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sample Size Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Confidence Level</Label>
              <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                <SelectTrigger data-testid="select-confidence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How confident you want to be in your results</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Margin of Error (%)</Label>
              <Input
                id="margin"
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={marginOfError}
                onChange={(e) => setMarginOfError(e.target.value)}
                data-testid="input-margin"
              />
              <p className="text-xs text-muted-foreground">How much error is acceptable (typically 3-5%)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proportion">Expected Proportion (%)</Label>
              <Input
                id="proportion"
                type="number"
                step="1"
                min="1"
                max="99"
                value={populationProportion}
                onChange={(e) => setPopulationProportion(e.target.value)}
                data-testid="input-proportion"
              />
              <p className="text-xs text-muted-foreground">Use 50% if unsure (gives largest sample)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="population">Population Size (optional)</Label>
              <Input
                id="population"
                type="number"
                min="1"
                placeholder="Leave blank for infinite"
                value={populationSize}
                onChange={(e) => setPopulationSize(e.target.value)}
                data-testid="input-population"
              />
              <p className="text-xs text-muted-foreground">Total population being studied</p>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Sample Size
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Required Sample Size</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {result.adjustedSize || result.sampleSize}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.adjustedSize 
                    ? `(Adjusted from ${result.sampleSize} for finite population)` 
                    : "people/responses needed"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-background rounded">
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-semibold">{confidenceLevel}%</p>
                </div>
                <div className="p-2 bg-background rounded">
                  <p className="text-muted-foreground">Margin</p>
                  <p className="font-semibold">±{marginOfError}%</p>
                </div>
                <div className="p-2 bg-background rounded">
                  <p className="text-muted-foreground">Proportion</p>
                  <p className="font-semibold">{populationProportion}%</p>
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
          <CardTitle className="text-lg">Understanding Sample Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>What is sample size?</strong> It's how many people you need to survey to get reliable results that represent a larger group.</p>
          <p><strong>Confidence Level:</strong> How sure you want to be. 95% means if you did the survey 100 times, 95 would give similar results.</p>
          <p><strong>Margin of Error:</strong> The "plus or minus" part. ±5% means your results could be 5% higher or lower.</p>
          <p><strong>Why 50% proportion?</strong> Using 50% gives the largest (safest) sample size when you don't know what to expect.</p>
        </CardContent>
      </Card>
    </div>
  );
}
