import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600 dark:text-blue-400" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-600 dark:text-green-400" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600 dark:text-yellow-400" };
    return { category: "Obese", color: "text-red-600 dark:text-red-400" };
  };

  const calculate = () => {
    let weightKg: number;
    let heightM: number;

    if (unit === "metric") {
      weightKg = parseFloat(weight);
      heightM = parseFloat(height) / 100;
    } else {
      weightKg = parseFloat(weight) * 0.453592;
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      heightM = totalInches * 0.0254;
    }

    if (weightKg > 0 && heightM > 0) {
      const bmi = weightKg / (heightM * heightM);
      const { category, color } = getBMICategory(bmi);
      setResult({ bmi, category, color });
    }
  };

  return (
    <Card data-testid="calculator-bmi">
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label>Unit System</Label>
          <Select value={unit} onValueChange={(v: "metric" | "imperial") => setUnit(v)}>
            <SelectTrigger data-testid="select-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input
            id="weight"
            type="number"
            placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            data-testid="input-weight"
          />
        </div>

        {unit === "metric" ? (
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              data-testid="input-height"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height-ft">Height (ft)</Label>
              <Input
                id="height-ft"
                type="number"
                placeholder="e.g., 5"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                data-testid="input-height-ft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-in">Height (in)</Label>
              <Input
                id="height-in"
                type="number"
                placeholder="e.g., 9"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                data-testid="input-height-in"
              />
            </div>
          </div>
        )}

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate BMI
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-bmi">
            <div className="p-6 rounded-lg bg-accent text-center">
              <p className="text-sm text-muted-foreground">Your BMI</p>
              <p className="text-4xl font-bold mt-1">{result.bmi.toFixed(1)}</p>
              <p className={`text-lg font-semibold mt-2 ${result.color}`}>
                {result.category}
              </p>
              
              <div className="mt-4 w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-full relative">
                <div
                  className="absolute w-3 h-5 bg-foreground rounded-sm -top-1"
                  style={{
                    left: `${Math.min(Math.max((result.bmi - 15) / 25 * 100, 0), 100)}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="font-semibold text-sm mb-2">How We Calculated This:</p>
              <div className="space-y-2 text-sm">
                <p className="font-mono bg-background p-2 rounded">BMI = Weight (kg) / Height (m) squared</p>
                {unit === "metric" ? (
                  <>
                    <p><span className="font-medium">Step 1:</span> Convert height to meters: {height} cm = {(parseFloat(height) / 100).toFixed(2)} m</p>
                    <p><span className="font-medium">Step 2:</span> Square the height: {(parseFloat(height) / 100).toFixed(2)} x {(parseFloat(height) / 100).toFixed(2)} = {(parseFloat(height) / 100 * parseFloat(height) / 100).toFixed(4)}</p>
                    <p><span className="font-medium">Step 3:</span> Divide weight by height squared: {weight} / {(parseFloat(height) / 100 * parseFloat(height) / 100).toFixed(4)} = <strong>{result.bmi.toFixed(1)}</strong></p>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Step 1:</span> Convert weight to kg: {weight} lbs x 0.4536 = {(parseFloat(weight) * 0.453592).toFixed(2)} kg</p>
                    <p><span className="font-medium">Step 2:</span> Convert height to meters: {heightFt}'{heightIn || 0}" = {((parseFloat(heightFt) * 12 + parseFloat(heightIn || "0")) * 0.0254).toFixed(2)} m</p>
                    <p><span className="font-medium">Step 3:</span> Calculate BMI: {(parseFloat(weight) * 0.453592).toFixed(2)} / ({((parseFloat(heightFt) * 12 + parseFloat(heightIn || "0")) * 0.0254).toFixed(2)})squared = <strong>{result.bmi.toFixed(1)}</strong></p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>BMI Categories:</strong></p>
          <p>Under 18.5: Underweight</p>
          <p>18.5 - 24.9: Normal weight</p>
          <p>25 - 29.9: Overweight</p>
          <p>30+: Obese</p>
        </div>
      </CardContent>
    </Card>
  );
}
