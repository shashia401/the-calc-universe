import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoundingResult {
  original: number;
  rounded: number | string;
  method: string;
  steps: string[];
}

export default function RoundingCalculator() {
  const [number, setNumber] = useState("");
  const [roundingType, setRoundingType] = useState("decimal");
  const [decimalPlaces, setDecimalPlaces] = useState("2");
  const [significantFigures, setSignificantFigures] = useState("3");
  const [result, setResult] = useState<RoundingResult | null>(null);

  const calculate = () => {
    const num = parseFloat(number);
    if (isNaN(num)) return;

    const steps: string[] = [];
    let rounded: number | string;
    let method: string;

    if (roundingType === "decimal") {
      const places = parseInt(decimalPlaces);
      const factor = Math.pow(10, places);
      rounded = Math.round(num * factor) / factor;
      method = `to ${places} decimal place${places !== 1 ? "s" : ""}`;

      steps.push(`Rounding ${num} to ${places} decimal place${places !== 1 ? "s" : ""}`);
      steps.push(``);
      steps.push(`Step 1: Look at the digit in position ${places + 1} after decimal`);
      const numStr = num.toString();
      const decimalIndex = numStr.indexOf(".");
      if (decimalIndex !== -1 && numStr.length > decimalIndex + places + 1) {
        const decisionDigit = numStr[decimalIndex + places + 1];
        steps.push(`The digit is: ${decisionDigit}`);
        steps.push(``);
        steps.push(`Step 2: Apply rounding rule`);
        if (parseInt(decisionDigit) >= 5) {
          steps.push(`${decisionDigit} ≥ 5, so round UP`);
        } else {
          steps.push(`${decisionDigit} < 5, so round DOWN`);
        }
      } else {
        steps.push(`No digit to round (number already has ${places} or fewer decimal places)`);
      }
      steps.push(``);
      steps.push(`Result: ${rounded}`);

    } else if (roundingType === "whole") {
      rounded = Math.round(num);
      method = "to nearest whole number";

      steps.push(`Rounding ${num} to the nearest whole number`);
      steps.push(``);
      steps.push(`Step 1: Look at the decimal part: ${(num % 1).toFixed(4)}`);
      steps.push(``);
      steps.push(`Step 2: Apply rounding rule`);
      if (num % 1 >= 0.5) {
        steps.push(`Decimal ≥ 0.5, so round UP to ${Math.ceil(num)}`);
      } else {
        steps.push(`Decimal < 0.5, so round DOWN to ${Math.floor(num)}`);
      }
      steps.push(``);
      steps.push(`Result: ${rounded}`);

    } else if (roundingType === "sigfig") {
      const sigFigs = parseInt(significantFigures);
      
      if (num === 0) {
        rounded = 0;
      } else {
        const magnitude = Math.floor(Math.log10(Math.abs(num)));
        const factor = Math.pow(10, sigFigs - magnitude - 1);
        rounded = Math.round(num * factor) / factor;
      }
      method = `to ${sigFigs} significant figure${sigFigs !== 1 ? "s" : ""}`;

      steps.push(`Rounding ${num} to ${sigFigs} significant figure${sigFigs !== 1 ? "s" : ""}`);
      steps.push(``);
      steps.push(`Step 1: Identify significant figures`);
      steps.push(`  - Non-zero digits are always significant`);
      steps.push(`  - Zeros between non-zeros are significant`);
      steps.push(`  - Leading zeros are NOT significant`);
      steps.push(``);
      steps.push(`Step 2: Keep ${sigFigs} significant digit${sigFigs !== 1 ? "s" : ""}`);
      steps.push(``);
      steps.push(`Result: ${rounded}`);

    } else if (roundingType === "tens") {
      rounded = Math.round(num / 10) * 10;
      method = "to nearest 10";
      
      steps.push(`Rounding ${num} to the nearest 10`);
      steps.push(``);
      steps.push(`Step 1: Look at the ones digit: ${Math.abs(num) % 10}`);
      steps.push(``);
      steps.push(`Step 2: If ones digit ≥ 5, round up to next ten`);
      steps.push(`        If ones digit < 5, round down`);
      steps.push(``);
      steps.push(`Result: ${rounded}`);

    } else if (roundingType === "hundreds") {
      rounded = Math.round(num / 100) * 100;
      method = "to nearest 100";
      
      steps.push(`Rounding ${num} to the nearest 100`);
      steps.push(``);
      steps.push(`Step 1: Look at the tens digit`);
      steps.push(``);
      steps.push(`Step 2: If tens digit ≥ 5, round up`);
      steps.push(`        If tens digit < 5, round down`);
      steps.push(``);
      steps.push(`Result: ${rounded}`);

    } else {
      rounded = Math.round(num / 1000) * 1000;
      method = "to nearest 1000";
      
      steps.push(`Rounding ${num} to the nearest 1000`);
      steps.push(``);
      steps.push(`Step 1: Look at the hundreds digit`);
      steps.push(``);
      steps.push(`Step 2: If hundreds digit ≥ 5, round up`);
      steps.push(`        If hundreds digit < 5, round down`);
      steps.push(``);
      steps.push(`Result: ${rounded}`);
    }

    setResult({ original: num, rounded, method, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Rounding Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Number to Round</Label>
            <Input
              id="number"
              type="number"
              step="any"
              placeholder="e.g., 3.14159"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              data-testid="input-number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rounding Type</Label>
              <Select value={roundingType} onValueChange={setRoundingType}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">Decimal Places</SelectItem>
                  <SelectItem value="whole">Whole Number</SelectItem>
                  <SelectItem value="sigfig">Significant Figures</SelectItem>
                  <SelectItem value="tens">Nearest 10</SelectItem>
                  <SelectItem value="hundreds">Nearest 100</SelectItem>
                  <SelectItem value="thousands">Nearest 1000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {roundingType === "decimal" && (
              <div className="space-y-2">
                <Label>Decimal Places</Label>
                <Select value={decimalPlaces} onValueChange={setDecimalPlaces}>
                  <SelectTrigger data-testid="select-decimals">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {roundingType === "sigfig" && (
              <div className="space-y-2">
                <Label>Significant Figures</Label>
                <Select value={significantFigures} onValueChange={setSignificantFigures}>
                  <SelectTrigger data-testid="select-sigfigs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Round Number
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {result.original} rounded {result.method}
                </p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {result.rounded}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Rounding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Rounding?</h3>
            <p className="text-muted-foreground">
              Rounding replaces a number with an approximation that is simpler but close to the 
              original value. It's useful when exact precision isn't needed or when presenting 
              data in a cleaner format.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Basic Rule</h3>
            <p className="text-muted-foreground mb-2">Look at the digit you're about to remove:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li><strong>0, 1, 2, 3, 4:</strong> Round DOWN (keep the previous digit)</li>
              <li><strong>5, 6, 7, 8, 9:</strong> Round UP (increase the previous digit by 1)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Examples</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">3.14159 to 2 decimal places</p>
                <p className="text-muted-foreground">Look at 3rd decimal: 1</p>
                <p className="text-muted-foreground">1 &lt; 5, round down → <strong>3.14</strong></p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">3.14159 to 3 decimal places</p>
                <p className="text-muted-foreground">Look at 4th decimal: 5</p>
                <p className="text-muted-foreground">5 ≥ 5, round up → <strong>3.142</strong></p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">847 to nearest 10</p>
                <p className="text-muted-foreground">Look at ones: 7</p>
                <p className="text-muted-foreground">7 ≥ 5, round up → <strong>850</strong></p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">847 to nearest 100</p>
                <p className="text-muted-foreground">Look at tens: 4</p>
                <p className="text-muted-foreground">4 &lt; 5, round down → <strong>800</strong></p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Significant Figures</h3>
            <p className="text-muted-foreground mb-2">
              Significant figures show how precise a measurement is:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>All non-zero digits are significant</li>
              <li>Zeros between non-zeros are significant</li>
              <li>Leading zeros (like 0.003) are NOT significant</li>
              <li>Trailing zeros after decimal ARE significant</li>
            </ul>
            <div className="mt-2 text-sm">
              <p>0.00456 has 3 sig figs (4, 5, 6)</p>
              <p>1.200 has 4 sig figs (1, 2, 0, 0)</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">When to Use Rounding</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Money:</strong> Round to 2 decimal places (cents)</li>
              <li><strong>Population:</strong> Round to nearest thousand</li>
              <li><strong>Science:</strong> Match significant figures of measurements</li>
              <li><strong>Estimation:</strong> Quick mental math</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
