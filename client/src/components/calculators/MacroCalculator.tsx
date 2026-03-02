import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Apple } from "lucide-react";

interface MacroResult {
  calories: number;
  protein: { grams: number; calories: number; percent: number };
  carbs: { grams: number; calories: number; percent: number };
  fat: { grams: number; calories: number; percent: number };
  steps: string[];
}

const activityLevels = [
  { id: "sedentary", name: "Sedentary (little or no exercise)", factor: 1.2 },
  { id: "light", name: "Lightly Active (1-3 days/week)", factor: 1.375 },
  { id: "moderate", name: "Moderately Active (3-5 days/week)", factor: 1.55 },
  { id: "active", name: "Very Active (6-7 days/week)", factor: 1.725 },
  { id: "extra", name: "Extra Active (physical job + exercise)", factor: 1.9 },
];

const goals = [
  { id: "lose", name: "Lose Weight", deficit: -500 },
  { id: "maintain", name: "Maintain Weight", deficit: 0 },
  { id: "gain", name: "Gain Muscle", deficit: 300 },
  { id: "bulk", name: "Aggressive Bulk", deficit: 500 },
];

const macroSplits = [
  { id: "balanced", name: "Balanced", protein: 30, carbs: 40, fat: 30 },
  { id: "low-carb", name: "Low Carb", protein: 40, carbs: 20, fat: 40 },
  { id: "high-protein", name: "High Protein", protein: 40, carbs: 35, fat: 25 },
  { id: "keto", name: "Ketogenic", protein: 25, carbs: 5, fat: 70 },
  { id: "zone", name: "Zone Diet (40/30/30)", protein: 30, carbs: 40, fat: 30 },
];

