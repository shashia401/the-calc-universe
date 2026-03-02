import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface PythagoreanResult {
  a: number;
  b: number;
  c: number;
  solvedFor: string;
  steps: string[];
  verification: string;
}

export default function PythagoreanTheoremCalculator() {
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [sideC, setSideC] = useState("");
  const [result, setResult] = useState<PythagoreanResult | null>(null);

  const calculate = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    const steps: string[] = [];
    let solvedFor: string;
    let finalA: number, finalB: number, finalC: number;

    steps.push(`Pythagorean Theorem: a² + b² = c²`);
    steps.push(`Where c is the hypotenuse (longest side, opposite the right angle)`);
    steps.push(``);

    if (!isNaN(a) && !isNaN(b) && isNaN(c)) {
      solvedFor = "c (hypotenuse)";
      finalA = a;
      finalB = b;
      finalC = Math.sqrt(a * a + b * b);

      steps.push(`Given: a = ${a}, b = ${b}`);
      steps.push(`Find: c (hypotenuse)`);
      steps.push(``);
      steps.push(`Step 1: Square each leg`);
      steps.push(`  a² = ${a}² = ${a * a}`);
      steps.push(`  b² = ${b}² = ${b * b}`);
      steps.push(``);
      steps.push(`Step 2: Add the squares`);
      steps.push(`  a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}`);
      steps.push(``);
      steps.push(`Step 3: Take the square root`);
      steps.push(`  c = √${a * a + b * b} = ${finalC.toFixed(4)}`);

    } else if (!isNaN(a) && isNaN(b) && !isNaN(c)) {
      if (c <= a) {
        alert("The hypotenuse (c) must be longer than leg (a)");
        return;
      }
      solvedFor = "b (leg)";
      finalA = a;
      finalC = c;
      finalB = Math.sqrt(c * c - a * a);

      steps.push(`Given: a = ${a}, c = ${c} (hypotenuse)`);
      steps.push(`Find: b (leg)`);
      steps.push(``);
      steps.push(`Step 1: Rearrange formula to solve for b`);
      steps.push(`  a² + b² = c²`);
      steps.push(`  b² = c² - a²`);
      steps.push(``);
      steps.push(`Step 2: Calculate`);
      steps.push(`  b² = ${c}² - ${a}² = ${c * c} - ${a * a} = ${c * c - a * a}`);
      steps.push(``);
      steps.push(`Step 3: Take the square root`);
      steps.push(`  b = √${c * c - a * a} = ${finalB.toFixed(4)}`);

    } else if (isNaN(a) && !isNaN(b) && !isNaN(c)) {
      if (c <= b) {
        alert("The hypotenuse (c) must be longer than leg (b)");
        return;
      }
      solvedFor = "a (leg)";
      finalB = b;
      finalC = c;
      finalA = Math.sqrt(c * c - b * b);

      steps.push(`Given: b = ${b}, c = ${c} (hypotenuse)`);
      steps.push(`Find: a (leg)`);
      steps.push(``);
      steps.push(`Step 1: Rearrange formula to solve for a`);
      steps.push(`  a² + b² = c²`);
      steps.push(`  a² = c² - b²`);
      steps.push(``);
      steps.push(`Step 2: Calculate`);
      steps.push(`  a² = ${c}² - ${b}² = ${c * c} - ${b * b} = ${c * c - b * b}`);
      steps.push(``);
      steps.push(`Step 3: Take the square root`);
      steps.push(`  a = √${c * c - b * b} = ${finalA.toFixed(4)}`);

    } else {
      alert("Please enter exactly two values to solve for the third.");
      return;
    }

    const verification = `Verification: ${finalA.toFixed(4)}² + ${finalB.toFixed(4)}² = ${(finalA * finalA).toFixed(4)} + ${(finalB * finalB).toFixed(4)} = ${(finalA * finalA + finalB * finalB).toFixed(4)} ≈ ${finalC.toFixed(4)}² = ${(finalC * finalC).toFixed(4)} ✓`;

    setResult({
      a: finalA,
      b: finalB,
      c: finalC,
      solvedFor,
      steps,
      verification,
    });
  };

  const clearInputs = () => {
    setSideA("");
    setSideB("");
    setSideC("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pythagorean Theorem Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-2xl font-mono font-bold text-primary">a² + b² = c²</p>
            <p className="text-sm text-muted-foreground mt-1">
              Enter any two values to find the third
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sideA">Side a (leg)</Label>
              <Input
                id="sideA"
                type="number"
                step="any"
                min="0"
                placeholder="Enter a"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                data-testid="input-a"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sideB">Side b (leg)</Label>
              <Input
                id="sideB"
                type="number"
                step="any"
                min="0"
                placeholder="Enter b"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                data-testid="input-b"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sideC">Side c (hypotenuse)</Label>
              <Input
                id="sideC"
                type="number"
                step="any"
                min="0"
                placeholder="Enter c"
                value={sideC}
                onChange={(e) => setSideC(e.target.value)}
                data-testid="input-c"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculate} className="flex-1" data-testid="button-calculate">
              Calculate
            </Button>
            <Button onClick={clearInputs} variant="outline">
              Clear
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Solved for {result.solvedFor}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">a</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-a">
                    {result.a.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">b</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-b">
                    {result.b.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">c (hypotenuse)</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-c">
                    {result.c.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-green-100 dark:bg-green-900 rounded text-sm">
                {result.verification}
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setSideA("3"); setSideB("4"); setSideC(""); }}>
              3-4-5 triangle
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSideA("5"); setSideB("12"); setSideC(""); }}>
              5-12-13 triangle
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSideA("8"); setSideB("15"); setSideC(""); }}>
              8-15-17 triangle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding the Pythagorean Theorem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is the Pythagorean Theorem?</h3>
            <p className="text-muted-foreground">
              The Pythagorean theorem states that in a right triangle, the square of the length of 
              the hypotenuse (the side opposite the right angle) equals the sum of the squares of 
              the lengths of the other two sides.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <p className="font-mono text-center text-2xl text-primary py-2">
              a² + b² = c²
            </p>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Where a and b are legs, and c is the hypotenuse
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Finding the Hypotenuse</h3>
            <p className="text-muted-foreground mb-2">
              A right triangle has legs of 3 and 4 units. Find the hypotenuse.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>a² + b² = c²</li>
              <li>3² + 4² = c²</li>
              <li>9 + 16 = c²</li>
              <li>25 = c²</li>
              <li>c = √25 = 5</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Pythagorean Triples</h3>
            <p className="text-muted-foreground mb-2">
              Sets of three positive integers that satisfy a² + b² = c²:
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-muted rounded text-center">3, 4, 5</div>
              <div className="p-2 bg-muted rounded text-center">5, 12, 13</div>
              <div className="p-2 bg-muted rounded text-center">8, 15, 17</div>
              <div className="p-2 bg-muted rounded text-center">7, 24, 25</div>
              <div className="p-2 bg-muted rounded text-center">6, 8, 10</div>
              <div className="p-2 bg-muted rounded text-center">9, 12, 15</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">History</h3>
            <p className="text-muted-foreground">
              Named after the ancient Greek mathematician Pythagoras (c. 570 – c. 495 BC), although 
              the relationship was known to Babylonians and Indians centuries earlier. It's one of 
              the most famous theorems in mathematics with hundreds of different proofs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Construction:</strong> Ensuring walls are perpendicular</li>
              <li><strong>Navigation:</strong> Finding shortest distance</li>
              <li><strong>Architecture:</strong> Calculating roof slopes</li>
              <li><strong>Computer graphics:</strong> Calculating distances between points</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
