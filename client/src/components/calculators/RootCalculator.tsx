import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface RootResult {
  result: number;
  steps: string[];
  isPerfect: boolean;
  simplified?: string;
}

export default function RootCalculator() {
  const [number, setNumber] = useState("");
  const [rootIndex, setRootIndex] = useState("2");
  const [result, setResult] = useState<RootResult | null>(null);

  const findLargestPerfectPower = (n: number, root: number): { factor: number; remainder: number } => {
    let factor = 1;
    for (let i = Math.floor(Math.pow(n, 1/root)); i >= 2; i--) {
      const power = Math.pow(i, root);
      if (n % power === 0) {
        factor = i;
        break;
      }
    }
    return { factor, remainder: n / Math.pow(factor, root) };
  };

  const calculate = () => {
    const num = parseFloat(number);
    const root = parseInt(rootIndex);

    if (isNaN(num) || isNaN(root) || root < 2) return;

    const steps: string[] = [];
    const isNegative = num < 0;
    const absNum = Math.abs(num);

    if (isNegative && root % 2 === 0) {
      steps.push(`Cannot take an even root of a negative number in real numbers`);
      steps.push(`For ${root}√(${num}), the result would be an imaginary number`);
      steps.push(`${root}√(${num}) = ${Math.pow(absNum, 1/root).toFixed(4)}i`);
      setResult({ result: NaN, steps, isPerfect: false });
      return;
    }

    const resultValue = isNegative ? -Math.pow(absNum, 1/root) : Math.pow(absNum, 1/root);
    const isPerfect = Number.isInteger(resultValue) || Math.abs(resultValue - Math.round(resultValue)) < 0.0000001;

    if (root === 2) {
      steps.push(`Square root: √${num}`);
      steps.push(`Finding what number times itself equals ${num}`);
    } else if (root === 3) {
      steps.push(`Cube root: ∛${num}`);
      steps.push(`Finding what number times itself 3 times equals ${num}`);
    } else {
      steps.push(`${root}th root of ${num}`);
      steps.push(`Finding what number raised to power ${root} equals ${num}`);
    }

    steps.push(``);

    if (isPerfect) {
      const perfectResult = Math.round(resultValue);
      steps.push(`This is a perfect ${root === 2 ? 'square' : root === 3 ? 'cube' : `${root}th power`}!`);
      steps.push(`${perfectResult}${root === 2 ? '²' : root === 3 ? '³' : `^${root}`} = ${num}`);
      steps.push(`Therefore, ${root === 2 ? '√' : root === 3 ? '∛' : `${root}√`}${num} = ${perfectResult}`);
    } else {
      steps.push(`Using the formula: ⁿ√x = x^(1/n)`);
      steps.push(`${num}^(1/${root}) = ${num}^${(1/root).toFixed(4)}`);
      steps.push(`= ${resultValue.toFixed(6)}`);
    }

    let simplified: string | undefined;
    if (!isPerfect && Number.isInteger(num) && num > 1 && root <= 3) {
      const { factor, remainder } = findLargestPerfectPower(Math.abs(num), root);
      if (factor > 1) {
        const symbol = root === 2 ? '√' : root === 3 ? '∛' : `${root}√`;
        simplified = `${factor}${symbol}${remainder}`;
        steps.push(``);
        steps.push(`Simplified form:`);
        steps.push(`${symbol}${num} = ${symbol}(${Math.pow(factor, root)} × ${remainder})`);
        steps.push(`= ${factor} × ${symbol}${remainder}`);
        steps.push(`= ${simplified}`);
      }
    }

    setResult({
      result: resultValue,
      steps,
      isPerfect,
      simplified,
    });
  };

  const getRootSymbol = () => {
    const root = parseInt(rootIndex);
    if (root === 2) return '√';
    if (root === 3) return '∛';
    return `${root}√`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Root Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-2xl font-mono">
              <sup>{rootIndex !== "2" ? rootIndex : ""}</sup>√{number || "x"} = ?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="number"
                step="any"
                placeholder="e.g., 64"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                data-testid="input-number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="root">Root Index</Label>
              <div className="flex gap-2">
                <Input
                  id="root"
                  type="number"
                  min="2"
                  placeholder="2"
                  value={rootIndex}
                  onChange={(e) => setRootIndex(e.target.value)}
                  data-testid="input-root"
                />
                <Button variant="outline" onClick={() => setRootIndex("2")}>√</Button>
                <Button variant="outline" onClick={() => setRootIndex("3")}>∛</Button>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate {getRootSymbol()}{number || "x"}
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Result</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-result">
                  {isNaN(result.result) ? "Complex Number" : result.result.toFixed(6)}
                </p>
                {result.isPerfect && !isNaN(result.result) && (
                  <Badge className="mt-2">Perfect {parseInt(rootIndex) === 2 ? 'Square' : parseInt(rootIndex) === 3 ? 'Cube' : 'Power'}</Badge>
                )}
                {result.simplified && (
                  <p className="text-muted-foreground mt-2">
                    Simplified: <span className="font-mono">{result.simplified}</span>
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-4 text-sm text-muted-foreground mb-1">Quick calculations:</p>
            {[4, 9, 16, 25, 36, 49, 64, 81].map((n) => (
              <Button
                key={n}
                variant="outline"
                size="sm"
                onClick={() => { setNumber(n.toString()); setRootIndex("2"); }}
              >
                √{n}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Roots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Root?</h3>
            <p className="text-muted-foreground">
              A root is the inverse of an exponent. If <strong>a<sup>n</sup> = b</strong>, then <strong>ⁿ√b = a</strong>.
            </p>
            <p className="text-muted-foreground mt-2">
              For example: Since 5² = 25, the square root of 25 is 5 (√25 = 5)
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Root Types</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-background rounded">
                <p className="font-mono">√x (square root)</p>
                <p className="text-muted-foreground">What number times itself equals x? (n = 2)</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">∛x (cube root)</p>
                <p className="text-muted-foreground">What number × itself × itself equals x? (n = 3)</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">ⁿ√x (nth root)</p>
                <p className="text-muted-foreground">What number raised to power n equals x?</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">The Formula</h3>
            <div className="text-center py-2">
              <p className="font-mono text-lg text-primary">
                ⁿ√x = x^(1/n)
              </p>
            </div>
            <p className="text-muted-foreground">
              A root can be written as a fractional exponent. For example, √16 = 16^(1/2) = 4
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Perfect Squares and Cubes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm mb-2">Perfect Squares:</p>
                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                  <span>1 = 1²</span>
                  <span>4 = 2²</span>
                  <span>9 = 3²</span>
                  <span>16 = 4²</span>
                  <span>25 = 5²</span>
                  <span>36 = 6²</span>
                  <span>49 = 7²</span>
                  <span>64 = 8²</span>
                  <span>81 = 9²</span>
                  <span>100 = 10²</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Perfect Cubes:</p>
                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                  <span>1 = 1³</span>
                  <span>8 = 2³</span>
                  <span>27 = 3³</span>
                  <span>64 = 4³</span>
                  <span>125 = 5³</span>
                  <span>216 = 6³</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Simplifying Roots</h3>
            <p className="text-muted-foreground mb-2">
              To simplify √72:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Find perfect square factors: 72 = 36 × 2</li>
              <li>Split the root: √72 = √36 × √2</li>
              <li>Simplify: √36 = 6</li>
              <li>Result: √72 = 6√2</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Important Rules</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>√(a × b) = √a × √b</li>
              <li>√(a / b) = √a / √b</li>
              <li>(√a)² = a</li>
              <li>Even roots of negative numbers are not real (they're imaginary)</li>
              <li>Odd roots of negative numbers are negative real numbers</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
