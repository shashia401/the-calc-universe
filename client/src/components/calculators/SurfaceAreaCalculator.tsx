import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SurfaceAreaResult {
  surfaceArea: number;
  lateralArea: number;
  baseArea: number;
  formula: string;
  steps: string[];
}

export default function SurfaceAreaCalculator() {
  const [shape, setShape] = useState("cube");
  const [dim1, setDim1] = useState("");
  const [dim2, setDim2] = useState("");
  const [dim3, setDim3] = useState("");
  const [result, setResult] = useState<SurfaceAreaResult | null>(null);

  const getLabels = () => {
    switch (shape) {
      case "cube": return ["Side Length", "", ""];
      case "rectangular": return ["Length", "Width", "Height"];
      case "sphere": return ["Radius", "", ""];
      case "cylinder": return ["Radius", "Height", ""];
      case "cone": return ["Radius", "Height", ""];
      default: return ["", "", ""];
    }
  };

  const calculate = () => {
    const d1 = parseFloat(dim1);
    const d2 = parseFloat(dim2);
    const d3 = parseFloat(dim3);

    let surfaceArea: number;
    let lateralArea: number;
    let baseArea: number;
    let formula: string;
    const steps: string[] = [];

    switch (shape) {
      case "cube":
        if (isNaN(d1) || d1 <= 0) return;
        baseArea = d1 * d1;
        lateralArea = 4 * d1 * d1;
        surfaceArea = 6 * d1 * d1;
        formula = "SA = 6s²";
        steps.push(`Cube with side s = ${d1}`);
        steps.push(``);
        steps.push(`A cube has 6 identical square faces`);
        steps.push(`Each face area = s² = ${d1}² = ${baseArea}`);
        steps.push(``);
        steps.push(`Total Surface Area = 6 × ${baseArea} = ${surfaceArea}`);
        break;

      case "rectangular":
        if (isNaN(d1) || isNaN(d2) || isNaN(d3) || d1 <= 0 || d2 <= 0 || d3 <= 0) return;
        const topBottom = 2 * d1 * d2;
        const frontBack = 2 * d2 * d3;
        const sides = 2 * d1 * d3;
        baseArea = d1 * d2;
        lateralArea = 2 * (d2 * d3 + d1 * d3);
        surfaceArea = topBottom + frontBack + sides;
        formula = "SA = 2(lw + wh + lh)";
        steps.push(`Rectangular prism: l=${d1}, w=${d2}, h=${d3}`);
        steps.push(``);
        steps.push(`Top & Bottom faces: 2 × (${d1} × ${d2}) = ${topBottom}`);
        steps.push(`Front & Back faces: 2 × (${d2} × ${d3}) = ${frontBack}`);
        steps.push(`Left & Right faces: 2 × (${d1} × ${d3}) = ${sides}`);
        steps.push(``);
        steps.push(`Total Surface Area = ${topBottom} + ${frontBack} + ${sides} = ${surfaceArea}`);
        break;

      case "sphere":
        if (isNaN(d1) || d1 <= 0) return;
        surfaceArea = 4 * Math.PI * d1 * d1;
        lateralArea = surfaceArea;
        baseArea = 0;
        formula = "SA = 4πr²";
        steps.push(`Sphere with radius r = ${d1}`);
        steps.push(``);
        steps.push(`Surface Area Formula: SA = 4πr²`);
        steps.push(`SA = 4 × π × ${d1}²`);
        steps.push(`SA = 4 × π × ${d1 * d1}`);
        steps.push(`SA = ${surfaceArea.toFixed(4)}`);
        break;

      case "cylinder":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        baseArea = Math.PI * d1 * d1;
        lateralArea = 2 * Math.PI * d1 * d2;
        surfaceArea = 2 * baseArea + lateralArea;
        formula = "SA = 2πr² + 2πrh";
        steps.push(`Cylinder: radius r=${d1}, height h=${d2}`);
        steps.push(``);
        steps.push(`Two circular bases:`);
        steps.push(`  Base area = πr² = π × ${d1}² = ${baseArea.toFixed(4)}`);
        steps.push(`  Two bases = 2 × ${baseArea.toFixed(4)} = ${(2 * baseArea).toFixed(4)}`);
        steps.push(``);
        steps.push(`Lateral (curved) surface:`);
        steps.push(`  Lateral area = 2πrh = 2 × π × ${d1} × ${d2} = ${lateralArea.toFixed(4)}`);
        steps.push(``);
        steps.push(`Total Surface Area = ${(2 * baseArea).toFixed(4)} + ${lateralArea.toFixed(4)} = ${surfaceArea.toFixed(4)}`);
        break;

      case "cone":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        const slantHeight = Math.sqrt(d1 * d1 + d2 * d2);
        baseArea = Math.PI * d1 * d1;
        lateralArea = Math.PI * d1 * slantHeight;
        surfaceArea = baseArea + lateralArea;
        formula = "SA = πr² + πrl";
        steps.push(`Cone: radius r=${d1}, height h=${d2}`);
        steps.push(``);
        steps.push(`First, find slant height (l):`);
        steps.push(`  l = √(r² + h²) = √(${d1}² + ${d2}²)`);
        steps.push(`  l = √${d1 * d1 + d2 * d2} = ${slantHeight.toFixed(4)}`);
        steps.push(``);
        steps.push(`Circular base:`);
        steps.push(`  Base area = πr² = π × ${d1}² = ${baseArea.toFixed(4)}`);
        steps.push(``);
        steps.push(`Lateral (curved) surface:`);
        steps.push(`  Lateral area = πrl = π × ${d1} × ${slantHeight.toFixed(4)} = ${lateralArea.toFixed(4)}`);
        steps.push(``);
        steps.push(`Total Surface Area = ${baseArea.toFixed(4)} + ${lateralArea.toFixed(4)} = ${surfaceArea.toFixed(4)}`);
        break;

      default:
        return;
    }

    setResult({ surfaceArea, lateralArea, baseArea, formula, steps });
  };

  const labels = getLabels();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Surface Area Calculator
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
                <SelectItem value="rectangular">Rectangular Prism</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="cone">Cone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {labels[0] && (
              <div className="space-y-2">
                <Label>{labels[0]}</Label>
                <Input type="number" step="any" min="0" placeholder="Enter value" value={dim1} onChange={(e) => setDim1(e.target.value)} data-testid="input-dim1" />
              </div>
            )}
            {labels[1] && (
              <div className="space-y-2">
                <Label>{labels[1]}</Label>
                <Input type="number" step="any" min="0" placeholder="Enter value" value={dim2} onChange={(e) => setDim2(e.target.value)} data-testid="input-dim2" />
              </div>
            )}
            {labels[2] && (
              <div className="space-y-2">
                <Label>{labels[2]}</Label>
                <Input type="number" step="any" min="0" placeholder="Enter value" value={dim3} onChange={(e) => setDim3(e.target.value)} data-testid="input-dim3" />
              </div>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Surface Area
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Total Surface Area</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-surface-area">
                    {result.surfaceArea.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Lateral Area</p>
                  <p className="text-xl font-bold">{result.lateralArea.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Base Area</p>
                  <p className="text-xl font-bold">{result.baseArea.toFixed(4)}</p>
                </div>
              </div>

              <div className="p-3 bg-background rounded text-center">
                <p className="text-sm text-muted-foreground">Formula</p>
                <p className="font-mono text-lg text-primary">{result.formula}</p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step:</p>
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
          <CardTitle>Understanding Surface Area</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Surface Area?</h3>
            <p className="text-muted-foreground">
              Surface area is the total area of all the surfaces (faces) of a 3D object. 
              It's measured in square units. Think of it as the amount of wrapping paper 
              needed to cover the entire object.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Surface Area Formulas</h3>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cube:</span><span className="font-mono">SA = 6s²</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Rect. Prism:</span><span className="font-mono">SA = 2(lw + wh + lh)</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Sphere:</span><span className="font-mono">SA = 4πr²</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cylinder:</span><span className="font-mono">SA = 2πr² + 2πrh</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Cone:</span><span className="font-mono">SA = πr² + πrl</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Types of Surface Area</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Total Surface Area:</strong> All surfaces including bases</li>
              <li><strong>Lateral Surface Area:</strong> Only the sides (excludes bases)</li>
              <li><strong>Base Area:</strong> Just the top/bottom faces</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Painting:</strong> How much paint for a room or object</li>
              <li><strong>Packaging:</strong> Material needed for boxes</li>
              <li><strong>Manufacturing:</strong> Material costs for products</li>
              <li><strong>Biology:</strong> Cell surface area affects function</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
