import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BodyFatResult {
  bodyFat: number;
  category: string;
  leanMass: number;
  fatMass: number;
  steps: string[];
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const getCategory = (bf: number, isMale: boolean): string => {
    if (isMale) {
      if (bf < 6) return "Essential Fat";
      if (bf < 14) return "Athletes";
      if (bf < 18) return "Fitness";
      if (bf < 25) return "Average";
      return "Above Average";
    } else {
      if (bf < 14) return "Essential Fat";
      if (bf < 21) return "Athletes";
      if (bf < 25) return "Fitness";
      if (bf < 32) return "Average";
      return "Above Average";
    }
  };

  const calculate = () => {
    let h = parseFloat(height);
    let w = parseFloat(weight);
    let n = parseFloat(neck);
    let wa = parseFloat(waist);
    let hi = gender === "female" ? parseFloat(hip) : 0;

    if (isNaN(h) || isNaN(w) || isNaN(n) || isNaN(wa) || h <= 0 || w <= 0 || n <= 0 || wa <= 0) return;
    if (gender === "female" && (isNaN(hi) || hi <= 0)) return;

    const steps: string[] = [];

    // Convert to cm if using imperial
    if (unit === "imperial") {
      h = h * 2.54;
      n = n * 2.54;
      wa = wa * 2.54;
      hi = hi * 2.54;
      w = w * 0.453592;
      steps.push("Converting measurements to metric...");
      steps.push(`Height: ${height} in → ${h.toFixed(2)} cm`);
      steps.push(`Weight: ${weight} lbs → ${w.toFixed(2)} kg`);
      steps.push("");
    }

    steps.push("Using the U.S. Navy Body Fat Formula");
    steps.push("");

    let bodyFat: number;

    if (gender === "male") {
      if (wa <= n) {
        steps.push("Error: Waist measurement must be greater than neck measurement for the Navy formula.");
        setResult({ bodyFat: 0, category: "Invalid", leanMass: 0, fatMass: 0, steps });
        return;
      }
      steps.push("Male Formula:");
      steps.push("BF% = 495 / (1.0324 - 0.19077 × log10(waist-neck) + 0.15456 × log10(height)) - 450");
      steps.push("");
      steps.push(`Waist - Neck = ${wa.toFixed(1)} - ${n.toFixed(1)} = ${(wa - n).toFixed(1)} cm`);
      steps.push(`log10(${(wa - n).toFixed(1)}) = ${Math.log10(wa - n).toFixed(4)}`);
      steps.push(`log10(${h.toFixed(1)}) = ${Math.log10(h).toFixed(4)}`);

      const denom = 1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h);
      bodyFat = 495 / denom - 450;

      steps.push("");
      steps.push(`Denominator = 1.0324 - 0.19077 × ${Math.log10(wa - n).toFixed(4)} + 0.15456 × ${Math.log10(h).toFixed(4)}`);
      steps.push(`Denominator = ${denom.toFixed(4)}`);
      steps.push(`BF% = 495 / ${denom.toFixed(4)} - 450 = ${bodyFat.toFixed(1)}%`);
    } else {
      if (wa + hi <= n) {
        steps.push("Error: Waist + hip must be greater than neck measurement for the Navy formula.");
        setResult({ bodyFat: 0, category: "Invalid", leanMass: 0, fatMass: 0, steps });
        return;
      }
      steps.push("Female Formula:");
      steps.push("BF% = 495 / (1.29579 - 0.35004 × log10(waist+hip-neck) + 0.22100 × log10(height)) - 450");
      steps.push("");
      steps.push(`Waist + Hip - Neck = ${wa.toFixed(1)} + ${hi.toFixed(1)} - ${n.toFixed(1)} = ${(wa + hi - n).toFixed(1)} cm`);
      steps.push(`log10(${(wa + hi - n).toFixed(1)}) = ${Math.log10(wa + hi - n).toFixed(4)}`);
      steps.push(`log10(${h.toFixed(1)}) = ${Math.log10(h).toFixed(4)}`);

      const denom = 1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.22100 * Math.log10(h);
      bodyFat = 495 / denom - 450;

      steps.push("");
      steps.push(`Denominator = 1.29579 - 0.35004 × ${Math.log10(wa + hi - n).toFixed(4)} + 0.22100 × ${Math.log10(h).toFixed(4)}`);
      steps.push(`Denominator = ${denom.toFixed(4)}`);
      steps.push(`BF% = 495 / ${denom.toFixed(4)} - 450 = ${bodyFat.toFixed(1)}%`);
    }

    bodyFat = Math.max(0, Math.min(bodyFat, 60));
    const fatMass = w * (bodyFat / 100);
    const leanMass = w - fatMass;
    const category = getCategory(bodyFat, gender === "male");

    steps.push("");
    steps.push("Body Composition:");
    steps.push(`Fat Mass = ${w.toFixed(1)} kg × ${bodyFat.toFixed(1)}% = ${fatMass.toFixed(1)} kg`);
    steps.push(`Lean Mass = ${w.toFixed(1)} kg - ${fatMass.toFixed(1)} kg = ${leanMass.toFixed(1)} kg`);

    setResult({ bodyFat, category, leanMass, fatMass, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Body Fat Calculator
            <Badge variant="secondary">Health</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>Unit System</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger data-testid="select-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
              <Input
                id="weight"
                type="number"
                step="any"
                placeholder={unit === "metric" ? "70" : "154"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                data-testid="input-weight"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neck">Neck Circumference ({unit === "metric" ? "cm" : "in"})</Label>
              <Input
                id="neck"
                type="number"
                step="any"
                placeholder={unit === "metric" ? "38" : "15"}
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                data-testid="input-neck"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist">Waist Circumference ({unit === "metric" ? "cm" : "in"})</Label>
              <Input
                id="waist"
                type="number"
                step="any"
                placeholder={unit === "metric" ? "85" : "33"}
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                data-testid="input-waist"
              />
            </div>
          </div>

          {gender === "female" && (
            <div className="space-y-2">
              <Label htmlFor="hip">Hip Circumference ({unit === "metric" ? "cm" : "in"})</Label>
              <Input
                id="hip"
                type="number"
                step="any"
                placeholder={unit === "metric" ? "100" : "40"}
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                data-testid="input-hip"
              />
            </div>
          )}

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Body Fat
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Body Fat</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {result.bodyFat.toFixed(1)}%
                </p>
                <Badge className="mt-2">{result.category}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-sm text-muted-foreground">Fat Mass</p>
                  <p className="text-xl font-bold">{result.fatMass.toFixed(1)} kg</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-sm text-muted-foreground">Lean Mass</p>
                  <p className="text-xl font-bold">{result.leanMass.toFixed(1)} kg</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Body Fat Categories</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-2">Men</p>
              <ul className="space-y-1">
                <li>Essential: 2-5%</li>
                <li>Athletes: 6-13%</li>
                <li>Fitness: 14-17%</li>
                <li>Average: 18-24%</li>
                <li>Above Average: 25%+</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Women</p>
              <ul className="space-y-1">
                <li>Essential: 10-13%</li>
                <li>Athletes: 14-20%</li>
                <li>Fitness: 21-24%</li>
                <li>Average: 25-31%</li>
                <li>Above Average: 32%+</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
