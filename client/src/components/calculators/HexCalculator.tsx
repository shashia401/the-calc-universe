import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function HexCalculator() {
  const [decimal, setDecimal] = useState("");
  const [hex, setHex] = useState("");
  const [binary, setBinary] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  const hexChars = "0123456789ABCDEF";

  const decimalToHex = () => {
    const num = parseInt(decimal);
    if (isNaN(num) || num < 0) return;

    const newSteps: string[] = [];
    let n = num;
    const remainders: string[] = [];

    if (num === 0) {
      newSteps.push("0 in decimal = 0 in hexadecimal");
      setHex("0");
      setBinary("0");
      setSteps(newSteps);
      return;
    }

    newSteps.push(`Converting ${num} to hexadecimal by repeated division by 16:`);
    newSteps.push("");

    while (n > 0) {
      const remainder = n % 16;
      remainders.unshift(hexChars[remainder]);
      newSteps.push(`${n} ÷ 16 = ${Math.floor(n / 16)} remainder ${remainder} (${hexChars[remainder]})`);
      n = Math.floor(n / 16);
    }

    const hexResult = remainders.join("");
    newSteps.push("");
    newSteps.push(`Reading remainders from bottom to top: ${hexResult}`);

    setHex(hexResult);
    setBinary(num.toString(2));
    setSteps(newSteps);
  };

  const hexToDecimal = () => {
    const cleanHex = hex.toUpperCase().replace(/[^0-9A-F]/g, "");
    if (!cleanHex) return;

    const newSteps: string[] = [];
    const digits = cleanHex.split("").reverse();
    let sum = 0;

    newSteps.push(`Converting ${cleanHex} to decimal using place values:`);
    newSteps.push("");

    digits.forEach((digit, position) => {
      const value = hexChars.indexOf(digit) * Math.pow(16, position);
      sum += value;
      newSteps.push(`Position ${position}: ${digit} (${hexChars.indexOf(digit)}) × 16^${position} = ${hexChars.indexOf(digit)} × ${Math.pow(16, position)} = ${value}`);
    });

    newSteps.push("");
    newSteps.push(`Sum: ${sum}`);

    setDecimal(sum.toString());
    setBinary(sum.toString(2));
    setSteps(newSteps);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Hexadecimal Calculator
            <Badge variant="secondary">Computer Science</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decimal">Decimal (Base 10)</Label>
              <Input
                id="decimal"
                type="number"
                min="0"
                placeholder="e.g., 255"
                value={decimal}
                onChange={(e) => setDecimal(e.target.value)}
                data-testid="input-decimal"
              />
              <Button onClick={decimalToHex} className="w-full" variant="outline" data-testid="button-to-hex">
                Convert to Hex →
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hex">Hexadecimal (Base 16)</Label>
              <Input
                id="hex"
                placeholder="e.g., FF"
                value={hex}
                onChange={(e) => setHex(e.target.value.toUpperCase())}
                data-testid="input-hex"
              />
              <Button onClick={hexToDecimal} className="w-full" variant="outline" data-testid="button-to-decimal">
                ← Convert to Decimal
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Binary (Base 2)</Label>
              <Input
                value={binary}
                readOnly
                className="bg-muted"
                data-testid="input-binary"
              />
              <p className="text-xs text-muted-foreground text-center">Auto-calculated</p>
            </div>
          </div>

          {steps.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Step-by-Step Conversion:</p>
              <div className="space-y-1 text-sm font-mono">
                {steps.map((step, i) => (
                  <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-4 text-sm text-muted-foreground mb-1">Quick hex digits:</p>
            {hexChars.split("").map((char, i) => (
              <div key={char} className="p-2 bg-muted rounded text-center text-sm">
                <span className="font-mono font-bold">{char}</span>
                <span className="text-muted-foreground ml-1">= {i}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Hexadecimal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Hexadecimal?</h3>
            <p className="text-muted-foreground">
              Hexadecimal (or "hex") is a base-16 number system. While decimal uses 10 digits (0-9), 
              hex uses 16 symbols: <strong>0-9</strong> for values 0-9 and <strong>A-F</strong> for values 10-15.
            </p>
            <p className="text-muted-foreground mt-2">
              Hex is widely used in computing because it provides a convenient way to represent binary 
              data - each hex digit represents exactly 4 binary digits (bits).
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Hex Digit Values</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-sm">
              <div className="text-center"><span className="font-mono">0</span> = 0</div>
              <div className="text-center"><span className="font-mono">1</span> = 1</div>
              <div className="text-center"><span className="font-mono">2</span> = 2</div>
              <div className="text-center"><span className="font-mono">3</span> = 3</div>
              <div className="text-center"><span className="font-mono">4</span> = 4</div>
              <div className="text-center"><span className="font-mono">5</span> = 5</div>
              <div className="text-center"><span className="font-mono">6</span> = 6</div>
              <div className="text-center"><span className="font-mono">7</span> = 7</div>
              <div className="text-center"><span className="font-mono">8</span> = 8</div>
              <div className="text-center"><span className="font-mono">9</span> = 9</div>
              <div className="text-center"><span className="font-mono">A</span> = 10</div>
              <div className="text-center"><span className="font-mono">B</span> = 11</div>
              <div className="text-center"><span className="font-mono">C</span> = 12</div>
              <div className="text-center"><span className="font-mono">D</span> = 13</div>
              <div className="text-center"><span className="font-mono">E</span> = 14</div>
              <div className="text-center"><span className="font-mono">F</span> = 15</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Convert 255 to Hex</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>255 ÷ 16 = 15 remainder <strong>15</strong> (F)</li>
              <li>15 ÷ 16 = 0 remainder <strong>15</strong> (F)</li>
              <li>Read remainders bottom to top: <strong>FF</strong></li>
            </ol>
            <p className="mt-2 text-muted-foreground">
              Check: F(15) × 16 + F(15) × 1 = 240 + 15 = 255 ✓
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Hex to Binary Connection</h3>
            <p className="text-muted-foreground mb-2">
              Each hex digit equals exactly 4 binary digits:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
              <div className="p-2 bg-muted rounded text-center">0 = 0000</div>
              <div className="p-2 bg-muted rounded text-center">4 = 0100</div>
              <div className="p-2 bg-muted rounded text-center">8 = 1000</div>
              <div className="p-2 bg-muted rounded text-center">C = 1100</div>
              <div className="p-2 bg-muted rounded text-center">1 = 0001</div>
              <div className="p-2 bg-muted rounded text-center">5 = 0101</div>
              <div className="p-2 bg-muted rounded text-center">9 = 1001</div>
              <div className="p-2 bg-muted rounded text-center">D = 1101</div>
              <div className="p-2 bg-muted rounded text-center">2 = 0010</div>
              <div className="p-2 bg-muted rounded text-center">6 = 0110</div>
              <div className="p-2 bg-muted rounded text-center">A = 1010</div>
              <div className="p-2 bg-muted rounded text-center">E = 1110</div>
              <div className="p-2 bg-muted rounded text-center">3 = 0011</div>
              <div className="p-2 bg-muted rounded text-center">7 = 0111</div>
              <div className="p-2 bg-muted rounded text-center">B = 1011</div>
              <div className="p-2 bg-muted rounded text-center">F = 1111</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Common Uses of Hexadecimal</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Colors:</strong> Web colors like #FF5733 (red=FF, green=57, blue=33)</li>
              <li><strong>Memory addresses:</strong> Computer memory locations like 0x7FFF</li>
              <li><strong>MAC addresses:</strong> Network identifiers like 00:1A:2B:3C:4D:5E</li>
              <li><strong>Error codes:</strong> Windows error codes like 0x80070005</li>
              <li><strong>Character encoding:</strong> Unicode values like U+0041 (letter 'A')</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
