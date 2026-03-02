import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface MarginResult {
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  markup: number;
  steps: string[];
}

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState("margin");
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [margin, setMargin] = useState("");
  const [result, setResult] = useState<MarginResult | null>(null);

  const calculate = () => {
    const steps: string[] = [];
    let rev: number, c: number, profit: number, profitMargin: number, markup: number;

    if (mode === "margin") {
      rev = parseFloat(revenue);
      c = parseFloat(cost);
      if (isNaN(rev) || isNaN(c) || rev <= 0 || c < 0) return;

      profit = rev - c;
      profitMargin = (profit / rev) * 100;
      markup = (profit / c) * 100;

      steps.push("PROFIT MARGIN CALCULATION:");
      steps.push(`Revenue (Selling Price): $${rev.toFixed(2)}`);
      steps.push(`Cost: $${c.toFixed(2)}`);
      steps.push("");
      steps.push("STEP-BY-STEP:");
      steps.push(`Profit = Revenue - Cost = $${rev.toFixed(2)} - $${c.toFixed(2)} = $${profit.toFixed(2)}`);
      steps.push(`Profit Margin = (Profit / Revenue) x 100`);
      steps.push(`Profit Margin = ($${profit.toFixed(2)} / $${rev.toFixed(2)}) x 100 = ${profitMargin.toFixed(2)}%`);
      steps.push("");
      steps.push(`Markup = (Profit / Cost) x 100`);
      steps.push(`Markup = ($${profit.toFixed(2)} / $${c.toFixed(2)}) x 100 = ${markup.toFixed(2)}%`);
    } else if (mode === "revenue") {
      c = parseFloat(cost);
      profitMargin = parseFloat(margin);
      if (isNaN(c) || isNaN(profitMargin) || c < 0 || profitMargin >= 100 || profitMargin < 0) return;

      rev = c / (1 - profitMargin / 100);
      profit = rev - c;
      markup = (profit / c) * 100;

      steps.push("FIND SELLING PRICE FROM MARGIN:");
      steps.push(`Cost: $${c.toFixed(2)}`);
      steps.push(`Desired Profit Margin: ${profitMargin}%`);
      steps.push("");
      steps.push("STEP-BY-STEP:");
      steps.push(`Revenue = Cost / (1 - Margin/100)`);
      steps.push(`Revenue = $${c.toFixed(2)} / (1 - ${profitMargin}%)`);
      steps.push(`Revenue = $${c.toFixed(2)} / ${(1 - profitMargin / 100).toFixed(4)} = $${rev.toFixed(2)}`);
      steps.push(`Profit = $${rev.toFixed(2)} - $${c.toFixed(2)} = $${profit.toFixed(2)}`);
      steps.push(`Markup = ${markup.toFixed(2)}%`);
    } else {
      c = parseFloat(cost);
      markup = parseFloat(margin);
      if (isNaN(c) || isNaN(markup) || c < 0 || markup < 0) return;

      rev = c * (1 + markup / 100);
      profit = rev - c;
      profitMargin = (profit / rev) * 100;

      steps.push("FIND SELLING PRICE FROM MARKUP:");
      steps.push(`Cost: $${c.toFixed(2)}`);
      steps.push(`Markup: ${markup}%`);
      steps.push("");
      steps.push("STEP-BY-STEP:");
      steps.push(`Revenue = Cost x (1 + Markup/100)`);
      steps.push(`Revenue = $${c.toFixed(2)} x ${(1 + markup / 100).toFixed(4)} = $${rev.toFixed(2)}`);
      steps.push(`Profit = $${rev.toFixed(2)} - $${c.toFixed(2)} = $${profit.toFixed(2)}`);
      steps.push(`Profit Margin = ${profitMargin.toFixed(2)}%`);
    }

    setResult({ revenue: rev, cost: c, profit, profitMargin, markup, steps });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Profit Margin Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calculation Mode</Label>
            <Select value={mode} onValueChange={(v) => { setMode(v); setResult(null); }}>
              <SelectTrigger data-testid="select-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="margin">Calculate Margin from Revenue & Cost</SelectItem>
                <SelectItem value="revenue">Find Selling Price from Desired Margin</SelectItem>
                <SelectItem value="markup">Find Selling Price from Markup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === "margin" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue / Selling Price ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    step="any"
                    placeholder="100"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    data-testid="input-revenue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="any"
                    placeholder="60"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    data-testid="input-cost"
                  />
                </div>
              </>
            )}
            {mode === "revenue" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="any"
                    placeholder="60"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    data-testid="input-cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Desired Profit Margin (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    step="0.1"
                    placeholder="40"
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    data-testid="input-margin"
                  />
                </div>
              </>
            )}
            {mode === "markup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="any"
                    placeholder="60"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    data-testid="input-cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Markup (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    step="0.1"
                    placeholder="66.67"
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    data-testid="input-markup"
                  />
                </div>
              </>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>

          {result && (
            <div className="mt-6 space-y-4" data-testid="result-profit-margin">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold" data-testid="text-revenue">{formatCurrency(result.revenue)}</p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-lg font-bold" data-testid="text-cost">{formatCurrency(result.cost)}</p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md text-center">
                  <p className="text-xs text-green-800 dark:text-green-300">Profit</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400" data-testid="text-profit">
                    {formatCurrency(result.profit)}
                  </p>
                </div>
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-xs opacity-90">Margin</p>
                  <p className="text-2xl font-bold" data-testid="text-margin">{result.profitMargin.toFixed(2)}%</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Markup: <strong>{result.markup.toFixed(2)}%</strong></span>
                  <span className="text-sm text-muted-foreground">Margin: <strong>{result.profitMargin.toFixed(2)}%</strong></span>
                </div>
                <div className="mt-3 w-full h-4 rounded-full overflow-hidden flex bg-background">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(result.cost / result.revenue) * 100}%` }}
                  />
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(result.profit / result.revenue) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-500" /> Cost ({((result.cost / result.revenue) * 100).toFixed(0)}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500" /> Profit ({((result.profit / result.revenue) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

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
          <CardTitle className="text-lg">Margin vs. Markup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Profit Margin</strong> = (Profit / Revenue) x 100. Margin is a percentage of the selling price.</p>
          <p><strong>Markup</strong> = (Profit / Cost) x 100. Markup is a percentage of the cost price.</p>
          <p><strong>Key Difference:</strong> A 50% markup results in a 33.3% margin. A 50% margin requires a 100% markup.</p>
          <p><strong>Gross vs Net:</strong> Gross margin only considers direct costs (COGS). Net margin includes all expenses (overhead, taxes, etc.).</p>
        </CardContent>
      </Card>
    </div>
  );
}