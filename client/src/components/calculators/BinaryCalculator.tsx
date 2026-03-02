import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BinaryCalculator() {
  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [conversionSteps, setConversionSteps] = useState<string[]>([]);
  const [bin1, setBin1] = useState("");
  const [bin2, setBin2] = useState("");
  const [operation, setOperation] = useState("add");
  const [arithmeticResult, setArithmeticResult] = useState<{binary: string; decimal: number; steps: string[]} | null>(null);

  const decimalToBinary = () => {
    const num = parseInt(decimal);
    if (isNaN(num) || num < 0) return;

    const steps: string[] = [];
    let n = num;
    const remainders: number[] = [];

    if (num === 0) {
      steps.push("0 in decimal = 0 in binary");
      setBinary("0");
      setConversionSteps(steps);
      return;
    }

    steps.push(`Converting ${num} to binary by repeated division by 2:`);
    steps.push("");

    while (n > 0) {
      const remainder = n % 2;
      remainders.unshift(remainder);
      steps.push(`${n} ÷ 2 = ${Math.floor(n / 2)} remainder ${remainder}`);
      n = Math.floor(n / 2);
    }

    steps.push("");
    steps.push(`Reading remainders from bottom to top: ${remainders.join("")}`);

    setBinary(remainders.join(""));
    setConversionSteps(steps);
  };

  const binaryToDecimal = () => {
    if (!/^[01]+$/.test(binary)) return;

    const steps: string[] = [];
    const digits = binary.split("").reverse();
    let sum = 0;

    steps.push(`Converting ${binary} to decimal using place values:`);
    steps.push("");

    const parts: string[] = [];
    digits.forEach((digit, position) => {
      const value = parseInt(digit) * Math.pow(2, position);
      if (digit === "1") {
        parts.push(`(1 × 2^${position} = ${value})`);
      }
      sum += value;
      steps.push(`Position ${position}: ${digit} × 2^${position} = ${digit} × ${Math.pow(2, position)} = ${value}`);
    });

    steps.push("");
    steps.push(`Sum: ${parts.join(" + ")} = ${sum}`);

    setDecimal(sum.toString());
    setConversionSteps(steps);
  };

  const performArithmetic = () => {
    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) return;

    const dec1 = parseInt(bin1, 2);
    const dec2 = parseInt(bin2, 2);
    let result: number;
    const steps: string[] = [];

    steps.push(`First number: ${bin1} = ${dec1} in decimal`);
    steps.push(`Second number: ${bin2} = ${dec2} in decimal`);
    steps.push("");

    switch (operation) {
      case "add":
        result = dec1 + dec2;
        steps.push(`Addition: ${dec1} + ${dec2} = ${result}`);
        break;
      case "subtract":
        result = dec1 - dec2;
        steps.push(`Subtraction: ${dec1} - ${dec2} = ${result}`);
        break;
      case "multiply":
        result = dec1 * dec2;
        steps.push(`Multiplication: ${dec1} × ${dec2} = ${result}`);
        break;
      case "divide":
        if (dec2 === 0) {
          steps.push("Cannot divide by zero!");
          setArithmeticResult({ binary: "Error", decimal: 0, steps });
          return;
        }
        result = Math.floor(dec1 / dec2);
        steps.push(`Division: ${dec1} ÷ ${dec2} = ${result} (integer division)`);
        break;
      default:
        return;
    }

    steps.push("");
    steps.push(`Result in decimal: ${result}`);
    steps.push(`Result in binary: ${(result >>> 0).toString(2)}`);

    setArithmeticResult({
      binary: (result >>> 0).toString(2),
      decimal: result,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Binary Calculator
            <Badge variant="secondary">Computer Science</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="convert">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decimal">Decimal Number</Label>
                  <Input
                    id="decimal"
                    type="number"
                    min="0"
                    placeholder="Enter decimal (e.g., 42)"
                    value={decimal}
                    onChange={(e) => setDecimal(e.target.value)}
                    data-testid="input-decimal"
                  />
                  <Button onClick={decimalToBinary} className="w-full" variant="outline" data-testid="button-to-binary">
                    Convert to Binary →
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="binary">Binary Number</Label>
                  <Input
                    id="binary"
                    placeholder="Enter binary (e.g., 101010)"
                    value={binary}
                    onChange={(e) => setBinary(e.target.value.replace(/[^01]/g, ""))}
                    data-testid="input-binary"
                  />
                  <Button onClick={binaryToDecimal} className="w-full" variant="outline" data-testid="button-to-decimal">
                    ← Convert to Decimal
                  </Button>
                </div>
              </div>

              {conversionSteps.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Step-by-Step:</p>
                  <div className="space-y-1 text-sm font-mono">
                    {conversionSteps.map((step, i) => (
                      <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="arithmetic" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>First Binary Number</Label>
                  <Input
                    placeholder="e.g., 1010"
                    value={bin1}
                    onChange={(e) => setBin1(e.target.value.replace(/[^01]/g, ""))}
                    data-testid="input-bin1"
                  />
                  <p className="text-xs text-muted-foreground">
                    = {bin1 ? parseInt(bin1, 2) : 0} in decimal
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border bg-background"
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    data-testid="select-operation"
                  >
                    <option value="add">+ Add</option>
                    <option value="subtract">− Subtract</option>
                    <option value="multiply">× Multiply</option>
                    <option value="divide">÷ Divide</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Second Binary Number</Label>
                  <Input
                    placeholder="e.g., 0110"
                    value={bin2}
                    onChange={(e) => setBin2(e.target.value.replace(/[^01]/g, ""))}
                    data-testid="input-bin2"
                  />
                  <p className="text-xs text-muted-foreground">
                    = {bin2 ? parseInt(bin2, 2) : 0} in decimal
                  </p>
                </div>
              </div>

              <Button onClick={performArithmetic} className="w-full" data-testid="button-calculate">
                Calculate
              </Button>

              {arithmeticResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold font-mono text-primary" data-testid="text-result">
                      {arithmeticResult.binary}
                    </p>
                    <p className="text-muted-foreground">
                      = {arithmeticResult.decimal} in decimal
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {arithmeticResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
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
          <CardTitle>Understanding Binary Numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Binary?</h3>
            <p className="text-muted-foreground">
              Binary is a number system that uses only two digits: <strong>0</strong> and <strong>1</strong>. 
              It's called "base-2" because it has two possible values for each digit. Computers use binary 
              because electronic circuits can easily represent two states: on (1) and off (0).
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Place Values in Binary</h3>
            <p className="text-muted-foreground mb-2">
              Just like decimal uses powers of 10, binary uses powers of 2:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Position</th>
                    <th className="p-2">7</th>
                    <th className="p-2">6</th>
                    <th className="p-2">5</th>
                    <th className="p-2">4</th>
                    <th className="p-2">3</th>
                    <th className="p-2">2</th>
                    <th className="p-2">1</th>
                    <th className="p-2">0</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Power of 2</td>
                    <td className="p-2 text-center">2⁷</td>
                    <td className="p-2 text-center">2⁶</td>
                    <td className="p-2 text-center">2⁵</td>
                    <td className="p-2 text-center">2⁴</td>
                    <td className="p-2 text-center">2³</td>
                    <td className="p-2 text-center">2²</td>
                    <td className="p-2 text-center">2¹</td>
                    <td className="p-2 text-center">2⁰</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Value</td>
                    <td className="p-2 text-center">128</td>
                    <td className="p-2 text-center">64</td>
                    <td className="p-2 text-center">32</td>
                    <td className="p-2 text-center">16</td>
                    <td className="p-2 text-center">8</td>
                    <td className="p-2 text-center">4</td>
                    <td className="p-2 text-center">2</td>
                    <td className="p-2 text-center">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Convert 13 to Binary</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>13 ÷ 2 = 6 remainder <strong>1</strong></li>
              <li>6 ÷ 2 = 3 remainder <strong>0</strong></li>
              <li>3 ÷ 2 = 1 remainder <strong>1</strong></li>
              <li>1 ÷ 2 = 0 remainder <strong>1</strong></li>
              <li>Read remainders from bottom to top: <strong>1101</strong></li>
            </ol>
            <p className="mt-2 text-muted-foreground">
              Check: 1×8 + 1×4 + 0×2 + 1×1 = 8 + 4 + 0 + 1 = 13 ✓
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Binary in Computing</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Bit:</strong> A single binary digit (0 or 1)</li>
              <li><strong>Byte:</strong> 8 bits (can represent 0-255)</li>
              <li><strong>Kilobyte:</strong> 1,024 bytes</li>
              <li><strong>Megabyte:</strong> 1,024 kilobytes</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Common Binary Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">1 = 1</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">10 = 2</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">100 = 4</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">1000 = 8</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">1010 = 10</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">10000 = 16</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">100000 = 32</p>
              </div>
              <div className="p-2 bg-muted rounded text-center">
                <p className="font-mono">1000000 = 64</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
