import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Assignment {
  name: string;
  score: string;
  maxScore: string;
  weight: string;
}

interface GradeResult {
  percentage: number;
  letterGrade: string;
  weightedAverage: number;
  steps: string[];
}

export default function GradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { name: "Assignment 1", score: "85", maxScore: "100", weight: "20" },
    { name: "Assignment 2", score: "90", maxScore: "100", weight: "30" },
    { name: "Exam", score: "78", maxScore: "100", weight: "50" },
  ]);
  const [result, setResult] = useState<GradeResult | null>(null);

  const addAssignment = () => {
    setAssignments([...assignments, { name: `Assignment ${assignments.length + 1}`, score: "", maxScore: "100", weight: "" }]);
  };

  const removeAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const updateAssignment = (index: number, field: keyof Assignment, value: string) => {
    setAssignments(assignments.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  };

  const calculate = () => {
    const steps: string[] = [];
    let totalWeight = 0;
    let weightedSum = 0;
    let totalPoints = 0;
    let maxPoints = 0;

    steps.push("CALCULATING WEIGHTED GRADE");
    steps.push("");

    assignments.forEach((a, i) => {
      const score = parseFloat(a.score);
      const max = parseFloat(a.maxScore);
      const weight = parseFloat(a.weight);

      if (!isNaN(score) && !isNaN(max) && max > 0) {
        const percentage = (score / max) * 100;
        totalPoints += score;
        maxPoints += max;

        if (!isNaN(weight) && weight > 0) {
          weightedSum += percentage * weight;
          totalWeight += weight;
          steps.push(`${a.name}: ${score}/${max} = ${percentage.toFixed(1)}% × ${weight}% weight`);
        } else {
          steps.push(`${a.name}: ${score}/${max} = ${percentage.toFixed(1)}% (no weight)`);
        }
      }
    });

    steps.push("");

    let finalPercentage: number;
    let isWeighted = totalWeight > 0;

    if (isWeighted) {
      finalPercentage = weightedSum / totalWeight;
      steps.push("WEIGHTED CALCULATION:");
      steps.push(`Sum of (percentage × weight) = ${weightedSum.toFixed(2)}`);
      steps.push(`Total weight = ${totalWeight}%`);
      steps.push(`Weighted average = ${weightedSum.toFixed(2)} / ${totalWeight} = ${finalPercentage.toFixed(2)}%`);
    } else {
      finalPercentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
      steps.push("SIMPLE AVERAGE:");
      steps.push(`Total points: ${totalPoints} / ${maxPoints}`);
      steps.push(`Average = ${finalPercentage.toFixed(2)}%`);
    }

    const letterGrade = getLetterGrade(finalPercentage);
    steps.push("");
    steps.push(`Final Grade: ${finalPercentage.toFixed(2)}% = ${letterGrade}`);

    setResult({
      percentage: finalPercentage,
      letterGrade,
      weightedAverage: weightedSum / (totalWeight || 1),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Grade Calculator
            <Badge variant="secondary">Education</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {assignments.map((a, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={a.name}
                    onChange={(e) => updateAssignment(i, "name", e.target.value)}
                    placeholder="Assignment name"
                    data-testid={`input-name-${i}`}
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Score</Label>
                  <Input
                    type="number"
                    value={a.score}
                    onChange={(e) => updateAssignment(i, "score", e.target.value)}
                    placeholder="Score"
                    data-testid={`input-score-${i}`}
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Max</Label>
                  <Input
                    type="number"
                    value={a.maxScore}
                    onChange={(e) => updateAssignment(i, "maxScore", e.target.value)}
                    placeholder="Max"
                    data-testid={`input-max-${i}`}
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Weight %</Label>
                  <Input
                    type="number"
                    value={a.weight}
                    onChange={(e) => updateAssignment(i, "weight", e.target.value)}
                    placeholder="Weight"
                    data-testid={`input-weight-${i}`}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeAssignment(i)} data-testid={`button-remove-${i}`}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addAssignment} className="w-full" data-testid="button-add">
            <Plus className="h-4 w-4 mr-2" />
            Add Assignment
          </Button>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Grade
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-2">
                  <span className="text-3xl font-bold" data-testid="text-letter">{result.letterGrade}</span>
                </div>
                <p className="text-2xl font-bold" data-testid="text-percentage">
                  {result.percentage.toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Calculation Steps:</p>
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
          <CardTitle className="text-lg">Grading Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">A+ (97-100)</div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">A (93-96)</div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">A- (90-92)</div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">B+ (87-89)</div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">B (83-86)</div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">B- (80-82)</div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">C+ (77-79)</div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">C (73-76)</div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">C- (70-72)</div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">D+ (67-69)</div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">D (63-66)</div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">F (below 60)</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
