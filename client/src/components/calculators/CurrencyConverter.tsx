import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";

const CURRENCIES = {
  USD: { name: "US Dollar", symbol: "$", rate: 1 },
  EUR: { name: "Euro", symbol: "€", rate: 0.92 },
  GBP: { name: "British Pound", symbol: "£", rate: 0.79 },
  JPY: { name: "Japanese Yen", symbol: "¥", rate: 149.50 },
  CAD: { name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  AUD: { name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  CHF: { name: "Swiss Franc", symbol: "Fr", rate: 0.88 },
  CNY: { name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  INR: { name: "Indian Rupee", symbol: "₹", rate: 83.12 },
  MXN: { name: "Mexican Peso", symbol: "$", rate: 17.15 },
  BRL: { name: "Brazilian Real", symbol: "R$", rate: 4.97 },
  KRW: { name: "South Korean Won", symbol: "₩", rate: 1328.50 },
  SGD: { name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", rate: 7.82 },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$", rate: 1.63 },
};

type CurrencyCode = keyof typeof CURRENCIES;

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("EUR");
  const [result, setResult] = useState<{ converted: number; rate: number; steps: string[] } | null>(null);

  const convert = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) return;

    const steps: string[] = [];
    const from = CURRENCIES[fromCurrency];
    const to = CURRENCIES[toCurrency];

    steps.push("CURRENCY CONVERSION");
    steps.push(`Converting: ${value.toLocaleString()} ${fromCurrency} to ${toCurrency}`);
    steps.push("");

    // Convert to USD first, then to target currency
    const inUSD = value / from.rate;
    steps.push("Step 1: Convert to USD (base currency)");
    steps.push(`${value.toLocaleString()} ${fromCurrency} ÷ ${from.rate} = ${inUSD.toFixed(4)} USD`);
    steps.push("");

    const converted = inUSD * to.rate;
    steps.push("Step 2: Convert USD to target currency");
    steps.push(`${inUSD.toFixed(4)} USD × ${to.rate} = ${converted.toFixed(2)} ${toCurrency}`);
    steps.push("");

    const rate = to.rate / from.rate;
    steps.push("Direct exchange rate:");
    steps.push(`1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`);
    steps.push(`1 ${toCurrency} = ${(1 / rate).toFixed(6)} ${fromCurrency}`);

    setResult({ converted, rate, steps });
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Currency Converter
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
            Note: Exchange rates are approximate and for educational purposes. Real rates change constantly.
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-amount"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as CurrencyCode)}>
                <SelectTrigger data-testid="select-from">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, { name }]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={swapCurrencies} data-testid="button-swap">
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as CurrencyCode)}>
                <SelectTrigger data-testid="select-to">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, { name }]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full" data-testid="button-convert">
            Convert Currency
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {parseFloat(amount).toLocaleString()} {fromCurrency} =
                </p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {CURRENCIES[toCurrency].symbol}{result.converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-lg text-muted-foreground">{toCurrency}</p>
              </div>

              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-muted-foreground">1 {fromCurrency}</p>
                  <p className="font-semibold">{result.rate.toFixed(4)} {toCurrency}</p>
                </div>
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-muted-foreground">1 {toCurrency}</p>
                  <p className="font-semibold">{(1 / result.rate).toFixed(4)} {fromCurrency}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded">
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
          <CardTitle className="text-lg">Quick Reference Rates (vs USD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              These are approximate reference rates for educational purposes only. Actual exchange rates fluctuate constantly. For real-time rates, please consult a financial institution or live currency service.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {Object.entries(CURRENCIES).slice(0, 9).map(([code, { symbol, rate }]) => (
              <div key={code} className="flex justify-between p-2 bg-muted rounded">
                <span>{code}</span>
                <span className="text-muted-foreground">{symbol}{rate}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
