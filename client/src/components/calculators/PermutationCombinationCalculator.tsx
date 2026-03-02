import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function permutation(n: number, r: number): number {
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): number {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export default function PermutationCombinationCalculator() {
  const [n, setN] = useState("");
  const [r, setR] = useState("");
  const [result, setResult] = useState<{
    permutation: number;
    combination: number;
    steps: { perm: string[]; comb: string[] };
  } | null>(null);

  const calculate = () => {
    const nVal = parseInt(n);
    const rVal = parseInt(r);

    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0 || rVal > nVal) return;

    const perm = permutation(nVal, rVal);
    const comb = combination(nVal, rVal);

    const permSteps = [
      `Permutation: Order matters`,
      `Formula: nPr = n! / (n-r)!`,
      ``,
      `${nVal}P${rVal} = ${nVal}! / (${nVal}-${rVal})!`,
      `= ${nVal}! / ${nVal - rVal}!`,
      `= ${factorial(nVal).toLocaleString()} / ${factorial(nVal - rVal).toLocaleString()}`,
      `= ${perm.toLocaleString()}`,
    ];

    const combSteps = [
      `Combination: Order doesn't matter`,
      `Formula: nCr = n! / (r! × (n-r)!)`,
      ``,
      `${nVal}C${rVal} = ${nVal}! / (${rVal}! × ${nVal - rVal}!)`,
      `= ${factorial(nVal).toLocaleString()} / (${factorial(rVal).toLocaleString()} × ${factorial(nVal - rVal).toLocaleString()})`,
      `= ${factorial(nVal).toLocaleString()} / ${(factorial(rVal) * factorial(nVal - rVal)).toLocaleString()}`,
      `= ${comb.toLocaleString()}`,
    ];

    setResult({
      permutation: perm,
      combination: comb,
      steps: { perm: permSteps, comb: combSteps },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Permutation & Combination Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="n">n (Total Items)</Label>
              <Input
                id="n"
                type="number"
                min="0"
                max="20"
                placeholder="e.g., 10"
                value={n}
                onChange={(e) => setN(e.target.value)}
                data-testid="input-n"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r">r (Items to Choose)</Label>
              <Input
                id="r"
                type="number"
                min="0"
                placeholder="e.g., 3"
                value={r}
                onChange={(e) => setR(e.target.value)}
                data-testid="input-r"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate nPr and nCr
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Permutation ({n}P{r})</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-permutation">
                    {result.permutation.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Order matters</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Combination ({n}C{r})</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-combination">
                    {result.combination.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Order doesn't matter</p>
                </div>
              </div>

              <Tabs defaultValue="perm">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="perm">Permutation Steps</TabsTrigger>
                  <TabsTrigger value="comb">Combination Steps</TabsTrigger>
                </TabsList>
                <TabsContent value="perm" className="p-4 bg-muted rounded-lg mt-2">
                  {result.steps.perm.map((step, i) => (
                    <p key={i} className={`text-sm ${step === "" ? "h-2" : ""}`}>{step}</p>
                  ))}
                </TabsContent>
                <TabsContent value="comb" className="p-4 bg-muted rounded-lg mt-2">
                  {result.steps.comb.map((step, i) => (
                    <p key={i} className={`text-sm ${step === "" ? "h-2" : ""}`}>{step}</p>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setN("5"); setR("3"); }}>
              5P3 / 5C3
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setN("10"); setR("2"); }}>
              10P2 / 10C2
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setN("52"); setR("5"); }}>
              52C5 (Poker)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Permutations & Combinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Permutation (nPr)</h3>
              <p className="text-muted-foreground text-sm">
                Arrangements where <strong>order matters</strong>.
              </p>
              <p className="font-mono text-primary mt-2">nPr = n! / (n-r)!</p>
              <p className="text-sm text-muted-foreground mt-2">
                Example: Arranging 3 books on a shelf from 5 books
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Combination (nCr)</h3>
              <p className="text-muted-foreground text-sm">
                Selections where <strong>order doesn't matter</strong>.
              </p>
              <p className="font-mono text-primary mt-2">nCr = n! / (r!(n-r)!)</p>
              <p className="text-sm text-muted-foreground mt-2">
                Example: Choosing 3 team members from 5 people
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">The Key Difference</h3>
            <p className="text-muted-foreground mb-2">
              Ask yourself: "Does the order of selection matter?"
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Permutation:</strong> ABC is different from ACB (order matters)</li>
              <li><strong>Combination:</strong> ABC is the same as ACB (only the group matters)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Examples</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Permutation Examples:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  <li>Race finishes (1st, 2nd, 3rd)</li>
                  <li>Password combinations</li>
                  <li>Phone numbers</li>
                  <li>Seating arrangements</li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Combination Examples:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  <li>Lottery picks</li>
                  <li>Poker hands</li>
                  <li>Committee selection</li>
                  <li>Pizza toppings</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Factorial (n!)</h3>
            <p className="text-muted-foreground mb-2">
              n! means n × (n-1) × (n-2) × ... × 2 × 1
            </p>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="p-2 bg-muted rounded text-center">0! = 1</div>
              <div className="p-2 bg-muted rounded text-center">1! = 1</div>
              <div className="p-2 bg-muted rounded text-center">5! = 120</div>
              <div className="p-2 bg-muted rounded text-center">10! = 3.6M</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
