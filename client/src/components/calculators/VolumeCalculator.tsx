import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VolumeResult {
  volume: number;
  surfaceArea: number;
  formula: string;
  steps: string[];
}

export default function VolumeCalculator() {
  const [shape, setShape] = useState("cube");
  const [dim1, setDim1] = useState("");
  const [dim2, setDim2] = useState("");
  const [dim3, setDim3] = useState("");
  const [result, setResult] = useState<VolumeResult | null>(null);

  const getLabels = () => {
    switch (shape) {
      case "cube":
        return ["Side Length", "", ""];
      case "rectangular":
        return ["Length", "Width", "Height"];
      case "sphere":
        return ["Radius", "", ""];
      case "cylinder":
        return ["Radius", "Height", ""];
      case "cone":
        return ["Radius", "Height", ""];
      case "pyramid":
        return ["Base Length", "Base Width", "Height"];
      default:
        return ["", "", ""];
    }
  };

  const calculate = () => {
    const d1 = parseFloat(dim1);
    const d2 = parseFloat(dim2);
    const d3 = parseFloat(dim3);

    let volume: number;
    let surfaceArea: number;
    let formula: string;
    const steps: string[] = [];

    switch (shape) {
      case "cube":
        if (isNaN(d1) || d1 <= 0) return;
        volume = d1 * d1 * d1;
        surfaceArea = 6 * d1 * d1;
        formula = "V = s³";
        steps.push(`Cube with side length s = ${d1}`);
        steps.push(``);
        steps.push(`Volume Formula: V = s³`);
        steps.push(`V = ${d1}³ = ${d1} × ${d1} × ${d1} = ${volume}`);
        steps.push(``);
        steps.push(`Surface Area Formula: SA = 6s²`);
        steps.push(`SA = 6 × ${d1}² = 6 × ${d1 * d1} = ${surfaceArea}`);
        break;

      case "rectangular":
        if (isNaN(d1) || isNaN(d2) || isNaN(d3) || d1 <= 0 || d2 <= 0 || d3 <= 0) return;
        volume = d1 * d2 * d3;
        surfaceArea = 2 * (d1 * d2 + d2 * d3 + d1 * d3);
        formula = "V = l × w × h";
        steps.push(`Rectangular Prism: l = ${d1}, w = ${d2}, h = ${d3}`);
        steps.push(``);
        steps.push(`Volume Formula: V = l × w × h`);
        steps.push(`V = ${d1} × ${d2} × ${d3} = ${volume}`);
        steps.push(``);
        steps.push(`Surface Area Formula: SA = 2(lw + wh + lh)`);
        steps.push(`SA = 2(${d1 * d2} + ${d2 * d3} + ${d1 * d3})`);
        steps.push(`SA = 2 × ${d1 * d2 + d2 * d3 + d1 * d3} = ${surfaceArea}`);
        break;

      case "sphere":
        if (isNaN(d1) || d1 <= 0) return;
        volume = (4 / 3) * Math.PI * d1 * d1 * d1;
        surfaceArea = 4 * Math.PI * d1 * d1;
        formula = "V = (4/3)πr³";
        steps.push(`Sphere with radius r = ${d1}`);
        steps.push(``);
        steps.push(`Volume Formula: V = (4/3)πr³`);
        steps.push(`V = (4/3) × π × ${d1}³`);
        steps.push(`V = (4/3) × π × ${d1 * d1 * d1}`);
        steps.push(`V = ${volume.toFixed(4)}`);
        steps.push(``);
        steps.push(`Surface Area Formula: SA = 4πr²`);
        steps.push(`SA = 4 × π × ${d1}² = 4 × π × ${d1 * d1}`);
        steps.push(`SA = ${surfaceArea.toFixed(4)}`);
        break;

      case "cylinder":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        volume = Math.PI * d1 * d1 * d2;
        surfaceArea = 2 * Math.PI * d1 * (d1 + d2);
        formula = "V = πr²h";
        steps.push(`Cylinder with radius r = ${d1}, height h = ${d2}`);
        steps.push(``);
        steps.push(`Volume Formula: V = πr²h`);
        steps.push(`V = π × ${d1}² × ${d2}`);
        steps.push(`V = π × ${d1 * d1} × ${d2}`);
        steps.push(`V = ${volume.toFixed(4)}`);
        steps.push(``);
        steps.push(`Surface Area Formula: SA = 2πr(r + h)`);
        steps.push(`SA = 2 × π × ${d1} × (${d1} + ${d2})`);
        steps.push(`SA = ${surfaceArea.toFixed(4)}`);
        break;

      case "cone":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        volume = (1 / 3) * Math.PI * d1 * d1 * d2;
        const slantHeight = Math.sqrt(d1 * d1 + d2 * d2);
        surfaceArea = Math.PI * d1 * (d1 + slantHeight);
        formula = "V = (1/3)πr²h";
        steps.push(`Cone with radius r = ${d1}, height h = ${d2}`);
        steps.push(``);
        steps.push(`Volume Formula: V = (1/3)πr²h`);
        steps.push(`V = (1/3) × π × ${d1}² × ${d2}`);
        steps.push(`V = (1/3) × π × ${d1 * d1} × ${d2}`);
        steps.push(`V = ${volume.toFixed(4)}`);
        steps.push(``);
        steps.push(`Slant height: l = √(r² + h²) = √(${d1 * d1} + ${d2 * d2}) = ${slantHeight.toFixed(4)}`);
        steps.push(`Surface Area Formula: SA = πr(r + l)`);
        steps.push(`SA = π × ${d1} × (${d1} + ${slantHeight.toFixed(4)})`);
        steps.push(`SA = ${surfaceArea.toFixed(4)}`);
        break;

      case "pyramid":
        if (isNaN(d1) || isNaN(d2) || isNaN(d3) || d1 <= 0 || d2 <= 0 || d3 <= 0) return;
        const baseArea = d1 * d2;
        volume = (1 / 3) * baseArea * d3;
        const slant1 = Math.sqrt((d1 / 2) ** 2 + d3 ** 2);
        const slant2 = Math.sqrt((d2 / 2) ** 2 + d3 ** 2);
        surfaceArea = baseArea + d1 * slant2 + d2 * slant1;
        formula = "V = (1/3) × base area × height";
        steps.push(`Rectangular Pyramid: base ${d1} × ${d2}, height h = ${d3}`);
        steps.push(``);
        steps.push(`Base Area = ${d1} × ${d2} = ${baseArea}`);
        steps.push(``);
        steps.push(`Volume Formula: V = (1/3) × base area × height`);
        steps.push(`V = (1/3) × ${baseArea} × ${d3}`);
        steps.push(`V = ${volume.toFixed(4)}`);
        break;

      default:
        return;
    }

    setResult({ volume, surfaceArea, formula, steps });
  };

  const labels = getLabels();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Volume Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select 3D Shape</Label>
            <Select value={shape} onValueChange={(v) => { setShape(v); setResult(null); }}>
              <SelectTrigger data-testid="select-shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cube">Cube</SelectItem>
                <SelectItem value="rectangular">Rectangular Prism (Box)</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="cone">Cone</SelectItem>
                <SelectItem value="pyramid">Rectangular Pyramid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {labels[0] && (
              <div className="space-y-2">
                <Label>{labels[0]}</Label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Enter value"
                  value={dim1}
                  onChange={(e) => setDim1(e.target.value)}
                  data-testid="input-dim1"
                />
              </div>
            )}
            {labels[1] && (
              <div className="space-y-2">
                <Label>{labels[1]}</Label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Enter value"
                  value={dim2}
                  onChange={(e) => setDim2(e.target.value)}
                  data-testid="input-dim2"
                />
              </div>
            )}
            {labels[2] && (
              <div className="space-y-2">
                <Label>{labels[2]}</Label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Enter value"
                  value={dim3}
                  onChange={(e) => setDim3(e.target.value)}
                  data-testid="input-dim3"
                />
              </div>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Volume
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-volume">
                    {result.volume.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">cubic units</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Surface Area</p>
                  <p className="text-2xl font-bold" data-testid="text-surface-area">
                    {result.surfaceArea.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">square units</p>
                </div>
              </div>

              <div className="p-3 bg-background rounded text-center">
                <p className="text-sm text-muted-foreground">Formula Used</p>
                <p className="font-mono text-lg text-primary">{result.formula}</p>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Volume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Volume?</h3>
            <p className="text-muted-foreground">
              Volume measures the amount of 3D space an object takes up. It's measured in cubic units 
              (like cubic meters, cubic feet, or liters). Think of it as how much water could fill 
              the shape.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Volume Formulas</h3>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cube:</span>
                <span className="font-mono">V = s³</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Rectangular Prism:</span>
                <span className="font-mono">V = l × w × h</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Sphere:</span>
                <span className="font-mono">V = (4/3)πr³</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cylinder:</span>
                <span className="font-mono">V = πr²h</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cone:</span>
                <span className="font-mono">V = (1/3)πr²h</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Pyramid:</span>
                <span className="font-mono">V = (1/3)Bh</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Key Relationships</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>A cone has 1/3 the volume of a cylinder with same base and height</li>
              <li>A pyramid has 1/3 the volume of a prism with same base and height</li>
              <li>Doubling all dimensions multiplies volume by 8 (2³)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Examples</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Cube:</strong> Dice, Rubik's cube, sugar cubes</li>
              <li><strong>Rectangular prism:</strong> Boxes, rooms, bricks</li>
              <li><strong>Sphere:</strong> Balls, Earth, oranges</li>
              <li><strong>Cylinder:</strong> Cans, pipes, drums</li>
              <li><strong>Cone:</strong> Ice cream cones, traffic cones</li>
              <li><strong>Pyramid:</strong> Egyptian pyramids, tents</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
