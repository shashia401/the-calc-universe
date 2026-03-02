import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SequenceResult {
  type: string;
  terms: number[];
  formula: string;
  sum: number;
  nthTerm: string;
  steps: string[];
}

export default function NumberSequenceCalculator() {
  const [mode, setMode] = useState("analyze");
  const [inputSequence, setInputSequence] = useState("");
  const [firstTerm, setFirstTerm] = useState("");
  const [commonDiff, setCommonDiff] = useState("");
  const [commonRatio, setCommonRatio] = useState("");
  const [numTerms, setNumTerms] = useState("10");
  const [seqType, setSeqType] = useState("arithmetic");
  const [result, setResult] = useState<SequenceResult | null>(null);

  const analyzeSequence = () => {
    const numbers = inputSequence
      .split(/[,\s]+/)
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));

    if (numbers.length < 3) return;

    const steps: string[] = [];
    steps.push(`Analyzing sequence: ${numbers.join(", ")}`);
    steps.push("");

    // Check for arithmetic sequence
    const differences: number[] = [];
    for (let i = 1; i < numbers.length; i++) {
      differences.push(numbers[i] - numbers[i - 1]);
    }
    const isArithmetic = differences.every(d => Math.abs(d - differences[0]) < 0.0001);

    // Check for geometric sequence
    const ratios: number[] = [];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i - 1] !== 0) {
        ratios.push(numbers[i] / numbers[i - 1]);
      }
    }
    const isGeometric = ratios.length === numbers.length - 1 && 
                         ratios.every(r => Math.abs(r - ratios[0]) < 0.0001);

    if (isArithmetic) {
      const d = differences[0];
      const a = numbers[0];
      steps.push("Step 1: Check differences between consecutive terms");
      for (let i = 0; i < differences.length; i++) {
        steps.push(`  ${numbers[i + 1]} - ${numbers[i]} = ${differences[i]}`);
      }
      steps.push("");
      steps.push(`All differences are equal to ${d}`);
      steps.push("This is an ARITHMETIC sequence!");
      steps.push("");
      steps.push("General formula: aₙ = a₁ + (n-1)d");
      steps.push(`Specific formula: aₙ = ${a} + (n-1)(${d})`);
      steps.push(`Simplified: aₙ = ${a} + ${d}n - ${d} = ${d}n + ${a - d}`);
      steps.push("");
      
      const sum = numbers.reduce((acc, val) => acc + val, 0);
      steps.push(`Sum of given terms: ${numbers.join(" + ")} = ${sum}`);

      // Predict next terms
      const nextTerms = [];
      for (let i = 0; i < 3; i++) {
        nextTerms.push(numbers[numbers.length - 1] + (i + 1) * d);
      }
      steps.push(`Next terms: ${nextTerms.join(", ")}`);

      setResult({
        type: "Arithmetic",
        terms: [...numbers, ...nextTerms],
        formula: `aₙ = ${d}n + ${a - d}`,
        sum,
        nthTerm: `aₙ = ${a} + (n-1) × ${d}`,
        steps,
      });
    } else if (isGeometric) {
      const r = ratios[0];
      const a = numbers[0];
      steps.push("Step 1: Check ratios between consecutive terms");
      for (let i = 0; i < ratios.length; i++) {
        steps.push(`  ${numbers[i + 1]} / ${numbers[i]} = ${ratios[i].toFixed(4)}`);
      }
      steps.push("");
      steps.push(`All ratios are equal to ${r}`);
      steps.push("This is a GEOMETRIC sequence!");
      steps.push("");
      steps.push("General formula: aₙ = a₁ × r^(n-1)");
      steps.push(`Specific formula: aₙ = ${a} × ${r}^(n-1)`);
      steps.push("");
      
      const sum = numbers.reduce((acc, val) => acc + val, 0);
      steps.push(`Sum of given terms: ${sum.toFixed(4)}`);

      const nextTerms = [];
      for (let i = 0; i < 3; i++) {
        nextTerms.push(numbers[numbers.length - 1] * Math.pow(r, i + 1));
      }
      steps.push(`Next terms: ${nextTerms.map(t => t.toFixed(4)).join(", ")}`);

      setResult({
        type: "Geometric",
        terms: [...numbers, ...nextTerms],
        formula: `aₙ = ${a} × ${r}^(n-1)`,
        sum,
        nthTerm: `aₙ = ${a} × ${r}^(n-1)`,
        steps,
      });
    } else {
      steps.push("Step 1: Check for arithmetic pattern");
      steps.push(`  Differences: ${differences.join(", ")}`);
      steps.push("  Differences are not constant");
      steps.push("");
      steps.push("Step 2: Check for geometric pattern");
      steps.push(`  Ratios: ${ratios.map(r => r.toFixed(4)).join(", ")}`);
      steps.push("  Ratios are not constant");
      steps.push("");
      steps.push("This sequence is neither arithmetic nor geometric.");
      steps.push("It might be a quadratic, Fibonacci, or other pattern.");

      setResult({
        type: "Unknown",
        terms: numbers,
        formula: "Pattern not recognized",
        sum: numbers.reduce((acc, val) => acc + val, 0),
        nthTerm: "N/A",
        steps,
      });
    }
  };

  const generateSequence = () => {
    const a = parseFloat(firstTerm);
    const n = parseInt(numTerms);

    if (isNaN(a) || isNaN(n) || n <= 0) return;

    const steps: string[] = [];
    const terms: number[] = [];

    if (seqType === "arithmetic") {
      const d = parseFloat(commonDiff);
      if (isNaN(d)) return;

      steps.push(`Generating Arithmetic Sequence`);
      steps.push(`First term (a₁) = ${a}`);
      steps.push(`Common difference (d) = ${d}`);
      steps.push(`Number of terms = ${n}`);
      steps.push("");
      steps.push("Formula: aₙ = a₁ + (n-1)d");
      steps.push("");

      for (let i = 0; i < n; i++) {
        const term = a + i * d;
        terms.push(term);
        if (i < 5) {
          steps.push(`a${i + 1} = ${a} + ${i} × ${d} = ${term}`);
        }
      }
      if (n > 5) steps.push("...");

      const sum = (n / 2) * (2 * a + (n - 1) * d);
      steps.push("");
      steps.push("Sum formula: Sₙ = n/2 × (2a₁ + (n-1)d)");
      steps.push(`S${n} = ${n}/2 × (2×${a} + ${n - 1}×${d})`);
      steps.push(`S${n} = ${sum}`);

      setResult({
        type: "Arithmetic",
        terms,
        formula: `aₙ = ${a} + (n-1) × ${d}`,
        sum,
        nthTerm: `aₙ = ${d}n + ${a - d}`,
        steps,
      });
    } else {
      const r = parseFloat(commonRatio);
      if (isNaN(r)) return;

      steps.push(`Generating Geometric Sequence`);
      steps.push(`First term (a₁) = ${a}`);
      steps.push(`Common ratio (r) = ${r}`);
      steps.push(`Number of terms = ${n}`);
      steps.push("");
      steps.push("Formula: aₙ = a₁ × r^(n-1)");
      steps.push("");

      for (let i = 0; i < n; i++) {
        const term = a * Math.pow(r, i);
        terms.push(term);
        if (i < 5) {
          steps.push(`a${i + 1} = ${a} × ${r}^${i} = ${term.toFixed(4)}`);
        }
      }
      if (n > 5) steps.push("...");

      let sum: number;
      if (Math.abs(r) === 1) {
        sum = a * n;
      } else {
        sum = a * (1 - Math.pow(r, n)) / (1 - r);
      }
      steps.push("");
      steps.push("Sum formula: Sₙ = a₁ × (1 - rⁿ) / (1 - r)");
      steps.push(`S${n} = ${sum.toFixed(4)}`);

      setResult({
        type: "Geometric",
        terms,
        formula: `aₙ = ${a} × ${r}^(n-1)`,
        sum,
        nthTerm: `aₙ = ${a} × ${r}^(n-1)`,
        steps,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Number Sequence Calculator
            <Badge variant="secondary">Patterns</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze" data-testid="tab-analyze">Analyze Sequence</TabsTrigger>
              <TabsTrigger value="generate" data-testid="tab-generate">Generate Sequence</TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sequence">Enter Sequence (comma or space separated)</Label>
                <Input
                  id="sequence"
                  placeholder="e.g., 2, 4, 6, 8, 10 or 3 6 12 24"
                  value={inputSequence}
                  onChange={(e) => setInputSequence(e.target.value)}
                  data-testid="input-sequence"
                />
                <p className="text-xs text-muted-foreground">Enter at least 3 numbers to detect the pattern</p>
              </div>
              <Button onClick={analyzeSequence} className="w-full" data-testid="button-analyze">
                Analyze Pattern
              </Button>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first">First Term (a₁)</Label>
                  <Input
                    id="first"
                    type="number"
                    step="any"
                    placeholder="e.g., 2"
                    value={firstTerm}
                    onChange={(e) => setFirstTerm(e.target.value)}
                    data-testid="input-first"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Number of Terms</Label>
                  <Input
                    id="terms"
                    type="number"
                    min="1"
                    max="100"
                    value={numTerms}
                    onChange={(e) => setNumTerms(e.target.value)}
                    data-testid="input-terms"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant={seqType === "arithmetic" ? "default" : "outline"}
                  onClick={() => setSeqType("arithmetic")}
                  className="flex-1"
                  data-testid="button-arithmetic"
                >
                  Arithmetic
                </Button>
                <Button
                  variant={seqType === "geometric" ? "default" : "outline"}
                  onClick={() => setSeqType("geometric")}
                  className="flex-1"
                  data-testid="button-geometric"
                >
                  Geometric
                </Button>
              </div>

              {seqType === "arithmetic" ? (
                <div className="space-y-2">
                  <Label htmlFor="diff">Common Difference (d)</Label>
                  <Input
                    id="diff"
                    type="number"
                    step="any"
                    placeholder="e.g., 3"
                    value={commonDiff}
                    onChange={(e) => setCommonDiff(e.target.value)}
                    data-testid="input-diff"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="ratio">Common Ratio (r)</Label>
                  <Input
                    id="ratio"
                    type="number"
                    step="any"
                    placeholder="e.g., 2"
                    value={commonRatio}
                    onChange={(e) => setCommonRatio(e.target.value)}
                    data-testid="input-ratio"
                  />
                </div>
              )}

              <Button onClick={generateSequence} className="w-full" data-testid="button-generate">
                Generate Sequence
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{result.type} Sequence</Badge>
                <span className="text-sm text-muted-foreground">Sum: {result.sum.toFixed(2)}</span>
              </div>

              <div className="p-3 bg-background rounded">
                <p className="text-sm text-muted-foreground mb-1">Terms:</p>
                <p className="font-mono text-sm break-all" data-testid="text-terms">
                  {result.terms.slice(0, 15).map(t => t.toFixed(2)).join(", ")}
                  {result.terms.length > 15 && " ..."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-xs text-muted-foreground">nth Term Formula</p>
                  <p className="font-mono text-primary">{result.nthTerm}</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-semibold">{result.type}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Understanding Sequences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Arithmetic Sequence:</strong> Each term increases by the same amount. Example: 2, 5, 8, 11 (adding 3 each time)</p>
          <p><strong>Geometric Sequence:</strong> Each term is multiplied by the same number. Example: 3, 6, 12, 24 (multiplying by 2)</p>
          <p><strong>Common Difference (d):</strong> The number you add each time in arithmetic sequences.</p>
          <p><strong>Common Ratio (r):</strong> The number you multiply by each time in geometric sequences.</p>
        </CardContent>
      </Card>
    </div>
  );
}
