import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark } from "lucide-react";

interface RetirementResult {
  totalAtRetirement: number;
  totalContributions: number;
  employerContributions: number;
  totalInterest: number;
  inflationAdjusted: number;
  monthlyRetirementIncome: number;
  yearlyBreakdown: { year: number; age: number; balance: number; contributions: number }[];
  steps: string[];
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [employerMatch, setEmployerMatch] = useState("");
  const [matchLimit, setMatchLimit] = useState("");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [retirementYears, setRetirementYears] = useState("25");
  const [accountType, setAccountType] = useState("401k");
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculate = () => {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution);
    const match = parseFloat(employerMatch) || 0;
    const limit = parseFloat(matchLimit) || 100;
    const annualReturn = parseFloat(returnRate) / 100;
    const inflation = parseFloat(inflationRate) / 100;
    const retYears = parseInt(retirementYears) || 25;

    if (isNaN(age) || isNaN(retAge) || isNaN(monthly) || age >= retAge || monthly < 0) return;

    const steps: string[] = [];
    const yearsToRetirement = retAge - age;
    const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;

    steps.push("RETIREMENT PROJECTION:");
    steps.push(`Current Age: ${age} | Retirement Age: ${retAge}`);
    steps.push(`Years to Retirement: ${yearsToRetirement}`);
    steps.push(`Account Type: ${accountType === "401k" ? "401(k)" : accountType === "ira" ? "IRA" : "Roth IRA"}`);
    steps.push(`Current Savings: $${savings.toLocaleString()}`);
    steps.push(`Monthly Contribution: $${monthly.toFixed(2)}`);

    const employerMonthly = monthly * Math.min(match / 100, limit / 100);
    if (match > 0) {
      steps.push(`Employer Match: ${match}% (up to ${limit}% of salary contribution)`);
      steps.push(`Employer Monthly Contribution: $${employerMonthly.toFixed(2)}`);
    }

    steps.push(`Expected Annual Return: ${(annualReturn * 100).toFixed(1)}%`);
    steps.push(`Inflation Rate: ${(inflation * 100).toFixed(1)}%`);
    steps.push("");

    let balance = savings;
    let totalContributions = savings;
    let totalEmployerContributions = 0;
    const yearlyBreakdown: RetirementResult["yearlyBreakdown"] = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearContribution = monthly * 12;
      const yearEmployer = employerMonthly * 12;

      for (let month = 0; month < 12; month++) {
        balance += monthly + employerMonthly;
        balance *= 1 + monthlyRate;
      }

      totalContributions += yearContribution;
      totalEmployerContributions += yearEmployer;

