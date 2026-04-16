import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FractionResult {
  whole: number;
  numerator: number;
  denominator: number;
  decimal: number;
  steps: string[];
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(num: number, den: number): { numerator: number; denominator: number } {
  const g = gcd(num, den);
  return { numerator: num / g, denominator: den / g };
}

export default function FractionCalculator() {
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState<FractionResult | null>(null);

  const calculate = () => {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    if (d1 === 0 || d2 === 0) return;

    let resultNum: number;
    let resultDen: number;
    const steps: string[] = [];

    switch (operation) {
      case "add":
        steps.push(`Step 1: Find a common denominator for ${d1} and ${d2}`);
        const commonDenAdd = lcm(d1, d2);
        steps.push(`Common denominator = LCM(${d1}, ${d2}) = ${commonDenAdd}`);
        const mult1Add = commonDenAdd / d1;
        const mult2Add = commonDenAdd / d2;
        steps.push(`Step 2: Convert fractions: ${n1}/${d1} = ${n1 * mult1Add}/${commonDenAdd}, ${n2}/${d2} = ${n2 * mult2Add}/${commonDenAdd}`);
        resultNum = n1 * mult1Add + n2 * mult2Add;
        resultDen = commonDenAdd;
        steps.push(`Step 3: Add numerators: ${n1 * mult1Add} + ${n2 * mult2Add} = ${resultNum}`);
        break;
      case "subtract":
        steps.push(`Step 1: Find a common denominator for ${d1} and ${d2}`);
        const commonDenSub = lcm(d1, d2);
        steps.push(`Common denominator = LCM(${d1}, ${d2}) = ${commonDenSub}`);
        const mult1Sub = commonDenSub / d1;
        const mult2Sub = commonDenSub / d2;
        steps.push(`Step 2: Convert fractions: ${n1}/${d1} = ${n1 * mult1Sub}/${commonDenSub}, ${n2}/${d2} = ${n2 * mult2Sub}/${commonDenSub}`);
        resultNum = n1 * mult1Sub - n2 * mult2Sub;
        resultDen = commonDenSub;
        steps.push(`Step 3: Subtract numerators: ${n1 * mult1Sub} - ${n2 * mult2Sub} = ${resultNum}`);
        break;
      case "multiply":
        steps.push(`Step 1: Multiply numerators: ${n1} × ${n2} = ${n1 * n2}`);
        steps.push(`Step 2: Multiply denominators: ${d1} × ${d2} = ${d1 * d2}`);
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case "divide":
        if (n2 === 0) {
          steps.push("Cannot divide by zero (second fraction's numerator is 0)");
          setResult({ whole: 0, numerator: 0, denominator: 1, decimal: 0, steps });
          return;
        }
        steps.push(`Step 1: Flip the second fraction: ${n2}/${d2} becomes ${d2}/${n2}`);
        steps.push(`Step 2: Multiply: ${n1}/${d1} × ${d2}/${n2}`);
        steps.push(`Step 3: Multiply numerators: ${n1} × ${d2} = ${n1 * d2}`);
        steps.push(`Step 4: Multiply denominators: ${d1} × ${n2} = ${d1 * n2}`);
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
      default:
        return;
    }

    const simplified = simplifyFraction(resultNum, resultDen);
    if (resultNum !== simplified.numerator || resultDen !== simplified.denominator) {
      steps.push(`Step ${steps.length + 1}: Simplify ${resultNum}/${resultDen} by dividing by GCD(${Math.abs(resultNum)}, ${Math.abs(resultDen)}) = ${gcd(resultNum, resultDen)}`);
    }

    const whole = Math.floor(Math.abs(simplified.numerator) / simplified.denominator) * (simplified.numerator < 0 ? -1 : 1);
    const remainderNum = Math.abs(simplified.numerator) % simplified.denominator;

    if (Math.abs(simplified.numerator) > simplified.denominator && remainderNum !== 0) {
      steps.push(`Result as mixed number: ${whole} ${remainderNum}/${simplified.denominator}`);
    }

    setResult({
      whole: whole,
      numerator: simplified.numerator,
      denominator: simplified.denominator,
      decimal: simplified.numerator / simplified.denominator,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Fraction Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>First Fraction</Label>
              <div className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  placeholder="Numerator"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="text-center"
                  data-testid="input-numerator-1"
                />
                <div className="w-full h-0.5 bg-foreground" />
                <Input
                  type="number"
                  placeholder="Denominator"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  className="text-center"
                  data-testid="input-denominator-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Operation</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger data-testid="select-operation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">+ Add</SelectItem>
                  <SelectItem value="subtract">− Subtract</SelectItem>
                  <SelectItem value="multiply">× Multiply</SelectItem>
                  <SelectItem value="divide">÷ Divide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Second Fraction</Label>
              <div className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  placeholder="Numerator"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="text-center"
                  data-testid="input-numerator-2"
                />
                <div className="w-full h-0.5 bg-foreground" />
                <Input
                  type="number"
                  placeholder="Denominator"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  className="text-center"
                  data-testid="input-denominator-2"
                />
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Result</p>
                <div className="text-3xl font-bold" data-testid="text-result">
                  {result.numerator}/{result.denominator}
                </div>
                <p className="text-muted-foreground">
                  = {result.decimal.toFixed(4)} (decimal)
                </p>
                {Math.abs(result.numerator) > result.denominator && result.numerator % result.denominator !== 0 && (
                  <p className="text-muted-foreground">
                    = {result.whole} {Math.abs(result.numerator) % result.denominator}/{result.denominator} (mixed number)
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {result.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Fractions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Fraction?</h3>
            <p className="text-muted-foreground">
              A fraction represents a part of a whole. It consists of two numbers separated by a line:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li><strong>Numerator</strong> (top number): The number of parts you have</li>
              <li><strong>Denominator</strong> (bottom number): The total number of equal parts the whole is divided into</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              For example, 3/4 means you have 3 parts out of 4 equal parts.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Formulas</h3>
            <div className="space-y-3 font-mono text-sm">
              <div>
                <p className="text-muted-foreground">Addition:</p>
                <p className="text-primary">a/b + c/d = (a×d + c×b) / (b×d)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Subtraction:</p>
                <p className="text-primary">a/b - c/d = (a×d - c×b) / (b×d)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Multiplication:</p>
                <p className="text-primary">a/b × c/d = (a×c) / (b×d)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Division:</p>
                <p className="text-primary">a/b ÷ c/d = a/b × d/c = (a×d) / (b×c)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Adding 1/4 + 2/3</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Find the Least Common Denominator (LCD) of 4 and 3: LCD = 12</li>
              <li>Convert 1/4 to twelfths: 1/4 = 3/12 (multiply both by 3)</li>
              <li>Convert 2/3 to twelfths: 2/3 = 8/12 (multiply both by 4)</li>
              <li>Add the numerators: 3/12 + 8/12 = 11/12</li>
              <li>The answer is 11/12</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Types of Fractions</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Proper fraction:</strong> Numerator is less than denominator (e.g., 3/4)</li>
              <li><strong>Improper fraction:</strong> Numerator is greater than or equal to denominator (e.g., 7/4)</li>
              <li><strong>Mixed number:</strong> A whole number and a fraction together (e.g., 1 3/4)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
