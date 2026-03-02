import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FactorResult {
  number: number;
  factors: number[];
  factorPairs: [number, number][];
  primeFactors: number[];
  primeFactorization: string;
  isPrime: boolean;
  factorCount: number;
  factorSum: number;
  steps: string[];
}

export default function FactorCalculator() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<FactorResult | null>(null);

  const calculate = () => {
    const num = parseInt(number);
    if (isNaN(num) || num < 1) return;

    const steps: string[] = [];
    const factors: number[] = [];
    const factorPairs: [number, number][] = [];

    steps.push(`Finding all factors of ${num}:`);
    steps.push(``);
    steps.push(`A factor is a number that divides ${num} evenly (no remainder)`);
    steps.push(``);

    for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        factors.push(i);
        const pair = num / i;
        if (pair !== i) {
          factors.push(pair);
        }
        factorPairs.push([i, pair]);
        steps.push(`${num} ÷ ${i} = ${pair} (no remainder) ✓`);
      }
    }

    factors.sort((a, b) => a - b);

    const primeFactors: number[] = [];
    let temp = num;
    let primeStr = "";
    const primeCount = new Map<number, number>();

    for (let i = 2; i <= temp; i++) {
      while (temp % i === 0) {
        primeFactors.push(i);
        primeCount.set(i, (primeCount.get(i) || 0) + 1);
        temp = temp / i;
      }
    }

    primeStr = Array.from(primeCount.entries())
      .map(([prime, count]) => (count > 1 ? `${prime}^${count}` : `${prime}`))
      .join(" × ");

    const isPrime = num > 1 && factors.length === 2;

    steps.push(``);
    steps.push(`Prime factorization: ${primeStr || num}`);
    if (isPrime) {
      steps.push(`${num} is a PRIME number (only divisible by 1 and itself)`);
    }

    setResult({
      number: num,
      factors,
      factorPairs,
      primeFactors,
      primeFactorization: primeStr || String(num),
      isPrime,
      factorCount: factors.length,
      factorSum: factors.reduce((a, b) => a + b, 0),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Factor Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Enter a Positive Integer</Label>
            <Input
              id="number"
              type="number"
              min="1"
              placeholder="e.g., 36"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              data-testid="input-number"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Find Factors
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Factors of {result.number}</p>
                  <p className="text-xl font-bold" data-testid="text-factor-count">
                    {result.factorCount} factors found
                  </p>
                </div>
                {result.isPrime && (
                  <Badge variant="default" className="text-lg">Prime Number</Badge>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">All Factors:</p>
                <div className="flex flex-wrap gap-2" data-testid="text-factors">
                  {result.factors.map((f) => (
                    <span key={f} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Factor Pairs:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {result.factorPairs.map(([a, b], i) => (
                    <div key={i} className="p-2 bg-background rounded text-center text-sm">
                      {a} × {b} = {result.number}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prime Factorization</p>
                  <p className="font-mono font-semibold">{result.primeFactorization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sum of Factors</p>
                  <p className="font-semibold">{result.factorSum}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">How We Found Them:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.includes("✓") ? "font-mono text-green-600 dark:text-green-400" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-4 text-sm text-muted-foreground mb-1">Try these:</p>
            <Button variant="outline" size="sm" onClick={() => setNumber("12")}>12</Button>
            <Button variant="outline" size="sm" onClick={() => setNumber("36")}>36</Button>
            <Button variant="outline" size="sm" onClick={() => setNumber("100")}>100</Button>
            <Button variant="outline" size="sm" onClick={() => setNumber("17")}>17</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Factor?</h3>
            <p className="text-muted-foreground">
              A factor of a number is any integer that divides into it evenly (with no remainder). 
              Every number has at least two factors: 1 and itself.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to Find Factors</h3>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1">
              <li>Start with 1 (always a factor)</li>
              <li>Try dividing by 2, 3, 4, etc.</li>
              <li>If division has no remainder, both the divisor and quotient are factors</li>
              <li>Stop when you reach the square root</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Factors of 24</h3>
            <div className="text-muted-foreground">
              <p>24 ÷ 1 = 24 → factors: 1, 24</p>
              <p>24 ÷ 2 = 12 → factors: 2, 12</p>
              <p>24 ÷ 3 = 8 → factors: 3, 8</p>
              <p>24 ÷ 4 = 6 → factors: 4, 6</p>
              <p className="mt-2"><strong>All factors: 1, 2, 3, 4, 6, 8, 12, 24</strong></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Prime vs Composite Numbers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Prime Numbers</p>
                <p className="text-sm text-muted-foreground">Have exactly 2 factors: 1 and itself</p>
                <p className="text-sm text-muted-foreground mt-1">Examples: 2, 3, 5, 7, 11, 13</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Composite Numbers</p>
                <p className="text-sm text-muted-foreground">Have more than 2 factors</p>
                <p className="text-sm text-muted-foreground mt-1">Examples: 4, 6, 8, 9, 10, 12</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Prime Factorization</h3>
            <p className="text-muted-foreground mb-2">
              Every composite number can be written as a product of prime numbers:
            </p>
            <div className="text-muted-foreground space-y-1">
              <p>12 = 2 × 2 × 3 = 2² × 3</p>
              <p>60 = 2 × 2 × 3 × 5 = 2² × 3 × 5</p>
              <p>100 = 2 × 2 × 5 × 5 = 2² × 5²</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Special Number Types</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Perfect numbers:</strong> Sum of factors (excluding itself) equals the number (e.g., 6: 1+2+3=6)</li>
              <li><strong>Square numbers:</strong> Have an odd number of factors (e.g., 16 has 5 factors)</li>
              <li><strong>Highly composite:</strong> Have more factors than any smaller number</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
