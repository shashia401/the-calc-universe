import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ScientificNotationCalculator() {
  const [decimal, setDecimal] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [exponent, setExponent] = useState("");
  const [convertResult, setConvertResult] = useState<{ result: string; steps: string[] } | null>(null);

  const [num1Coef, setNum1Coef] = useState("");
  const [num1Exp, setNum1Exp] = useState("");
  const [num2Coef, setNum2Coef] = useState("");
  const [num2Exp, setNum2Exp] = useState("");
  const [operation, setOperation] = useState("multiply");
  const [calcResult, setCalcResult] = useState<{ result: string; decimal: number; steps: string[] } | null>(null);

  const toScientific = () => {
    const num = parseFloat(decimal);
    if (isNaN(num) || num === 0) return;

    const steps: string[] = [];
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const coef = num / Math.pow(10, exp);

    steps.push(`Converting ${num} to scientific notation:`);
    steps.push(``);
    steps.push(`Step 1: Move decimal point to get a number between 1 and 10`);
    steps.push(`  ${Math.abs(num)} → ${Math.abs(coef).toFixed(6)}`);
    steps.push(``);
    steps.push(`Step 2: Count how many places the decimal moved`);
    steps.push(`  Moved ${Math.abs(exp)} place${Math.abs(exp) !== 1 ? "s" : ""} to the ${exp >= 0 ? "left" : "right"}`);
    steps.push(``);
    steps.push(`Step 3: Write as coefficient × 10^exponent`);
    steps.push(`  ${coef.toFixed(6)} × 10^${exp}`);

    setConvertResult({
      result: `${coef.toPrecision(6)} × 10^${exp}`,
      steps,
    });
  };

  const toDecimal = () => {
    const coef = parseFloat(coefficient);
    const exp = parseInt(exponent);
    if (isNaN(coef) || isNaN(exp)) return;

    const steps: string[] = [];
    const result = coef * Math.pow(10, exp);

    steps.push(`Converting ${coef} × 10^${exp} to decimal:`);
    steps.push(``);
    steps.push(`Step 1: Calculate 10^${exp} = ${Math.pow(10, exp)}`);
    steps.push(``);
    steps.push(`Step 2: Multiply coefficient by result`);
    steps.push(`  ${coef} × ${Math.pow(10, exp)} = ${result}`);
    steps.push(``);
    if (exp > 0) {
      steps.push(`Alternative: Move decimal ${exp} place${exp !== 1 ? "s" : ""} to the right`);
    } else if (exp < 0) {
      steps.push(`Alternative: Move decimal ${Math.abs(exp)} place${Math.abs(exp) !== 1 ? "s" : ""} to the left`);
    }

    setConvertResult({
      result: result.toString(),
      steps,
    });
  };

  const calculate = () => {
    const c1 = parseFloat(num1Coef);
    const e1 = parseInt(num1Exp);
    const c2 = parseFloat(num2Coef);
    const e2 = parseInt(num2Exp);

    if (isNaN(c1) || isNaN(e1) || isNaN(c2) || isNaN(e2)) return;

    const steps: string[] = [];
    let resultCoef: number;
    let resultExp: number;
    let decimalResult: number;

    const num1 = c1 * Math.pow(10, e1);
    const num2 = c2 * Math.pow(10, e2);

    steps.push(`(${c1} × 10^${e1}) ${operation === "multiply" ? "×" : operation === "divide" ? "÷" : operation === "add" ? "+" : "-"} (${c2} × 10^${e2})`);
    steps.push(``);

    switch (operation) {
      case "multiply":
        resultCoef = c1 * c2;
        resultExp = e1 + e2;
        decimalResult = num1 * num2;
        steps.push(`Step 1: Multiply coefficients`);
        steps.push(`  ${c1} × ${c2} = ${resultCoef}`);
        steps.push(``);
        steps.push(`Step 2: Add exponents`);
        steps.push(`  ${e1} + ${e2} = ${resultExp}`);
        break;

      case "divide":
        resultCoef = c1 / c2;
        resultExp = e1 - e2;
        decimalResult = num1 / num2;
        steps.push(`Step 1: Divide coefficients`);
        steps.push(`  ${c1} ÷ ${c2} = ${resultCoef}`);
        steps.push(``);
        steps.push(`Step 2: Subtract exponents`);
        steps.push(`  ${e1} - ${e2} = ${resultExp}`);
        break;

      case "add":
      case "subtract":
        decimalResult = operation === "add" ? num1 + num2 : num1 - num2;
        const resExp = Math.floor(Math.log10(Math.abs(decimalResult)));
        resultCoef = decimalResult / Math.pow(10, resExp);
        resultExp = resExp;
        steps.push(`Step 1: Convert to same exponent for ${operation}`);
        steps.push(`  ${c1} × 10^${e1} = ${num1}`);
        steps.push(`  ${c2} × 10^${e2} = ${num2}`);
        steps.push(``);
        steps.push(`Step 2: ${operation === "add" ? "Add" : "Subtract"} the numbers`);
        steps.push(`  ${num1} ${operation === "add" ? "+" : "-"} ${num2} = ${decimalResult}`);
        steps.push(``);
        steps.push(`Step 3: Convert back to scientific notation`);
        break;

      default:
        return;
    }

    const normalizedExp = Math.floor(Math.log10(Math.abs(resultCoef)));
    if (normalizedExp !== 0 && resultCoef !== 0) {
      const normalizedCoef = resultCoef / Math.pow(10, normalizedExp);
      const finalExp = resultExp + normalizedExp;
      steps.push(``);
      steps.push(`Step 3: Normalize (coefficient between 1 and 10)`);
      steps.push(`  ${resultCoef.toPrecision(4)} × 10^${resultExp} = ${normalizedCoef.toPrecision(4)} × 10^${finalExp}`);
      resultCoef = normalizedCoef;
      resultExp = finalExp;
    }

    setCalcResult({
      result: `${resultCoef.toPrecision(4)} × 10^${resultExp}`,
      decimal: decimalResult,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Scientific Notation Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="convert">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="calculate">Calculate</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="font-semibold">Decimal to Scientific</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g., 0.00045"
                      value={decimal}
                      onChange={(e) => setDecimal(e.target.value)}
                      data-testid="input-decimal"
                    />
                    <Button onClick={toScientific} data-testid="button-to-scientific">
                      Convert →
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <Label className="font-semibold">Scientific to Decimal</Label>
                  <div className="flex gap-2 mt-2 items-center">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Coefficient"
                      value={coefficient}
                      onChange={(e) => setCoefficient(e.target.value)}
                      className="w-32"
                      data-testid="input-coefficient"
                    />
                    <span className="text-lg">× 10^</span>
                    <Input
                      type="number"
                      placeholder="Exp"
                      value={exponent}
                      onChange={(e) => setExponent(e.target.value)}
                      className="w-20"
                      data-testid="input-exponent"
                    />
                    <Button onClick={toDecimal} data-testid="button-to-decimal">
                      Convert →
                    </Button>
                  </div>
                </div>
              </div>

              {convertResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold text-primary font-mono" data-testid="text-convert-result">
                      {convertResult.result}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {convertResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calculate" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    step="any"
                    placeholder="Coef"
                    value={num1Coef}
                    onChange={(e) => setNum1Coef(e.target.value)}
                    className="w-20"
                    data-testid="input-num1-coef"
                  />
                  <span>×10^</span>
                  <Input
                    type="number"
                    placeholder="Exp"
                    value={num1Exp}
                    onChange={(e) => setNum1Exp(e.target.value)}
                    className="w-16"
                    data-testid="input-num1-exp"
                  />
                </div>

                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="h-10 px-3 rounded-md border bg-background"
                  data-testid="select-operation"
                >
                  <option value="multiply">×</option>
                  <option value="divide">÷</option>
                  <option value="add">+</option>
                  <option value="subtract">−</option>
                </select>

                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    step="any"
                    placeholder="Coef"
                    value={num2Coef}
                    onChange={(e) => setNum2Coef(e.target.value)}
                    className="w-20"
                    data-testid="input-num2-coef"
                  />
                  <span>×10^</span>
                  <Input
                    type="number"
                    placeholder="Exp"
                    value={num2Exp}
                    onChange={(e) => setNum2Exp(e.target.value)}
                    className="w-16"
                    data-testid="input-num2-exp"
                  />
                </div>
              </div>

              <Button onClick={calculate} className="w-full" data-testid="button-calculate">
                Calculate
              </Button>

              {calcResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold text-primary font-mono" data-testid="text-calc-result">
                      {calcResult.result}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      = {calcResult.decimal.toExponential(4)} (decimal: {calcResult.decimal})
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {calcResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Scientific Notation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Scientific Notation?</h3>
            <p className="text-muted-foreground">
              Scientific notation is a way to write very large or very small numbers compactly. 
              It's written as a coefficient (between 1 and 10) multiplied by a power of 10.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Format</h3>
            <p className="font-mono text-center text-xl text-primary py-2">
              a × 10<sup>n</sup>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Where: 1 ≤ |a| &lt; 10 (coefficient) and n is an integer (exponent)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Examples</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Large Numbers:</p>
                <p className="text-muted-foreground">6,500,000 = 6.5 × 10⁶</p>
                <p className="text-muted-foreground">93,000,000 = 9.3 × 10⁷</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold">Small Numbers:</p>
                <p className="text-muted-foreground">0.00025 = 2.5 × 10⁻⁴</p>
                <p className="text-muted-foreground">0.000007 = 7 × 10⁻⁶</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Calculation Rules</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">(a × 10ⁿ) × (b × 10ᵐ) = (a × b) × 10⁽ⁿ⁺ᵐ⁾</p>
                <p className="text-muted-foreground">Multiply coefficients, add exponents</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">(a × 10ⁿ) ÷ (b × 10ᵐ) = (a ÷ b) × 10⁽ⁿ⁻ᵐ⁾</p>
                <p className="text-muted-foreground">Divide coefficients, subtract exponents</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Astronomy:</strong> Distance to stars (e.g., 9.46 × 10¹⁵ m = 1 light-year)</li>
              <li><strong>Chemistry:</strong> Avogadro's number (6.022 × 10²³)</li>
              <li><strong>Physics:</strong> Speed of light (3 × 10⁸ m/s)</li>
              <li><strong>Biology:</strong> Size of cells (1 × 10⁻⁵ m)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