export default function MacroCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [split, setSplit] = useState("balanced");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<MacroResult | null>(null);

  const calculate = () => {
    let w = parseFloat(weight);
    let h = parseFloat(height);
    const a = parseInt(age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) return;

    const steps: string[] = [];

    if (unit === "imperial") {
      const wKg = w * 0.453592;
      const hCm = h * 2.54;
      steps.push("Converting to metric:");
      steps.push(`Weight: ${w} lbs = ${wKg.toFixed(1)} kg`);
      steps.push(`Height: ${h} in = ${hCm.toFixed(1)} cm`);
      w = wKg;
      h = hCm;
      steps.push("");
    }

    steps.push("STEP 1: Calculate BMR (Mifflin-St Jeor)");
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
      steps.push(`Male: BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) + 5`);
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
      steps.push(`Female: BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) - 161`);
    }
    steps.push(`BMR = ${bmr.toFixed(0)} cal/day`);
    steps.push("");

    const actLevel = activityLevels.find((l) => l.id === activity);
    const factor = actLevel?.factor || 1.55;
    const tdee = bmr * factor;

    steps.push("STEP 2: Calculate TDEE");
    steps.push(`TDEE = BMR x Activity Factor`);
    steps.push(`TDEE = ${bmr.toFixed(0)} x ${factor} = ${tdee.toFixed(0)} cal/day`);
    steps.push("");

    const goalInfo = goals.find((g) => g.id === goal);
    const adjustment = goalInfo?.deficit || 0;
    const targetCalories = Math.round(tdee + adjustment);

    steps.push("STEP 3: Apply Goal Adjustment");
    steps.push(`Goal: ${goalInfo?.name} (${adjustment >= 0 ? "+" : ""}${adjustment} cal/day)`);
    steps.push(`Target Calories = ${tdee.toFixed(0)} + (${adjustment}) = ${targetCalories} cal/day`);
    steps.push("");

    const macroSplit = macroSplits.find((s) => s.id === split);
    const proteinPct = macroSplit?.protein || 30;
    const carbsPct = macroSplit?.carbs || 40;
    const fatPct = macroSplit?.fat || 30;

    const proteinCal = targetCalories * (proteinPct / 100);
    const carbsCal = targetCalories * (carbsPct / 100);
    const fatCal = targetCalories * (fatPct / 100);

    const proteinGrams = proteinCal / 4;
    const carbsGrams = carbsCal / 4;
    const fatGrams = fatCal / 9;

    steps.push("STEP 4: Calculate Macronutrients");
    steps.push(`Split: ${macroSplit?.name} (${proteinPct}/${carbsPct}/${fatPct})`);
    steps.push("");
    steps.push(`Protein: ${targetCalories} x ${proteinPct}% = ${proteinCal.toFixed(0)} cal = ${proteinGrams.toFixed(0)}g (4 cal/g)`);
    steps.push(`Carbs: ${targetCalories} x ${carbsPct}% = ${carbsCal.toFixed(0)} cal = ${carbsGrams.toFixed(0)}g (4 cal/g)`);
    steps.push(`Fat: ${targetCalories} x ${fatPct}% = ${fatCal.toFixed(0)} cal = ${fatGrams.toFixed(0)}g (9 cal/g)`);

    setResult({
      calories: targetCalories,
      protein: { grams: Math.round(proteinGrams), calories: Math.round(proteinCal), percent: proteinPct },
      carbs: { grams: Math.round(carbsGrams), calories: Math.round(carbsCal), percent: carbsPct },
      fat: { grams: Math.round(fatGrams), calories: Math.round(fatCal), percent: fatPct },
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-500" />
            Macro Calculator
            <Badge variant="secondary">Nutrition</Badge>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger data-testid="select-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Macro Split</Label>
              <Select value={split} onValueChange={setSplit}>
                <SelectTrigger data-testid="select-split">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {macroSplits.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.protein}/{s.carbs}/{s.fat})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Apple className="h-4 w-4 mr-2" />
            Calculate Macros
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-accent text-center">
                <p className="text-sm text-muted-foreground">Daily Calorie Target</p>
                <p className="text-3xl font-bold" data-testid="text-calories">
                  {result.calories.toLocaleString()} cal
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
                  <p className="text-xs text-red-700 dark:text-red-400">Protein ({result.protein.percent}%)</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-protein">
                    {result.protein.grams}g
                  </p>
                  <p className="text-xs text-muted-foreground">{result.protein.calories} cal</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">Carbs ({result.carbs.percent}%)</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="text-carbs">
                    {result.carbs.grams}g
                  </p>
                  <p className="text-xs text-muted-foreground">{result.carbs.calories} cal</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-400">Fat ({result.fat.percent}%)</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-fat">
                    {result.fat.grams}g
                  </p>
                  <p className="text-xs text-muted-foreground">{result.fat.calories} cal</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500"
                    style={{ width: `${result.protein.percent}%` }}
                  />
                  <div
                    className="bg-yellow-500"
                    style={{ width: `${result.carbs.percent}%` }}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${result.fat.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground gap-1">
                  <span>Protein {result.protein.percent}%</span>
                  <span>Carbs {result.carbs.percent}%</span>
                  <span>Fat {result.fat.percent}%</span>
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
          <CardTitle className="text-lg">Understanding Macronutrients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Protein (4 cal/g):</strong> Essential for muscle repair, immune function, and enzyme production. Higher protein intake helps preserve muscle mass during weight loss and supports muscle growth.</p>
          <p><strong>Carbohydrates (4 cal/g):</strong> Your body's preferred energy source. Important for brain function, high-intensity exercise, and recovery. Choose complex carbs like whole grains, fruits, and vegetables.</p>
          <p><strong>Fat (9 cal/g):</strong> Critical for hormone production, vitamin absorption, and cell membrane integrity. Focus on healthy fats from sources like nuts, avocados, olive oil, and fatty fish.</p>
          <p><strong>Choosing a split:</strong> Active individuals and those trying to build muscle benefit from higher protein. Endurance athletes may need more carbs. Low-carb/keto approaches can work well for some people for weight loss.</p>
        </CardContent>
      </Card>
    </div>
  );
}
