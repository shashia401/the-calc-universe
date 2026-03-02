import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AreaResult {
  area: number;
  perimeter: number;
  formula: string;
  steps: string[];
}

export default function AreaCalculator() {
  const [shape, setShape] = useState("rectangle");
  const [dim1, setDim1] = useState("");
  const [dim2, setDim2] = useState("");
  const [dim3, setDim3] = useState("");
  const [result, setResult] = useState<AreaResult | null>(null);

  const getLabels = () => {
    switch (shape) {
      case "square": return ["Side Length", "", ""];
      case "rectangle": return ["Length", "Width", ""];
      case "triangle": return ["Base", "Height", ""];
      case "circle": return ["Radius", "", ""];
      case "trapezoid": return ["Base 1", "Base 2", "Height"];
      case "parallelogram": return ["Base", "Height", ""];
      case "rhombus": return ["Diagonal 1", "Diagonal 2", ""];
      case "ellipse": return ["Semi-major (a)", "Semi-minor (b)", ""];
      default: return ["", "", ""];
    }
  };

  const calculate = () => {
    const d1 = parseFloat(dim1);
    const d2 = parseFloat(dim2);
    const d3 = parseFloat(dim3);

    let area: number;
    let perimeter: number;
    let formula: string;
    const steps: string[] = [];

    switch (shape) {
      case "square":
        if (isNaN(d1) || d1 <= 0) return;
        area = d1 * d1;
        perimeter = 4 * d1;
        formula = "A = s²";
        steps.push(`Square with side s = ${d1}`);
        steps.push(``);
        steps.push(`Area = s² = ${d1}² = ${area}`);
        steps.push(`Perimeter = 4s = 4 × ${d1} = ${perimeter}`);
        break;

      case "rectangle":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        area = d1 * d2;
        perimeter = 2 * (d1 + d2);
        formula = "A = l × w";
        steps.push(`Rectangle: length = ${d1}, width = ${d2}`);
        steps.push(``);
        steps.push(`Area = length × width = ${d1} × ${d2} = ${area}`);
        steps.push(`Perimeter = 2(l + w) = 2(${d1} + ${d2}) = ${perimeter}`);
        break;

      case "triangle":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        area = 0.5 * d1 * d2;
        perimeter = 0;
        formula = "A = (1/2) × b × h";
        steps.push(`Triangle: base = ${d1}, height = ${d2}`);
        steps.push(``);
        steps.push(`Area = (1/2) × base × height`);
        steps.push(`Area = (1/2) × ${d1} × ${d2} = ${area}`);
        steps.push(`(Perimeter requires all three sides)`);
        break;

      case "circle":
        if (isNaN(d1) || d1 <= 0) return;
        area = Math.PI * d1 * d1;
        perimeter = 2 * Math.PI * d1;
        formula = "A = πr²";
        steps.push(`Circle with radius r = ${d1}`);
        steps.push(``);
        steps.push(`Area = πr² = π × ${d1}² = π × ${d1 * d1} = ${area.toFixed(4)}`);
        steps.push(`Circumference = 2πr = 2 × π × ${d1} = ${perimeter.toFixed(4)}`);
        break;

      case "trapezoid":
        if (isNaN(d1) || isNaN(d2) || isNaN(d3) || d1 <= 0 || d2 <= 0 || d3 <= 0) return;
        area = 0.5 * (d1 + d2) * d3;
        perimeter = 0;
        formula = "A = (1/2)(b₁ + b₂)h";
        steps.push(`Trapezoid: base₁ = ${d1}, base₂ = ${d2}, height = ${d3}`);
        steps.push(``);
        steps.push(`Area = (1/2) × (base₁ + base₂) × height`);
        steps.push(`Area = (1/2) × (${d1} + ${d2}) × ${d3}`);
        steps.push(`Area = (1/2) × ${d1 + d2} × ${d3} = ${area}`);
        break;

      case "parallelogram":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        area = d1 * d2;
        perimeter = 0;
        formula = "A = b × h";
        steps.push(`Parallelogram: base = ${d1}, height = ${d2}`);
        steps.push(``);
        steps.push(`Area = base × height = ${d1} × ${d2} = ${area}`);
        break;

      case "rhombus":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        area = 0.5 * d1 * d2;
        const side = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2);
        perimeter = 4 * side;
        formula = "A = (1/2) × d₁ × d₂";
        steps.push(`Rhombus: diagonal₁ = ${d1}, diagonal₂ = ${d2}`);
        steps.push(``);
        steps.push(`Area = (1/2) × d₁ × d₂ = (1/2) × ${d1} × ${d2} = ${area}`);
        steps.push(`Side = √[(d₁/2)² + (d₂/2)²] = ${side.toFixed(4)}`);
        steps.push(`Perimeter = 4 × side = ${perimeter.toFixed(4)}`);
        break;

      case "ellipse":
        if (isNaN(d1) || isNaN(d2) || d1 <= 0 || d2 <= 0) return;
        area = Math.PI * d1 * d2;
        perimeter = Math.PI * (3 * (d1 + d2) - Math.sqrt((3 * d1 + d2) * (d1 + 3 * d2)));
        formula = "A = πab";
        steps.push(`Ellipse: semi-major a = ${d1}, semi-minor b = ${d2}`);
        steps.push(``);
        steps.push(`Area = π × a × b = π × ${d1} × ${d2} = ${area.toFixed(4)}`);
        steps.push(`Perimeter ≈ ${perimeter.toFixed(4)} (Ramanujan approximation)`);
        break;

      default:
        return;
    }

    setResult({ area, perimeter, formula, steps });
  };

  const labels = getLabels();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Area Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Shape</Label>
            <Select value={shape} onValueChange={(v) => { setShape(v); setResult(null); }}>
              <SelectTrigger data-testid="select-shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="trapezoid">Trapezoid</SelectItem>
                <SelectItem value="parallelogram">Parallelogram</SelectItem>
                <SelectItem value="rhombus">Rhombus</SelectItem>
                <SelectItem value="ellipse">Ellipse</SelectItem>
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
            Calculate Area
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-area">
                    {result.area.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">square units</p>
                </div>
                {result.perimeter > 0 && (
                  <div className="p-3 bg-background rounded text-center">
                    <p className="text-xs text-muted-foreground">Perimeter</p>
                    <p className="text-2xl font-bold" data-testid="text-perimeter">
                      {result.perimeter.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground">units</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-background rounded text-center">
                <p className="text-sm text-muted-foreground">Formula</p>
                <p className="font-mono text-lg text-primary">{result.formula}</p>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Area</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Area?</h3>
            <p className="text-muted-foreground">
              Area measures the amount of space inside a 2D shape. It's measured in square units 
              (square meters, square feet, etc.). Think of it as how many unit squares would fit 
              inside the shape.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Common Area Formulas</h3>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Square:</span><span className="font-mono">A = s²</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Rectangle:</span><span className="font-mono">A = l × w</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Triangle:</span><span className="font-mono">A = (1/2)bh</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Circle:</span><span className="font-mono">A = πr²</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Trapezoid:</span><span className="font-mono">A = (1/2)(b₁+b₂)h</span>
              </div>
              <div className="p-2 bg-background rounded flex justify-between">
                <span>Parallelogram:</span><span className="font-mono">A = bh</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Flooring:</strong> How much carpet or tile to buy</li>
              <li><strong>Painting:</strong> How much paint for a wall</li>
              <li><strong>Gardening:</strong> Size of a garden plot</li>
              <li><strong>Real estate:</strong> House and land sizes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
