import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TriangleResult {
  area: number;
  perimeter: number;
  angles: { A: number; B: number; C: number };
  sides: { a: number; b: number; c: number };
  type: string;
  height: number;
  inradius: number;
  circumradius: number;
  steps: string[];
}

export default function TriangleCalculator() {
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [sideC, setSideC] = useState("");
  const [base, setBase] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<TriangleResult | null>(null);

  const calculateFromSides = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) return;
    if (a + b <= c || a + c <= b || b + c <= a) {
      alert("Invalid triangle: the sum of any two sides must be greater than the third side.");
      return;
    }

    const steps: string[] = [];
    const perimeter = a + b + c;
    const s = perimeter / 2;

    steps.push(`Given sides: a = ${a}, b = ${b}, c = ${c}`);
    steps.push(``);
    steps.push(`Step 1: Calculate perimeter`);
    steps.push(`  Perimeter = a + b + c = ${a} + ${b} + ${c} = ${perimeter}`);
    steps.push(``);
    steps.push(`Step 2: Calculate area using Heron's formula`);
    steps.push(`  s (semi-perimeter) = ${perimeter} / 2 = ${s}`);
    steps.push(`  Area = √[s(s-a)(s-b)(s-c)]`);
    steps.push(`  Area = √[${s} × ${(s - a).toFixed(2)} × ${(s - b).toFixed(2)} × ${(s - c).toFixed(2)}]`);

    const areaSquared = s * (s - a) * (s - b) * (s - c);
    const area = Math.sqrt(areaSquared);
    steps.push(`  Area = √${areaSquared.toFixed(4)} = ${area.toFixed(4)}`);

    steps.push(``);
    steps.push(`Step 3: Calculate angles using Law of Cosines`);
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
    const angleC = 180 - angleA - angleB;

    steps.push(`  Angle A = arccos[(b² + c² - a²) / (2bc)]`);
    steps.push(`  Angle A = arccos[(${b * b} + ${c * c} - ${a * a}) / (2 × ${b} × ${c})]`);
    steps.push(`  Angle A = ${angleA.toFixed(2)}°`);
    steps.push(`  Angle B = ${angleB.toFixed(2)}°`);
    steps.push(`  Angle C = ${angleC.toFixed(2)}°`);

    const heightFromA = (2 * area) / a;
    const inradius = area / s;
    const circumradius = a / (2 * Math.sin(angleA * Math.PI / 180));

    let type = "";
    if (Math.abs(angleA - 90) < 0.01 || Math.abs(angleB - 90) < 0.01 || Math.abs(angleC - 90) < 0.01) {
      type = "Right Triangle";
    } else if (angleA > 90 || angleB > 90 || angleC > 90) {
      type = "Obtuse Triangle";
    } else {
      type = "Acute Triangle";
    }

    if (Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01) {
      type += " (Equilateral)";
    } else if (Math.abs(a - b) < 0.01 || Math.abs(b - c) < 0.01 || Math.abs(a - c) < 0.01) {
      type += " (Isosceles)";
    } else {
      type += " (Scalene)";
    }

    setResult({
      area,
      perimeter,
      angles: { A: angleA, B: angleB, C: angleC },
      sides: { a, b, c },
      type,
      height: heightFromA,
      inradius,
      circumradius,
      steps,
    });
  };

  const calculateFromBaseHeight = () => {
    const b = parseFloat(base);
    const h = parseFloat(height);

    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return;

    const area = (b * h) / 2;
    const steps = [
      `Given: base = ${b}, height = ${h}`,
      ``,
      `Area Formula: A = (1/2) × base × height`,
      `Area = (1/2) × ${b} × ${h}`,
      `Area = ${area}`,
    ];

    setResult({
      area,
      perimeter: 0,
      angles: { A: 0, B: 0, C: 0 },
      sides: { a: 0, b, c: 0 },
      type: "Unknown (need all sides)",
      height: h,
      inradius: 0,
      circumradius: 0,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Triangle Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sides">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sides">Three Sides (SSS)</TabsTrigger>
              <TabsTrigger value="baseheight">Base & Height</TabsTrigger>
            </TabsList>

            <TabsContent value="sides" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sideA">Side a</Label>
                  <Input
                    id="sideA"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 3"
                    value={sideA}
                    onChange={(e) => setSideA(e.target.value)}
                    data-testid="input-side-a"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sideB">Side b</Label>
                  <Input
                    id="sideB"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 4"
                    value={sideB}
                    onChange={(e) => setSideB(e.target.value)}
                    data-testid="input-side-b"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sideC">Side c</Label>
                  <Input
                    id="sideC"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 5"
                    value={sideC}
                    onChange={(e) => setSideC(e.target.value)}
                    data-testid="input-side-c"
                  />
                </div>
              </div>
              <Button onClick={calculateFromSides} className="w-full" data-testid="button-calculate-sides">
                Calculate Triangle
              </Button>
            </TabsContent>

            <TabsContent value="baseheight" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base">Base</Label>
                  <Input
                    id="base"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 6"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    data-testid="input-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 4"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    data-testid="input-height"
                  />
                </div>
              </div>
              <Button onClick={calculateFromBaseHeight} className="w-full" data-testid="button-calculate-bh">
                Calculate Area
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-area">
                    {result.area.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Perimeter</p>
                  <p className="text-xl font-bold">{result.perimeter.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Height (to a)</p>
                  <p className="text-xl font-bold">{result.height.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-background rounded text-center col-span-2 md:col-span-1">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-bold">{result.type}</p>
                </div>
              </div>

              {result.angles.A > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Angle A</p>
                    <p className="font-bold">{result.angles.A.toFixed(2)}°</p>
                  </div>
                  <div className="p-2 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Angle B</p>
                    <p className="font-bold">{result.angles.B.toFixed(2)}°</p>
                  </div>
                  <div className="p-2 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Angle C</p>
                    <p className="font-bold">{result.angles.C.toFixed(2)}°</p>
                  </div>
                </div>
              )}

              {result.inradius > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Inradius</p>
                    <p className="font-bold">{result.inradius.toFixed(4)}</p>
                  </div>
                  <div className="p-2 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Circumradius</p>
                    <p className="font-bold">{result.circumradius.toFixed(4)}</p>
                  </div>
                </div>
              )}

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

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => { setSideA("3"); setSideB("4"); setSideC("5"); }}>
              3-4-5 Right
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSideA("5"); setSideB("5"); setSideC("5"); }}>
              Equilateral
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSideA("5"); setSideB("5"); setSideC("8"); }}>
              Isosceles
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Triangles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Triangle?</h3>
            <p className="text-muted-foreground">
              A triangle is a polygon with three vertices (corners) connected by three line segments 
              called edges or sides. The sum of interior angles in any triangle is always 180°.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Formulas</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-background rounded">
                <p className="font-mono">Area = (1/2) × base × height</p>
                <p className="text-muted-foreground">Basic area formula</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">Area = √[s(s-a)(s-b)(s-c)]</p>
                <p className="text-muted-foreground">Heron's formula (s = semi-perimeter)</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">a² = b² + c² - 2bc×cos(A)</p>
                <p className="text-muted-foreground">Law of Cosines</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">a/sin(A) = b/sin(B) = c/sin(C)</p>
                <p className="text-muted-foreground">Law of Sines</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Triangle Types</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm mb-2">By Sides:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li><strong>Equilateral:</strong> All sides equal</li>
                  <li><strong>Isosceles:</strong> Two sides equal</li>
                  <li><strong>Scalene:</strong> No sides equal</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">By Angles:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li><strong>Acute:</strong> All angles &lt; 90°</li>
                  <li><strong>Right:</strong> One angle = 90°</li>
                  <li><strong>Obtuse:</strong> One angle &gt; 90°</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Triangle Inequality</h3>
            <p className="text-muted-foreground">
              The sum of any two sides must be greater than the third side. This is called the 
              Triangle Inequality Theorem.
            </p>
            <p className="font-mono text-primary mt-2">
              a + b &gt; c, a + c &gt; b, b + c &gt; a
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Special Properties</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Inradius:</strong> Radius of the largest circle that fits inside</li>
              <li><strong>Circumradius:</strong> Radius of the circle passing through all vertices</li>
              <li><strong>Median:</strong> Line from vertex to midpoint of opposite side</li>
              <li><strong>Altitude:</strong> Perpendicular from vertex to opposite side</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
