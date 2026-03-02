import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse } from "lucide-react";

interface BMRResult {
  mifflin: number;
  harris: number;
  average: number;
  steps: string[];
}

export default function BMRCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<BMRResult | null>(null);

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

    let mifflin: number;
    let harris: number;

    steps.push("METHOD 1: Mifflin-St Jeor Equation (1990)");
    steps.push("Considered the most accurate for most people.");
    steps.push("");
    if (gender === "male") {
      steps.push("Male: BMR = (10 x weight) + (6.25 x height) - (5 x age) + 5");
      mifflin = 10 * w + 6.25 * h - 5 * a + 5;
      steps.push(`BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) + 5`);
      steps.push(`BMR = ${(10 * w).toFixed(1)} + ${(6.25 * h).toFixed(1)} - ${5 * a} + 5`);
    } else {
      steps.push("Female: BMR = (10 x weight) + (6.25 x height) - (5 x age) - 161");
      mifflin = 10 * w + 6.25 * h - 5 * a - 161;
      steps.push(`BMR = (10 x ${w.toFixed(1)}) + (6.25 x ${h.toFixed(1)}) - (5 x ${a}) - 161`);
      steps.push(`BMR = ${(10 * w).toFixed(1)} + ${(6.25 * h).toFixed(1)} - ${5 * a} - 161`);
    }
    steps.push(`Mifflin-St Jeor BMR = ${mifflin.toFixed(0)} calories/day`);
    steps.push("");

    steps.push("METHOD 2: Harris-Benedict Equation (Revised 1984)");
    steps.push("A classic formula, slightly less accurate than Mifflin-St Jeor.");
    steps.push("");
    if (gender === "male") {
      steps.push("Male: BMR = 88.362 + (13.397 x weight) + (4.799 x height) - (5.677 x age)");
      harris = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
      steps.push(`BMR = 88.362 + (13.397 x ${w.toFixed(1)}) + (4.799 x ${h.toFixed(1)}) - (5.677 x ${a})`);
      steps.push(`BMR = 88.362 + ${(13.397 * w).toFixed(1)} + ${(4.799 * h).toFixed(1)} - ${(5.677 * a).toFixed(1)}`);
    } else {
      steps.push("Female: BMR = 447.593 + (9.247 x weight) + (3.098 x height) - (4.330 x age)");
      harris = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
      steps.push(`BMR = 447.593 + (9.247 x ${w.toFixed(1)}) + (3.098 x ${h.toFixed(1)}) - (4.330 x ${a})`);
      steps.push(`BMR = 447.593 + ${(9.247 * w).toFixed(1)} + ${(3.098 * h).toFixed(1)} - ${(4.33 * a).toFixed(1)}`);
    }
    steps.push(`Harris-Benedict BMR = ${harris.toFixed(0)} calories/day`);
    steps.push("");

    const average = (mifflin + harris) / 2;
    steps.push("COMPARISON:");
    steps.push(`Mifflin-St Jeor: ${mifflin.toFixed(0)} cal/day`);
    steps.push(`Harris-Benedict: ${harris.toFixed(0)} cal/day`);
    steps.push(`Average: ${average.toFixed(0)} cal/day`);
    steps.push(`Difference: ${Math.abs(mifflin - harris).toFixed(0)} cal/day`);

    setResult({
      mifflin: Math.round(mifflin),
      harris: Math.round(harris),
      average: Math.round(average),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-red-500" />
            BMR Calculator
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

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <HeartPulse className="h-4 w-4 mr-2" />
            Calculate BMR
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
                  <p className="text-xs text-muted-foreground">Mifflin-St Jeor</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-mifflin">
                    {result.mifflin.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">cal/day</p>
                  <Badge variant="secondary" className="mt-1">Recommended</Badge>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <p className="text-xs text-muted-foreground">Harris-Benedict</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-harris">
                    {result.harris.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">cal/day</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent text-center">
                <p className="text-sm text-muted-foreground">Average BMR</p>
                <p className="text-3xl font-bold" data-testid="text-average">
                  {result.average.toLocaleString()} cal/day
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is the minimum calories your body needs at complete rest
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-semibold mb-2">What this means:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Your body burns approximately <strong>{result.average.toLocaleString()} calories per day</strong> just to keep you alive (breathing, blood circulation, cell production).</p>
                  <p>You should <strong>never eat below your BMR</strong> for extended periods as this can slow your metabolism and cause health issues.</p>
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
          <CardTitle className="text-lg">Understanding BMR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>BMR (Basal Metabolic Rate)</strong> is the number of calories your body needs to perform basic life-sustaining functions. These include breathing, circulation, cell production, nutrient processing, and protein synthesis.</p>
          <p><strong>Mifflin-St Jeor vs Harris-Benedict:</strong> The Mifflin-St Jeor equation (1990) is generally considered more accurate for modern populations. The Harris-Benedict equation (revised 1984) is older but still widely used.</p>
          <p><strong>Factors affecting BMR:</strong> Age (decreases with age), gender (men typically have higher BMR), body composition (more muscle = higher BMR), genetics, and hormonal balance.</p>
          <p><strong>Important:</strong> BMR only accounts for calories burned at rest. Your actual daily calorie needs (TDEE) are higher due to physical activity and the thermic effect of food.</p>
        </CardContent>
      </Card>
    </div>
  );
}
