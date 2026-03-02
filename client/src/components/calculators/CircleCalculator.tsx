import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CircleResult {
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
  steps: string[];
}

export default function CircleCalculator() {
  const [inputType, setInputType] = useState("radius");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CircleResult | null>(null);

  const calculate = () => {
    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) return;

    const steps: string[] = [];
    let radius: number;

    switch (inputType) {
      case "radius":
        radius = val;
        steps.push(`Given: Radius (r) = ${val}`);
        break;
      case "diameter":
        radius = val / 2;
        steps.push(`Given: Diameter (d) = ${val}`);
        steps.push(`Radius = d / 2 = ${val} / 2 = ${radius}`);
        break;
      case "circumference":
        radius = val / (2 * Math.PI);
        steps.push(`Given: Circumference (C) = ${val}`);
        steps.push(`Using C = 2πr, so r = C / (2π)`);
        steps.push(`Radius = ${val} / (2 × π) = ${radius.toFixed(4)}`);
        break;
      case "area":
        radius = Math.sqrt(val / Math.PI);
        steps.push(`Given: Area (A) = ${val}`);
        steps.push(`Using A = πr², so r = √(A/π)`);
        steps.push(`Radius = √(${val} / π) = ${radius.toFixed(4)}`);
        break;
      default:
        return;
    }

    const diameter = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;

    steps.push(``);
    steps.push(`Step-by-step calculations:`);
    steps.push(``);
    steps.push(`Diameter = 2 × radius`);
    steps.push(`  d = 2 × ${radius.toFixed(4)} = ${diameter.toFixed(4)}`);
    steps.push(``);
    steps.push(`Circumference = 2πr`);
    steps.push(`  C = 2 × π × ${radius.toFixed(4)}`);
    steps.push(`  C = ${circumference.toFixed(4)}`);
    steps.push(``);
    steps.push(`Area = πr²`);
    steps.push(`  A = π × ${radius.toFixed(4)}²`);
    steps.push(`  A = π × ${(radius * radius).toFixed(4)}`);
    steps.push(`  A = ${area.toFixed(4)}`);

    setResult({ radius, diameter, circumference, area, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Circle Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Known Value</Label>
              <Select value={inputType} onValueChange={setInputType}>
                <SelectTrigger data-testid="select-input-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radius">Radius</SelectItem>
                  <SelectItem value="diameter">Diameter</SelectItem>
                  <SelectItem value="circumference">Circumference</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="any"
                min="0"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                data-testid="input-value"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Circle Properties
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Radius (r)</p>
                  <p className="text-xl font-bold text-primary" data-testid="text-radius">
                    {result.radius.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Diameter (d)</p>
                  <p className="text-xl font-bold" data-testid="text-diameter">
                    {result.diameter.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Circumference (C)</p>
                  <p className="text-xl font-bold" data-testid="text-circumference">
                    {result.circumference.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Area (A)</p>
                  <p className="text-xl font-bold" data-testid="text-area">
                    {result.area.toFixed(4)}
                  </p>
                </div>
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
            <Button variant="outline" size="sm" onClick={() => { setInputType("radius"); setValue("5"); }}>
              r = 5
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setInputType("diameter"); setValue("10"); }}>
              d = 10
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setInputType("area"); setValue("100"); }}>
              A = 100
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Circles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Circle?</h3>
            <p className="text-muted-foreground">
              A circle is a shape where all points are the same distance from the center. 
              This distance is called the radius. A circle has no corners or edges - it's 
              perfectly round.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Formulas</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">Diameter = 2r</p>
                <p className="text-muted-foreground">Diameter is twice the radius</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">Circumference = 2πr = πd</p>
                <p className="text-muted-foreground">Distance around the circle</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono text-primary">Area = πr²</p>
                <p className="text-muted-foreground">Space inside the circle</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">The Number Pi (π)</h3>
            <p className="text-muted-foreground">
              Pi (π) is a special number approximately equal to <strong>3.14159...</strong>
            </p>
            <p className="text-muted-foreground mt-2">
              It represents the ratio of a circle's circumference to its diameter. Pi is an 
              irrational number, meaning its decimal representation never ends and never repeats.
            </p>
            <p className="font-mono text-primary mt-2 text-center">
              π ≈ 3.14159265358979...
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Circle Parts</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Center:</strong> The middle point of the circle</li>
              <li><strong>Radius:</strong> Distance from center to any point on the circle</li>
              <li><strong>Diameter:</strong> Distance across the circle through the center</li>
              <li><strong>Circumference:</strong> The perimeter (distance around)</li>
              <li><strong>Chord:</strong> A line segment connecting two points on the circle</li>
              <li><strong>Arc:</strong> A portion of the circumference</li>
              <li><strong>Sector:</strong> A "pie slice" of the circle</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example</h3>
            <p className="text-muted-foreground mb-2">
              A pizza has a radius of 6 inches. Find its circumference and area.
            </p>
            <div className="text-muted-foreground">
              <p>Circumference = 2 × π × 6 = 12π ≈ 37.7 inches</p>
              <p>Area = π × 6² = 36π ≈ 113.1 square inches</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Circles</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Wheels and tires</li>
              <li>Pizzas and pies</li>
              <li>Coins and buttons</li>
              <li>Clock faces</li>
              <li>The Earth's orbit (approximately)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
