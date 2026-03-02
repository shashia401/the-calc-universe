import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  steps: string[];
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [termUnit, setTermUnit] = useState("years");
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    let n = parseFloat(term);

    if (isNaN(P) || isNaN(annualRate) || isNaN(n) || P <= 0 || n <= 0) return;

    const steps: string[] = [];

    // Convert term to months
    if (termUnit === "years") {
      n = n * 12;
      steps.push(`Loan term: ${term} years = ${n} months`);
    } else {
      steps.push(`Loan term: ${n} months`);
    }

    steps.push(`Principal: $${P.toLocaleString()}`);
    steps.push(`Annual interest rate: ${annualRate}%`);
    steps.push("");

    const r = annualRate / 100 / 12; // Monthly rate
    steps.push("MONTHLY PAYMENT FORMULA:");
    steps.push("M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]");
    steps.push("");
    steps.push("Where:");
    steps.push(`  P = $${P.toLocaleString()} (principal)`);
    steps.push(`  r = ${annualRate}% / 12 = ${(r * 100).toFixed(4)}% = ${r.toFixed(6)} (monthly rate)`);
    steps.push(`  n = ${n} (number of payments)`);
    steps.push("");

    let monthlyPayment: number;
    if (r === 0) {
      monthlyPayment = P / n;
      steps.push("Since rate = 0%, payment = principal / months");
      steps.push(`M = $${P.toLocaleString()} / ${n} = $${monthlyPayment.toFixed(2)}`);
    } else {
      const numerator = r * Math.pow(1 + r, n);
      const denominator = Math.pow(1 + r, n) - 1;
      monthlyPayment = P * (numerator / denominator);

      steps.push("STEP-BY-STEP:");
      steps.push(`(1 + r)ⁿ = (1 + ${r.toFixed(6)})^${n} = ${Math.pow(1 + r, n).toFixed(6)}`);
      steps.push(`Numerator = ${r.toFixed(6)} × ${Math.pow(1 + r, n).toFixed(6)} = ${numerator.toFixed(6)}`);
      steps.push(`Denominator = ${Math.pow(1 + r, n).toFixed(6)} - 1 = ${denominator.toFixed(6)}`);
      steps.push(`M = $${P.toLocaleString()} × (${numerator.toFixed(6)} / ${denominator.toFixed(6)})`);
      steps.push(`M = $${monthlyPayment.toFixed(2)}`);
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    steps.push("");
    steps.push("TOTALS:");
    steps.push(`Total paid = $${monthlyPayment.toFixed(2)} × ${n} = $${totalPayment.toFixed(2)}`);
    steps.push(`Total interest = $${totalPayment.toFixed(2)} - $${P.toLocaleString()} = $${totalInterest.toFixed(2)}`);

    // Generate amortization schedule (first 12 and last 3 months)
    const schedule: LoanResult["schedule"] = [];
    let balance = P;

    for (let month = 1; month <= n; month++) {
      const interest = balance * r;
      const principalPaid = monthlyPayment - interest;
      balance = Math.max(0, balance - principalPaid);

      if (month <= 12 || month > n - 3) {
        schedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPaid,
          interest,
          balance,
        });
      }
    }

    setResult({ monthlyPayment, totalPayment, totalInterest, schedule, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Loan Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Loan Amount ($)</Label>
              <Input
                id="principal"
                type="number"
                step="any"
                placeholder="10000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                data-testid="input-principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="5.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                data-testid="input-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Loan Term</Label>
              <div className="flex gap-2">
                <Input
                  id="term"
                  type="number"
                  step="1"
                  placeholder="5"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="flex-1"
                  data-testid="input-term"
                />
                <Select value={termUnit} onValueChange={setTermUnit}>
                  <SelectTrigger className="w-28" data-testid="select-term-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Loan
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-primary text-primary-foreground rounded-lg text-center">
                  <p className="text-sm opacity-90">Monthly Payment</p>
                  <p className="text-2xl font-bold" data-testid="text-monthly">
                    ${result.monthlyPayment.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="text-xl font-bold">${result.totalPayment.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-xl font-bold text-orange-600">${result.totalInterest.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
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
                          <td className="text-right p-2 text-green-600">${row.principal.toFixed(2)}</td>
                          <td className="text-right p-2 text-orange-600">${row.interest.toFixed(2)}</td>
                          <td className="text-right p-2">${row.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Understanding Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Principal:</strong> The amount you borrow.</p>
          <p><strong>Interest:</strong> The cost of borrowing money, expressed as a percentage.</p>
          <p><strong>Amortization:</strong> Early payments are mostly interest. Later payments are mostly principal.</p>
          <p><strong>Tip:</strong> Making extra payments reduces total interest significantly!</p>
        </CardContent>
      </Card>
    </div>
  );
}
