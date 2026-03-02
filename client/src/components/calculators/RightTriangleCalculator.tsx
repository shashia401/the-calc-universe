import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface RightTriangleResult {
  a: number;
  b: number;
  c: number;
  angleA: number;
  angleB: number;
  area: number;
  perimeter: number;
  steps: string[];
}

export default function RightTriangleCalculator() {
  const [legA, setLegA] = useState("");
  const [legB, setLegB] = useState("");
  const [hypotenuse, setHypotenuse] = useState("");
  const [angleInput, setAngleInput] = useState("");
  const [result, setResult] = useState<RightTriangleResult | null>(null);

  const calculate = () => {
    const a = parseFloat(legA);
    const b = parseFloat(legB);
    const c = parseFloat(hypotenuse);
    const angle = parseFloat(angleInput);

    const steps: string[] = [];
    let finalA: number, finalB: number, finalC: number;

    steps.push(`Right Triangle (one 90° angle)`);
    steps.push(`Using Pythagorean Theorem: a² + b² = c²`);
    steps.push(``);

    if (!isNaN(a) && !isNaN(b)) {
      finalA = a;
      finalB = b;
      finalC = Math.sqrt(a * a + b * b);
      steps.push(`Given: leg a = ${a}, leg b = ${b}`);
      steps.push(`Finding hypotenuse c`);
      steps.push(`c = √(a² + b²) = √(${a * a} + ${b * b}) = √${a * a + b * b} = ${finalC.toFixed(4)}`);
    } else if (!isNaN(a) && !isNaN(c)) {
      if (c <= a) { alert("Hypotenuse must be longer than the leg"); return; }
      finalA = a;
      finalC = c;
      finalB = Math.sqrt(c * c - a * a);
      steps.push(`Given: leg a = ${a}, hypotenuse c = ${c}`);
      steps.push(`Finding leg b`);
      steps.push(`b = √(c² - a²) = √(${c * c} - ${a * a}) = √${c * c - a * a} = ${finalB.toFixed(4)}`);
    } else if (!isNaN(b) && !isNaN(c)) {
      if (c <= b) { alert("Hypotenuse must be longer than the leg"); return; }
      finalB = b;
      finalC = c;
      finalA = Math.sqrt(c * c - b * b);
      steps.push(`Given: leg b = ${b}, hypotenuse c = ${c}`);
      steps.push(`Finding leg a`);
      steps.push(`a = √(c² - b²) = √(${c * c} - ${b * b}) = √${c * c - b * b} = ${finalA.toFixed(4)}`);
    } else if (!isNaN(a) && !isNaN(angle)) {
      const angleRad = angle * Math.PI / 180;
      finalA = a;
      finalB = a / Math.tan(angleRad);
      finalC = a / Math.sin(angleRad);
      steps.push(`Given: leg a = ${a}, angle A = ${angle}°`);
      steps.push(`Using trigonometry:`);
      steps.push(`b = a / tan(A) = ${a} / tan(${angle}°) = ${finalB.toFixed(4)}`);
      steps.push(`c = a / sin(A) = ${a} / sin(${angle}°) = ${finalC.toFixed(4)}`);
    } else if (!isNaN(c) && !isNaN(angle)) {
      const angleRad = angle * Math.PI / 180;
      finalC = c;
      finalA = c * Math.sin(angleRad);
      finalB = c * Math.cos(angleRad);
      steps.push(`Given: hypotenuse c = ${c}, angle A = ${angle}°`);
      steps.push(`Using trigonometry:`);
      steps.push(`a = c × sin(A) = ${c} × sin(${angle}°) = ${finalA.toFixed(4)}`);
      steps.push(`b = c × cos(A) = ${c} × cos(${angle}°) = ${finalB.toFixed(4)}`);
    } else {
      alert("Please enter two values (two sides, or one side and one angle)");
      return;
    }

    const angleA = Math.atan(finalA / finalB) * (180 / Math.PI);
    const angleB = 90 - angleA;
    const area = (finalA * finalB) / 2;
    const perimeter = finalA + finalB + finalC;

    steps.push(``);
    steps.push(`Calculating angles:`);
    steps.push(`Angle A = arctan(a/b) = arctan(${finalA.toFixed(4)}/${finalB.toFixed(4)}) = ${angleA.toFixed(2)}°`);
    steps.push(`Angle B = 90° - ${angleA.toFixed(2)}° = ${angleB.toFixed(2)}°`);
    steps.push(`Angle C = 90° (right angle)`);
    steps.push(``);
    steps.push(`Area = (1/2) × a × b = (1/2) × ${finalA.toFixed(4)} × ${finalB.toFixed(4)} = ${area.toFixed(4)}`);
    steps.push(`Perimeter = a + b + c = ${perimeter.toFixed(4)}`);

    setResult({
      a: finalA,
      b: finalB,
      c: finalC,
      angleA,
      angleB,
      area,
      perimeter,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Right Triangle Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter any two values to calculate all sides, angles, area, and perimeter.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legA">Leg a (opposite to angle A)</Label>
              <Input id="legA" type="number" step="any" min="0" placeholder="Enter value" value={legA} onChange={(e) => setLegA(e.target.value)} data-testid="input-leg-a" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legB">Leg b (adjacent to angle A)</Label>
              <Input id="legB" type="number" step="any" min="0" placeholder="Enter value" value={legB} onChange={(e) => setLegB(e.target.value)} data-testid="input-leg-b" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hyp">Hypotenuse c</Label>
              <Input id="hyp" type="number" step="any" min="0" placeholder="Enter value" value={hypotenuse} onChange={(e) => setHypotenuse(e.target.value)} data-testid="input-hypotenuse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="angle">Angle A (degrees)</Label>
              <Input id="angle" type="number" step="any" min="0" max="90" placeholder="0-90°" value={angleInput} onChange={(e) => setAngleInput(e.target.value)} data-testid="input-angle" />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Right Triangle
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Leg a</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-a">{result.a.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Leg b</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-b">{result.b.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Hypotenuse c</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-c">{result.c.toFixed(4)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Angle A</p>
                  <p className="font-bold">{result.angleA.toFixed(2)}°</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Angle B</p>
                  <p className="font-bold">{result.angleB.toFixed(2)}°</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Angle C</p>
                  <p className="font-bold">90.00°</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="font-bold">{result.area.toFixed(4)}</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Perimeter</p>
                  <p className="font-bold">{result.perimeter.toFixed(4)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setLegA("3"); setLegB("4"); setHypotenuse(""); setAngleInput(""); }}>
              3-4-5 triangle
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setLegA("1"); setLegB("1"); setHypotenuse(""); setAngleInput(""); }}>
              45-45-90
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setLegA(""); setLegB(""); setHypotenuse("10"); setAngleInput("30"); }}>
              30-60-90
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Right Triangles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Right Triangle?</h3>
            <p className="text-muted-foreground">
              A right triangle has one 90° angle. The side opposite the right angle is called 
              the hypotenuse (always the longest side). The other two sides are called legs.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Formulas</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">a² + b² = c²</p>
                <p className="text-muted-foreground">Pythagorean Theorem</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">sin(A) = opposite/hypotenuse = a/c</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">cos(A) = adjacent/hypotenuse = b/c</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">tan(A) = opposite/adjacent = a/b</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Special Right Triangles</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">45-45-90 Triangle</p>
                <p className="text-muted-foreground">Legs are equal</p>
                <p className="text-muted-foreground">Ratio: 1 : 1 : √2</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">30-60-90 Triangle</p>
                <p className="text-muted-foreground">Half of equilateral</p>
                <p className="text-muted-foreground">Ratio: 1 : √3 : 2</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">SOH-CAH-TOA</h3>
            <p className="text-muted-foreground">
              A mnemonic for remembering trigonometric ratios:
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li><strong>S</strong>ine = <strong>O</strong>pposite / <strong>H</strong>ypotenuse</li>
              <li><strong>C</strong>osine = <strong>A</strong>djacent / <strong>H</strong>ypotenuse</li>
              <li><strong>T</strong>angent = <strong>O</strong>pposite / <strong>A</strong>djacent</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
