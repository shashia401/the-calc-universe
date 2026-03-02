import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

interface InflationResult {
  futureValue: number;
  purchasingPower: number;
  totalInflation: number;
  yearlyBreakdown: { year: number; value: number; purchasingPower: number }[];
  steps: string[];
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<InflationResult | null>(null);

  const calculate = () => {
    const A = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseInt(years);

    if (isNaN(A) || isNaN(r) || isNaN(t) || A <= 0 || t <= 0) return;

    const steps: string[] = [];
    const inflationRate = r / 100;

    steps.push("INFLATION ADJUSTMENT FORMULA:");
    steps.push("Future Value = Present Value x (1 + inflation rate)^years");
    steps.push("Purchasing Power = Present Value / (1 + inflation rate)^years");
    steps.push("");
    steps.push(`Present Value: $${A.toLocaleString()}`);
    steps.push(`Annual Inflation Rate: ${r}%`);
    steps.push(`Time Period: ${t} years`);
    steps.push("");

    const futureValue = A * Math.pow(1 + inflationRate, t);
    const purchasingPower = A / Math.pow(1 + inflationRate, t);
    const totalInflation = ((futureValue - A) / A) * 100;

    steps.push("STEP-BY-STEP:");
    steps.push(`(1 + ${inflationRate})^${t} = ${Math.pow(1 + inflationRate, t).toFixed(6)}`);
    steps.push(`Future cost of $${A.toLocaleString()} worth of goods: $${futureValue.toFixed(2)}`);
    steps.push(`Today's $${A.toLocaleString()} will feel like: $${purchasingPower.toFixed(2)}`);
    steps.push(`Total cumulative inflation: ${totalInflation.toFixed(1)}%`);

    const yearlyBreakdown: InflationResult["yearlyBreakdown"] = [];
    for (let year = 1; year <= t; year++) {
      yearlyBreakdown.push({
        year,
        value: A * Math.pow(1 + inflationRate, year),
        purchasingPower: A / Math.pow(1 + inflationRate, year),
      });
    }

    setResult({ futureValue, purchasingPower, totalInflation, yearlyBreakdown, steps });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            Inflation Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Current Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-testid="input-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Inflation Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                placeholder="3.0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                data-testid="input-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Years</Label>
              <Input
                id="years"
                type="number"
                step="1"
                placeholder="10"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                data-testid="input-years"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Inflation Impact
          </Button>

          {result && (
            <div className="mt-6 space-y-4" data-testid="result-inflation">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-md text-center">
                  <p className="text-sm text-orange-800 dark:text-orange-300">Future Cost</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400" data-testid="text-future-value">
                    {formatCurrency(result.futureValue)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Purchasing Power</p>
                  <p className="text-2xl font-bold" data-testid="text-purchasing-power">
                    {formatCurrency(result.purchasingPower)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total Inflation</p>
                  <p className="text-2xl font-bold" data-testid="text-total-inflation">
                    {result.totalInflation.toFixed(1)}%
                  </p>
                </div>
              </div>

              {result.yearlyBreakdown.length <= 15 && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-semibold mb-3">Year-by-Year Breakdown</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.yearlyBreakdown.map((item) => (
                      <div key={item.year} className="flex justify-between text-sm" data-testid={`row-year-${item.year}`}>
                        <span className="text-muted-foreground">Year {item.year}</span>
                        <span>Cost: {formatCurrency(item.value)}</span>
                        <span className="text-muted-foreground">Worth: {formatCurrency(item.purchasingPower)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Understanding Inflation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Inflation</strong> is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time.</p>
          <p><strong>Purchasing Power:</strong> What your money can actually buy. $100 today buys less than $100 did 20 years ago.</p>
          <p><strong>Historical Average:</strong> US inflation has averaged about 3.0-3.5% per year over the long term.</p>
          <p><strong>Why it matters:</strong> Savings that don't grow faster than inflation are actually losing value in real terms.</p>
        </CardContent>
      </Card>
    </div>
  );
}