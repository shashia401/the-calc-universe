import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestScoreCalculator() {
  const [mode, setMode] = useState("score");
  const [correct, setCorrect] = useState("");
  const [total, setTotal] = useState("");
  const [targetPercent, setTargetPercent] = useState("90");
  const [wrongAnswers, setWrongAnswers] = useState("");
  const [result, setResult] = useState<{ percentage: number; grade: string; needed?: number; steps: string[] } | null>(null);

  const getGrade = (p: number): string => {
    if (p >= 97) return "A+";
    if (p >= 93) return "A";
    if (p >= 90) return "A-";
    if (p >= 87) return "B+";
    if (p >= 83) return "B";
    if (p >= 80) return "B-";
    if (p >= 77) return "C+";
    if (p >= 73) return "C";
    if (p >= 70) return "C-";
    if (p >= 67) return "D+";
    if (p >= 63) return "D";
    if (p >= 60) return "D-";
    return "F";
  };

  const calculateScore = () => {
    const c = parseFloat(correct);
    const t = parseFloat(total);
    if (isNaN(c) || isNaN(t) || t <= 0) return;

    const steps: string[] = [];
    const percentage = (c / t) * 100;

    steps.push("TEST SCORE CALCULATION");
    steps.push("");
    steps.push(`Correct answers: ${c}`);
    steps.push(`Total questions: ${t}`);
    steps.push("");
    steps.push("Formula: (correct / total) × 100");
    steps.push(`= (${c} / ${t}) × 100`);
    steps.push(`= ${(c / t).toFixed(4)} × 100`);
    steps.push(`= ${percentage.toFixed(2)}%`);
    steps.push("");
    steps.push(`Letter Grade: ${getGrade(percentage)}`);

    setResult({ percentage, grade: getGrade(percentage), steps });
  };

  const calculateNeeded = () => {
    const t = parseFloat(total);
    const target = parseFloat(targetPercent);
    if (isNaN(t) || isNaN(target) || t <= 0) return;

    const steps: string[] = [];
    const needed = Math.ceil((target / 100) * t);

    steps.push("QUESTIONS NEEDED CALCULATION");
    steps.push("");
    steps.push(`Total questions: ${t}`);
    steps.push(`Target percentage: ${target}%`);
    steps.push("");
    steps.push("Formula: (target% / 100) × total");
    steps.push(`= (${target} / 100) × ${t}`);
    steps.push(`= ${(target / 100).toFixed(4)} × ${t}`);
    steps.push(`= ${((target / 100) * t).toFixed(2)}`);
    steps.push(`= ${needed} (rounded up)`);
    steps.push("");
    steps.push(`You need at least ${needed} correct answers out of ${t}`);
    steps.push(`Maximum wrong answers allowed: ${t - needed}`);

    setResult({ percentage: target, grade: getGrade(target), needed, steps });
  };

  const calculateFromWrong = () => {
    const t = parseFloat(total);
    const w = parseFloat(wrongAnswers);
    if (isNaN(t) || isNaN(w) || t <= 0 || w < 0) return;

    const steps: string[] = [];
    const c = t - w;
    const percentage = (c / t) * 100;

    steps.push("SCORE FROM WRONG ANSWERS");
    steps.push("");
    steps.push(`Total questions: ${t}`);
    steps.push(`Wrong answers: ${w}`);
    steps.push(`Correct answers: ${t} - ${w} = ${c}`);
    steps.push("");
    steps.push("Formula: (correct / total) × 100");
    steps.push(`= (${c} / ${t}) × 100`);
    steps.push(`= ${percentage.toFixed(2)}%`);
    steps.push("");
    steps.push(`Letter Grade: ${getGrade(percentage)}`);

    setResult({ percentage, grade: getGrade(percentage), steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Test Score Calculator
            <Badge variant="secondary">Education</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="score" data-testid="tab-score">Score</TabsTrigger>
              <TabsTrigger value="needed" data-testid="tab-needed">Needed</TabsTrigger>
              <TabsTrigger value="wrong" data-testid="tab-wrong">From Wrong</TabsTrigger>
            </TabsList>

            <TabsContent value="score" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correct">Correct Answers</Label>
                  <Input
                    id="correct"
                    type="number"
                    min="0"
                    placeholder="45"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    data-testid="input-correct"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-score">Total Questions</Label>
                  <Input
                    id="total-score"
                    type="number"
                    min="1"
                    placeholder="50"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    data-testid="input-total"
                  />
                </div>
              </div>
              <Button onClick={calculateScore} className="w-full" data-testid="button-calc-score">
                Calculate Score
              </Button>
            </TabsContent>

            <TabsContent value="needed" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-needed">Total Questions</Label>
                  <Input
                    id="total-needed"
                    type="number"
                    min="1"
                    placeholder="50"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    data-testid="input-total-needed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target Percentage</Label>
                  <Input
                    id="target"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="90"
                    value={targetPercent}
                    onChange={(e) => setTargetPercent(e.target.value)}
                    data-testid="input-target"
                  />
                </div>
              </div>
              <Button onClick={calculateNeeded} className="w-full" data-testid="button-calc-needed">
                Calculate Needed
              </Button>
            </TabsContent>

            <TabsContent value="wrong" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-wrong">Total Questions</Label>
                  <Input
                    id="total-wrong"
                    type="number"
                    min="1"
                    placeholder="50"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    data-testid="input-total-wrong"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wrong">Wrong Answers</Label>
                  <Input
                    id="wrong"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={wrongAnswers}
                    onChange={(e) => setWrongAnswers(e.target.value)}
                    data-testid="input-wrong"
                  />
                </div>
              </div>
              <Button onClick={calculateFromWrong} className="w-full" data-testid="button-calc-wrong">
                Calculate Score
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary" data-testid="text-percentage">
                  {result.percentage.toFixed(1)}%
                </p>
                <Badge className="text-lg px-4 py-1 mt-2">{result.grade}</Badge>
                {result.needed !== undefined && (
                  <p className="mt-2 text-muted-foreground">
                    Need at least <span className="font-bold text-foreground">{result.needed}</span> correct
                  </p>
                )}
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded">
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
          <CardTitle className="text-lg">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">For a 90% on...</p>
              <p>10 questions: need 9 correct</p>
              <p>20 questions: need 18 correct</p>
              <p>50 questions: need 45 correct</p>
              <p>100 questions: need 90 correct</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Score formula</p>
              <p>Percentage = (Correct ÷ Total) × 100</p>
              <p className="mt-2 font-semibold">Needed formula</p>
              <p>Needed = (Target% ÷ 100) × Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
