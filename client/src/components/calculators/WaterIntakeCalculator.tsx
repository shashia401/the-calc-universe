import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets } from "lucide-react";

interface WaterResult {
  liters: number;
  cups: number;
  ounces: number;
  bottles: number;
  steps: string[];
}

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("temperate");
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculate = () => {
    let w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    const steps: string[] = [];

    // Convert to kg if needed
    if (unit === "lbs") {
      w = w * 0.453592;
      steps.push(`Weight: ${weight} lbs = ${w.toFixed(1)} kg`);
    } else {
      steps.push(`Weight: ${w} kg`);
    }
    steps.push("");

    // Base calculation: 30-35ml per kg of body weight
    let baseWater = w * 0.033; // liters (33ml per kg)
    steps.push("BASE CALCULATION:");
    steps.push("Rule: 33ml of water per kg of body weight");
    steps.push(`Base = ${w.toFixed(1)} kg × 33ml = ${(w * 33).toFixed(0)} ml = ${baseWater.toFixed(2)} L`);
    steps.push("");

    // Activity adjustment
    let activityMultiplier = 1;
    steps.push("ACTIVITY ADJUSTMENT:");
    switch (activity) {
      case "sedentary":
        activityMultiplier = 0.9;
        steps.push("Sedentary (little to no exercise): -10%");
        break;
      case "light":
        activityMultiplier = 1;
        steps.push("Light activity (1-2 days/week): No change");
        break;
      case "moderate":
        activityMultiplier = 1.1;
        steps.push("Moderate activity (3-5 days/week): +10%");
        break;
      case "active":
        activityMultiplier = 1.2;
        steps.push("Active (6-7 days/week): +20%");
        break;
      case "very_active":
        activityMultiplier = 1.3;
        steps.push("Very active (intense daily exercise): +30%");
        break;
    }
    steps.push("");

    // Climate adjustment
    let climateMultiplier = 1;
    steps.push("CLIMATE ADJUSTMENT:");
    switch (climate) {
      case "cold":
        climateMultiplier = 0.95;
        steps.push("Cold climate: -5%");
        break;
      case "temperate":
        climateMultiplier = 1;
        steps.push("Temperate climate: No change");
        break;
      case "hot":
        climateMultiplier = 1.15;
        steps.push("Hot climate: +15%");
        break;
      case "very_hot":
        climateMultiplier = 1.25;
        steps.push("Very hot/humid climate: +25%");
        break;
    }
    steps.push("");

    const totalLiters = baseWater * activityMultiplier * climateMultiplier;
    steps.push("FINAL CALCULATION:");
    steps.push(`${baseWater.toFixed(2)} L × ${activityMultiplier} (activity) × ${climateMultiplier} (climate)`);
    steps.push(`= ${totalLiters.toFixed(2)} liters per day`);
    steps.push("");

    const cups = totalLiters / 0.25; // 250ml cups
    const ounces = totalLiters * 33.814;
    const bottles = totalLiters / 0.5; // 500ml bottles

    steps.push("CONVERSIONS:");
    steps.push(`${cups.toFixed(1)} cups (250ml each)`);
    steps.push(`${ounces.toFixed(1)} fluid ounces`);
    steps.push(`${bottles.toFixed(1)} standard bottles (500ml each)`);

    setResult({ liters: totalLiters, cups, ounces, bottles, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Water Intake Calculator
            <Badge variant="secondary">Nutrition</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Body Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  step="any"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1"
                  data-testid="input-weight"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-24" data-testid="select-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger data-testid="select-activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (desk job)</SelectItem>
                  <SelectItem value="light">Light (1-2 workouts/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 workouts/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 workouts/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (intense daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Climate</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger data-testid="select-climate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="temperate">Temperate (Average)</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="very_hot">Very Hot / Humid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Droplets className="h-4 w-4 mr-2" />
            Calculate Daily Water Intake
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Daily Water Intake</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-result">
                  {result.liters.toFixed(1)}L
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-background rounded-lg">
                  <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                  <p className="text-xl font-bold">{result.cups.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">cups</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                  <p className="text-xl font-bold">{result.ounces.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">fl oz</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                  <p className="text-xl font-bold">{result.bottles.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">bottles</p>
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
          <CardTitle className="text-lg">Hydration Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>When to drink more:</strong> During exercise, hot weather, illness, or pregnancy/breastfeeding.</p>
          <p><strong>Signs of dehydration:</strong> Dark urine, thirst, dry mouth, fatigue, headache.</p>
          <p><strong>Tip:</strong> Drink a glass of water when you wake up and before each meal.</p>
          <p><strong>Note:</strong> About 20% of daily water comes from food (fruits, vegetables, soups).</p>
        </CardContent>
      </Card>
    </div>
  );
}
