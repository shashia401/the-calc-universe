import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame } from "lucide-react";

interface TDEEResult {
  bmr: number;
  tdee: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
  steps: string[];
}

const activityLevels = [
  { id: "sedentary", name: "Sedentary (office job, little exercise)", factor: 1.2 },
  { id: "light", name: "Lightly Active (light exercise 1-3 days/week)", factor: 1.375 },
  { id: "moderate", name: "Moderately Active (moderate exercise 3-5 days/week)", factor: 1.55 },
  { id: "active", name: "Very Active (hard exercise 6-7 days/week)", factor: 1.725 },
  { id: "extra", name: "Extra Active (very hard exercise, physical job)", factor: 1.9 },
];

export default function TDEECalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [unit, setUnit] = useState("metric");
  const [formula, setFormula] = useState("mifflin");
  const [result, setResult] = useState<TDEEResult | null>(null);

  const calculate = () => {
    let w = parseFloat(weight);
    let h = parseFloat(height);
    const a = parseInt(age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) return;

    const steps: string[] = [];

    if (unit === "imperial") {
      steps.push("Converting to metric:");
      const wKg = w * 0.453592;
      const hCm = h * 2.54;
      steps.push(`Weight: ${w} lbs = ${wKg.toFixed(1)} kg`);
      steps.push(`Height: ${h} in = ${hCm.toFixed(1)} cm`);
      w = wKg;
      h = hCm;
      steps.push("");
    }

    let bmr: number;

    if (formula === "mifflin") {
      steps.push("FORMULA: Mifflin-St Jeor (recommended)");
      steps.push("");
      if (gender === "male") {
        steps.push("Male: BMR = (10 x weight kg) + (6.25 x height cm) - (5 x age) + 5");
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
        steps.push(`BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) + 5`);
      } else {
        steps.push("Female: BMR = (10 x weight kg) + (6.25 x height cm) - (5 x age) - 161");
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
        steps.push(`BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) - 161`);
      }
    } else {
      steps.push("FORMULA: Harris-Benedict (revised)");
      steps.push("");
      if (gender === "male") {
        steps.push("Male: BMR = 88.362 + (13.397 x weight kg) + (4.799 x height cm) - (5.677 x age)");
        bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
        steps.push(`BMR = 88.362 + (13.397 x ${w.toFixed(1)}) + (4.799 x ${h.toFixed(1)}) - (5.677 x ${a})`);
      } else {
        steps.push("Female: BMR = 447.593 + (9.247 x weight kg) + (3.098 x height cm) - (4.330 x age)");
        bmr = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
        steps.push(`BMR = 447.593 + (9.247 x ${w.toFixed(1)}) + (3.098 x ${h.toFixed(1)}) - (4.330 x ${a})`);
      }
    }

    steps.push(`BMR = ${bmr.toFixed(0)} calories/day`);
    steps.push("");

    const actLevel = activityLevels.find((l) => l.id === activity);
    const factor = actLevel?.factor || 1.55;

    steps.push("ACTIVITY MULTIPLIER:");
    steps.push(`${actLevel?.name}`);
    steps.push(`Factor: ${factor}`);
    steps.push("");

    const tdee = bmr * factor;
    steps.push("TDEE CALCULATION:");
    steps.push(`TDEE = BMR x Activity Factor`);
    steps.push(`TDEE = ${bmr.toFixed(0)} x ${factor} = ${tdee.toFixed(0)} calories/day`);
    steps.push("");

    steps.push("CALORIE TARGETS:");
    steps.push(`Mild weight loss (-0.25 kg/week): ${Math.round(tdee - 250)} cal/day`);
    steps.push(`Weight loss (-0.5 kg/week): ${Math.round(tdee - 500)} cal/day`);
    steps.push(`Extreme weight loss (-1 kg/week): ${Math.round(tdee - 1000)} cal/day`);
    steps.push(`Mild weight gain (+0.25 kg/week): ${Math.round(tdee + 250)} cal/day`);
    steps.push(`Weight gain (+0.5 kg/week): ${Math.round(tdee + 500)} cal/day`);

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      extremeLoss: Math.round(tdee - 1000),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            TDEE Calculator
            <Badge variant="secondary">Fitness</Badge>
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
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                data-testid="input-age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
              <Input
                id="weight"
                type="number"
                placeholder={unit === "metric" ? "70" : "154"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                data-testid="input-weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "in"})</Label>
              <Input
                id="height"
                type="number"
                placeholder={unit === "metric" ? "175" : "69"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                data-testid="input-height"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger data-testid="select-activity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Formula</Label>
            <Select value={formula} onValueChange={setFormula}>
              <SelectTrigger data-testid="select-formula">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mifflin">Mifflin-St Jeor (Recommended)</SelectItem>
                <SelectItem value="harris">Harris-Benedict (Revised)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Flame className="h-4 w-4 mr-2" />
            Calculate TDEE
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Basal Metabolic Rate</p>
                  <p className="text-2xl font-bold" data-testid="text-bmr">{result.bmr.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">cal/day</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-center">
                  <p className="text-xs text-muted-foreground">Total Daily Energy</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400" data-testid="text-tdee">
                    {result.tdee.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">cal/day</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Weight Loss Targets</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
                    <p className="text-xs text-green-700 dark:text-green-400">Mild (-0.25kg/wk)</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="text-mild-loss">
                      {result.mildLoss.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950/50 text-center">
                    <p className="text-xs text-green-700 dark:text-green-400">Normal (-0.5kg/wk)</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="text-weight-loss">
                      {result.weightLoss.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
                    <p className="text-xs text-red-700 dark:text-red-400">Extreme (-1kg/wk)</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400" data-testid="text-extreme-loss">
                      {result.extremeLoss.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Weight Gain Targets</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                    <p className="text-xs text-blue-700 dark:text-blue-400">Mild (+0.25kg/wk)</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400" data-testid="text-mild-gain">
                      {result.mildGain.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-center">
                    <p className="text-xs text-blue-700 dark:text-blue-400">Normal (+0.5kg/wk)</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400" data-testid="text-weight-gain">
                      {result.weightGain.toLocaleString()}
                    </p>
                  </div>
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
          <CardTitle className="text-lg">Understanding TDEE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>TDEE (Total Daily Energy Expenditure)</strong> is the total number of calories you burn per day. It accounts for your Basal Metabolic Rate (BMR) plus all physical activity.</p>
          <p><strong>BMR</strong> is the number of calories your body needs at complete rest to maintain basic life functions like breathing, circulation, and cell production.</p>
          <p><strong>To lose weight:</strong> Eat fewer calories than your TDEE. A deficit of 500 cal/day results in roughly 0.5 kg (1 lb) of weight loss per week.</p>
          <p><strong>To gain weight:</strong> Eat more calories than your TDEE. A surplus of 500 cal/day results in roughly 0.5 kg (1 lb) of weight gain per week.</p>
        </CardContent>
      </Card>
    </div>
  );
}
