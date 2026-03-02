import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SavingsResult {
  finalBalance: number;
  totalDeposits: number;
  totalInterest: number;
  monthlyDeposit: number;
  goalReached: boolean;
  monthsToGoal: number | null;
  yearlyBreakdown: { year: number; balance: number; deposits: number; interest: number }[];
  steps: string[];
}

export default function SavingsCalculator() {
  const [initialDeposit, setInitialDeposit] = useState("");
  const [monthlyDeposit, setMonthlyDeposit] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [compounding, setCompounding] = useState("12");
  const [result, setResult] = useState<SavingsResult | null>(null);

  const calculate = () => {
    const P = parseFloat(initialDeposit) || 0;
    const PMT = parseFloat(monthlyDeposit) || 0;
    const r = parseFloat(annualRate);
    const t = parseInt(years);
    const goal = parseFloat(savingsGoal) || 0;
    const n = parseInt(compounding);

    if (isNaN(r) || isNaN(t) || t <= 0) return;

    const steps: string[] = [];
    steps.push("SAVINGS PARAMETERS:");
    steps.push(`  Initial deposit: $${P.toLocaleString()}`);
    steps.push(`  Monthly deposit: $${PMT.toLocaleString()}`);
    steps.push(`  Annual interest rate: ${r}%`);
    steps.push(`  Time period: ${t} years`);
    steps.push(`  Compounding: ${n === 12 ? "Monthly" : n === 4 ? "Quarterly" : n === 1 ? "Annually" : n === 365 ? "Daily" : `${n}x/year`}`);
    if (goal > 0) steps.push(`  Savings goal: $${goal.toLocaleString()}`);
    steps.push("");

    const monthlyRate = r > 0 ? Math.pow(1 + r / 100 / n, n / 12) - 1 : 0;

    steps.push("CALCULATION:");
    if (r > 0) {
      steps.push(`  Monthly effective rate: ${(monthlyRate * 100).toFixed(4)}%`);
    }

    let balance = P;
    let totalDeposits = P;
    const yearlyBreakdown: SavingsResult["yearlyBreakdown"] = [];
    let monthsToGoal: number | null = null;

    for (let year = 1; year <= t; year++) {
      const startBalance = balance;
      let yearDeposits = 0;

      for (let month = 1; month <= 12; month++) {
        balance += PMT;
        yearDeposits += PMT;
        balance *= (1 + monthlyRate);

        if (goal > 0 && monthsToGoal === null && balance >= goal) {
          monthsToGoal = (year - 1) * 12 + month;
        }
      }

      totalDeposits += yearDeposits;
      const yearInterest = balance - startBalance - yearDeposits;

      yearlyBreakdown.push({
        year,
        balance: Math.round(balance),
        deposits: Math.round(yearDeposits),
        interest: Math.round(yearInterest),
      });

      if (year <= 5 || year === t) {
        steps.push(`  Year ${year}: Balance = $${balance.toFixed(2)} (Deposits: $${yearDeposits.toFixed(0)}, Interest: $${yearInterest.toFixed(2)})`);
      } else if (year === 6) {
        steps.push("  ...");
      }
    }

    const totalInterest = balance - totalDeposits;

    steps.push("");
    steps.push("SUMMARY:");
    steps.push(`  Final balance: $${balance.toFixed(2)}`);
    steps.push(`  Total deposited: $${totalDeposits.toFixed(2)}`);
    steps.push(`  Total interest earned: $${totalInterest.toFixed(2)}`);
    steps.push(`  Interest as % of final: ${((totalInterest / balance) * 100).toFixed(1)}%`);

    if (goal > 0) {
      if (monthsToGoal !== null) {
        const goalYears = Math.floor(monthsToGoal / 12);
        const goalMonths = monthsToGoal % 12;
        steps.push("");
        steps.push(`  Goal of $${goal.toLocaleString()} reached in ${goalYears} years, ${goalMonths} months`);
      } else {
        steps.push("");
        steps.push(`  Goal of $${goal.toLocaleString()} NOT reached within ${t} years`);
      }
    }

    setResult({
      finalBalance: balance,
      totalDeposits,
      totalInterest,
      monthlyDeposit: PMT,
      goalReached: goal > 0 ? balance >= goal : true,
      monthsToGoal,
      yearlyBreakdown,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Savings Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Deposit ($)</Label>
              <Input
                id="initial"
                type="number"
                step="any"
                placeholder="5000"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                data-testid="input-initial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Deposit ($)</Label>
              <Input
                id="monthly"
                type="number"
                step="any"
                placeholder="500"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                data-testid="input-monthly"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="4.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                data-testid="input-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Time Period (Years)</Label>
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
            <div className="space-y-2">
              <Label htmlFor="goal">Savings Goal ($, optional)</Label>
              <Input
                id="goal"
                type="number"
                step="any"
                placeholder="100000"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                data-testid="input-goal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compounding">Compounding</Label>
              <Select value={compounding} onValueChange={setCompounding}>
                <SelectTrigger data-testid="select-compounding">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annually</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="365">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Savings
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-sm opacity-90">Final Balance</p>
                  <p className="text-xl font-bold" data-testid="text-final-balance">
                    ${result.finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total Deposited</p>
                  <p className="text-lg font-bold" data-testid="text-total-deposits">
                    ${result.totalDeposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Interest Earned</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="text-total-interest">
                    ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {result.monthsToGoal !== null && (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md text-center">
                  <p className="text-sm text-green-800 dark:text-green-300">Goal Reached In</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400" data-testid="text-months-to-goal">
                    {Math.floor(result.monthsToGoal / 12)} years, {result.monthsToGoal % 12} months
                  </p>
                </div>
              )}

              {savingsGoal && !result.goalReached && (
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-md text-center">
                  <p className="text-sm text-orange-800 dark:text-orange-300" data-testid="text-goal-not-reached">
                    Goal of ${parseFloat(savingsGoal).toLocaleString()} not reached within the time period. Consider increasing monthly deposits or extending the period.
                  </p>
                </div>
              )}

              <div className="w-full h-6 rounded-md overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(result.totalDeposits / result.finalBalance) * 100}%` }}
                />
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(result.totalInterest / result.finalBalance) * 100}%` }}
                />
              </div>
              <div className="flex justify-between gap-2 text-xs flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-blue-500" />
                  Deposits ({((result.totalDeposits / result.finalBalance) * 100).toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-green-500" />
                  Interest ({((result.totalInterest / result.finalBalance) * 100).toFixed(0)}%)
                </span>
              </div>

              {result.yearlyBreakdown.length <= 15 && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-semibold mb-3">Yearly Breakdown</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="text-left p-2">Year</th>
                          <th className="text-right p-2">Balance</th>
                          <th className="text-right p-2">Deposits</th>
                          <th className="text-right p-2">Interest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyBreakdown.map((row) => (
                          <tr key={row.year} className="border-t border-border">
                            <td className="p-2">{row.year}</td>
                            <td className="text-right p-2 font-medium">${row.balance.toLocaleString()}</td>
                            <td className="text-right p-2 text-blue-600 dark:text-blue-400">${row.deposits.toLocaleString()}</td>
                            <td className="text-right p-2 text-green-600 dark:text-green-400">${row.interest.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          <CardTitle className="text-lg">Understanding Savings Growth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Compound Interest:</strong> Interest is calculated on both your initial deposit and accumulated interest, causing exponential growth over time.</p>
          <p><strong>Regular Deposits:</strong> Consistent monthly contributions are the most powerful tool for building savings. Even small amounts add up significantly over years.</p>
          <p><strong>APY vs APR:</strong> APY (Annual Percentage Yield) accounts for compounding and is the actual rate you earn. APR does not include compounding effects.</p>
          <p><strong>Rule of 72:</strong> Divide 72 by your interest rate to estimate how many years it takes to double your money. At 6%, money doubles in roughly 12 years.</p>
        </CardContent>
      </Card>
    </div>
  );
}