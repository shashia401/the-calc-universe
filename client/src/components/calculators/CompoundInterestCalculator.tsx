import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

interface CompoundResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: { year: number; balance: number; interest: number; contributions: number }[];
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [compoundFrequency, setCompoundFrequency] = useState("12");
  const [result, setResult] = useState<CompoundResult | null>(null);

  const calculate = () => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = parseFloat(interestRate) / 100;
    const t = parseInt(years);
    const n = parseInt(compoundFrequency);

    if (r >= 0 && t > 0) {
      const yearlyBreakdown: CompoundResult["yearlyBreakdown"] = [];
      let balance = P;
      let totalContributions = P;

      const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

      for (let year = 1; year <= t; year++) {
        const yearlyContribution = PMT * 12;
        const startBalance = balance;
        
        for (let month = 0; month < 12; month++) {
          balance += PMT;
          balance *= 1 + monthlyRate;
        }
        
        totalContributions += yearlyContribution;
        const yearInterest = balance - startBalance - yearlyContribution;
        
        yearlyBreakdown.push({
          year,
          balance: Math.round(balance),
          interest: Math.round(yearInterest),
          contributions: Math.round(yearlyContribution),
        });
      }

      setResult({
        finalBalance: Math.round(balance),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(balance - totalContributions),
        yearlyBreakdown,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card data-testid="calculator-compound-interest">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Compound Interest Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Initial Investment ($)</Label>
            <Input
              id="principal"
              type="number"
              placeholder="10000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              data-testid="input-principal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly">Monthly Contribution ($)</Label>
            <Input
              id="monthly"
              type="number"
              placeholder="500"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              data-testid="input-monthly"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              placeholder="7"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              data-testid="input-rate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Investment Period (years)</Label>
            <Input
              id="years"
              type="number"
              placeholder="20"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              data-testid="input-years"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Compound Frequency</Label>
          <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
            <SelectTrigger data-testid="select-frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Semi-annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate Growth
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-compound">
            <div className="p-6 rounded-lg bg-accent text-center">
              <p className="text-sm text-muted-foreground">Final Balance</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(result.finalBalance)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">Total Contributions</p>
                <p className="text-lg font-semibold">{formatCurrency(result.totalContributions)}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center">
                <p className="text-xs text-green-800 dark:text-green-300">Total Interest Earned</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>
            </div>

            <div className="w-full h-6 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(result.totalContributions / result.finalBalance) * 100}%`,
                }}
              />
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${(result.totalInterest / result.finalBalance) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-500" />
                Contributions ({((result.totalContributions / result.finalBalance) * 100).toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500" />
                Interest ({((result.totalInterest / result.finalBalance) * 100).toFixed(0)}%)
              </span>
            </div>

            {result.yearlyBreakdown.length <= 10 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Yearly Growth</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.yearlyBreakdown.map((item) => (
                    <div key={item.year} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Year {item.year}</span>
                      <span className="font-medium">{formatCurrency(item.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="font-semibold text-sm mb-2">How Compound Interest Works:</p>
              <div className="space-y-2 text-sm">
                <p className="font-mono bg-background p-2 rounded text-xs">
                  A = P(1 + r/n)^(nt) + PMT x (((1 + r/n)^(nt) - 1) / (r/n))
                </p>
                <p><span className="font-medium">The Magic of Compounding:</span> Your interest earns interest!</p>
                <p>
                  <span className="font-medium">Example:</span> With {formatCurrency(parseFloat(principal) || 0)} initial + {formatCurrency(parseFloat(monthlyContribution) * 12 || 0)}/year contributions at {interestRate}% interest:
                </p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>You contributed: {formatCurrency(result.totalContributions)}</li>
                  <li>Interest earned: {formatCurrency(result.totalInterest)} (that's free money!)</li>
                  <li>Your money grew by {((result.totalInterest / result.totalContributions) * 100).toFixed(0)}% from interest alone</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
