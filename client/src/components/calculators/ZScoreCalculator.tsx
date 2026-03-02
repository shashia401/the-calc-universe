import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ZScoreResult {
  zScore: number;
  percentile: number;
  interpretation: string;
  steps: string[];
}

function normalCDF(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

export default function ZScoreCalculator() {
  const [value, setValue] = useState("");
  const [mean, setMean] = useState("");
  const [stdDev, setStdDev] = useState("");
  const [result, setResult] = useState<ZScoreResult | null>(null);

  const calculate = () => {
    const x = parseFloat(value);
    const mu = parseFloat(mean);
    const sigma = parseFloat(stdDev);

    if (isNaN(x) || isNaN(mu) || isNaN(sigma) || sigma <= 0) return;

    const zScore = (x - mu) / sigma;
    const percentile = normalCDF(zScore) * 100;

    let interpretation: string;
    if (zScore < -2) {
      interpretation = "Very low - significantly below average (bottom ~2.5%)";
    } else if (zScore < -1) {
      interpretation = "Below average (bottom ~16%)";
    } else if (zScore < 0) {
      interpretation = "Slightly below average";
    } else if (zScore === 0) {
      interpretation = "Exactly average";
    } else if (zScore < 1) {
      interpretation = "Slightly above average";
    } else if (zScore < 2) {
      interpretation = "Above average (top ~16%)";
    } else {
      interpretation = "Very high - significantly above average (top ~2.5%)";
    }

    const steps = [
      `Z-Score Formula: z = (x - μ) / σ`,
      ``,
      `Given:`,
      `  x (value) = ${x}`,
      `  μ (mean) = ${mu}`,
      `  σ (standard deviation) = ${sigma}`,
      ``,
      `Calculation:`,
      `  z = (${x} - ${mu}) / ${sigma}`,
      `  z = ${x - mu} / ${sigma}`,
      `  z = ${zScore.toFixed(4)}`,
      ``,
      `This means ${x} is ${Math.abs(zScore).toFixed(2)} standard deviations`,
      `${zScore >= 0 ? 'above' : 'below'} the mean.`,
      ``,
      `Percentile: ${percentile.toFixed(2)}% of values are below ${x}`,
    ];

    setResult({ zScore, percentile, interpretation, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Z-Score Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value (x)</Label>
              <Input
                id="value"
                type="number"
                step="any"
                placeholder="e.g., 85"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                data-testid="input-value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mean">Mean (μ)</Label>
              <Input
                id="mean"
                type="number"
                step="any"
                placeholder="e.g., 75"
                value={mean}
                onChange={(e) => setMean(e.target.value)}
                data-testid="input-mean"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stddev">Std Dev (σ)</Label>
              <Input
                id="stddev"
                type="number"
                step="any"
                min="0"
                placeholder="e.g., 10"
                value={stdDev}
                onChange={(e) => setStdDev(e.target.value)}
                data-testid="input-stddev"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Z-Score
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Z-Score</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-zscore">
                    {result.zScore.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentile</p>
                  <p className="text-3xl font-bold" data-testid="text-percentile">
                    {result.percentile.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${
                Math.abs(result.zScore) < 1 ? 'bg-green-100 dark:bg-green-900' :
                Math.abs(result.zScore) < 2 ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-red-100 dark:bg-red-900'
              }`}>
                <p className="font-semibold">{result.interpretation}</p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setValue("85"); setMean("75"); setStdDev("10"); }}>
              Test Score
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setValue("170"); setMean("175"); setStdDev("7"); }}>
              Height (cm)
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setValue("100"); setMean("100"); setStdDev("15"); }}>
              IQ Score
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Z-Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Z-Score?</h3>
            <p className="text-muted-foreground">
              A z-score (or standard score) tells you how many standard deviations a value is from the mean. 
              It allows you to compare values from different distributions.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <p className="font-mono text-center text-xl text-primary py-2">
              z = (x - μ) / σ
            </p>
            <p className="text-sm text-muted-foreground mt-2">Where:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li><strong>x</strong> = the value you're measuring</li>
              <li><strong>μ</strong> = the population mean</li>
              <li><strong>σ</strong> = the standard deviation</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Interpreting Z-Scores</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded flex justify-between">
                <span>z = 0</span>
                <span className="text-muted-foreground">Exactly at the mean</span>
              </div>
              <div className="p-2 bg-muted rounded flex justify-between">
                <span>z = +1</span>
                <span className="text-muted-foreground">1 std dev above mean (84th percentile)</span>
              </div>
              <div className="p-2 bg-muted rounded flex justify-between">
                <span>z = -1</span>
                <span className="text-muted-foreground">1 std dev below mean (16th percentile)</span>
              </div>
              <div className="p-2 bg-muted rounded flex justify-between">
                <span>z = +2</span>
                <span className="text-muted-foreground">2 std devs above (97.7th percentile)</span>
              </div>
              <div className="p-2 bg-muted rounded flex justify-between">
                <span>z = -2</span>
                <span className="text-muted-foreground">2 std devs below (2.3rd percentile)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Test scores:</strong> Compare performance across different tests</li>
              <li><strong>Medical:</strong> Compare patient measurements to normal ranges</li>
              <li><strong>Quality control:</strong> Identify products outside specifications</li>
              <li><strong>Finance:</strong> Measure investment performance relative to market</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example</h3>
            <p className="text-muted-foreground">
              A student scores 85 on a test. The class average is 75 with a standard deviation of 10.
            </p>
            <p className="text-muted-foreground mt-2">
              z = (85 - 75) / 10 = 1.0
            </p>
            <p className="text-muted-foreground mt-2">
              This means the student scored 1 standard deviation above the mean, putting them 
              in approximately the 84th percentile (better than 84% of students).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
