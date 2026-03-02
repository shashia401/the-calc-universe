import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby } from "lucide-react";

interface PregnancyResult {
  dueDate: Date;
  conceptionDate: Date;
  currentWeek: number;
  currentDay: number;
  trimester: number;
  daysRemaining: number;
  percentComplete: number;
  milestones: { week: number; description: string; date: Date }[];
  steps: string[];
}

export default function PregnancyCalculator() {
  const [method, setMethod] = useState("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const calculate = () => {
    const steps: string[] = [];
    let dueDate: Date;
    let conception: Date;
    let startDate: Date;

    if (method === "lmp") {
      if (!lmpDate) return;
      startDate = new Date(lmpDate);
      if (isNaN(startDate.getTime())) return;

      steps.push("METHOD: Last Menstrual Period (LMP)");
      steps.push(`LMP Date: ${startDate.toLocaleDateString()}`);
      steps.push("");
      steps.push("Using Naegele's Rule:");
      steps.push("Due Date = LMP + 280 days (40 weeks)");

      dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 280);

      conception = new Date(startDate);
      conception.setDate(conception.getDate() + 14);

      steps.push(`Estimated Conception: ${conception.toLocaleDateString()} (LMP + 14 days)`);
      steps.push(`Estimated Due Date: ${dueDate.toLocaleDateString()}`);
    } else {
      if (!conceptionDate) return;
      const concDate = new Date(conceptionDate);
      if (isNaN(concDate.getTime())) return;

      conception = concDate;
      startDate = new Date(concDate);
      startDate.setDate(startDate.getDate() - 14);

      steps.push("METHOD: Known Conception Date");
      steps.push(`Conception Date: ${conception.toLocaleDateString()}`);
      steps.push("");
      steps.push("Due Date = Conception Date + 266 days (38 weeks)");

      dueDate = new Date(conception);
      dueDate.setDate(dueDate.getDate() + 266);

      steps.push(`Equivalent LMP: ${startDate.toLocaleDateString()}`);
      steps.push(`Estimated Due Date: ${dueDate.toLocaleDateString()}`);
    }

    const today = new Date();
    const daysSinceLMP = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysSinceLMP / 7);
    const currentDay = daysSinceLMP % 7;
    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const percentComplete = Math.min(100, Math.max(0, (daysSinceLMP / 280) * 100));

    let trimester = 1;
    if (currentWeek >= 28) trimester = 3;
    else if (currentWeek >= 13) trimester = 2;

    steps.push("");
    steps.push("CURRENT PROGRESS:");
    steps.push(`Days since LMP: ${daysSinceLMP}`);
    steps.push(`Current: Week ${currentWeek}, Day ${currentDay}`);
    steps.push(`Trimester: ${trimester}`);
    steps.push(`Days Remaining: ${daysRemaining}`);
    steps.push(`Progress: ${percentComplete.toFixed(1)}%`);

    const milestoneWeeks = [
      { week: 5, description: "Heart begins to beat" },
      { week: 8, description: "All major organs forming" },
      { week: 12, description: "End of first trimester; risk of miscarriage drops" },
      { week: 13, description: "Second trimester begins" },
      { week: 16, description: "Gender may be visible on ultrasound" },
      { week: 20, description: "Anatomy scan; halfway point" },
      { week: 24, description: "Viability milestone" },
      { week: 28, description: "Third trimester begins" },
      { week: 32, description: "Baby is practicing breathing" },
      { week: 36, description: "Baby is considered early term" },
      { week: 37, description: "Full term begins" },
      { week: 40, description: "Estimated due date" },
    ];

    const milestones = milestoneWeeks.map((m) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + m.week * 7);
      return { ...m, date };
    });

    setResult({
      dueDate,
      conceptionDate: conception,
      currentWeek,
      currentDay,
      trimester,
      daysRemaining,
      percentComplete,
      milestones,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-500" />
            Pregnancy Due Date Calculator
            <Badge variant="secondary">Health</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calculation Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger data-testid="select-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lmp">Last Menstrual Period (LMP)</SelectItem>
                <SelectItem value="conception">Known Conception Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method === "lmp" ? (
            <div className="space-y-2">
              <Label htmlFor="lmp-date">First Day of Last Period</Label>
              <Input
                id="lmp-date"
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                data-testid="input-lmp-date"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="conception-date">Conception Date</Label>
              <Input
                id="conception-date"
                type="date"
                value={conceptionDate}
                onChange={(e) => setConceptionDate(e.target.value)}
                data-testid="input-conception-date"
              />
            </div>
          )}

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Baby className="h-4 w-4 mr-2" />
            Calculate Due Date
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-6 rounded-lg bg-pink-50 dark:bg-pink-950/30 text-center">
                <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400" data-testid="text-due-date">
                  {result.dueDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold" data-testid="text-current-week">
                    {result.currentWeek}w {result.currentDay}d
                  </p>
                  <p className="text-xs text-muted-foreground">Current Week</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold" data-testid="text-trimester">
                    {result.trimester}
                  </p>
                  <p className="text-xs text-muted-foreground">Trimester</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold" data-testid="text-days-remaining">
                    {result.daysRemaining}
                  </p>
                  <p className="text-xs text-muted-foreground">Days Left</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{result.percentComplete.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${result.percentComplete}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Key Milestones</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.milestones.map((m, i) => {
                    const isPast = new Date() >= m.date;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-2 rounded text-sm ${
                          isPast ? "bg-pink-50 dark:bg-pink-950/20" : "bg-muted"
                        }`}
                        data-testid={`milestone-week-${m.week}`}
                      >
                        <Badge variant={isPast ? "default" : "secondary"} className="shrink-0">
                          Week {m.week}
                        </Badge>
                        <span className="flex-1">{m.description}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {m.date.toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">About Pregnancy Dating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Naegele's Rule:</strong> The standard method adds 280 days (40 weeks) to the first day of the last menstrual period. Pregnancy is dated from the LMP even though conception typically occurs about 2 weeks later.</p>
          <p><strong>Trimesters:</strong> First (weeks 1-12), Second (weeks 13-27), Third (weeks 28-40). Each trimester involves different stages of fetal development.</p>
          <p><strong>Note:</strong> This calculator provides estimates. Only about 5% of babies are born on their due date. Most births occur within 2 weeks before or after the estimated due date.</p>
        </CardContent>
      </Card>
    </div>
  );
}
