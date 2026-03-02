import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function RatioCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [simplifiedResult, setSimplifiedResult] = useState<{ a: number; b: number; gcd: number; steps: string[] } | null>(null);
  
  const [r1a, setR1a] = useState("");
  const [r1b, setR1b] = useState("");
  const [r2a, setR2a] = useState("");
  const [r2b, setR2b] = useState("");
  const [scaleResult, setScaleResult] = useState<{ missing: number; steps: string[] } | null>(null);

  const simplifyRatio = () => {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    if (isNaN(aVal) || isNaN(bVal) || bVal === 0) return;

    const steps: string[] = [];
    const divisor = gcd(aVal, bVal);
    const simplifiedA = aVal / divisor;
    const simplifiedB = bVal / divisor;

    steps.push(`Original ratio: ${aVal} : ${bVal}`);
    steps.push(``);
    steps.push(`Step 1: Find the Greatest Common Divisor (GCD)`);
    steps.push(`GCD(${aVal}, ${bVal}) = ${divisor}`);
    steps.push(``);
    steps.push(`Step 2: Divide both numbers by the GCD`);
    steps.push(`${aVal} ÷ ${divisor} = ${simplifiedA}`);
    steps.push(`${bVal} ÷ ${divisor} = ${simplifiedB}`);
    steps.push(``);
    steps.push(`Simplified ratio: ${simplifiedA} : ${simplifiedB}`);

    setSimplifiedResult({ a: simplifiedA, b: simplifiedB, gcd: divisor, steps });
  };

  const solveEquivalentRatio = () => {
    const v1a = parseFloat(r1a);
    const v1b = parseFloat(r1b);
    const v2a = parseFloat(r2a);
    const v2b = parseFloat(r2b);

    const steps: string[] = [];

    if (!isNaN(v1a) && !isNaN(v1b) && !isNaN(v2a) && isNaN(v2b)) {
      const missing = (v1b * v2a) / v1a;
      steps.push(`Given: ${v1a} : ${v1b} = ${v2a} : ?`);
      steps.push(``);
      steps.push(`Using cross multiplication:`);
      steps.push(`${v1a} × ? = ${v1b} × ${v2a}`);
      steps.push(`${v1a} × ? = ${v1b * v2a}`);
      steps.push(`? = ${v1b * v2a} ÷ ${v1a}`);
      steps.push(`? = ${missing}`);
      setScaleResult({ missing, steps });
    } else if (!isNaN(v1a) && !isNaN(v1b) && isNaN(v2a) && !isNaN(v2b)) {
      const missing = (v1a * v2b) / v1b;
      steps.push(`Given: ${v1a} : ${v1b} = ? : ${v2b}`);
      steps.push(``);
      steps.push(`Using cross multiplication:`);
      steps.push(`? × ${v1b} = ${v1a} × ${v2b}`);
      steps.push(`? × ${v1b} = ${v1a * v2b}`);
      steps.push(`? = ${v1a * v2b} ÷ ${v1b}`);
      steps.push(`? = ${missing}`);
      setScaleResult({ missing, steps });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Ratio Calculator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simplify">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simplify">Simplify Ratio</TabsTrigger>
              <TabsTrigger value="equivalent">Find Equivalent</TabsTrigger>
            </TabsList>

            <TabsContent value="simplify" className="space-y-4 mt-4">
              <div className="flex items-center gap-4 justify-center">
                <div className="space-y-2">
                  <Label htmlFor="a">First Number</Label>
                  <Input
                    id="a"
                    type="number"
                    placeholder="e.g., 12"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-24 text-center"
                    data-testid="input-a"
                  />
                </div>
                <span className="text-2xl font-bold mt-6">:</span>
                <div className="space-y-2">
                  <Label htmlFor="b">Second Number</Label>
                  <Input
                    id="b"
                    type="number"
                    placeholder="e.g., 18"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-24 text-center"
                    data-testid="input-b"
                  />
                </div>
              </div>

              <Button onClick={simplifyRatio} className="w-full" data-testid="button-simplify">
                Simplify Ratio
              </Button>

              {simplifiedResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Simplified Ratio</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-simplified">
                      {simplifiedResult.a} : {simplifiedResult.b}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {simplifiedResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="equivalent" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground text-center">
                Fill in 3 values to find the missing one
              </p>
              <div className="flex items-center gap-2 justify-center flex-wrap">
                <Input
                  type="number"
                  placeholder="a"
                  value={r1a}
                  onChange={(e) => setR1a(e.target.value)}
                  className="w-20 text-center"
                  data-testid="input-r1a"
                />
                <span className="text-xl font-bold">:</span>
                <Input
                  type="number"
                  placeholder="b"
                  value={r1b}
                  onChange={(e) => setR1b(e.target.value)}
                  className="w-20 text-center"
                  data-testid="input-r1b"
                />
                <span className="text-xl font-bold">=</span>
                <Input
                  type="number"
                  placeholder="c"
                  value={r2a}
                  onChange={(e) => setR2a(e.target.value)}
                  className="w-20 text-center"
                  data-testid="input-r2a"
                />
                <span className="text-xl font-bold">:</span>
                <Input
                  type="number"
                  placeholder="d"
                  value={r2b}
                  onChange={(e) => setR2b(e.target.value)}
                  className="w-20 text-center"
                  data-testid="input-r2b"
                />
              </div>

              <Button onClick={solveEquivalentRatio} className="w-full" data-testid="button-solve">
                Find Missing Value
              </Button>

              {scaleResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Missing Value</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-missing">
                      {scaleResult.missing.toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {scaleResult.steps.map((step, i) => (
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
          <CardTitle>Understanding Ratios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Ratio?</h3>
            <p className="text-muted-foreground">
              A ratio compares two quantities and shows the relationship between them. 
              It can be written as <strong>a : b</strong>, <strong>a to b</strong>, or as a fraction <strong>a/b</strong>.
            </p>
            <p className="text-muted-foreground mt-2">
              For example, if there are 3 red balls and 5 blue balls, the ratio of red to blue is 3:5
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Simplifying Ratios</h3>
            <p className="text-muted-foreground mb-2">
              To simplify a ratio, divide both parts by their Greatest Common Divisor (GCD):
            </p>
            <p className="font-mono text-center text-primary py-2">
              a : b = (a ÷ GCD) : (b ÷ GCD)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Simplify 24 : 36</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Find GCD of 24 and 36: GCD = 12</li>
              <li>Divide both by 12: 24 ÷ 12 = 2, 36 ÷ 12 = 3</li>
              <li>Simplified ratio: 2 : 3</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Equivalent Ratios</h3>
            <p className="text-muted-foreground mb-2">
              Two ratios are equivalent if they simplify to the same ratio. You can find equivalent 
              ratios by multiplying or dividing both parts by the same number.
            </p>
            <p className="text-muted-foreground">
              Example: 2:3 = 4:6 = 6:9 = 8:12 (all simplify to 2:3)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Cross Multiplication</h3>
            <p className="text-muted-foreground mb-2">
              To find a missing value in equivalent ratios a:b = c:d:
            </p>
            <p className="font-mono text-center text-primary py-2">
              a × d = b × c
            </p>
            <p className="text-muted-foreground">
              If you know any 3 values, you can find the 4th!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Recipes:</strong> "2 cups flour to 1 cup sugar" = 2:1</li>
              <li><strong>Maps:</strong> Scale of 1:100000 means 1cm = 1km</li>
              <li><strong>Mixing:</strong> Paint mixed 3:1 (3 parts white, 1 part color)</li>
              <li><strong>Finance:</strong> Debt-to-income ratio</li>
              <li><strong>Sports:</strong> Win-loss ratio</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
