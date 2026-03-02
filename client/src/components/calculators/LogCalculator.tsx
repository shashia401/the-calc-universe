import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogResult {
  result: number;
  steps: string[];
}

export default function LogCalculator() {
  const [value, setValue] = useState("");
  const [base, setBase] = useState("10");
  const [result, setResult] = useState<LogResult | null>(null);
  const [antilogValue, setAntilogValue] = useState("");
  const [antilogBase, setAntilogBase] = useState("10");
  const [antilogResult, setAntilogResult] = useState<LogResult | null>(null);

  const calculateLog = () => {
    const val = parseFloat(value);
    const b = parseFloat(base);

    if (isNaN(val) || isNaN(b) || val <= 0 || b <= 0 || b === 1) return;

    const steps: string[] = [];
    let logResult: number;

    if (b === Math.E) {
      logResult = Math.log(val);
      steps.push(`Natural logarithm (ln): log base e of ${val}`);
      steps.push(`ln(${val}) = ${logResult.toFixed(6)}`);
    } else if (b === 10) {
      logResult = Math.log10(val);
      steps.push(`Common logarithm: log base 10 of ${val}`);
      steps.push(`log₁₀(${val}) = ${logResult.toFixed(6)}`);
    } else {
      logResult = Math.log(val) / Math.log(b);
      steps.push(`Using change of base formula:`);
      steps.push(`log_${b}(${val}) = ln(${val}) / ln(${b})`);
      steps.push(`= ${Math.log(val).toFixed(6)} / ${Math.log(b).toFixed(6)}`);
      steps.push(`= ${logResult.toFixed(6)}`);
    }

    steps.push(``);
    steps.push(`Meaning: ${b}^${logResult.toFixed(4)} = ${val}`);

    setResult({ result: logResult, steps });
  };

  const calculateAntilog = () => {
    const val = parseFloat(antilogValue);
    const b = parseFloat(antilogBase);

    if (isNaN(val) || isNaN(b) || b <= 0 || b === 1) return;

    const steps: string[] = [];
    const antilogResultVal = Math.pow(b, val);

    steps.push(`Antilog (inverse of log): ${b}^${val}`);
    steps.push(``);
    if (b === Math.E) {
      steps.push(`This is e^${val} (exponential function)`);
    } else if (b === 10) {
      steps.push(`This is 10^${val}`);
    }
    steps.push(`= ${antilogResultVal.toFixed(6)}`);
    steps.push(``);
    steps.push(`Verification: log_${b}(${antilogResultVal.toFixed(4)}) = ${val}`);

    setAntilogResult({ result: antilogResultVal, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Logarithm Calculator
            <Badge variant="secondary">Advanced Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="log">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="log">Logarithm</TabsTrigger>
              <TabsTrigger value="antilog">Antilogarithm</TabsTrigger>
            </TabsList>

            <TabsContent value="log" className="space-y-4 mt-4">
              <div className="text-center py-4 bg-muted rounded-lg">
                <p className="text-lg font-mono">
                  log<sub>{base || "b"}</sub>({value || "x"}) = ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Number (x)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g., 100"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    data-testid="input-value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base">Base</Label>
                  <div className="flex gap-2">
                    <Input
                      id="base"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="10"
                      value={base}
                      onChange={(e) => setBase(e.target.value)}
                      data-testid="input-base"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBase("10")}
                    >
                      10
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBase(Math.E.toString())}
                    >
                      e
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={calculateLog} className="w-full" data-testid="button-calculate-log">
                Calculate Logarithm
              </Button>

              {result && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-3xl font-bold text-primary font-mono" data-testid="text-log-result">
                      {result.result.toFixed(6)}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {result.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="antilog" className="space-y-4 mt-4">
              <div className="text-center py-4 bg-muted rounded-lg">
                <p className="text-lg font-mono">
                  {antilogBase || "b"}<sup>{antilogValue || "x"}</sup> = ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="antilog-value">Exponent (x)</Label>
                  <Input
                    id="antilog-value"
                    type="number"
                    step="any"
                    placeholder="e.g., 2"
                    value={antilogValue}
                    onChange={(e) => setAntilogValue(e.target.value)}
                    data-testid="input-antilog-value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="antilog-base">Base</Label>
                  <div className="flex gap-2">
                    <Input
                      id="antilog-base"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="10"
                      value={antilogBase}
                      onChange={(e) => setAntilogBase(e.target.value)}
                      data-testid="input-antilog-base"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAntilogBase("10")}
                    >
                      10
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAntilogBase(Math.E.toString())}
                    >
                      e
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={calculateAntilog} className="w-full" data-testid="button-calculate-antilog">
                Calculate Antilogarithm
              </Button>

              {antilogResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-3xl font-bold text-primary font-mono" data-testid="text-antilog-result">
                      {antilogResult.result.toFixed(6)}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {antilogResult.steps.map((step, i) => (
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
          <CardTitle>Understanding Logarithms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Logarithm?</h3>
            <p className="text-muted-foreground">
              A logarithm answers the question: "What power must I raise the base to, to get this number?"
            </p>
            <p className="text-muted-foreground mt-2">
              If <strong>b<sup>y</sup> = x</strong>, then <strong>log<sub>b</sub>(x) = y</strong>
            </p>
            <p className="text-muted-foreground mt-2">
              For example: Since 10² = 100, we say log₁₀(100) = 2
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Types of Logarithms</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-background rounded">
                <p className="font-mono">log₁₀(x) or log(x)</p>
                <p className="text-muted-foreground">Common logarithm (base 10)</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">ln(x) or logₑ(x)</p>
                <p className="text-muted-foreground">Natural logarithm (base e ≈ 2.718)</p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-mono">log₂(x)</p>
                <p className="text-muted-foreground">Binary logarithm (base 2, used in computing)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Logarithm Laws</h3>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">log(a × b) = log(a) + log(b)</p>
                <p className="text-muted-foreground">Product rule: log of a product = sum of logs</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">log(a / b) = log(a) - log(b)</p>
                <p className="text-muted-foreground">Quotient rule: log of a quotient = difference of logs</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">log(a^n) = n × log(a)</p>
                <p className="text-muted-foreground">Power rule: log of a power = exponent times log</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">log_b(x) = ln(x) / ln(b)</p>
                <p className="text-muted-foreground">Change of base formula</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: log₁₀(1000)</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Question: What power of 10 equals 1000?</li>
              <li>We know: 10 × 10 × 10 = 1000</li>
              <li>That's: 10³ = 1000</li>
              <li>Therefore: log₁₀(1000) = 3</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Sound (Decibels):</strong> Loudness measured on a log scale</li>
              <li><strong>Earthquakes (Richter):</strong> Magnitude is logarithmic</li>
              <li><strong>pH Scale:</strong> Acidity measured using log₁₀</li>
              <li><strong>Computer Science:</strong> Algorithm complexity (e.g., binary search)</li>
              <li><strong>Finance:</strong> Compound interest calculations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
