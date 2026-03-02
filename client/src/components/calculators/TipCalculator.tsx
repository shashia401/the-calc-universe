import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState([18]);
  const [splitCount, setSplitCount] = useState("1");
  const [result, setResult] = useState<TipResult | null>(null);

  const presetTips = [15, 18, 20, 25];

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const tip = tipPercent[0];
    const split = parseInt(splitCount) || 1;

    if (bill > 0) {
      const tipAmount = bill * (tip / 100);
      const totalAmount = bill + tipAmount;
      const perPerson = totalAmount / split;

      setResult({ tipAmount, totalAmount, perPerson });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card data-testid="calculator-tip">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="bill-amount">Bill Amount ($)</Label>
          <Input
            id="bill-amount"
            type="number"
            placeholder="e.g., 85.50"
            value={billAmount}
            onChange={(e) => {
              setBillAmount(e.target.value);
              setResult(null);
            }}
            data-testid="input-bill-amount"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Tip Percentage</Label>
            <span className="text-2xl font-bold text-primary">{tipPercent[0]}%</span>
          </div>
          <Slider
            value={tipPercent}
            onValueChange={setTipPercent}
            max={30}
            min={0}
            step={1}
            className="w-full"
            data-testid="slider-tip-percent"
          />
          <div className="flex gap-2">
            {presetTips.map((tip) => (
              <Button
                key={tip}
                variant={tipPercent[0] === tip ? "default" : "outline"}
                size="sm"
                onClick={() => setTipPercent([tip])}
                className="flex-1"
                data-testid={`button-preset-${tip}`}
              >
                {tip}%
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="split-count">Split Between</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSplitCount((prev) => Math.max(1, parseInt(prev) - 1).toString())}
              data-testid="button-split-minus"
            >
              -
            </Button>
            <Input
              id="split-count"
              type="number"
              min="1"
              value={splitCount}
              onChange={(e) => setSplitCount(e.target.value)}
              className="text-center"
              data-testid="input-split-count"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSplitCount((prev) => (parseInt(prev) + 1).toString())}
              data-testid="button-split-plus"
            >
              +
            </Button>
            <span className="text-muted-foreground">{parseInt(splitCount) === 1 ? "person" : "people"}</span>
          </div>
        </div>

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate Tip
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-tip">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">Tip Amount</p>
                <p className="text-xl font-bold">{formatCurrency(result.tipAmount)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{formatCurrency(result.totalAmount)}</p>
              </div>
            </div>

            {parseInt(splitCount) > 1 && (
              <div className="p-6 rounded-lg bg-accent text-center">
                <p className="text-sm text-muted-foreground">Each Person Pays</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(result.perPerson)}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
