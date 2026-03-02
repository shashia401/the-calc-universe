import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AutoLoanResult {
  vehiclePrice: number;
  totalLoanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  salesTaxAmount: number;
  effectivePrice: number;
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  steps: string[];
}

export default function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [tradeInValue, setTradeInValue] = useState("");
  const [salesTax, setSalesTax] = useState("6");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("60");
  const [result, setResult] = useState<AutoLoanResult | null>(null);

  const calculate = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment) || 0;
    const tradeIn = parseFloat(tradeInValue) || 0;
    const taxRate = parseFloat(salesTax) || 0;
    const rate = parseFloat(interestRate);
    const months = parseInt(loanTerm);

    if (isNaN(price) || price <= 0 || isNaN(rate) || isNaN(months) || months <= 0) return;

    const steps: string[] = [];

    steps.push("VEHICLE COST BREAKDOWN:");
    steps.push(`  Vehicle price: $${price.toLocaleString()}`);

    const taxableAmount = price - tradeIn;
    const salesTaxAmount = Math.max(0, taxableAmount) * (taxRate / 100);
    steps.push(`  Sales tax (${taxRate}% on $${Math.max(0, taxableAmount).toLocaleString()}): $${salesTaxAmount.toFixed(2)}`);

    const totalCost = price + salesTaxAmount;
    steps.push(`  Total cost with tax: $${totalCost.toFixed(2)}`);

    if (tradeIn > 0) steps.push(`  Trade-in value: -$${tradeIn.toLocaleString()}`);
    if (down > 0) steps.push(`  Down payment: -$${down.toLocaleString()}`);

    const loanAmount = Math.max(0, totalCost - down - tradeIn);
    steps.push(`  Loan amount: $${loanAmount.toFixed(2)}`);
    steps.push("");

    const monthlyRate = rate / 100 / 12;
    steps.push("MONTHLY PAYMENT CALCULATION:");
    steps.push(`  Loan amount: $${loanAmount.toFixed(2)}`);
    steps.push(`  Interest rate: ${rate}% annual (${(monthlyRate * 100).toFixed(4)}% monthly)`);
    steps.push(`  Loan term: ${months} months (${(months / 12).toFixed(1)} years)`);
    steps.push("");

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / months;
      steps.push("  Since rate = 0%, payment = loan / months");
      steps.push(`  Monthly payment = $${loanAmount.toFixed(2)} / ${months} = $${monthlyPayment.toFixed(2)}`);
    } else {
      steps.push("  M = P x [r(1+r)^n] / [(1+r)^n - 1]");
      const factor = Math.pow(1 + monthlyRate, months);
      const numerator = monthlyRate * factor;
      const denominator = factor - 1;
      monthlyPayment = loanAmount * (numerator / denominator);

      steps.push(`  (1+r)^n = ${factor.toFixed(6)}`);
      steps.push(`  M = $${loanAmount.toFixed(2)} x (${numerator.toFixed(6)} / ${denominator.toFixed(6)})`);
      steps.push(`  M = $${monthlyPayment.toFixed(2)}`);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    steps.push("");
    steps.push("TOTALS:");
    steps.push(`  Monthly payment: $${monthlyPayment.toFixed(2)}`);
    steps.push(`  Total of payments: $${totalPayment.toFixed(2)}`);
    steps.push(`  Total interest: $${totalInterest.toFixed(2)}`);
    steps.push(`  Total cost of vehicle: $${(down + tradeIn + totalPayment).toFixed(2)}`);

    const schedule: AutoLoanResult["schedule"] = [];
    let balance = loanAmount;

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);

      if (month <= 12 || month > months - 3) {
        schedule.push({ month, payment: monthlyPayment, principal, interest, balance });
      }
    }

    setResult({
      vehiclePrice: price,
      totalLoanAmount: loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      salesTaxAmount,
      effectivePrice: down + tradeIn + totalPayment,
      schedule,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Auto Loan Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-price">Vehicle Price ($)</Label>
              <Input
                id="vehicle-price"
                type="number"
                step="any"
                placeholder="35000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                data-testid="input-vehicle-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down-payment">Down Payment ($)</Label>
              <Input
                id="down-payment"
                type="number"
                step="any"
                placeholder="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                data-testid="input-down-payment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trade-in">Trade-In Value ($)</Label>
              <Input
                id="trade-in"
                type="number"
                step="any"
                placeholder="3000"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
                data-testid="input-trade-in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales-tax">Sales Tax Rate (%)</Label>
              <Input
                id="sales-tax"
                type="number"
                step="0.1"
                placeholder="6"
                value={salesTax}
                onChange={(e) => setSalesTax(e.target.value)}
                data-testid="input-sales-tax"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="5.9"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                data-testid="input-interest-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-term">Loan Term</Label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger data-testid="select-loan-term">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 months (2 years)</SelectItem>
                  <SelectItem value="36">36 months (3 years)</SelectItem>
                  <SelectItem value="48">48 months (4 years)</SelectItem>
                  <SelectItem value="60">60 months (5 years)</SelectItem>
                  <SelectItem value="72">72 months (6 years)</SelectItem>
                  <SelectItem value="84">84 months (7 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Auto Loan
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-sm opacity-90">Monthly Payment</p>
                  <p className="text-xl font-bold" data-testid="text-monthly-payment">
                    ${result.monthlyPayment.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-lg font-bold" data-testid="text-loan-amount">
                    ${result.totalLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400" data-testid="text-total-interest">
                    ${result.totalInterest.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Sales Tax</p>
                  <p className="text-lg font-bold" data-testid="text-sales-tax">
                    ${result.salesTaxAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold mb-3">Amortization Schedule</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left p-2">Month</th>
                        <th className="text-right p-2">Payment</th>
                        <th className="text-right p-2">Principal</th>
                        <th className="text-right p-2">Interest</th>
                        <th className="text-right p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-2">{row.month}</td>
                          <td className="text-right p-2">${row.payment.toFixed(2)}</td>
                          <td className="text-right p-2 text-green-600 dark:text-green-400">${row.principal.toFixed(2)}</td>
                          <td className="text-right p-2 text-orange-600 dark:text-orange-400">${row.interest.toFixed(2)}</td>
                          <td className="text-right p-2">${row.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          <CardTitle className="text-lg">Understanding Auto Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Down Payment:</strong> A larger down payment reduces your loan amount, monthly payments, and total interest paid. Aim for at least 20%.</p>
          <p><strong>Trade-In:</strong> Your current vehicle's value can be applied toward the new purchase, reducing the amount you need to finance. In most states, trade-ins reduce your taxable amount.</p>
          <p><strong>Loan Term:</strong> Shorter terms have higher monthly payments but save significantly on interest. A 36-month loan costs much less in total than a 72-month loan.</p>
          <p><strong>Sales Tax:</strong> Most states charge sales tax on vehicle purchases. Some states tax the full price; others tax the difference after trade-in.</p>
          <p><strong>Tip:</strong> Get pre-approved for financing before visiting the dealership to have leverage in negotiations.</p>
        </CardContent>
      </Card>
    </div>
  );
}