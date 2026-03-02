import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2 } from "lucide-react";

interface TimeEntry {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
}

interface HoursResult {
  entries: { label: string; hours: number; minutes: number; decimal: number }[];
  totalHours: number;
  totalMinutes: number;
  totalDecimal: number;
  steps: string[];
}

export default function HoursCalculator() {
  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: 1, label: "Day 1", startTime: "09:00", endTime: "17:00", breakMinutes: "30" },
  ]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [result, setResult] = useState<HoursResult | null>(null);

  let nextId = entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1;

  const addEntry = () => {
    setEntries([
      ...entries,
      { id: nextId, label: `Day ${nextId}`, startTime: "09:00", endTime: "17:00", breakMinutes: "0" },
    ]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const updateEntry = (id: number, field: string, value: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculate = () => {
    const steps: string[] = [];
    let totalMinutesWorked = 0;
    const entryResults: { label: string; hours: number; minutes: number; decimal: number }[] = [];

    entries.forEach((entry) => {
      if (!entry.startTime || !entry.endTime) return;

      const startMin = parseTime(entry.startTime);
      let endMin = parseTime(entry.endTime);
      const breakMin = parseInt(entry.breakMinutes) || 0;

      if (endMin <= startMin) {
        endMin += 24 * 60;
      }

      const workedMin = endMin - startMin - breakMin;
      if (workedMin <= 0) return;

      const hours = Math.floor(workedMin / 60);
      const minutes = workedMin % 60;
      const decimal = workedMin / 60;

      totalMinutesWorked += workedMin;
      entryResults.push({ label: entry.label, hours, minutes, decimal });

      steps.push(`${entry.label}: ${entry.startTime} to ${entry.endTime}`);
      steps.push(`  Duration: ${endMin - startMin} min - ${breakMin} min break = ${workedMin} min`);
      steps.push(`  = ${hours}h ${minutes}m (${decimal.toFixed(2)} hours)`);
      steps.push("");
    });

    const totalHours = Math.floor(totalMinutesWorked / 60);
    const totalMins = totalMinutesWorked % 60;
    const totalDecimal = totalMinutesWorked / 60;

    steps.push(`TOTAL: ${totalHours}h ${totalMins}m (${totalDecimal.toFixed(2)} hours)`);

    const rate = parseFloat(hourlyRate);
    if (!isNaN(rate) && rate > 0) {
      const grossPay = totalDecimal * rate;
      steps.push("");
      steps.push(`Gross Pay: ${totalDecimal.toFixed(2)} hours x $${rate.toFixed(2)}/hr = $${grossPay.toFixed(2)}`);
    }

    setResult({
      entries: entryResults,
      totalHours,
      totalMinutes: totalMins,
      totalDecimal,
      steps,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours Calculator
            <Badge variant="secondary">Time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Calculate total hours worked across multiple time entries. Supports overnight shifts and break deductions.
          </p>

          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="p-3 border rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={entry.label}
                      onChange={(e) => updateEntry(entry.id, "label", e.target.value)}
                      data-testid={`input-label-${entry.id}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Start Time</Label>
                    <Input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) => updateEntry(entry.id, "startTime", e.target.value)}
                      data-testid={`input-start-${entry.id}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Time</Label>
                    <Input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) => updateEntry(entry.id, "endTime", e.target.value)}
                      data-testid={`input-end-${entry.id}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Break (min)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={entry.breakMinutes}
                      onChange={(e) => updateEntry(entry.id, "breakMinutes", e.target.value)}
                      data-testid={`input-break-${entry.id}`}
                    />
                  </div>
                  <div className="flex items-end">
                    {entries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(entry.id)}
                        data-testid={`button-remove-${entry.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addEntry} className="w-full" data-testid="button-add-entry">
            <Plus className="h-4 w-4 mr-2" /> Add Time Entry
          </Button>

          <div className="space-y-2">
            <Label htmlFor="rate">Hourly Rate (optional)</Label>
            <Input
              id="rate"
              type="number"
              step="any"
              placeholder="e.g., 25.00"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              data-testid="input-rate"
            />
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Hours
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Hours Worked</p>
                <p className="text-3xl font-bold" data-testid="text-total-hours">
                  {result.totalHours}h {result.totalMinutes}m
                </p>
                <p className="text-sm text-muted-foreground">
                  ({result.totalDecimal.toFixed(2)} decimal hours)
                </p>
                {!isNaN(parseFloat(hourlyRate)) && parseFloat(hourlyRate) > 0 && (
                  <p className="text-lg font-semibold mt-2" data-testid="text-gross-pay">
                    Gross Pay: ${(result.totalDecimal * parseFloat(hourlyRate)).toFixed(2)}
                  </p>
                )}
              </div>

              {result.entries.length > 1 && (
                <div className="space-y-2">
                  {result.entries.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm font-medium">{entry.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {entry.hours}h {entry.minutes}m ({entry.decimal.toFixed(2)} hrs)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Calculation Steps:</p>
                <div className="text-sm font-mono">
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
          <CardTitle className="text-lg">Time Tracking Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold mb-1">Decimal Hours Conversion</p>
            <p>Payroll often uses decimal hours. 30 minutes = 0.5 hours, 15 minutes = 0.25 hours, 45 minutes = 0.75 hours.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Overtime</p>
            <p>In the US, the FLSA requires overtime pay (1.5x) for hours exceeding 40 per week for non-exempt employees.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Overnight Shifts</p>
            <p>If your end time is earlier than your start time, this calculator automatically handles overnight shifts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
