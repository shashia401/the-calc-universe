import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ROIResult {
  roi: number;
  annualizedROI: number;
  netProfit: number;
  totalReturn: number;
  investmentGain: number;
  steps: string[];
}

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [additionalCosts, setAdditionalCosts] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [annualDividends, setAnnualDividends] = useState("");
  const [result, setResult] = useState<ROIResult | null>(null);

  const calculate = () => {
    const initial = parseFloat(initialInvestment);
    const final_ = parseFloat(finalValue);
    const costs = parseFloat(additionalCosts) || 0;
    const years = parseFloat(investmentPeriod) || 0;
    const dividends = parseFloat(annualDividends) || 0;

    if (isNaN(initial) || isNaN(final_) || initial <= 0) return;

    const steps: string[] = [];

    steps.push("INVESTMENT PARAMETERS:");
    steps.push(`  Initial investment: $${initial.toLocaleString()}`);
    steps.push(`  Final value: $${final_.toLocaleString()}`);
    if (costs > 0) steps.push(`  Additional costs: $${costs.toLocaleString()}`);
    if (dividends > 0 && years > 0) steps.push(`  Annual dividends: $${dividends.toLocaleString()}`);
    if (years > 0) steps.push(`  Investment period: ${years} years`);
    steps.push("");

    const totalCost = initial + costs;
    const totalDividends = dividends * Math.max(years, 1);
    const totalReturn = final_ + totalDividends;
    const netProfit = totalReturn - totalCost;
    const investmentGain = final_ - initial;

    steps.push("ROI CALCULATION:");
    steps.push("  ROI = (Net Profit / Total Cost) x 100");
    steps.push("");

    if (costs > 0) {
      steps.push(`  Total cost = $${initial.toLocaleString()} + $${costs.toLocaleString()} = $${totalCost.toLocaleString()}`);
    } else {
      steps.push(`  Total cost = $${totalCost.toLocaleString()}`);
    }

    if (dividends > 0 && years > 0) {
      steps.push(`  Total dividends = $${dividends.toLocaleString()} x ${years} years = $${totalDividends.toLocaleString()}`);
      steps.push(`  Total return = $${final_.toLocaleString()} + $${totalDividends.toLocaleString()} = $${totalReturn.toLocaleString()}`);
    }

    steps.push(`  Net profit = $${totalReturn.toLocaleString()} - $${totalCost.toLocaleString()} = $${netProfit.toLocaleString()}`);

    const roi = (netProfit / totalCost) * 100;
    steps.push(`  ROI = ($${netProfit.toLocaleString()} / $${totalCost.toLocaleString()}) x 100 = ${roi.toFixed(2)}%`);

    let annualizedROI = 0;
    if (years > 0) {
      steps.push("");
      steps.push("ANNUALIZED ROI:");
      steps.push("  Annualized ROI = [(1 + ROI)^(1/years) - 1] x 100");

      if (roi > -100) {
        annualizedROI = (Math.pow(1 + roi / 100, 1 / years) - 1) * 100;
        steps.push(`  Annualized ROI = [(1 + ${(roi / 100).toFixed(4)})^(1/${years}) - 1] x 100`);
        steps.push(`  Annualized ROI = ${annualizedROI.toFixed(2)}%`);
      } else {
        steps.push("  Cannot calculate annualized ROI for total loss");
      }
    }

    steps.push("");
    steps.push("SUMMARY:");
    steps.push(`  Investment gain/loss: $${investmentGain.toLocaleString()}`);
    steps.push(`  Net profit (with costs & dividends): $${netProfit.toLocaleString()}`);
    steps.push(`  ROI: ${roi.toFixed(2)}%`);
    if (years > 0) steps.push(`  Annualized ROI: ${annualizedROI.toFixed(2)}%`);

    setResult({
      roi,
      annualizedROI,
      netProfit,
      totalReturn,
      investmentGain,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            ROI Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Investment ($)</Label>
              <Input
                id="initial"
                type="number"
                step="any"
                placeholder="10000"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                data-testid="input-initial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="final">Final Value ($)</Label>
              <Input
                id="final"
                type="number"
                step="any"
                placeholder="15000"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                data-testid="input-final"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costs">Additional Costs ($, optional)</Label>
              <Input
                id="costs"
                type="number"
                step="any"
                placeholder="500"
                value={additionalCosts}
                onChange={(e) => setAdditionalCosts(e.target.value)}
                data-testid="input-costs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Investment Period (Years, optional)</Label>
              <Input
                id="period"
                type="number"
                step="0.1"
                placeholder="3"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                data-testid="input-period"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dividends">Annual Dividends ($, optional)</Label>
              <Input
                id="dividends"
                type="number"
                step="any"
                placeholder="200"
                value={annualDividends}
                onChange={(e) => setAnnualDividends(e.target.value)}
                data-testid="input-dividends"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate ROI
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-sm opacity-90">ROI</p>
                  <p className="text-xl font-bold" data-testid="text-roi">
                    {result.roi.toFixed(2)}%
                  </p>
                </div>
                {investmentPeriod && (
                  <div className="p-4 bg-muted rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Annualized ROI</p>
                    <p className="text-xl font-bold" data-testid="text-annualized-roi">
                      {result.annualizedROI.toFixed(2)}%
                    </p>
                  </div>
                )}
                <div className={`p-4 rounded-md text-center ${result.netProfit >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                  <p className={`text-sm ${result.netProfit >= 0 ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>Net Profit</p>
                  <p className={`text-xl font-bold ${result.netProfit >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`} data-testid="text-net-profit">
                    ${result.netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className="text-xl font-bold" data-testid="text-total-return">
                    ${result.totalReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold mb-3">Investment Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Investment</span>
                    <span>${parseFloat(initialInvestment).toLocaleString()}</span>
                  </div>
                  {additionalCosts && parseFloat(additionalCosts) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Costs</span>
                      <span>${parseFloat(additionalCosts).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Value</span>
                    <span>${parseFloat(finalValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capital Gain/Loss</span>
                    <span className={result.investmentGain >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      ${result.investmentGain.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Net Profit</span>
                    <span className={result.netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      ${result.netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
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
          <CardTitle className="text-lg">Understanding Return on Investment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>ROI Formula:</strong> ROI = (Net Profit / Total Investment Cost) x 100. A positive ROI means the investment gained value; negative means it lost value.</p>
          <p><strong>Annualized ROI:</strong> Adjusts ROI for the time period to allow fair comparison between investments of different durations. A 50% return over 5 years is different from 50% over 1 year.</p>
          <p><strong>Total Return:</strong> Includes both capital gains (price appreciation) and income (dividends, interest, rent) from the investment.</p>
          <p><strong>Limitations:</strong> ROI does not account for risk, inflation, or opportunity cost. Two investments with the same ROI may have very different risk profiles.</p>
          <p><strong>Tip:</strong> Always compare annualized ROI when evaluating investments with different time horizons.</p>
        </CardContent>
      </Card>
    </div>
  );
}