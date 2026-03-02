import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeightResult {
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
  bmi: { min: number; max: number };
  average: number;
  steps: string[];
}

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<WeightResult | null>(null);

  const calculate = () => {
    let h = parseFloat(height);
    if (isNaN(h) || h <= 0) return;

    const steps: string[] = [];

    // Convert to inches for formulas
    let heightInches: number;
    if (unit === "metric") {
      heightInches = h / 2.54;
      steps.push(`Height: ${h} cm = ${heightInches.toFixed(1)} inches`);
    } else {
      heightInches = h;
      steps.push(`Height: ${h} inches`);
    }

    const inchesOver5Feet = heightInches - 60;
    steps.push(`Inches over 5 feet: ${heightInches.toFixed(1)} - 60 = ${inchesOver5Feet.toFixed(1)}`);
    steps.push("");

    let robinson: number, miller: number, devine: number, hamwi: number;

    if (gender === "male") {
      steps.push("FORMULAS FOR MEN:");
      steps.push("");

      robinson = 52 + 1.9 * inchesOver5Feet;
      steps.push("Robinson Formula (1983):");
      steps.push(`  52 + 1.9 × ${inchesOver5Feet.toFixed(1)} = ${robinson.toFixed(1)} kg`);

      miller = 56.2 + 1.41 * inchesOver5Feet;
      steps.push("Miller Formula (1983):");
      steps.push(`  56.2 + 1.41 × ${inchesOver5Feet.toFixed(1)} = ${miller.toFixed(1)} kg`);

      devine = 50 + 2.3 * inchesOver5Feet;
      steps.push("Devine Formula (1974):");
      steps.push(`  50 + 2.3 × ${inchesOver5Feet.toFixed(1)} = ${devine.toFixed(1)} kg`);

      hamwi = 48 + 2.7 * inchesOver5Feet;
      steps.push("Hamwi Formula (1964):");
      steps.push(`  48 + 2.7 × ${inchesOver5Feet.toFixed(1)} = ${hamwi.toFixed(1)} kg`);
    } else {
      steps.push("FORMULAS FOR WOMEN:");
      steps.push("");

      robinson = 49 + 1.7 * inchesOver5Feet;
      steps.push("Robinson Formula (1983):");
      steps.push(`  49 + 1.7 × ${inchesOver5Feet.toFixed(1)} = ${robinson.toFixed(1)} kg`);

      miller = 53.1 + 1.36 * inchesOver5Feet;
      steps.push("Miller Formula (1983):");
      steps.push(`  53.1 + 1.36 × ${inchesOver5Feet.toFixed(1)} = ${miller.toFixed(1)} kg`);

      devine = 45.5 + 2.3 * inchesOver5Feet;
      steps.push("Devine Formula (1974):");
      steps.push(`  45.5 + 2.3 × ${inchesOver5Feet.toFixed(1)} = ${devine.toFixed(1)} kg`);

      hamwi = 45.5 + 2.2 * inchesOver5Feet;
      steps.push("Hamwi Formula (1964):");
      steps.push(`  45.5 + 2.2 × ${inchesOver5Feet.toFixed(1)} = ${hamwi.toFixed(1)} kg`);
    }

    steps.push("");

    // BMI-based healthy range (18.5-24.9)
    const heightMeters = (unit === "metric" ? h : h * 2.54) / 100;
    const bmiMin = 18.5 * heightMeters * heightMeters;
    const bmiMax = 24.9 * heightMeters * heightMeters;

    steps.push("HEALTHY BMI RANGE (18.5 - 24.9):");
    steps.push(`Height in meters: ${heightMeters.toFixed(2)} m`);
    steps.push(`Min weight (BMI 18.5): 18.5 × ${heightMeters.toFixed(2)}² = ${bmiMin.toFixed(1)} kg`);
    steps.push(`Max weight (BMI 24.9): 24.9 × ${heightMeters.toFixed(2)}² = ${bmiMax.toFixed(1)} kg`);

    const average = (robinson + miller + devine + hamwi) / 4;
    steps.push("");
    steps.push(`Average of all formulas: ${average.toFixed(1)} kg`);

    setResult({
      robinson,
      miller,
      devine,
      hamwi,
      bmi: { min: bmiMin, max: bmiMax },
      average,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Ideal Weight Calculator
            <Badge variant="secondary">Health</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger data-testid="select-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
              <Input
                id="height"
                type="number"
                step="any"
                placeholder={unit === "metric" ? "170" : "67"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                data-testid="input-height"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger data-testid="select-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Ideal Weight
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Average Ideal Weight</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {result.average.toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ({(result.average * 2.205).toFixed(1)} lbs)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Robinson</p>
                  <p className="text-lg font-bold">{result.robinson.toFixed(1)} kg</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Miller</p>
                  <p className="text-lg font-bold">{result.miller.toFixed(1)} kg</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Devine</p>
                  <p className="text-lg font-bold">{result.devine.toFixed(1)} kg</p>
                </div>
                <div className="p-3 bg-muted rounded text-center">
                  <p className="text-xs text-muted-foreground">Hamwi</p>
                  <p className="text-lg font-bold">{result.hamwi.toFixed(1)} kg</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Healthy Weight Range (BMI 18.5-24.9)</p>
                <div className="flex justify-between items-center">
                  <span>{result.bmi.min.toFixed(1)} kg</span>
                  <div className="flex-1 mx-4 h-3 bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 rounded-full" />
                  <span>{result.bmi.max.toFixed(1)} kg</span>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded max-h-48 overflow-y-auto">
                  {result.steps.map((step, i) => (
                    <div key={i}>{step || <br />}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Ideal Weight Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Note:</strong> These formulas provide estimates. Your ideal weight depends on many factors including muscle mass, bone density, and overall health.</p>
          <p><strong>Robinson (1983):</strong> Most commonly used in clinical settings.</p>
          <p><strong>Devine (1974):</strong> Originally created for medication dosing.</p>
          <p><strong>BMI Range:</strong> The healthy BMI range (18.5-24.9) is often the most reliable indicator.</p>
        </CardContent>
      </Card>
    </div>
  );
}
