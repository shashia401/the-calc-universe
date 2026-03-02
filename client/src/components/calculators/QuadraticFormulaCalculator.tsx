import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface QuadraticResult {
  discriminant: number;
  x1: { real: number; imaginary: number };
  x2: { real: number; imaginary: number };
  rootType: "two-real" | "one-real" | "complex";
  vertex: { x: number; y: number };
  steps: string[];
}

export default function QuadraticFormulaCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<QuadraticResult | null>(null);

  const calculate = () => {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || aVal === 0) return;

    const steps: string[] = [];
    const discriminant = bVal * bVal - 4 * aVal * cVal;

    steps.push(`Given equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`);
    steps.push(``);
    steps.push(`Step 1: Identify coefficients`);
    steps.push(`  a = ${aVal}, b = ${bVal}, c = ${cVal}`);
    steps.push(``);
    steps.push(`Step 2: Calculate the discriminant (b² - 4ac)`);
    steps.push(`  D = (${bVal})² - 4(${aVal})(${cVal})`);
    steps.push(`  D = ${bVal * bVal} - ${4 * aVal * cVal}`);
    steps.push(`  D = ${discriminant}`);
    steps.push(``);

    let x1: { real: number; imaginary: number };
    let x2: { real: number; imaginary: number };
    let rootType: "two-real" | "one-real" | "complex";

    if (discriminant > 0) {
      rootType = "two-real";
      const sqrtD = Math.sqrt(discriminant);
      x1 = { real: (-bVal + sqrtD) / (2 * aVal), imaginary: 0 };
      x2 = { real: (-bVal - sqrtD) / (2 * aVal), imaginary: 0 };

      steps.push(`Step 3: Since D > 0, there are two distinct real roots`);
      steps.push(`  √D = √${discriminant} = ${sqrtD.toFixed(4)}`);
      steps.push(``);
      steps.push(`Step 4: Apply the quadratic formula: x = (-b ± √D) / (2a)`);
      steps.push(`  x₁ = (-${bVal} + ${sqrtD.toFixed(4)}) / (2 × ${aVal})`);
      steps.push(`  x₁ = ${(-bVal + sqrtD).toFixed(4)} / ${2 * aVal}`);
      steps.push(`  x₁ = ${x1.real.toFixed(4)}`);
      steps.push(``);
      steps.push(`  x₂ = (-${bVal} - ${sqrtD.toFixed(4)}) / (2 × ${aVal})`);
      steps.push(`  x₂ = ${(-bVal - sqrtD).toFixed(4)} / ${2 * aVal}`);
      steps.push(`  x₂ = ${x2.real.toFixed(4)}`);
    } else if (discriminant === 0) {
      rootType = "one-real";
      x1 = { real: -bVal / (2 * aVal), imaginary: 0 };
      x2 = x1;

      steps.push(`Step 3: Since D = 0, there is exactly one real root (a double root)`);
      steps.push(``);
      steps.push(`Step 4: Apply the quadratic formula: x = -b / (2a)`);
      steps.push(`  x = -${bVal} / (2 × ${aVal})`);
      steps.push(`  x = ${-bVal} / ${2 * aVal}`);
      steps.push(`  x = ${x1.real.toFixed(4)}`);
    } else {
      rootType = "complex";
      const realPart = -bVal / (2 * aVal);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * aVal);
      x1 = { real: realPart, imaginary: imaginaryPart };
      x2 = { real: realPart, imaginary: -imaginaryPart };

      steps.push(`Step 3: Since D < 0, there are two complex (imaginary) roots`);
      steps.push(`  √D = √(${discriminant}) = ${Math.sqrt(-discriminant).toFixed(4)}i`);
      steps.push(``);
      steps.push(`Step 4: Apply the quadratic formula for complex roots`);
      steps.push(`  Real part: -b/(2a) = -${bVal}/(2×${aVal}) = ${realPart.toFixed(4)}`);
      steps.push(`  Imaginary part: √|D|/(2a) = ${Math.sqrt(-discriminant).toFixed(4)}/${2 * aVal} = ${imaginaryPart.toFixed(4)}`);
      steps.push(``);
      steps.push(`  x₁ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`);
      steps.push(`  x₂ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`);
    }

    const vertexX = -bVal / (2 * aVal);
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    setResult({
      discriminant,
      x1,
      x2,
      rootType,
      vertex: { x: vertexX, y: vertexY },
      steps,
    });
  };

  const formatRoot = (root: { real: number; imaginary: number }) => {
    if (root.imaginary === 0) {
      return root.real.toFixed(4);
    }
    const sign = root.imaginary > 0 ? "+" : "-";
    return `${root.real.toFixed(4)} ${sign} ${Math.abs(root.imaginary).toFixed(4)}i`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Quadratic Formula Calculator
            <Badge variant="secondary">Algebra</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-lg font-mono">
              <span className="text-primary">{a || "a"}</span>x² + 
              <span className="text-primary"> {b || "b"}</span>x + 
              <span className="text-primary"> {c || "c"}</span> = 0
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="a">a (x² coefficient)</Label>
              <Input
                id="a"
                type="number"
                step="any"
                placeholder="e.g., 1"
                value={a}
                onChange={(e) => setA(e.target.value)}
                data-testid="input-a"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b">b (x coefficient)</Label>
              <Input
                id="b"
                type="number"
                step="any"
                placeholder="e.g., -5"
                value={b}
                onChange={(e) => setB(e.target.value)}
                data-testid="input-b"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c">c (constant)</Label>
              <Input
                id="c"
                type="number"
                step="any"
                placeholder="e.g., 6"
                value={c}
                onChange={(e) => setC(e.target.value)}
                data-testid="input-c"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Solve Equation
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center mb-4">
                <Badge variant={result.rootType === "complex" ? "destructive" : "default"}>
                  {result.rootType === "two-real" && "Two Real Roots"}
                  {result.rootType === "one-real" && "One Real Root (Double Root)"}
                  {result.rootType === "complex" && "Complex Roots"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">x₁</p>
                  <p className="text-2xl font-bold text-primary font-mono" data-testid="text-x1">
                    {formatRoot(result.x1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">x₂</p>
                  <p className="text-2xl font-bold text-primary font-mono" data-testid="text-x2">
                    {formatRoot(result.x2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Discriminant (D)</p>
                  <p className="text-xl font-semibold">{result.discriminant.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vertex</p>
                  <p className="text-xl font-semibold">
                    ({result.vertex.x.toFixed(2)}, {result.vertex.y.toFixed(2)})
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
          <CardTitle>Understanding the Quadratic Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Quadratic Equation?</h3>
            <p className="text-muted-foreground">
              A quadratic equation is a polynomial equation of degree 2, meaning the highest power of x is 2. 
              The standard form is <strong>ax² + bx + c = 0</strong>, where a, b, and c are constants and a ≠ 0.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Quadratic Formula</h3>
            <div className="text-center py-4">
              <p className="font-mono text-xl text-primary">
                x = (-b ± √(b² - 4ac)) / (2a)
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This formula gives you the solutions (roots) of any quadratic equation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">The Discriminant</h3>
            <p className="text-muted-foreground mb-2">
              The discriminant is <strong>D = b² - 4ac</strong> and tells you what type of solutions to expect:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>D &gt; 0:</strong> Two different real solutions (the parabola crosses the x-axis twice)</li>
              <li><strong>D = 0:</strong> One real solution, repeated (the parabola touches the x-axis once)</li>
              <li><strong>D &lt; 0:</strong> Two complex solutions (the parabola doesn't touch the x-axis)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Solve x² - 5x + 6 = 0</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Identify: a = 1, b = -5, c = 6</li>
              <li>Calculate discriminant: D = (-5)² - 4(1)(6) = 25 - 24 = 1</li>
              <li>Since D &gt; 0, there are two real roots</li>
              <li>x = (5 ± √1) / 2 = (5 ± 1) / 2</li>
              <li>x₁ = (5 + 1) / 2 = 3</li>
              <li>x₂ = (5 - 1) / 2 = 2</li>
            </ol>
            <p className="mt-2 text-muted-foreground">
              Check: (x - 3)(x - 2) = x² - 5x + 6 ✓
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Key Terms</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Roots/Solutions:</strong> The values of x that make the equation true</li>
              <li><strong>Vertex:</strong> The highest or lowest point of the parabola</li>
              <li><strong>Parabola:</strong> The U-shaped curve when you graph a quadratic</li>
              <li><strong>Coefficient:</strong> The numbers multiplying the variable terms</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Methods to Solve Quadratics</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Factoring:</strong> Works when factors are easy to find</li>
              <li><strong>Quadratic Formula:</strong> Always works, shown above</li>
              <li><strong>Completing the Square:</strong> Transforms equation to vertex form</li>
              <li><strong>Graphing:</strong> Find where the parabola crosses x-axis</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
