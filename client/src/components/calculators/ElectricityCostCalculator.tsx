import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface ElectricityResult {
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  steps: string[];
}

export default function ElectricityCostCalculator() {
  const [wattage, setWattage] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [costPerKwh, setCostPerKwh] = useState("0.12");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<ElectricityResult | null>(null);

  const calculate = () => {
    const watts = parseFloat(wattage);
    const hours = parseFloat(hoursPerDay);
    const rate = parseFloat(costPerKwh);
    const qty = parseInt(quantity) || 1;

    if (isNaN(watts) || isNaN(hours) || isNaN(rate) || watts <= 0 || hours <= 0 || rate <= 0) return;

    const steps: string[] = [];

    const totalWatts = watts * qty;
    steps.push(`Power: ${watts}W x ${qty} unit${qty > 1 ? "s" : ""} = ${totalWatts}W`);

    const dailyKwh = (totalWatts * hours) / 1000;
    steps.push(`Daily energy: ${totalWatts}W x ${hours} hours / 1000 = ${dailyKwh.toFixed(3)} kWh`);

    const dailyCost = dailyKwh * rate;
    steps.push(`Daily cost: ${dailyKwh.toFixed(3)} kWh x $${rate} = $${dailyCost.toFixed(4)}`);

    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    steps.push("");
    steps.push(`Weekly cost: $${dailyCost.toFixed(4)} x 7 = $${weeklyCost.toFixed(2)}`);
    steps.push(`Monthly cost (30 days): $${dailyCost.toFixed(4)} x 30 = $${monthlyCost.toFixed(2)}`);
    steps.push(`Yearly cost: $${dailyCost.toFixed(4)} x 365 = $${yearlyCost.toFixed(2)}`);
    steps.push("");
    steps.push(`Monthly energy: ${monthlyKwh.toFixed(2)} kWh`);
    steps.push(`Yearly energy: ${yearlyKwh.toFixed(2)} kWh`);

    setResult({ dailyCost, weeklyCost, monthlyCost, yearlyCost, dailyKwh, monthlyKwh, yearlyKwh, steps });
  };

  const presets = [
    { name: "LED Bulb", watts: 10 },
    { name: "Laptop", watts: 65 },
    { name: "Desktop PC", watts: 300 },
    { name: "TV (55\")", watts: 100 },
    { name: "Refrigerator", watts: 150 },
    { name: "AC Unit", watts: 1500 },
    { name: "Space Heater", watts: 1500 },
    { name: "Washer", watts: 500 },
    { name: "Dryer", watts: 3000 },
    { name: "Microwave", watts: 1000 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Electricity Cost Calculator
            <Badge variant="secondary">Utility</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wattage">Power Consumption (Watts)</Label>
              <Input
                id="wattage"
                type="number"
                step="any"
                placeholder="e.g., 100"
                value={wattage}
                onChange={(e) => setWattage(e.target.value)}
                data-testid="input-wattage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Used Per Day</Label>
              <Input
                id="hours"
                type="number"
                step="any"
                placeholder="e.g., 8"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                data-testid="input-hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Electricity Rate ($/kWh)</Label>
              <Input
                id="rate"
                type="number"
                step="any"
                placeholder="e.g., 0.12"
                value={costPerKwh}
                onChange={(e) => setCostPerKwh(e.target.value)}
                data-testid="input-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Units</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="e.g., 1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                data-testid="input-quantity"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Quick Presets:</p>
            <div className="flex gap-2 flex-wrap">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setWattage(preset.watts.toString())}
                  data-testid={`button-preset-${preset.name.toLowerCase().replace(/[\s"()]/g, "-")}`}
                >
                  {preset.name} ({preset.watts}W)
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Cost
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Daily</p>
                  <p className="text-xl font-bold" data-testid="text-daily">${result.dailyCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{result.dailyKwh.toFixed(2)} kWh</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Weekly</p>
                  <p className="text-xl font-bold" data-testid="text-weekly">${result.weeklyCost.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Monthly</p>
                  <p className="text-xl font-bold" data-testid="text-monthly">${result.monthlyCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{result.monthlyKwh.toFixed(1)} kWh</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Yearly</p>
                  <p className="text-xl font-bold" data-testid="text-yearly">${result.yearlyCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{result.yearlyKwh.toFixed(0)} kWh</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Calculation Steps:</p>
                <div className="text-sm font-mono">
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
          <CardTitle className="text-lg">Understanding Electricity Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold mb-1">How It Works</p>
            <p>Electricity is measured in kilowatt-hours (kWh). One kWh is using 1,000 watts for one hour. Your utility bill charges you per kWh consumed.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Average US Electricity Rates</p>
            <p>The national average is about $0.12/kWh, but rates vary widely by state from $0.08 to over $0.30/kWh.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Energy Saving Tips</p>
            <p>Switch to LED bulbs, use smart power strips, upgrade to Energy Star appliances, and adjust your thermostat by 2-3 degrees to save significantly.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
