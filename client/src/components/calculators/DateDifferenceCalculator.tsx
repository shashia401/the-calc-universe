import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface DateResult {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  steps: string[];
}

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<DateResult | null>(null);

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    const steps: string[] = [];
    
    // Ensure start is before end
    const earlier = start < end ? start : end;
    const later = start < end ? end : start;

    steps.push(`Start Date: ${earlier.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);
    steps.push(`End Date: ${later.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`);
    steps.push("");

    // Calculate total days
    const diffTime = later.getTime() - earlier.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = totalDays / 7;
    const totalHours = diffTime / (1000 * 60 * 60);
    const totalMinutes = diffTime / (1000 * 60);

    steps.push("TOTAL DIFFERENCE:");
    steps.push(`${totalDays.toLocaleString()} days`);
    steps.push(`${totalWeeks.toFixed(2)} weeks`);
    steps.push(`${totalHours.toLocaleString()} hours`);
    steps.push(`${totalMinutes.toLocaleString()} minutes`);
    steps.push("");

    // Calculate years, months, days
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    steps.push("BROKEN DOWN:");
    if (years > 0) steps.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months > 0) steps.push(`${months} month${months !== 1 ? "s" : ""}`);
    if (weeks > 0) steps.push(`${weeks} week${weeks !== 1 ? "s" : ""}`);
    if (remainingDays > 0 || (years === 0 && months === 0 && weeks === 0)) {
      steps.push(`${remainingDays} day${remainingDays !== 1 ? "s" : ""}`);
    }

    setResult({
      years,
      months,
      weeks,
      days: remainingDays,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      steps,
    });
  };

  const setQuickDate = (type: string) => {
    const today = new Date();
    setEndDate(today.toISOString().split("T")[0]);
    
    const past = new Date(today);
    switch (type) {
      case "week":
        past.setDate(past.getDate() - 7);
        break;
      case "month":
        past.setMonth(past.getMonth() - 1);
        break;
      case "year":
        past.setFullYear(past.getFullYear() - 1);
        break;
    }
    setStartDate(past.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Difference Calculator
            <Badge variant="secondary">Time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Date</Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setQuickDate("week")}>
              Last Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate("month")}>
              Last Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate("year")}>
              Last Year
            </Button>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Difference
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time Between Dates</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-result">
                  {result.years > 0 && `${result.years}y `}
                  {result.months > 0 && `${result.months}m `}
                  {result.weeks > 0 && `${result.weeks}w `}
                  {result.days}d
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-2xl font-bold">{result.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-2xl font-bold">{result.totalWeeks.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Total Weeks</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-2xl font-bold">{result.totalHours.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Hours</p>
                </div>
                <div className="p-3 bg-background rounded text-center">
                  <p className="text-2xl font-bold">{(result.totalMinutes / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-muted-foreground">Total Minutes</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Details:</p>
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
          <CardTitle className="text-lg">Fun Date Facts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1 year</strong> = 365.25 days (accounting for leap years)</p>
          <p><strong>1 month</strong> = ~30.44 days on average</p>
          <p><strong>1 decade</strong> = 10 years = 3,652.5 days</p>
          <p><strong>1 century</strong> = 100 years = 36,525 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
