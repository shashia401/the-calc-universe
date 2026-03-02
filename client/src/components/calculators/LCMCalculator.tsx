import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
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

export default function LCMCalculator() {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<{
    lcm: number;
    steps: string[];
    primeFactors: { number: number; factors: string }[];
  } | null>(null);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (nums.length < 2) return;

    const steps: string[] = [];
    const primeFactors: { number: number; factors: string }[] = [];

    steps.push(`Finding LCM of: ${nums.join(", ")}`);
    steps.push(``);
    steps.push(`Method: Prime Factorization`);
    steps.push(``);
    steps.push(`Step 1: Find prime factorization of each number`);

    const allFactors = new Map<number, number>();

    nums.forEach((num) => {
      const factors = primeFactorization(num);
      const factorStr = Array.from(factors.entries())
        .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : `${prime}`))
        .join(" × ");
      
      primeFactors.push({ number: num, factors: factorStr || "1" });
      steps.push(`  ${num} = ${factorStr || "1"}`);

      factors.forEach((power, prime) => {
        allFactors.set(prime, Math.max(allFactors.get(prime) || 0, power));
      });
    });

    steps.push(``);
    steps.push(`Step 2: Take highest power of each prime factor`);
    
    const factorList: string[] = [];
    let lcmResult = 1;
    
    Array.from(allFactors.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([prime, power]) => {
        const term = power > 1 ? `${prime}^${power}` : `${prime}`;
        factorList.push(term);
        lcmResult *= Math.pow(prime, power);
        steps.push(`  ${prime}: highest power is ${power}`);
      });

    steps.push(``);
    steps.push(`Step 3: Multiply all highest powers together`);
    steps.push(`  LCM = ${factorList.join(" × ")}`);
    steps.push(`  LCM = ${lcmResult}`);

    setResult({ lcm: lcmResult, steps, primeFactors });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Least Common Multiple (LCM) Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 12, 18, 24"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              data-testid="input-numbers"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate LCM
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Least Common Multiple</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-lcm">
                  {result.lcm.toLocaleString()}
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
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4 font-mono" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-4 text-sm text-muted-foreground mb-1">Quick examples:</p>
            <Button variant="outline" size="sm" onClick={() => setNumbers("4, 6")}>4, 6</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("12, 18")}>12, 18</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("3, 5, 7")}>3, 5, 7</Button>
            <Button variant="outline" size="sm" onClick={() => setNumbers("8, 12, 15")}>8, 12, 15</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Least Common Multiple</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is LCM?</h3>
            <p className="text-muted-foreground">
              The Least Common Multiple (LCM) of two or more numbers is the smallest positive number 
              that is divisible by all of them. It's called "least" because it's the smallest number 
              that works.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Methods to Find LCM</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm">1. Prime Factorization Method:</p>
                <p className="text-sm text-muted-foreground ml-4">
                  Find prime factors of each number, then multiply the highest power of each prime.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">2. Using GCD:</p>
                <p className="text-sm text-muted-foreground ml-4 font-mono">
                  LCM(a, b) = |a × b| ÷ GCD(a, b)
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">3. Listing Multiples:</p>
                <p className="text-sm text-muted-foreground ml-4">
                  List multiples of each number until you find the first common one.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: LCM of 12 and 18</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Prime factorization:</strong></p>
              <p className="ml-4">12 = 2² × 3</p>
              <p className="ml-4">18 = 2 × 3²</p>
              <p><strong>Take highest powers:</strong></p>
              <p className="ml-4">2²: highest power of 2</p>
              <p className="ml-4">3²: highest power of 3</p>
              <p><strong>LCM = 2² × 3² = 4 × 9 = 36</strong></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">LCM vs GCF</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">LCM</p>
                <p className="text-sm text-muted-foreground">Smallest number divisible by all</p>
                <p className="text-sm text-muted-foreground mt-1">Uses highest powers</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">GCF (GCD)</p>
                <p className="text-sm text-muted-foreground">Largest number that divides all</p>
                <p className="text-sm text-muted-foreground mt-1">Uses lowest powers</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Adding fractions:</strong> Find common denominator</li>
              <li><strong>Scheduling:</strong> When will two events coincide again?</li>
              <li><strong>Gear ratios:</strong> Finding when gears align</li>
              <li><strong>Tiling:</strong> Finding tile sizes that fit evenly</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Practice Problem</h3>
            <p className="text-muted-foreground">
              Bus A comes every 12 minutes. Bus B comes every 18 minutes. If both buses just arrived, 
              when will they arrive together again?
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Answer:</strong> LCM(12, 18) = 36 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
