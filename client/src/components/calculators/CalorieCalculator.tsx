import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flame } from "lucide-react";

interface CalorieResult {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  weightGain: number;
}

const activityLevels = [
  { id: "sedentary", name: "Sedentary (little or no exercise)", factor: 1.2 },
  { id: "light", name: "Lightly active (1-3 days/week)", factor: 1.375 },
  { id: "moderate", name: "Moderately active (3-5 days/week)", factor: 1.55 },
  { id: "active", name: "Very active (6-7 days/week)", factor: 1.725 },
  { id: "extra", name: "Extra active (physical job)", factor: 1.9 },
];

export function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculate = () => {
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);
    const ageYears = parseInt(age);

    if (unit === "imperial") {
      weightKg = weightKg * 0.453592;
      heightCm = heightCm * 2.54;
    }

    if (weightKg > 0 && heightCm > 0 && ageYears > 0) {
      let bmr: number;
      if (gender === "male") {
        bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
      } else {
        bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
      }

      const activityFactor = activityLevels.find((a) => a.id === activity)?.factor || 1.55;
      const maintenance = bmr * activityFactor;

      setResult({
        bmr: Math.round(bmr),
        maintenance: Math.round(maintenance),
        weightLoss: Math.round(maintenance - 500),
        weightGain: Math.round(maintenance + 500),
      });
    }
  };

  return (
    <Card data-testid="calculator-calorie">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Calorie Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Unit System</Label>
          <Select value={unit} onValueChange={(v: "metric" | "imperial") => setUnit(v)}>
            <SelectTrigger data-testid="select-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(v: "male" | "female") => setGender(v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" data-testid="radio-male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" data-testid="radio-female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
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

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate Calories
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-calorie">
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Basal Metabolic Rate (BMR)</p>
              <p className="text-xl font-bold">{result.bmr.toLocaleString()} cal/day</p>
            </div>

            <div className="p-6 rounded-lg bg-accent text-center">
              <p className="text-sm text-muted-foreground">Daily Calorie Needs</p>
              <p className="text-4xl font-bold text-primary">{result.maintenance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">calories/day to maintain weight</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center">
                <p className="text-xs text-green-800 dark:text-green-300">Weight Loss</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">
                  {result.weightLoss.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">-500 cal/day</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-center">
                <p className="text-xs text-blue-800 dark:text-blue-300">Weight Gain</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {result.weightGain.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">+500 cal/day</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
