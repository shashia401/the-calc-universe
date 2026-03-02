import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SalaryResult {
  annual: number;
  monthly: number;
  biweekly: number;
  weekly: number;
  daily: number;
  hourly: number;
  estimatedFederalTax: number;
  estimatedStateTax: number;
  estimatedFICA: number;
  netAnnual: number;
  netMonthly: number;
  steps: string[];
}

const federalBrackets2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

function calculateFederalTax(taxableIncome: number): number {
  let tax = 0;
  for (const bracket of federalBrackets2024) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

export default function SalaryCalculator() {
  const [amount, setAmount] = useState("");
  const [inputType, setInputType] = useState("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [filingStatus, setFilingStatus] = useState("single");
  const [stateTaxRate, setStateTaxRate] = useState("5");
  const [result, setResult] = useState<SalaryResult | null>(null);

  const calculate = () => {
    const value = parseFloat(amount);
    const hours = parseFloat(hoursPerWeek);
    const stateRate = parseFloat(stateTaxRate);

    if (isNaN(value) || value <= 0 || isNaN(hours) || hours <= 0) return;

    const steps: string[] = [];
    let annual: number;

    switch (inputType) {
      case "hourly":
        annual = value * hours * 52;
        steps.push(`Hourly to Annual: $${value.toFixed(2)} x ${hours} hrs/week x 52 weeks = $${annual.toLocaleString()}`);
        break;
      case "weekly":
        annual = value * 52;
        steps.push(`Weekly to Annual: $${value.toLocaleString()} x 52 weeks = $${annual.toLocaleString()}`);
        break;
      case "biweekly":
        annual = value * 26;
        steps.push(`Biweekly to Annual: $${value.toLocaleString()} x 26 pay periods = $${annual.toLocaleString()}`);
        break;
      case "monthly":
        annual = value * 12;
        steps.push(`Monthly to Annual: $${value.toLocaleString()} x 12 months = $${annual.toLocaleString()}`);
        break;
      default:
        annual = value;
        steps.push(`Annual salary: $${annual.toLocaleString()}`);
    }

    const monthly = annual / 12;
    const biweekly = annual / 26;
    const weekly = annual / 52;
    const daily = annual / 260;
    const hourly = annual / (hours * 52);

    steps.push("");
    steps.push("SALARY BREAKDOWN:");
    steps.push(`  Annual:   $${annual.toFixed(2)}`);
    steps.push(`  Monthly:  $${monthly.toFixed(2)}`);
    steps.push(`  Biweekly: $${biweekly.toFixed(2)}`);
    steps.push(`  Weekly:   $${weekly.toFixed(2)}`);
    steps.push(`  Daily:    $${daily.toFixed(2)} (260 working days)`);
    steps.push(`  Hourly:   $${hourly.toFixed(2)} (${hours} hrs/week)`);

    const standardDeduction = filingStatus === "married" ? 29200 : 14600;
    const taxableIncome = Math.max(0, annual - standardDeduction);
    steps.push("");
    steps.push("TAX ESTIMATION:");
    steps.push(`  Standard deduction (${filingStatus}): $${standardDeduction.toLocaleString()}`);
    steps.push(`  Taxable income: $${annual.toLocaleString()} - $${standardDeduction.toLocaleString()} = $${taxableIncome.toLocaleString()}`);

    const federalTax = calculateFederalTax(taxableIncome);
    steps.push(`  Federal tax: $${federalTax.toFixed(2)}`);

    const stateTax = annual * (isNaN(stateRate) ? 0 : stateRate / 100);
    steps.push(`  State tax (${stateRate}%): $${stateTax.toFixed(2)}`);

    const socialSecurity = Math.min(annual, 168600) * 0.062;
    const medicare = annual * 0.0145;
    const fica = socialSecurity + medicare;
    steps.push(`  Social Security (6.2%): $${socialSecurity.toFixed(2)}`);
    steps.push(`  Medicare (1.45%): $${medicare.toFixed(2)}`);
    steps.push(`  Total FICA: $${fica.toFixed(2)}`);

    const totalTax = federalTax + stateTax + fica;
    const netAnnual = annual - totalTax;
    steps.push("");
    steps.push(`  Total taxes: $${totalTax.toFixed(2)}`);
    steps.push(`  Net annual pay: $${netAnnual.toFixed(2)}`);
    steps.push(`  Net monthly pay: $${(netAnnual / 12).toFixed(2)}`);
    steps.push(`  Effective tax rate: ${((totalTax / annual) * 100).toFixed(1)}%`);

    setResult({
      annual, monthly, biweekly, weekly, daily, hourly,
      estimatedFederalTax: federalTax,
      estimatedStateTax: stateTax,
      estimatedFICA: fica,
      netAnnual,
      netMonthly: netAnnual / 12,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Salary Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Salary Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="65000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-testid="input-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-type">Pay Period</Label>
              <Select value={inputType} onValueChange={setInputType}>
                <SelectTrigger data-testid="select-input-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Biweekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours per Week</Label>
              <Input
                id="hours"
                type="number"
                step="1"
                placeholder="40"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                data-testid="input-hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filing-status">Filing Status</Label>
              <Select value={filingStatus} onValueChange={setFilingStatus}>
                <SelectTrigger data-testid="select-filing-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state-tax">State Tax Rate (%)</Label>
              <Input
                id="state-tax"
                type="number"
                step="0.1"
                placeholder="5"
                value={stateTaxRate}
                onChange={(e) => setStateTaxRate(e.target.value)}
                data-testid="input-state-tax"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Salary
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-sm opacity-90">Annual</p>
                  <p className="text-xl font-bold" data-testid="text-annual">
                    ${result.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <p className="text-lg font-bold" data-testid="text-monthly">
                    ${result.monthly.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Hourly</p>
                  <p className="text-lg font-bold" data-testid="text-hourly">
                    ${result.hourly.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Biweekly</p>
                  <p className="text-sm font-bold" data-testid="text-biweekly">${result.biweekly.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="text-sm font-bold" data-testid="text-weekly">${result.weekly.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Daily</p>
                  <p className="text-sm font-bold" data-testid="text-daily">${result.daily.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Net Monthly</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400" data-testid="text-net-monthly">${result.netMonthly.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold mb-3">Estimated Tax Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Federal Tax</span>
                    <span data-testid="text-federal-tax">${result.estimatedFederalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">State Tax</span>
                    <span data-testid="text-state-tax">${result.estimatedStateTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FICA (SS + Medicare)</span>
                    <span data-testid="text-fica">${result.estimatedFICA.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Net Annual Pay</span>
                    <span className="text-green-600 dark:text-green-400" data-testid="text-net-annual">${result.netAnnual.toFixed(2)}</span>
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
          <CardTitle className="text-lg">Understanding Salary Conversions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Annual to Hourly:</strong> Divide annual salary by 2,080 (52 weeks x 40 hours) for standard full-time.</p>
          <p><strong>Biweekly Pay:</strong> There are 26 biweekly pay periods in a year (not 24). This is a common misconception.</p>
          <p><strong>FICA Taxes:</strong> Social Security (6.2% up to $168,600) and Medicare (1.45%) are mandatory payroll taxes.</p>
          <p><strong>Effective Tax Rate:</strong> Your actual tax rate after deductions and brackets, usually lower than your marginal rate.</p>
          <p><strong>Note:</strong> Tax estimates are approximate. Actual taxes depend on deductions, credits, and local taxes.</p>
        </CardContent>
      </Card>
    </div>
  );
}