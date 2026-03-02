import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CalculationResult {
  result: number;
  scientificNotation: string;
  steps: string[];
}

export default function ExponentCalculator() {
  const [base, setBase] = useState("");
  const [exponent, setExponent] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    const b = parseFloat(base);
    const e = parseFloat(exponent);

    if (isNaN(b) || isNaN(e)) return;

    const resultValue = Math.pow(b, e);
    const steps: string[] = [];

    if (Number.isInteger(e) && e >= 0 && e <= 10) {
      steps.push(`${b}^${e} means multiplying ${b} by itself ${e} time${e !== 1 ? 's' : ''}`);
      if (e === 0) {
        steps.push(`Any number raised to the power of 0 equals 1`);
        steps.push(`${b}^0 = 1`);
      } else if (e === 1) {
        steps.push(`Any number raised to the power of 1 equals itself`);
        steps.push(`${b}^1 = ${b}`);
      } else {
        const expansion = Array(e).fill(b).join(' × ');
        steps.push(`${b}^${e} = ${expansion}`);
        let running = b;
        for (let i = 1; i < e; i++) {
          running *= b;
          if (i < e - 1) {
            steps.push(`After ${i + 1} multiplications: ${running}`);
          }
        }
        steps.push(`Result: ${resultValue}`);
      }
    } else if (e < 0) {
      steps.push(`A negative exponent means taking the reciprocal`);
      steps.push(`${b}^${e} = 1 / ${b}^${Math.abs(e)}`);
      steps.push(`${b}^${Math.abs(e)} = ${Math.pow(b, Math.abs(e))}`);
      steps.push(`1 / ${Math.pow(b, Math.abs(e))} = ${resultValue}`);
    } else if (!Number.isInteger(e)) {
      steps.push(`A fractional exponent involves roots`);
      if (e === 0.5) {
        steps.push(`${b}^0.5 = √${b} (square root)`);
      } else if (e === 1/3) {
        steps.push(`${b}^(1/3) = ∛${b} (cube root)`);
      } else {
        steps.push(`${b}^${e} can be calculated using logarithms or a calculator`);
      }
      steps.push(`Result: ${resultValue}`);
    } else {
      steps.push(`${b} multiplied by itself ${e} times`);
      steps.push(`Result: ${resultValue}`);
    }

    setResult({
      result: resultValue,
      scientificNotation: resultValue.toExponential(4),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Exponent Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base">Base Number</Label>
              <Input
                id="base"
                type="number"
                step="any"
                placeholder="Enter base"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                data-testid="input-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exponent">Exponent (Power)</Label>
              <Input
                id="exponent"
                type="number"
                step="any"
                placeholder="Enter exponent"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                data-testid="input-exponent"
              />
            </div>
          </div>

          <div className="text-center text-2xl font-mono py-2">
            {base || "a"}<sup>{exponent || "n"}</sup> = ?
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Result</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-result">
                  {Number.isFinite(result.result) 
                    ? (Math.abs(result.result) < 0.0001 || Math.abs(result.result) > 999999 
                        ? result.scientificNotation 
                        : result.result.toLocaleString(undefined, { maximumFractionDigits: 10 }))
                    : "Undefined"}
                </p>
                {Number.isFinite(result.result) && Math.abs(result.result) > 999999 && (
                  <p className="text-muted-foreground text-sm">
                    ({result.result.toLocaleString()})
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {result.steps.map((step, i) => (
                    <p key={i}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Exponents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is an Exponent?</h3>
            <p className="text-muted-foreground">
              An exponent (or power) tells you how many times to multiply a number by itself. 
              In the expression a<sup>n</sup>, "a" is the <strong>base</strong> and "n" is the <strong>exponent</strong>.
            </p>
            <p className="text-muted-foreground mt-2">
              For example, 2<sup>3</sup> means 2 × 2 × 2 = 8
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Basic Formula</h3>
            <div className="text-center py-2">
              <p className="font-mono text-lg text-primary">
                a<sup>n</sup> = a × a × a × ... (n times)
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Laws of Exponents</h3>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></p>
                <p className="text-muted-foreground">Multiplying same bases: add exponents</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m-n</sup></p>
                <p className="text-muted-foreground">Dividing same bases: subtract exponents</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></p>
                <p className="text-muted-foreground">Power of a power: multiply exponents</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">a<sup>0</sup> = 1</p>
                <p className="text-muted-foreground">Any number to the power of 0 equals 1</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">a<sup>-n</sup> = 1/a<sup>n</sup></p>
                <p className="text-muted-foreground">Negative exponent: take the reciprocal</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">a<sup>1/n</sup> = ⁿ√a</p>
                <p className="text-muted-foreground">Fractional exponent: equals the nth root</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Examples</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>5<sup>2</sup> = 25</strong> (5 × 5 = 25, called "5 squared")</p>
              <p><strong>2<sup>4</sup> = 16</strong> (2 × 2 × 2 × 2 = 16)</p>
              <p><strong>10<sup>3</sup> = 1000</strong> (10 × 10 × 10 = 1000, called "10 cubed")</p>
              <p><strong>3<sup>-2</sup> = 1/9</strong> (1 ÷ 3² = 1/9)</p>
              <p><strong>16<sup>0.5</sup> = 4</strong> (square root of 16)</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Special Powers</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Squared (²):</strong> Raised to the power of 2 (e.g., 4² = 16)</li>
              <li><strong>Cubed (³):</strong> Raised to the power of 3 (e.g., 2³ = 8)</li>
              <li><strong>Powers of 10:</strong> Used in scientific notation (e.g., 10⁶ = 1,000,000)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
