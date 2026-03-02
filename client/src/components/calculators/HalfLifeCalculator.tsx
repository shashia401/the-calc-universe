import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalculationResult {
  remaining: number;
  elapsed: number;
  halfLives: number;
  percentRemaining: number;
  steps: string[];
}

export default function HalfLifeCalculator() {
  const [calcType, setCalcType] = useState("remaining");
  const [initialAmount, setInitialAmount] = useState("");
  const [halfLife, setHalfLife] = useState("");
  const [timeElapsed, setTimeElapsed] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    const steps: string[] = [];
    
    if (calcType === "remaining") {
      const N0 = parseFloat(initialAmount);
      const t = parseFloat(timeElapsed);
      const tHalf = parseFloat(halfLife);

      if (isNaN(N0) || isNaN(t) || isNaN(tHalf) || tHalf <= 0) return;

      const halfLives = t / tHalf;
      const remaining = N0 * Math.pow(0.5, halfLives);
      const percentRemaining = (remaining / N0) * 100;

      steps.push(`Formula: N = N₀ × (1/2)^(t/t½)`);
      steps.push(`Where:`);
      steps.push(`  N₀ = Initial amount = ${N0}`);
      steps.push(`  t = Time elapsed = ${t}`);
      steps.push(`  t½ = Half-life = ${tHalf}`);
      steps.push(``);
      steps.push(`Step 1: Calculate number of half-lives`);
      steps.push(`  t/t½ = ${t}/${tHalf} = ${halfLives.toFixed(4)} half-lives`);
      steps.push(``);
      steps.push(`Step 2: Calculate remaining amount`);
      steps.push(`  N = ${N0} × (0.5)^${halfLives.toFixed(4)}`);
      steps.push(`  N = ${N0} × ${Math.pow(0.5, halfLives).toFixed(6)}`);
      steps.push(`  N = ${remaining.toFixed(4)}`);

      setResult({
        remaining,
        elapsed: t,
        halfLives,
        percentRemaining,
        steps,
      });
    } else if (calcType === "halflife") {
      const N0 = parseFloat(initialAmount);
      const N = parseFloat(remainingAmount);
      const t = parseFloat(timeElapsed);

      if (isNaN(N0) || isNaN(N) || isNaN(t) || N <= 0 || N0 <= 0 || N > N0) return;

      const halfLife = -t * Math.log(2) / Math.log(N / N0);
      const halfLives = t / halfLife;

      steps.push(`Formula: t½ = -t × ln(2) / ln(N/N₀)`);
      steps.push(`Where:`);
      steps.push(`  N₀ = Initial amount = ${N0}`);
      steps.push(`  N = Remaining amount = ${N}`);
      steps.push(`  t = Time elapsed = ${t}`);
      steps.push(``);
      steps.push(`Step 1: Calculate the ratio N/N₀`);
      steps.push(`  ${N}/${N0} = ${(N/N0).toFixed(6)}`);
      steps.push(``);
      steps.push(`Step 2: Take natural log`);
      steps.push(`  ln(${(N/N0).toFixed(6)}) = ${Math.log(N/N0).toFixed(6)}`);
      steps.push(``);
      steps.push(`Step 3: Calculate half-life`);
      steps.push(`  t½ = -${t} × ${Math.log(2).toFixed(4)} / ${Math.log(N/N0).toFixed(6)}`);
      steps.push(`  t½ = ${halfLife.toFixed(4)}`);

      setResult({
        remaining: N,
        elapsed: t,
        halfLives,
        percentRemaining: (N / N0) * 100,
        steps,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Half-Life Calculator
            <Badge variant="secondary">Physics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>What do you want to calculate?</Label>
            <Select value={calcType} onValueChange={setCalcType}>
              <SelectTrigger data-testid="select-calc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remaining">Remaining Amount</SelectItem>
                <SelectItem value="halflife">Half-Life</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Amount (N₀)</Label>
              <Input
                id="initial"
                type="number"
                step="any"
                placeholder="e.g., 100"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                data-testid="input-initial"
              />
            </div>
            
            {calcType === "remaining" && (
              <div className="space-y-2">
                <Label htmlFor="halflife">Half-Life (t½)</Label>
                <Input
                  id="halflife"
                  type="number"
                  step="any"
                  placeholder="e.g., 5730 years"
                  value={halfLife}
                  onChange={(e) => setHalfLife(e.target.value)}
                  data-testid="input-halflife"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time">Time Elapsed (t)</Label>
              <Input
                id="time"
                type="number"
                step="any"
                placeholder="e.g., 10000"
                value={timeElapsed}
                onChange={(e) => setTimeElapsed(e.target.value)}
                data-testid="input-time"
              />
            </div>

            {calcType === "halflife" && (
              <div className="space-y-2">
                <Label htmlFor="remaining">Remaining Amount (N)</Label>
                <Input
                  id="remaining"
                  type="number"
                  step="any"
                  placeholder="e.g., 25"
                  value={remainingAmount}
                  onChange={(e) => setRemainingAmount(e.target.value)}
                  data-testid="input-remaining"
                />
              </div>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Amount</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-remaining">
                    {result.remaining.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percent Remaining</p>
                  <p className="text-2xl font-bold" data-testid="text-percent">
                    {result.percentRemaining.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Half-Lives Elapsed</p>
                  <p className="text-2xl font-bold">{result.halfLives.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Decayed</p>
                  <p className="text-2xl font-bold">
                    {(100 - result.percentRemaining).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm font-mono">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Half-Life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Half-Life?</h3>
            <p className="text-muted-foreground">
              Half-life is the time required for a quantity to reduce to half of its initial value. 
              It's most commonly used in nuclear physics to describe radioactive decay, but the concept 
              applies to any process that decreases exponentially.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <div className="text-center py-2">
              <p className="font-mono text-lg text-primary">
                N = N₀ × (1/2)^(t/t½)
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Where:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li><strong>N</strong> = Amount remaining after time t</li>
              <li><strong>N₀</strong> = Initial amount</li>
              <li><strong>t</strong> = Time elapsed</li>
              <li><strong>t½</strong> = Half-life</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Carbon-14 Dating</h3>
            <p className="text-muted-foreground mb-2">
              Carbon-14 has a half-life of about 5,730 years. If a fossil originally had 100 units 
              of Carbon-14, how much would remain after 11,460 years?
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Number of half-lives: 11,460 ÷ 5,730 = 2 half-lives</li>
              <li>After 1st half-life: 100 × 0.5 = 50 units</li>
              <li>After 2nd half-life: 50 × 0.5 = 25 units</li>
              <li>Or using formula: 100 × (0.5)² = 100 × 0.25 = 25 units</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Quick Reference: Amount Remaining</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Half-Lives</th>
                    <th className="p-2 text-right">Remaining</th>
                    <th className="p-2 text-right">Decayed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">0</td><td className="p-2 text-right">100%</td><td className="p-2 text-right">0%</td></tr>
                  <tr className="border-b"><td className="p-2">1</td><td className="p-2 text-right">50%</td><td className="p-2 text-right">50%</td></tr>
                  <tr className="border-b"><td className="p-2">2</td><td className="p-2 text-right">25%</td><td className="p-2 text-right">75%</td></tr>
                  <tr className="border-b"><td className="p-2">3</td><td className="p-2 text-right">12.5%</td><td className="p-2 text-right">87.5%</td></tr>
                  <tr className="border-b"><td className="p-2">4</td><td className="p-2 text-right">6.25%</td><td className="p-2 text-right">93.75%</td></tr>
                  <tr><td className="p-2">5</td><td className="p-2 text-right">3.125%</td><td className="p-2 text-right">96.875%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Applications</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Archaeology:</strong> Carbon-14 dating of ancient artifacts</li>
              <li><strong>Medicine:</strong> Calculating drug dosage and clearance times</li>
              <li><strong>Nuclear power:</strong> Managing radioactive waste</li>
              <li><strong>Geology:</strong> Dating rocks and fossils</li>
              <li><strong>Pharmacology:</strong> Drug elimination from the body</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
