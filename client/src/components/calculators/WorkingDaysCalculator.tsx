import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";

export default function WorkingDaysCalculator() {
  const [mode, setMode] = useState("count");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysToAdd, setDaysToAdd] = useState("10");
  const [excludeSaturday, setExcludeSaturday] = useState(true);
  const [excludeSunday, setExcludeSunday] = useState(true);
  const [result, setResult] = useState<{ value: number | string; details: string[]; calendar: Date[] } | null>(null);

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return (excludeSaturday && day === 6) || (excludeSunday && day === 0);
  };

  const countWorkingDays = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) return;

    let workDays = 0;
    let totalDays = 0;
    let weekendDays = 0;
    const workingDates: Date[] = [];

    const current = new Date(start);
    while (current <= end) {
      totalDays++;
      if (!isWeekend(current)) {
        workDays++;
        workingDates.push(new Date(current));
      } else {
        weekendDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const details = [
      `Start: ${start.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}`,
      `End: ${end.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}`,
      "",
      `Total calendar days: ${totalDays}`,
      `Weekend days: ${weekendDays}`,
      `Working days: ${workDays}`,
      "",
      `Working weeks: ${(workDays / 5).toFixed(1)}`,
    ];

    setResult({ value: workDays, details, calendar: workingDates.slice(0, 31) });
  };

  const addWorkingDays = () => {
    if (!startDate) return;

    const start = new Date(startDate);
    const days = parseInt(daysToAdd);

    if (isNaN(days)) return;

    let addedDays = 0;
    const current = new Date(start);
    const workingDates: Date[] = [];

    while (addedDays < days) {
      current.setDate(current.getDate() + 1);
      if (!isWeekend(current)) {
        addedDays++;
        workingDates.push(new Date(current));
      }
    }

    const details = [
      `Start date: ${start.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}`,
      `Working days to add: ${days}`,
      "",
      `End date: ${current.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}`,
      "",
      `Calendar days spanned: ${Math.ceil((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))}`,
    ];

    setResult({ 
      value: current.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }), 
      details,
      calendar: workingDates.slice(0, 31)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Working Days Calculator
            <Badge variant="secondary">Business</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excludeSaturday}
                onChange={(e) => setExcludeSaturday(e.target.checked)}
                className="h-4 w-4"
              />
              Exclude Saturday
            </Label>
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excludeSunday}
                onChange={(e) => setExcludeSunday(e.target.checked)}
                className="h-4 w-4"
              />
              Exclude Sunday
            </Label>
          </div>

          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="count" data-testid="tab-count">Count Working Days</TabsTrigger>
              <TabsTrigger value="add" data-testid="tab-add">Add Working Days</TabsTrigger>
            </TabsList>

            <TabsContent value="count" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count-start">Start Date</Label>
                  <Input
                    id="count-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-testid="input-count-start"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count-end">End Date</Label>
                  <Input
                    id="count-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-testid="input-count-end"
                  />
                </div>
              </div>
              <Button onClick={countWorkingDays} className="w-full" data-testid="button-count">
                Count Working Days
              </Button>
            </TabsContent>

            <TabsContent value="add" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-start">Start Date</Label>
                  <Input
                    id="add-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-testid="input-add-start"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-days">Working Days to Add</Label>
                  <Input
                    id="add-days"
                    type="number"
                    min="1"
                    value={daysToAdd}
                    onChange={(e) => setDaysToAdd(e.target.value)}
                    data-testid="input-add-days"
                  />
                </div>
              </div>
              <Button onClick={addWorkingDays} className="w-full" data-testid="button-add">
                Calculate End Date
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === "count" ? "Working Days" : "End Date"}
                </p>
                <p className="text-3xl font-bold text-primary" data-testid="text-result">
                  {result.value}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Details:</p>
                <div className="text-sm font-mono bg-background p-3 rounded">
                  {result.details.map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>

              {result.calendar.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Working Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.calendar.map((date, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-background rounded">
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    ))}
                    {result.calendar.length >= 31 && <span className="text-xs text-muted-foreground">...</span>}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Working Days Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Standard work week:</strong> Monday through Friday (5 days)</p>
          <p><strong>Note:</strong> This calculator does not account for public holidays.</p>
          <p><strong>Tip:</strong> For project planning, add a buffer for unexpected delays.</p>
        </CardContent>
      </Card>
    </div>
  );
}
