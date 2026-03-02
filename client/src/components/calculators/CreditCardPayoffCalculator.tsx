import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface PayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  monthlyBreakdown: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  steps: string[];
}

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [result, setResult] = useState<PayoffResult | null>(null);

  const calculate = () => {
    const B = parseFloat(balance);
    const r = parseFloat(apr);
    const P = parseFloat(monthlyPayment);

    if (isNaN(B) || isNaN(r) || isNaN(P) || B <= 0 || r < 0 || P <= 0) return;

    const steps: string[] = [];
    const monthlyRate = r / 100 / 12;

    steps.push("CREDIT CARD PAYOFF CALCULATION:");
    steps.push(`Current Balance: $${B.toLocaleString()}`);
    steps.push(`APR: ${r}%`);
    steps.push(`Monthly Interest Rate: ${r}% / 12 = ${(monthlyRate * 100).toFixed(4)}%`);
    steps.push(`Monthly Payment: $${P.toFixed(2)}`);
    steps.push("");

    const minPayment = B * monthlyRate;
    if (P <= minPayment) {
      steps.push(`PROBLEM: Your payment of $${P.toFixed(2)} is less than or equal to`);
      steps.push(`the monthly interest charge of $${minPayment.toFixed(2)}.`);
      steps.push("You will never pay off this balance! Increase your monthly payment.");
      setResult({
        monthsToPayoff: Infinity,
        yearsToPayoff: Infinity,
        totalInterest: Infinity,
        totalPaid: Infinity,
        monthlyBreakdown: [],
        steps,
      });
      return;
    }

    if (monthlyRate === 0) {
      const months = Math.ceil(B / P);
      steps.push(`With 0% APR, payoff = Balance / Payment = ${months} months`);
      setResult({
        monthsToPayoff: months,
        yearsToPayoff: months / 12,
        totalInterest: 0,
        totalPaid: B,
        monthlyBreakdown: [],
        steps,
      });
      return;
    }

    const monthsToPayoff = Math.ceil(
      -Math.log(1 - (monthlyRate * B) / P) / Math.log(1 + monthlyRate)
    );

    steps.push("PAYOFF FORMULA:");
    steps.push("n = -log(1 - (r x B) / P) / log(1 + r)");
    steps.push(`n = -log(1 - (${monthlyRate.toFixed(6)} x $${B.toLocaleString()}) / $${P.toFixed(2)}) / log(1 + ${monthlyRate.toFixed(6)})`);
    steps.push(`n = ${monthsToPayoff} months (${(monthsToPayoff / 12).toFixed(1)} years)`);
    steps.push("");

    let currentBalance = B;
    let totalInterest = 0;
    const monthlyBreakdown: PayoffResult["monthlyBreakdown"] = [];

    for (let month = 1; month <= monthsToPayoff; month++) {
      const interest = currentBalance * monthlyRate;
      const payment = Math.min(P, currentBalance + interest);
      const principal = payment - interest;
      currentBalance = Math.max(0, currentBalance - principal);
      totalInterest += interest;

      if (month <= 12 || month > monthsToPayoff - 3) {
        monthlyBreakdown.push({
          month,
          payment,
          principal,
          interest,
          balance: currentBalance,
        });
      }
    }

    const totalPaid = B + totalInterest;

    steps.push("TOTALS:");
    steps.push(`Total Interest Paid: $${totalInterest.toFixed(2)}`);
    steps.push(`Total Amount Paid: $${totalPaid.toFixed(2)}`);
    steps.push(`Interest as % of Balance: ${((totalInterest / B) * 100).toFixed(1)}%`);

    setResult({
      monthsToPayoff,
      yearsToPayoff: monthsToPayoff / 12,
      totalInterest,
      totalPaid,
      monthlyBreakdown,
      steps,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            Credit Card Payoff Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance ($)</Label>
              <Input
                id="balance"
                type="number"
                step="any"
                placeholder="5000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                data-testid="input-balance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apr">APR (%)</Label>
              <Input
                id="apr"
                type="number"
                step="0.01"
                placeholder="22.99"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                data-testid="input-apr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment">Monthly Payment ($)</Label>
              <Input
                id="payment"
                type="number"
                step="any"
                placeholder="200"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                data-testid="input-payment"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Payoff
          </Button>

          {result && (
            <div className="mt-6 space-y-4" data-testid="result-payoff">
              {result.monthsToPayoff === Infinity ? (
                <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-md text-center">
                  <p className="text-lg font-bold text-red-700 dark:text-red-400" data-testid="text-warning">
                    Payment too low to pay off balance
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Increase your monthly payment above the minimum interest charge.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                      <p className="text-xs opacity-90">Time to Pay Off</p>
                      <p className="text-2xl font-bold" data-testid="text-months">
                        {result.monthsToPayoff} mo
                      </p>
                      <p className="text-xs opacity-75">{result.yearsToPayoff.toFixed(1)} years</p>
                    </div>
                    <div className="p-4 bg-muted rounded-md text-center">
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="text-lg font-bold" data-testid="text-total-paid">
                        {formatCurrency(result.totalPaid)}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-md text-center">
                      <p className="text-xs text-orange-800 dark:text-orange-300">Total Interest</p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-400" data-testid="text-total-interest">
                        {formatCurrency(result.totalInterest)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-md text-center">
                      <p className="text-xs text-muted-foreground">Interest %</p>
                      <p className="text-lg font-bold" data-testid="text-interest-pct">
                        {((result.totalInterest / parseFloat(balance)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {result.monthlyBreakdown.length > 0 && (
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-semibold mb-3">Payment Schedule</p>
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
                            {result.monthlyBreakdown.map((row, i) => (
                              <tr key={i} className="border-t border-border" data-testid={`row-month-${row.month}`}>
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
                  )}
                </>
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
          <CardTitle className="text-lg">Credit Card Payoff Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Minimum Payments:</strong> Paying only the minimum can take decades to pay off and costs thousands in interest.</p>
          <p><strong>Avalanche Method:</strong> Pay off the highest-interest card first to minimize total interest paid.</p>
          <p><strong>Snowball Method:</strong> Pay off the smallest balance first for psychological wins.</p>
          <p><strong>Balance Transfer:</strong> Moving to a 0% APR card can save significant interest, but watch for transfer fees.</p>
        </CardContent>
      </Card>
    </div>
  );
}