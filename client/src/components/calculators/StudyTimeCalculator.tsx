import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock } from "lucide-react";

interface StudyResult {
  totalHours: number;
  hoursPerDay: number;
  hoursPerWeek: number;
  sessionsPerDay: number;
  schedule: { day: string; hours: number }[];
  steps: string[];
}

export default function StudyTimeCalculator() {
  const [totalPages, setTotalPages] = useState("300");
  const [pagesPerHour, setPagesPerHour] = useState("20");
  const [daysAvailable, setDaysAvailable] = useState("14");
  const [difficulty, setDifficulty] = useState("medium");
  const [hoursPerSession, setHoursPerSession] = useState("2");
  const [result, setResult] = useState<StudyResult | null>(null);

  const calculate = () => {
    const pages = parseFloat(totalPages);
    const pph = parseFloat(pagesPerHour);
    const days = parseFloat(daysAvailable);
    const sessionLength = parseFloat(hoursPerSession);

    if (isNaN(pages) || isNaN(pph) || isNaN(days) || pages <= 0 || pph <= 0 || days <= 0) return;

    const steps: string[] = [];

    // Difficulty multiplier
    let multiplier = 1;
    switch (difficulty) {
      case "easy": multiplier = 0.8; break;
      case "medium": multiplier = 1; break;
      case "hard": multiplier = 1.3; break;
      case "very_hard": multiplier = 1.5; break;
    }

    steps.push("STUDY TIME CALCULATION");
    steps.push("");
    steps.push(`Material: ${pages} pages`);
    steps.push(`Reading speed: ${pph} pages/hour`);
    steps.push(`Available days: ${days}`);
    steps.push(`Difficulty: ${difficulty} (×${multiplier})`);
    steps.push("");

    // Base reading time
    const baseHours = pages / pph;
    steps.push("Step 1: Calculate base reading time");
    steps.push(`${pages} pages ÷ ${pph} pages/hour = ${baseHours.toFixed(1)} hours`);
    steps.push("");

    // Add time for notes, review, practice
    const totalHours = baseHours * multiplier * 1.5; // 1.5x for notes/review
    steps.push("Step 2: Add time for notes and review (×1.5)");
    steps.push(`${baseHours.toFixed(1)} hours × ${multiplier} (difficulty) × 1.5 = ${totalHours.toFixed(1)} hours`);
    steps.push("");

    const hoursPerDay = totalHours / days;
    const hoursPerWeek = hoursPerDay * 7;
    const sessionsPerDay = Math.ceil(hoursPerDay / sessionLength);

    steps.push("Step 3: Calculate daily schedule");
    steps.push(`${totalHours.toFixed(1)} hours ÷ ${days} days = ${hoursPerDay.toFixed(1)} hours/day`);
    steps.push(`Sessions per day (${sessionLength}hr each): ${sessionsPerDay}`);
    steps.push("");

    // Create weekly schedule
    const schedule = [
      { day: "Mon", hours: hoursPerDay },
      { day: "Tue", hours: hoursPerDay },
      { day: "Wed", hours: hoursPerDay },
      { day: "Thu", hours: hoursPerDay },
      { day: "Fri", hours: hoursPerDay },
      { day: "Sat", hours: hoursPerDay * 0.8 },
      { day: "Sun", hours: hoursPerDay * 0.5 },
    ];

    steps.push("RECOMMENDATIONS:");
    steps.push("• Take 10-min breaks every hour");
    steps.push("• Review previous material at start of each session");
    steps.push("• Active recall is more effective than re-reading");
    steps.push("• Get 7-8 hours of sleep for memory consolidation");

    setResult({
      totalHours,
      hoursPerDay,
      hoursPerWeek,
      sessionsPerDay,
      schedule,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Time Calculator
            <Badge variant="secondary">Education</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Total Pages / Topics</Label>
              <Input
                id="pages"
                type="number"
                min="1"
                placeholder="300"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                data-testid="input-pages"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Pages per Hour</Label>
              <Input
                id="speed"
                type="number"
                min="1"
                placeholder="20"
                value={pagesPerHour}
                onChange={(e) => setPagesPerHour(e.target.value)}
                data-testid="input-speed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Days Available</Label>
              <Input
                id="days"
                type="number"
                min="1"
                placeholder="14"
                value={daysAvailable}
                onChange={(e) => setDaysAvailable(e.target.value)}
                data-testid="input-days"
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (familiar topic)</SelectItem>
                  <SelectItem value="medium">Medium (some new concepts)</SelectItem>
                  <SelectItem value="hard">Hard (mostly new material)</SelectItem>
                  <SelectItem value="very_hard">Very Hard (complex topics)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="session">Hours per Study Session</Label>
              <Input
                id="session"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="2"
                value={hoursPerSession}
                onChange={(e) => setHoursPerSession(e.target.value)}
                data-testid="input-session"
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Clock className="h-4 w-4 mr-2" />
            Calculate Study Schedule
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                  <p className="text-2xl font-bold" data-testid="text-total">{result.totalHours.toFixed(0)}</p>
                  <p className="text-xs">Total Hours</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-2xl font-bold">{result.hoursPerDay.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Hours/Day</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-2xl font-bold">{result.sessionsPerDay}</p>
                  <p className="text-xs text-muted-foreground">Sessions/Day</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Weekly Schedule</p>
                <div className="grid grid-cols-7 gap-1">
                  {result.schedule.map(({ day, hours }) => (
                    <div key={day} className="text-center p-2 bg-background rounded">
                      <p className="text-xs text-muted-foreground">{day}</p>
                      <p className="font-semibold">{hours.toFixed(1)}h</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Calculation Details:</p>
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
          <CardTitle className="text-lg">Study Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Pomodoro Technique:</strong> Study for 25 minutes, break for 5 minutes.</p>
          <p><strong>Active Recall:</strong> Test yourself instead of just re-reading.</p>
          <p><strong>Spaced Repetition:</strong> Review material at increasing intervals.</p>
          <p><strong>Sleep:</strong> Memory consolidation happens during sleep - don't skip it!</p>
        </CardContent>
      </Card>
    </div>
  );
}
