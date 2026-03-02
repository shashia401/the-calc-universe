import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DistanceResult {
  distance: number;
  midpoint: { x: number; y: number; z?: number };
  steps: string[];
}

export default function DistanceCalculator() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [z1, setZ1] = useState("");
  const [z2, setZ2] = useState("");
  const [result2D, setResult2D] = useState<DistanceResult | null>(null);
  const [result3D, setResult3D] = useState<DistanceResult | null>(null);

  const calculate2D = () => {
    const px1 = parseFloat(x1);
    const py1 = parseFloat(y1);
    const px2 = parseFloat(x2);
    const py2 = parseFloat(y2);

    if (isNaN(px1) || isNaN(py1) || isNaN(px2) || isNaN(py2)) return;

    const steps: string[] = [];
    const dx = px2 - px1;
    const dy = py2 - py1;

    steps.push(`Given points: (${px1}, ${py1}) and (${px2}, ${py2})`);
    steps.push(``);
    steps.push(`Distance Formula: d = √[(x₂-x₁)² + (y₂-y₁)²]`);
    steps.push(``);
    steps.push(`Step 1: Calculate differences`);
    steps.push(`  x₂ - x₁ = ${px2} - ${px1} = ${dx}`);
    steps.push(`  y₂ - y₁ = ${py2} - ${py1} = ${dy}`);
    steps.push(``);
    steps.push(`Step 2: Square the differences`);
    steps.push(`  (${dx})² = ${dx * dx}`);
    steps.push(`  (${dy})² = ${dy * dy}`);
    steps.push(``);
    steps.push(`Step 3: Add and take square root`);
    steps.push(`  d = √[${dx * dx} + ${dy * dy}]`);
    steps.push(`  d = √${dx * dx + dy * dy}`);

    const distance = Math.sqrt(dx * dx + dy * dy);
    steps.push(`  d = ${distance.toFixed(4)}`);

    const midpoint = { x: (px1 + px2) / 2, y: (py1 + py2) / 2 };
    steps.push(``);
    steps.push(`Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)`);
    steps.push(`Midpoint = ((${px1}+${px2})/2, (${py1}+${py2})/2) = (${midpoint.x}, ${midpoint.y})`);

    setResult2D({ distance, midpoint, steps });
  };

  const calculate3D = () => {
    const px1 = parseFloat(x1);
    const py1 = parseFloat(y1);
    const pz1 = parseFloat(z1);
    const px2 = parseFloat(x2);
    const py2 = parseFloat(y2);
    const pz2 = parseFloat(z2);

    if (isNaN(px1) || isNaN(py1) || isNaN(pz1) || isNaN(px2) || isNaN(py2) || isNaN(pz2)) return;

    const steps: string[] = [];
    const dx = px2 - px1;
    const dy = py2 - py1;
    const dz = pz2 - pz1;

    steps.push(`Given points: (${px1}, ${py1}, ${pz1}) and (${px2}, ${py2}, ${pz2})`);
    steps.push(``);
    steps.push(`3D Distance Formula: d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]`);
    steps.push(``);
    steps.push(`Step 1: Calculate differences`);
    steps.push(`  Δx = ${dx}, Δy = ${dy}, Δz = ${dz}`);
    steps.push(``);
    steps.push(`Step 2: Square and add`);
    steps.push(`  ${dx}² + ${dy}² + ${dz}² = ${dx * dx} + ${dy * dy} + ${dz * dz} = ${dx * dx + dy * dy + dz * dz}`);
    steps.push(``);
    steps.push(`Step 3: Take square root`);

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    steps.push(`  d = √${dx * dx + dy * dy + dz * dz} = ${distance.toFixed(4)}`);

    const midpoint = { x: (px1 + px2) / 2, y: (py1 + py2) / 2, z: (pz1 + pz2) / 2 };
    steps.push(``);
    steps.push(`3D Midpoint = (${midpoint.x}, ${midpoint.y}, ${midpoint.z})`);

    setResult3D({ distance, midpoint, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Distance Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="2d">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="2d">2D Distance</TabsTrigger>
              <TabsTrigger value="3d">3D Distance</TabsTrigger>
            </TabsList>

            <TabsContent value="2d" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-2">Point 1 (x₁, y₁)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" step="any" placeholder="x₁" value={x1} onChange={(e) => setX1(e.target.value)} data-testid="input-x1" />
                    <Input type="number" step="any" placeholder="y₁" value={y1} onChange={(e) => setY1(e.target.value)} data-testid="input-y1" />
                  </div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-2">Point 2 (x₂, y₂)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" step="any" placeholder="x₂" value={x2} onChange={(e) => setX2(e.target.value)} data-testid="input-x2" />
                    <Input type="number" step="any" placeholder="y₂" value={y2} onChange={(e) => setY2(e.target.value)} data-testid="input-y2" />
                  </div>
                </div>
              </div>

              <Button onClick={calculate2D} className="w-full" data-testid="button-calculate-2d">
                Calculate 2D Distance
              </Button>

              {result2D && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-2xl font-bold text-primary" data-testid="text-distance-2d">{result2D.distance.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Midpoint</p>
                      <p className="text-xl font-bold">({result2D.midpoint.x}, {result2D.midpoint.y})</p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {result2D.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="3d" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-2">Point 1 (x₁, y₁, z₁)</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" step="any" placeholder="x₁" value={x1} onChange={(e) => setX1(e.target.value)} />
                    <Input type="number" step="any" placeholder="y₁" value={y1} onChange={(e) => setY1(e.target.value)} />
                    <Input type="number" step="any" placeholder="z₁" value={z1} onChange={(e) => setZ1(e.target.value)} data-testid="input-z1" />
                  </div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-2">Point 2 (x₂, y₂, z₂)</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" step="any" placeholder="x₂" value={x2} onChange={(e) => setX2(e.target.value)} />
                    <Input type="number" step="any" placeholder="y₂" value={y2} onChange={(e) => setY2(e.target.value)} />
                    <Input type="number" step="any" placeholder="z₂" value={z2} onChange={(e) => setZ2(e.target.value)} data-testid="input-z2" />
                  </div>
                </div>
              </div>

              <Button onClick={calculate3D} className="w-full" data-testid="button-calculate-3d">
                Calculate 3D Distance
              </Button>

              {result3D && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-2xl font-bold text-primary" data-testid="text-distance-3d">{result3D.distance.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Midpoint</p>
                      <p className="text-xl font-bold">({result3D.midpoint.x}, {result3D.midpoint.y}, {result3D.midpoint.z})</p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {result3D.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding the Distance Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is the Distance Formula?</h3>
            <p className="text-muted-foreground">
              The distance formula calculates the straight-line distance between two points. 
              It's derived from the Pythagorean theorem.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formulas</h3>
            <div className="space-y-2">
              <div className="p-2 bg-background rounded">
                <p className="font-semibold text-sm">2D Distance:</p>
                <p className="font-mono text-primary">d = √[(x₂-x₁)² + (y₂-y₁)²]</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-semibold text-sm">3D Distance:</p>
                <p className="font-mono text-primary">d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Connection to Pythagorean Theorem</h3>
            <p className="text-muted-foreground">
              The distance formula is essentially the Pythagorean theorem applied to coordinates. 
              The differences in x and y form the legs of a right triangle, and the distance is 
              the hypotenuse.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Midpoint Formula</h3>
            <p className="font-mono text-center text-primary py-2">
              M = ((x₁+x₂)/2, (y₁+y₂)/2)
            </p>
            <p className="text-muted-foreground">
              The midpoint is the average of the coordinates - it's exactly halfway between two points.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>GPS:</strong> Calculating distances between locations</li>
              <li><strong>Games:</strong> Collision detection, path finding</li>
              <li><strong>Physics:</strong> Displacement calculations</li>
              <li><strong>3D modeling:</strong> Measuring objects in space</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
