import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function gcdTwoNumbers(a: number, b: number): { gcd: number; steps: string[] } {
  a = Math.abs(a);
  b = Math.abs(b);
  const steps: string[] = [];
  
  if (a < b) [a, b] = [b, a];
  
  steps.push(`Using Euclidean Algorithm:`);
  
  while (b !== 0) {
    const remainder = a % b;
    steps.push(`${a} = ${Math.floor(a / b)} × ${b} + ${remainder}`);
    a = b;
    b = remainder;
  }
  
  steps.push(`GCF = ${a}`);
  
  return { gcd: a, steps };
}

function primeFactorization(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = Math.abs(n);
  
  for (let i = 2; i * i <= num; i++) {
    while (num % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      num = num / i;
    }
  }
  
  if (num > 1) {
    factors.set(num, (factors.get(num) || 0) + 1);
  }
  
  return factors;
}

export default function GCFCalculator() {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<{
    gcf: number;
    euclideanSteps: string[];
    primeFactors: { number: number; factors: string }[];
  } | null>(null);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (nums.length < 2) return;

    const primeFactors: { number: number; factors: string }[] = [];

    nums.forEach((num) => {
      const factors = primeFactorization(num);
      const factorStr = Array.from(factors.entries())
        .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : `${prime}`))
        .join(" × ");
      primeFactors.push({ number: num, factors: factorStr || "1" });
    });

    let gcfResult = nums[0];
    const allSteps: string[] = [];

    for (let i = 1; i < nums.length; i++) {
      const { gcd, steps } = gcdTwoNumbers(gcfResult, nums[i]);
      if (i > 1) {
        allSteps.push(``);
        allSteps.push(`Now finding GCF(${gcfResult}, ${nums[i]}):`);
      }
      allSteps.push(...steps);
      gcfResult = gcd;
    }

    setResult({ gcf: gcfResult, euclideanSteps: allSteps, primeFactors });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Greatest Common Factor (GCF) Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 24, 36, 48"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              data-testid="input-numbers"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate GCF
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Greatest Common Factor</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-gcf">
                  {result.gcf}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Prime Factorizations:</p>
                <div className="grid gap-2">
                  {result.primeFactors.map((pf, i) => (
                    <div key={i} className="p-2 bg-background rounded flex justify-between">
                      <span className="font-semibold">{pf.number}</span>
                      <span className="font-mono">{pf.factors}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Euclidean Algorithm Steps:</p>
                <div className="space-y-1 text-sm font-mono">
                  {result.euclideanSteps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-4 text-sm text-muted-foreground mb-1">Quick examples:</p>
            <Button variant="outline" size="sm" onClick={() => setNumbers("12, 18")}>12, 18</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("24, 36")}>24, 36</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("48, 60, 72")}>48, 60, 72</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("100, 75")}>100, 75</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Greatest Common Factor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is GCF?</h3>
            <p className="text-muted-foreground">
              The Greatest Common Factor (GCF), also called Greatest Common Divisor (GCD), is the 
              largest positive number that divides all given numbers without leaving a remainder.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Methods to Find GCF</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm">1. Euclidean Algorithm (used above):</p>
                <p className="text-sm text-muted-foreground ml-4">
                  Repeatedly divide and take remainder until remainder is 0
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">2. Prime Factorization:</p>
                <p className="text-sm text-muted-foreground ml-4">
                  Find common prime factors with lowest powers
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">3. Listing Factors:</p>
                <p className="text-sm text-muted-foreground ml-4">
                  List all factors of each number, find the largest common one
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: GCF of 48 and 18</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm mb-2">Euclidean Algorithm:</p>
                <div className="text-sm text-muted-foreground space-y-1 font-mono">
                  <p>48 = 2 × 18 + 12</p>
                  <p>18 = 1 × 12 + 6</p>
                  <p>12 = 2 × 6 + 0</p>
                  <p className="font-bold">GCF = 6</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Prime Factorization:</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>48 = 2⁴ × 3</p>
                  <p>18 = 2 × 3²</p>
                  <p>Common: 2¹ × 3¹</p>
                  <p className="font-bold">GCF = 6</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Euclidean Algorithm Explained</h3>
            <p className="text-muted-foreground mb-2">
              This ancient algorithm works by repeatedly applying the division formula:
            </p>
            <p className="font-mono text-center text-primary py-2">
              a = q × b + r
            </p>
            <p className="text-muted-foreground">
              Where a is divided by b, giving quotient q and remainder r. The GCF of a and b equals 
              the GCF of b and r. We repeat until r = 0, and b is our answer.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Relationship with LCM</h3>
            <p className="font-mono text-center text-primary py-2">
              GCF(a, b) × LCM(a, b) = a × b
            </p>
            <p className="text-muted-foreground">
              The product of GCF and LCM equals the product of the original numbers!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Simplifying fractions:</strong> Divide numerator and denominator by GCF</li>
              <li><strong>Cutting materials:</strong> Largest size that fits evenly</li>
              <li><strong>Distributing items:</strong> Largest equal groups possible</li>
              <li><strong>Cryptography:</strong> RSA encryption uses GCF</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
