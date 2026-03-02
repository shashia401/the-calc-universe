import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeks: number;
  months: number;
  isPast: boolean;
}

export default function DaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [result, setResult] = useState<CountdownResult | null>(null);

  const calculate = () => {
    if (!targetDate) return;

    const target = new Date(targetDate + "T00:00:00");
    const now = new Date();

    const diffMs = target.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);

    setResult({ days, hours, minutes, seconds, weeks, months, isPast });
  };

  useEffect(() => {
    if (targetDate) {
      calculate();
      const interval = setInterval(calculate, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDate]);

  const setQuickDate = (type: string) => {
    const target = new Date();
    switch (type) {
      case "christmas":
        target.setMonth(11, 25);
        if (target < new Date()) target.setFullYear(target.getFullYear() + 1);
        setEventName("Christmas");
        break;
      case "newyear":
        target.setMonth(0, 1);
        target.setFullYear(target.getFullYear() + 1);
        setEventName("New Year");
        break;
      case "valentine":
        target.setMonth(1, 14);
        if (target < new Date()) target.setFullYear(target.getFullYear() + 1);
        setEventName("Valentine's Day");
        break;
      case "halloween":
        target.setMonth(9, 31);
        if (target < new Date()) target.setFullYear(target.getFullYear() + 1);
        setEventName("Halloween");
        break;
    }
    setTargetDate(target.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Days Until Calculator
            <Badge variant="secondary">Countdown</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event">Event Name (optional)</Label>
              <Input
                id="event"
                placeholder="e.g., My Birthday"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                data-testid="input-event"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Target Date</Label>
              <Input
                id="date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                data-testid="input-date"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setQuickDate("christmas")}>
              Christmas
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate("newyear")}>
              New Year
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate("valentine")}>
              Valentine's
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate("halloween")}>
              Halloween
            </Button>
          </div>

          {result && (
            <div className={`mt-6 p-6 rounded-lg ${result.isPast ? "bg-orange-100 dark:bg-orange-900/30" : "bg-gradient-to-br from-primary/10 to-accent"}`}>
              <div className="text-center mb-4">
                <p className="text-lg text-muted-foreground">
                  {result.isPast ? "Time since" : "Time until"} {eventName || "target date"}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-3xl md:text-4xl font-bold text-primary" data-testid="text-days">
                    {result.days}
                  </p>
                  <p className="text-sm text-muted-foreground">Days</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-3xl md:text-4xl font-bold">
                    {result.hours}
                  </p>
                  <p className="text-sm text-muted-foreground">Hours</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-3xl md:text-4xl font-bold">
                    {result.minutes}
                  </p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-3xl md:text-4xl font-bold">
                    {result.seconds}
                  </p>
                  <p className="text-sm text-muted-foreground">Seconds</p>
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
                <span>{result.weeks} weeks</span>
                <span>•</span>
                <span>~{result.months} months</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Holidays (US)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>New Year's Day:</strong> January 1</p>
          <p><strong>Valentine's Day:</strong> February 14</p>
          <p><strong>Independence Day:</strong> July 4</p>
          <p><strong>Halloween:</strong> October 31</p>
          <p><strong>Thanksgiving:</strong> 4th Thursday of November</p>
          <p><strong>Christmas:</strong> December 25</p>
        </CardContent>
      </Card>
    </div>
  );
}
