import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SlopeResult {
  slope: number | null;
  yIntercept: number;
  equation: string;
  angle: number;
  distance: number;
  midpoint: { x: number; y: number };
  slopeType: string;
  steps: string[];
}

export default function SlopeCalculator() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [result, setResult] = useState<SlopeResult | null>(null);

  const calculate = () => {
    const px1 = parseFloat(x1);
    const py1 = parseFloat(y1);
    const px2 = parseFloat(x2);
    const py2 = parseFloat(y2);

    if (isNaN(px1) || isNaN(py1) || isNaN(px2) || isNaN(py2)) return;

    const steps: string[] = [];
    const deltaX = px2 - px1;
    const deltaY = py2 - py1;

    steps.push(`Given points: (${px1}, ${py1}) and (${px2}, ${py2})`);
    steps.push(``);
    steps.push(`Step 1: Calculate rise and run`);
    steps.push(`  Rise (Δy) = y₂ - y₁ = ${py2} - ${py1} = ${deltaY}`);
    steps.push(`  Run (Δx) = x₂ - x₁ = ${px2} - ${px1} = ${deltaX}`);
    steps.push(``);

    let slope: number | null;
    let slopeType: string;
    let equation: string;
    let yIntercept: number;

    if (deltaX === 0) {
      slope = null;
      slopeType = "Undefined (vertical line)";
      equation = `x = ${px1}`;
      yIntercept = NaN;
      steps.push(`Step 2: Calculate slope`);
      steps.push(`  Slope = rise / run = ${deltaY} / 0 = undefined`);
      steps.push(`  This is a vertical line.`);
    } else {
      slope = deltaY / deltaX;
      yIntercept = py1 - slope * px1;

      if (slope === 0) {
        slopeType = "Zero (horizontal line)";
      } else if (slope > 0) {
        slopeType = "Positive (rising from left to right)";
      } else {
        slopeType = "Negative (falling from left to right)";
      }

      steps.push(`Step 2: Calculate slope`);
      steps.push(`  Slope (m) = rise / run = ${deltaY} / ${deltaX} = ${slope.toFixed(4)}`);
      steps.push(``);
      steps.push(`Step 3: Find y-intercept using point-slope form`);
      steps.push(`  y - y₁ = m(x - x₁)`);
      steps.push(`  y - ${py1} = ${slope.toFixed(4)}(x - ${px1})`);
      steps.push(`  y = ${slope.toFixed(4)}x + ${yIntercept.toFixed(4)}`);

      if (yIntercept >= 0) {
        equation = `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
      } else {
        equation = `y = ${slope.toFixed(2)}x - ${Math.abs(yIntercept).toFixed(2)}`;
      }
    }

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const midpoint = { x: (px1 + px2) / 2, y: (py1 + py2) / 2 };
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    steps.push(``);
    steps.push(`Additional calculations:`);
    steps.push(`  Distance = √[(Δx)² + (Δy)²] = √[${deltaX * deltaX} + ${deltaY * deltaY}] = ${distance.toFixed(4)}`);
    steps.push(`  Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2) = (${midpoint.x}, ${midpoint.y})`);
    steps.push(`  Angle = arctan(Δy/Δx) = ${angle.toFixed(2)}°`);

    setResult({
      slope,
      yIntercept,
      equation,
      angle,
      distance,
      midpoint,
      slopeType,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Slope Calculator
            <Badge variant="secondary">Geometry</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded">
              <p className="text-sm font-semibold mb-2">Point 1 (x₁, y₁)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">x₁</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={x1}
                    onChange={(e) => setX1(e.target.value)}
                    data-testid="input-x1"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">y₁</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={y1}
                    onChange={(e) => setY1(e.target.value)}
                    data-testid="input-y1"
                  />
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-sm font-semibold mb-2">Point 2 (x₂, y₂)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">x₂</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={x2}
                    onChange={(e) => setX2(e.target.value)}
                    data-testid="input-x2"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">y₂</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={y2}
                    onChange={(e) => setY2(e.target.value)}
                    data-testid="input-y2"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Slope
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Slope (m)</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-slope">
                    {result.slope !== null ? result.slope.toFixed(4) : "Undefined"}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.slopeType}</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Equation</p>
                  <p className="text-lg font-bold font-mono" data-testid="text-equation">
                    {result.equation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-bold">{result.distance.toFixed(4)}</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Midpoint</p>
                  <p className="font-bold">({result.midpoint.x}, {result.midpoint.y})</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="text-xs text-muted-foreground">Angle</p>
                  <p className="font-bold">{result.angle.toFixed(2)}°</p>
                </div>
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

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setX1("0"); setY1("0"); setX2("4"); setY2("3"); }}>
              (0,0) to (4,3)
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setX1("1"); setY1("2"); setX2("3"); setY2("6"); }}>
              (1,2) to (3,6)
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setX1("2"); setY1("5"); setX2("2"); setY2("1"); }}>
              Vertical line
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Slope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Slope?</h3>
            <p className="text-muted-foreground">
              Slope measures the steepness and direction of a line. It's the ratio of vertical 
              change (rise) to horizontal change (run) between any two points on the line.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <p className="font-mono text-center text-xl text-primary py-2">
              m = (y₂ - y₁) / (x₂ - x₁) = rise / run
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Types of Slope</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Positive slope (m &gt; 0)</p>
                <p className="text-muted-foreground">Line rises from left to right ↗</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Negative slope (m &lt; 0)</p>
                <p className="text-muted-foreground">Line falls from left to right ↘</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Zero slope (m = 0)</p>
                <p className="text-muted-foreground">Horizontal line →</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Undefined slope</p>
                <p className="text-muted-foreground">Vertical line ↑</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Slope-Intercept Form</h3>
            <p className="font-mono text-center text-primary py-2">y = mx + b</p>
            <p className="text-muted-foreground">
              Where m is the slope and b is the y-intercept (where the line crosses the y-axis).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Examples</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Road grades:</strong> A 6% grade means 6 feet rise per 100 feet run</li>
              <li><strong>Roof pitch:</strong> Often expressed as rise:run (e.g., 4:12)</li>
              <li><strong>Ramps:</strong> ADA requires max slope of 1:12 for wheelchair ramps</li>
              <li><strong>Economics:</strong> Rate of change in prices or quantities</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
