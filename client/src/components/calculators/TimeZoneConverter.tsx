import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const TIMEZONES = [
  { id: "UTC", name: "UTC (Coordinated Universal Time)", offset: 0 },
  { id: "EST", name: "EST (Eastern Standard Time)", offset: -5 },
  { id: "EDT", name: "EDT (Eastern Daylight Time)", offset: -4 },
  { id: "CST", name: "CST (Central Standard Time)", offset: -6 },
  { id: "CDT", name: "CDT (Central Daylight Time)", offset: -5 },
  { id: "MST", name: "MST (Mountain Standard Time)", offset: -7 },
  { id: "MDT", name: "MDT (Mountain Daylight Time)", offset: -6 },
  { id: "PST", name: "PST (Pacific Standard Time)", offset: -8 },
  { id: "PDT", name: "PDT (Pacific Daylight Time)", offset: -7 },
  { id: "AKST", name: "AKST (Alaska Standard Time)", offset: -9 },
  { id: "HST", name: "HST (Hawaii Standard Time)", offset: -10 },
  { id: "GMT", name: "GMT (Greenwich Mean Time)", offset: 0 },
  { id: "BST", name: "BST (British Summer Time)", offset: 1 },
  { id: "CET", name: "CET (Central European Time)", offset: 1 },
  { id: "CEST", name: "CEST (Central European Summer Time)", offset: 2 },
  { id: "IST", name: "IST (India Standard Time)", offset: 5.5 },
  { id: "JST", name: "JST (Japan Standard Time)", offset: 9 },
  { id: "CST_CN", name: "CST (China Standard Time)", offset: 8 },
  { id: "AEST", name: "AEST (Australian Eastern Standard Time)", offset: 10 },
  { id: "AEDT", name: "AEDT (Australian Eastern Daylight Time)", offset: 11 },
  { id: "NZST", name: "NZST (New Zealand Standard Time)", offset: 12 },
];

export default function TimeZoneConverter() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [fromZone, setFromZone] = useState("EST");
  const [toZone, setToZone] = useState("UTC");
  const [result, setResult] = useState<{ time: string; date: string; steps: string[] } | null>(null);
  const [worldTimes, setWorldTimes] = useState<{ zone: string; time: string }[]>([]);

  useEffect(() => {
    // Set current time as default
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
  }, []);

  const convert = () => {
    if (!time || !date) return;

    const fromTz = TIMEZONES.find(tz => tz.id === fromZone);
    const toTz = TIMEZONES.find(tz => tz.id === toZone);
    if (!fromTz || !toTz) return;

    const steps: string[] = [];

    // Parse input time
    const [hours, minutes] = time.split(":").map(Number);
    const inputDate = new Date(date);
    inputDate.setHours(hours, minutes, 0, 0);

    steps.push(`Input: ${time} on ${date} in ${fromTz.name}`);
    steps.push("");

    // Convert to UTC first
    const utcTime = new Date(inputDate.getTime() - fromTz.offset * 60 * 60 * 1000);
    steps.push(`Step 1: Convert to UTC`);
    steps.push(`UTC offset for ${fromZone}: ${fromTz.offset >= 0 ? "+" : ""}${fromTz.offset} hours`);
    steps.push(`${time} ${fromTz.offset >= 0 ? "-" : "+"} ${Math.abs(fromTz.offset)} hours = ${utcTime.toTimeString().slice(0, 5)} UTC`);
    steps.push("");

    // Convert from UTC to target
    const targetTime = new Date(utcTime.getTime() + toTz.offset * 60 * 60 * 1000);
    steps.push(`Step 2: Convert to ${toZone}`);
    steps.push(`UTC offset for ${toZone}: ${toTz.offset >= 0 ? "+" : ""}${toTz.offset} hours`);
    steps.push(`${utcTime.toTimeString().slice(0, 5)} UTC ${toTz.offset >= 0 ? "+" : "-"} ${Math.abs(toTz.offset)} hours = ${targetTime.toTimeString().slice(0, 5)} ${toZone}`);

    const resultTime = targetTime.toTimeString().slice(0, 5);
    const resultDate = targetTime.toISOString().split("T")[0];

    // Check if date changed
    if (resultDate !== date) {
      steps.push("");
      steps.push(`Note: Date changes to ${resultDate}`);
    }

    setResult({ time: resultTime, date: resultDate, steps });

    // Calculate world times
    const times = TIMEZONES.slice(0, 8).map(tz => {
      const tzTime = new Date(utcTime.getTime() + tz.offset * 60 * 60 * 1000);
      return { zone: tz.id, time: tzTime.toTimeString().slice(0, 5) };
    });
    setWorldTimes(times);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Time Zone Converter
            <Badge variant="secondary">Time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="input-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                data-testid="input-time"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Time Zone</Label>
              <Select value={fromZone} onValueChange={setFromZone}>
                <SelectTrigger data-testid="select-from">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz.id} value={tz.id}>
                      {tz.id} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>To Time Zone</Label>
              <Select value={toZone} onValueChange={setToZone}>
                <SelectTrigger data-testid="select-to">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz.id} value={tz.id}>
                      {tz.id} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full" data-testid="button-convert">
            Convert Time
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {time} {fromZone} on {date}
                </p>
                <p className="text-lg">is</p>
                <p className="text-4xl font-bold text-primary" data-testid="text-result">
                  {result.time}
                </p>
                <p className="text-lg text-muted-foreground">
                  {toZone} on {result.date}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Conversion Steps:</p>
                <div className="text-sm font-mono bg-background p-3 rounded">
                  {result.steps.map((step, i) => (
                    <div key={i}>{step || <br />}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {worldTimes.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-3">World Times</p>
              <div className="grid grid-cols-4 gap-2">
                {worldTimes.map(({ zone, time }) => (
                  <div key={zone} className="text-center p-2 bg-background rounded">
                    <p className="font-semibold">{zone}</p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
