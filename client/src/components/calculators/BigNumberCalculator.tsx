import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BigNumberCalculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState<{ result: string; steps: string[] } | null>(null);

  const addBigNumbers = (a: string, b: string): { result: string; steps: string[] } => {
    const steps: string[] = [];
    a = a.replace(/^0+/, "") || "0";
    b = b.replace(/^0+/, "") || "0";
    
    steps.push(`Adding ${a} + ${b}`);
    steps.push(``);
    steps.push(`Using column addition (right to left):`);
    
    let result = "";
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;
    
    while (i >= 0 || j >= 0 || carry) {
      const digitA = i >= 0 ? parseInt(a[i]) : 0;
      const digitB = j >= 0 ? parseInt(b[j]) : 0;
      const sum = digitA + digitB + carry;
      result = (sum % 10) + result;
      carry = Math.floor(sum / 10);
      i--;
      j--;
    }
    
    steps.push(`Result: ${result}`);
    return { result, steps };
  };

  const subtractBigNumbers = (a: string, b: string): { result: string; steps: string[] } => {
    const steps: string[] = [];
    a = a.replace(/^0+/, "") || "0";
    b = b.replace(/^0+/, "") || "0";
    
    let negative = false;
    if (a.length < b.length || (a.length === b.length && a < b)) {
      [a, b] = [b, a];
      negative = true;
    }
    
    steps.push(`Subtracting ${negative ? b : a} - ${negative ? a : b}`);
    steps.push(``);
    
    let result = "";
    let borrow = 0;
    let i = a.length - 1;
    let j = b.length - 1;
    
    while (i >= 0) {
      let digitA = parseInt(a[i]) - borrow;
      const digitB = j >= 0 ? parseInt(b[j]) : 0;
      
      if (digitA < digitB) {
        digitA += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }
      
      result = (digitA - digitB) + result;
      i--;
      j--;
    }
    
    result = result.replace(/^0+/, "") || "0";
    if (negative) result = "-" + result;
    
    steps.push(`Result: ${result}`);
    return { result, steps };
  };

  const multiplyBigNumbers = (a: string, b: string): { result: string; steps: string[] } => {
    const steps: string[] = [];
    a = a.replace(/^0+/, "") || "0";
    b = b.replace(/^0+/, "") || "0";
    
    if (a === "0" || b === "0") {
      steps.push(`Any number × 0 = 0`);
      return { result: "0", steps };
    }
    
    steps.push(`Multiplying ${a} × ${b}`);
    steps.push(``);
    steps.push(`Using long multiplication:`);
    
    const n = a.length;
    const m = b.length;
    const result = new Array(n + m).fill(0);
    
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        const mult = parseInt(a[i]) * parseInt(b[j]);
        const p1 = i + j;
        const p2 = i + j + 1;
        const sum = mult + result[p2];
        
        result[p2] = sum % 10;
        result[p1] += Math.floor(sum / 10);
      }
    }
    
    let resultStr = result.join("").replace(/^0+/, "") || "0";
    steps.push(`Result: ${resultStr}`);
    return { result: resultStr, steps };
  };

  const calculate = () => {
    const cleanNum1 = num1.replace(/[^0-9]/g, "");
    const cleanNum2 = num2.replace(/[^0-9]/g, "");
    
    if (!cleanNum1 || !cleanNum2) return;
    
    let calcResult: { result: string; steps: string[] };
    
    switch (operation) {
      case "add":
        calcResult = addBigNumbers(cleanNum1, cleanNum2);
        break;
      case "subtract":
        calcResult = subtractBigNumbers(cleanNum1, cleanNum2);
        break;
      case "multiply":
        calcResult = multiplyBigNumbers(cleanNum1, cleanNum2);
        break;
      default:
        return;
    }
    
    setResult(calcResult);
  };

  const formatLargeNumber = (num: string): string => {
    const clean = num.replace(/[^0-9-]/g, "");
    const isNegative = clean.startsWith("-");
    const absNum = isNegative ? clean.slice(1) : clean;
    const formatted = absNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return isNegative ? "-" + formatted : formatted;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Big Number Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Calculate with numbers larger than standard calculator limits. Handles numbers with hundreds of digits!
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="num1">First Number</Label>
              <Input
                id="num1"
                placeholder="Enter a large number (e.g., 12345678901234567890)"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                data-testid="input-num1"
              />
              {num1 && (
                <p className="text-xs text-muted-foreground">
                  {num1.replace(/[^0-9]/g, "").length} digits: {formatLargeNumber(num1.replace(/[^0-9]/g, ""))}
                </p>
              )}
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num2">Second Number</Label>
              <Input
                id="num2"
                placeholder="Enter another large number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                data-testid="input-num2"
              />
              {num2 && (
                <p className="text-xs text-muted-foreground">
                  {num2.replace(/[^0-9]/g, "").length} digits: {formatLargeNumber(num2.replace(/[^0-9]/g, ""))}
                </p>
              )}
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Result</p>
                <p className="text-xl font-mono break-all" data-testid="text-result">
                  {result.result}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.result.replace(/^-/, "").length} digits • Formatted: {formatLargeNumber(result.result)}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Method:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <p className="col-span-2 text-sm text-muted-foreground mb-1">Try these examples:</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setNum1("12345678901234567890"); setNum2("98765432109876543210"); }}
            >
              20-digit numbers
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setNum1("999999999999999999999999"); setNum2("1"); }}
            >
              +1 overflow test
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Big Number Arithmetic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Why Do We Need Big Number Calculators?</h3>
            <p className="text-muted-foreground">
              Regular calculators and computers can only handle numbers up to a certain size (typically 
              about 15-17 significant digits). Beyond that, you lose precision. Big number calculators 
              treat numbers as strings of digits and use algorithms similar to how we do math by hand.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Calculator Limits</h3>
            <p className="text-muted-foreground">
              JavaScript's regular numbers max out at about 9,007,199,254,740,991 (2⁵³ - 1). 
              This calculator can handle numbers with hundreds or thousands of digits!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">How It Works</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Addition:</p>
                <p className="text-sm text-muted-foreground">
                  Works digit by digit from right to left, just like column addition you learned in school. 
                  Keeps track of "carries" when sum exceeds 9.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">Subtraction:</p>
                <p className="text-sm text-muted-foreground">
                  Works digit by digit from right to left, using "borrowing" when needed.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">Multiplication:</p>
                <p className="text-sm text-muted-foreground">
                  Uses long multiplication - multiplying each digit pair and summing the results 
                  at the correct positions.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Cryptography:</strong> Encryption uses numbers with hundreds of digits</li>
              <li><strong>Astronomy:</strong> Distances measured in huge numbers</li>
              <li><strong>Finance:</strong> National debts and global money supply</li>
              <li><strong>Mathematics:</strong> Prime number research, factorials</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Fun Facts</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>100! (factorial) has 158 digits</li>
              <li>The largest known prime number has over 24 million digits</li>
              <li>A googol is 10¹⁰⁰ (1 followed by 100 zeros)</li>
              <li>A googolplex is 10^googol - too big to write out!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
