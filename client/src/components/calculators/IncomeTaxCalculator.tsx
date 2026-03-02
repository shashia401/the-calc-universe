import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaxBracketResult {
  bracket: { min: number; max: number; rate: number };
  taxableInBracket: number;
  taxForBracket: number;
}

interface TaxResult {
  grossIncome: number;
  adjustedIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  federalTax: number;
  effectiveRate: number;
  marginalRate: number;
  bracketBreakdown: TaxBracketResult[];
  steps: string[];
}

const brackets: Record<string, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  head: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

const standardDeductions: Record<string, number> = {
  single: 14600,
  married: 29200,
  head: 21900,
};

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [deductions, setDeductions] = useState("");
  const [useStandard, setUseStandard] = useState("standard");
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculate = () => {
    const grossIncome = parseFloat(income);
    if (isNaN(grossIncome) || grossIncome <= 0) return;

    const steps: string[] = [];
    steps.push(`Gross Income: $${grossIncome.toLocaleString()}`);
    steps.push(`Filing Status: ${filingStatus === "married" ? "Married Filing Jointly" : filingStatus === "head" ? "Head of Household" : "Single"}`);
    steps.push("");

    const stdDeduction = standardDeductions[filingStatus];
    let deductionAmount: number;

    if (useStandard === "standard") {
      deductionAmount = stdDeduction;
      steps.push(`Using Standard Deduction: $${stdDeduction.toLocaleString()}`);
    } else {
      deductionAmount = parseFloat(deductions) || 0;
      steps.push(`Using Itemized Deductions: $${deductionAmount.toLocaleString()}`);
      if (deductionAmount < stdDeduction) {
        steps.push(`  Note: Standard deduction ($${stdDeduction.toLocaleString()}) would be higher`);
      }
    }

    const taxableIncome = Math.max(0, grossIncome - deductionAmount);
    steps.push(`Taxable Income: $${grossIncome.toLocaleString()} - $${deductionAmount.toLocaleString()} = $${taxableIncome.toLocaleString()}`);
    steps.push("");
    steps.push("FEDERAL TAX CALCULATION BY BRACKET:");

    const filingBrackets = brackets[filingStatus];
    const bracketBreakdown: TaxBracketResult[] = [];
    let totalTax = 0;
    let marginalRate = 0.10;

    for (const bracket of filingBrackets) {
      if (taxableIncome <= bracket.min) break;
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxForBracket = taxableInBracket * bracket.rate;
      totalTax += taxForBracket;
      marginalRate = bracket.rate;

      bracketBreakdown.push({ bracket, taxableInBracket, taxForBracket });

      const maxDisplay = bracket.max === Infinity ? "+" : `$${bracket.max.toLocaleString()}`;
      steps.push(`  ${(bracket.rate * 100).toFixed(0)}% bracket ($${bracket.min.toLocaleString()} - ${maxDisplay}): $${taxableInBracket.toLocaleString()} x ${(bracket.rate * 100)}% = $${taxForBracket.toFixed(2)}`);
    }

    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

    steps.push("");
    steps.push(`Total Federal Tax: $${totalTax.toFixed(2)}`);
    steps.push(`Marginal Tax Rate: ${(marginalRate * 100).toFixed(0)}%`);
    steps.push(`Effective Tax Rate: ${effectiveRate.toFixed(2)}%`);
    steps.push("");
    steps.push(`After-Tax Income: $${(grossIncome - totalTax).toFixed(2)}`);
    steps.push(`Monthly After-Tax: $${((grossIncome - totalTax) / 12).toFixed(2)}`);

    setResult({
      grossIncome,
      adjustedIncome: grossIncome,
      standardDeduction: deductionAmount,
      taxableIncome,
      federalTax: totalTax,
      effectiveRate,
      marginalRate: marginalRate * 100,
      bracketBreakdown,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Income Tax Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Annual Gross Income ($)</Label>
              <Input
                id="income"
                type="number"
                step="any"
                placeholder="75000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                data-testid="input-income"
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
                  <SelectItem value="head">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deduction-type">Deduction Type</Label>
              <Select value={useStandard} onValueChange={setUseStandard}>
                <SelectTrigger data-testid="select-deduction-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Deduction (${standardDeductions[filingStatus].toLocaleString()})</SelectItem>
                  <SelectItem value="itemized">Itemized Deductions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {useStandard === "itemized" && (
              <div className="space-y-2">
                <Label htmlFor="deductions">Itemized Deductions ($)</Label>
                <Input
                  id="deductions"
                  type="number"
                  step="any"
                  placeholder="20000"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  data-testid="input-deductions"
                />
              </div>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Tax
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-sm opacity-90">Federal Tax</p>
                  <p className="text-xl font-bold" data-testid="text-federal-tax">
                    ${result.federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-xl font-bold" data-testid="text-effective-rate">
                    {result.effectiveRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Marginal Rate</p>
                  <p className="text-xl font-bold" data-testid="text-marginal-rate">
                    {result.marginalRate.toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">After-Tax</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400" data-testid="text-after-tax">
                    ${(result.grossIncome - result.federalTax).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold mb-3">Tax Bracket Breakdown</p>
                <div className="space-y-2">
                  {result.bracketBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="outline" className="min-w-[3rem] justify-center">
                        {(item.bracket.rate * 100).toFixed(0)}%
                      </Badge>
                      <div className="flex-1 h-2 bg-background rounded-md overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-md"
                          style={{ width: `${(item.taxableInBracket / result.taxableIncome) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono min-w-[5rem] text-right" data-testid={`text-bracket-tax-${i}`}>
                        ${item.taxForBracket.toFixed(0)}
                      </span>
                    </div>
                  ))}
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
          <CardTitle className="text-lg">Understanding Federal Income Tax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Progressive Tax System:</strong> The US uses tax brackets where only income within each range is taxed at that rate, not your entire income.</p>
          <p><strong>Marginal vs. Effective Rate:</strong> Your marginal rate is the highest bracket you fall into. Your effective rate is the actual percentage of total income paid in taxes.</p>
          <p><strong>Standard Deduction:</strong> A flat amount you can deduct from your income before calculating tax. For 2024: $14,600 (single), $29,200 (married), $21,900 (head of household).</p>
          <p><strong>Note:</strong> This calculator estimates federal income tax only. State taxes, FICA, and other deductions are not included.</p>
        </CardContent>
      </Card>
    </div>
  );
}