      if (year <= 5 || year > yearsToRetirement - 3 || year % 5 === 0) {
        yearlyBreakdown.push({
          year,
          age: age + year,
          balance: Math.round(balance),
          contributions: Math.round(totalContributions + totalEmployerContributions),
        });
      }
    }

    const totalAtRetirement = balance;
    const totalInterest = totalAtRetirement - totalContributions - totalEmployerContributions;
    const inflationAdjusted = totalAtRetirement / Math.pow(1 + inflation, yearsToRetirement);

    const realReturn = annualReturn - inflation;
    let monthlyIncome: number;
    if (realReturn <= 0) {
      monthlyIncome = inflationAdjusted / (retYears * 12);
    } else {
      const monthlyRealRate = realReturn / 12;
      monthlyIncome = (inflationAdjusted * monthlyRealRate) / (1 - Math.pow(1 + monthlyRealRate, -retYears * 12));
    }

    steps.push("RESULTS:");
    steps.push(`Total at Retirement: $${Math.round(totalAtRetirement).toLocaleString()}`);
    steps.push(`Your Contributions: $${Math.round(totalContributions).toLocaleString()}`);
    if (totalEmployerContributions > 0) {
      steps.push(`Employer Contributions: $${Math.round(totalEmployerContributions).toLocaleString()}`);
    }
    steps.push(`Investment Growth: $${Math.round(totalInterest).toLocaleString()}`);
    steps.push("");
    steps.push(`Inflation-Adjusted Value (today's dollars): $${Math.round(inflationAdjusted).toLocaleString()}`);
    steps.push(`Estimated Monthly Income (${retYears} yr withdrawal): $${Math.round(monthlyIncome).toLocaleString()}`);

    setResult({
      totalAtRetirement: Math.round(totalAtRetirement),
      totalContributions: Math.round(totalContributions),
      employerContributions: Math.round(totalEmployerContributions),
      totalInterest: Math.round(totalInterest),
      inflationAdjusted: Math.round(inflationAdjusted),
      monthlyRetirementIncome: Math.round(monthlyIncome),
      yearlyBreakdown,
      steps,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-blue-500" />
            Retirement Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-age">Current Age</Label>
              <Input
                id="current-age"
                type="number"
                placeholder="30"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                data-testid="input-current-age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input
                id="retirement-age"
                type="number"
                placeholder="65"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                data-testid="input-retirement-age"
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger data-testid="select-account-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="401k">401(k)</SelectItem>
                  <SelectItem value="ira">Traditional IRA</SelectItem>
                  <SelectItem value="roth">Roth IRA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-savings">Current Savings ($)</Label>
              <Input
                id="current-savings"
                type="number"
                step="any"
                placeholder="50000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                data-testid="input-current-savings"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
              <Input
                id="monthly-contribution"
                type="number"
                step="any"
                placeholder="500"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                data-testid="input-monthly-contribution"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employer-match">Employer Match (%)</Label>
              <Input
                id="employer-match"
                type="number"
                step="1"
                placeholder="50"
                value={employerMatch}
                onChange={(e) => setEmployerMatch(e.target.value)}
                data-testid="input-employer-match"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="match-limit">Match Limit (% of contribution)</Label>
              <Input
                id="match-limit"
                type="number"
                step="1"
                placeholder="6"
                value={matchLimit}
                onChange={(e) => setMatchLimit(e.target.value)}
                data-testid="input-match-limit"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="return-rate">Expected Return (%)</Label>
              <Input
                id="return-rate"
                type="number"
                step="0.1"
                placeholder="7"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                data-testid="input-return-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
              <Input
                id="inflation-rate"
                type="number"
                step="0.1"
                placeholder="3"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                data-testid="input-inflation-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirement-years">Years in Retirement</Label>
              <Input
                id="retirement-years"
                type="number"
                step="1"
                placeholder="25"
                value={retirementYears}
                onChange={(e) => setRetirementYears(e.target.value)}
                data-testid="input-retirement-years"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Retirement
          </Button>

          {result && (
            <div className="mt-6 space-y-4" data-testid="result-retirement">
              <div className="p-6 rounded-md bg-accent text-center">
                <p className="text-sm text-muted-foreground">Total at Retirement</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-total">
                  {formatCurrency(result.totalAtRetirement)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(result.inflationAdjusted)} in today's dollars
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Your Contributions</p>
                  <p className="text-lg font-bold" data-testid="text-contributions">
                    {formatCurrency(result.totalContributions)}
                  </p>
                </div>
                {result.employerContributions > 0 && (
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-md text-center">
                    <p className="text-xs text-blue-800 dark:text-blue-300">Employer Match</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400" data-testid="text-employer">
                      {formatCurrency(result.employerContributions)}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md text-center">
                  <p className="text-xs text-green-800 dark:text-green-300">Investment Growth</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400" data-testid="text-growth">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-xs opacity-90">Monthly Income</p>
                  <p className="text-lg font-bold" data-testid="text-monthly-income">
                    {formatCurrency(result.monthlyRetirementIncome)}
                  </p>
                </div>
              </div>

              <div className="w-full h-6 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(result.totalContributions / result.totalAtRetirement) * 100}%` }}
                />
                {result.employerContributions > 0 && (
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${(result.employerContributions / result.totalAtRetirement) * 100}%` }}
                  />
                )}
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(result.totalInterest / result.totalAtRetirement) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500" /> Your Contributions
                </span>
                {result.employerContributions > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-purple-500" /> Employer Match
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500" /> Growth
                </span>
              </div>

              {result.yearlyBreakdown.length > 0 && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-semibold mb-3">Growth Projection</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.yearlyBreakdown.map((item) => (
                      <div key={item.year} className="flex justify-between text-sm" data-testid={`row-year-${item.year}`}>
                        <span className="text-muted-foreground">Age {item.age} (Year {item.year})</span>
                        <span className="font-medium">{formatCurrency(item.balance)}</span>
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
          <CardTitle className="text-lg">Retirement Planning Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>401(k):</strong> Employer-sponsored plan with pre-tax contributions. Many employers match a percentage of your contributions.</p>
          <p><strong>Traditional IRA:</strong> Individual retirement account with tax-deductible contributions. Taxes paid on withdrawal.</p>
          <p><strong>Roth IRA:</strong> After-tax contributions, but qualified withdrawals are tax-free. Great if you expect higher taxes in retirement.</p>
          <p><strong>Employer Match:</strong> Free money! Always contribute enough to get the full match.</p>
          <p><strong>Rule of Thumb:</strong> Aim to save 15% of your income for retirement and have 25x your annual expenses saved by retirement.</p>
        </CardContent>
      </Card>
    </div>
  );
}