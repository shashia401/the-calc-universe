import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from "lucide-react";

interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  priceAfterDiscount: number;
  salesTax: number;
  finalPrice: number;
  steps: string[];
}

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [secondDiscount, setSecondDiscount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState<DiscountResult | null>(null);

  const calculate = () => {
    const P = parseFloat(price);
    const D = parseFloat(discount);
    const D2 = parseFloat(secondDiscount) || 0;
    const tax = parseFloat(taxRate) || 0;

    if (isNaN(P) || isNaN(D) || P <= 0 || D < 0) return;

    const steps: string[] = [];
    steps.push(`Original Price: $${P.toFixed(2)}`);

    let discountAmount: number;
    let priceAfterDiscount: number;

    if (discountType === "percentage") {
      discountAmount = P * (D / 100);
      priceAfterDiscount = P - discountAmount;
      steps.push(`Discount: ${D}% off`);
      steps.push(`Discount Amount = $${P.toFixed(2)} x ${D}% = $${discountAmount.toFixed(2)}`);
      steps.push(`Price after discount = $${P.toFixed(2)} - $${discountAmount.toFixed(2)} = $${priceAfterDiscount.toFixed(2)}`);
    } else {
      discountAmount = Math.min(D, P);
      priceAfterDiscount = P - discountAmount;
      steps.push(`Discount: $${D.toFixed(2)} off`);
      steps.push(`Price after discount = $${P.toFixed(2)} - $${discountAmount.toFixed(2)} = $${priceAfterDiscount.toFixed(2)}`);
    }

    if (D2 > 0) {
      const secondDiscountAmount = priceAfterDiscount * (D2 / 100);
      steps.push("");
      steps.push(`Additional ${D2}% discount applied:`);
      steps.push(`Second discount = $${priceAfterDiscount.toFixed(2)} x ${D2}% = $${secondDiscountAmount.toFixed(2)}`);
      discountAmount += secondDiscountAmount;
      priceAfterDiscount -= secondDiscountAmount;
      steps.push(`Price after both discounts = $${priceAfterDiscount.toFixed(2)}`);
    }

    let salesTax = 0;
    let finalPrice = priceAfterDiscount;

    if (tax > 0) {
      salesTax = priceAfterDiscount * (tax / 100);
      finalPrice = priceAfterDiscount + salesTax;
      steps.push("");
      steps.push(`Sales Tax: ${tax}%`);
      steps.push(`Tax Amount = $${priceAfterDiscount.toFixed(2)} x ${tax}% = $${salesTax.toFixed(2)}`);
      steps.push(`Final Price = $${priceAfterDiscount.toFixed(2)} + $${salesTax.toFixed(2)} = $${finalPrice.toFixed(2)}`);
    }

    steps.push("");
    steps.push("SUMMARY:");
    steps.push(`You save: $${discountAmount.toFixed(2)} (${((discountAmount / P) * 100).toFixed(1)}% off)`);

    setResult({
      originalPrice: P,
      discountAmount,
      priceAfterDiscount,
      salesTax,
      finalPrice,
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
            <Tag className="h-5 w-5 text-green-500" />
            Discount Calculator
            <Badge variant="secondary">Finance</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Original Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="any"
                placeholder="99.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <div className="flex gap-2">
                <Input
                  id="discount"
                  type="number"
                  step="any"
                  placeholder="20"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="flex-1"
                  data-testid="input-discount"
                />
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="w-28" data-testid="select-discount-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">$ Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="second-discount">Second Discount (% off, optional)</Label>
              <Input
                id="second-discount"
                type="number"
                step="any"
                placeholder="0"
                value={secondDiscount}
                onChange={(e) => setSecondDiscount(e.target.value)}
                data-testid="input-second-discount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Sales Tax (%, optional)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                placeholder="8.25"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                data-testid="input-tax-rate"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Discount
          </Button>

          {result && (
            <div className="mt-6 space-y-4" data-testid="result-discount">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Original</p>
                  <p className="text-lg font-bold line-through text-muted-foreground" data-testid="text-original">
                    {formatCurrency(result.originalPrice)}
                  </p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md text-center">
                  <p className="text-xs text-green-800 dark:text-green-300">You Save</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400" data-testid="text-savings">
                    {formatCurrency(result.discountAmount)}
                  </p>
                </div>
                {result.salesTax > 0 && (
                  <div className="p-4 bg-muted rounded-md text-center">
                    <p className="text-xs text-muted-foreground">Sales Tax</p>
                    <p className="text-lg font-bold" data-testid="text-tax">
                      {formatCurrency(result.salesTax)}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-primary text-primary-foreground rounded-md text-center">
                  <p className="text-xs opacity-90">Final Price</p>
                  <p className="text-2xl font-bold" data-testid="text-final-price">
                    {formatCurrency(result.finalPrice)}
                  </p>
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
          <CardTitle className="text-lg">Understanding Discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Percentage Discount:</strong> A percentage of the original price is subtracted. A 20% discount on $100 saves you $20.</p>
          <p><strong>Stacking Discounts:</strong> When two percentage discounts are applied sequentially, the second applies to the already-reduced price, not the original.</p>
          <p><strong>Example:</strong> 20% + 10% off $100 = $100 x 0.80 x 0.90 = $72 (not $70).</p>
          <p><strong>Sales Tax:</strong> Applied after discounts on the reduced price, not the original price.</p>
        </CardContent>
      </Card>
    </div>
  );
}