import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface OvulationResult {
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  safeDaysAfter: Date;
  cycleLength: number;
  lutealPhase: number;
  steps: string[];
}

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [lutealPhase, setLutealPhase] = useState("14");
  const [result, setResult] = useState<OvulationResult | null>(null);

  const calculate = () => {
    if (!lastPeriod) return;
    const lmp = new Date(lastPeriod);
    if (isNaN(lmp.getTime())) return;

    const cycle = parseInt(cycleLength);
    const luteal = parseInt(lutealPhase);

    if (isNaN(cycle) || isNaN(luteal) || cycle < 20 || cycle > 45 || luteal < 10 || luteal > 16) return;

    const steps: string[] = [];

    steps.push("INPUT DATA:");
    steps.push(`Last Period Start: ${lmp.toLocaleDateString()}`);
    steps.push(`Cycle Length: ${cycle} days`);
    steps.push(`Luteal Phase: ${luteal} days`);
    steps.push("");

    steps.push("STEP 1: Calculate Ovulation Day");
    steps.push("Ovulation typically occurs [Cycle Length - Luteal Phase] days after the start of the last period.");
    const ovulationDay = cycle - luteal;
    steps.push(`Ovulation Day = ${cycle} - ${luteal} = Day ${ovulationDay} of cycle`);
    steps.push("");

    const ovulationDate = new Date(lmp);
    ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);
    steps.push(`Ovulation Date: ${ovulationDate.toLocaleDateString()}`);
    steps.push("");

    steps.push("STEP 2: Calculate Fertile Window");
    steps.push("Sperm can survive up to 5 days in the reproductive tract.");
    steps.push("The egg is viable for about 12-24 hours after ovulation.");
    steps.push("Fertile window: 5 days before ovulation to 1 day after.");

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    steps.push(`Fertile Window: ${fertileStart.toLocaleDateString()} to ${fertileEnd.toLocaleDateString()}`);
    steps.push(`(${7} days total)`);
    steps.push("");

    steps.push("STEP 3: Calculate Next Period");
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    steps.push(`Next Period = LMP + Cycle Length`);
    steps.push(`Next Period = ${lmp.toLocaleDateString()} + ${cycle} days`);
    steps.push(`Next Period: ${nextPeriod.toLocaleDateString()}`);
    steps.push("");

    const safeDaysAfter = new Date(fertileEnd);
    safeDaysAfter.setDate(safeDaysAfter.getDate() + 1);

    steps.push("STEP 4: Safe Days (less likely to conceive)");
    steps.push(`Before fertile window: ${lmp.toLocaleDateString()} to ${new Date(fertileStart.getTime() - 86400000).toLocaleDateString()}`);
    steps.push(`After fertile window: ${safeDaysAfter.toLocaleDateString()} to ${new Date(nextPeriod.getTime() - 86400000).toLocaleDateString()}`);

    setResult({
      ovulationDate,
      fertileStart,
      fertileEnd,
      nextPeriod,
      safeDaysAfter,
      cycleLength: cycle,
      lutealPhase: luteal,
      steps,
    });
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Ovulation Calculator
            <Badge variant="secondary">Women's Health</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last-period">First Day of Last Period</Label>
            <Input
              id="last-period"
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              data-testid="input-last-period"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Average Cycle Length</Label>
              <Select value={cycleLength} onValueChange={setCycleLength}>
                <SelectTrigger data-testid="select-cycle-length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 16 }, (_, i) => i + 21).map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} days {days === 28 ? "(average)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Luteal Phase Length</Label>
              <Select value={lutealPhase} onValueChange={setLutealPhase}>
                <SelectTrigger data-testid="select-luteal-phase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 7 }, (_, i) => i + 10).map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} days {days === 14 ? "(average)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Calendar className="h-4 w-4 mr-2" />
            Calculate Ovulation
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
                <p className="text-sm text-muted-foreground">Estimated Ovulation Date</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-ovulation-date">
                  {formatDate(result.ovulationDate)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30">
                <p className="text-sm font-semibold text-center mb-2">Fertile Window</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400" data-testid="text-fertile-start">
                    {formatDate(result.fertileStart)}
                  </span>
                  <span className="text-muted-foreground">to</span>
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400" data-testid="text-fertile-end">
                    {formatDate(result.fertileEnd)}
                  </span>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  7 days - highest chance of conception
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Next Period</p>
                  <p className="text-lg font-bold" data-testid="text-next-period">
                    {formatDate(result.nextPeriod)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Cycle Day of Ovulation</p>
                  <p className="text-lg font-bold" data-testid="text-ovulation-day">
                    Day {result.cycleLength - result.lutealPhase}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Cycle Timeline</p>
                <div className="w-full h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-red-400 flex items-center justify-center text-xs text-white"
                    style={{ width: `${(5 / result.cycleLength) * 100}%` }}
                    title="Period"
                  >
                    Period
                  </div>
                  <div
                    className="bg-muted"
                    style={{ width: `${((result.cycleLength - result.lutealPhase - 6) / result.cycleLength) * 100}%` }}
                  />
                  <div
                    className="bg-pink-400 flex items-center justify-center text-xs text-white"
                    style={{ width: `${(7 / result.cycleLength) * 100}%` }}
                    title="Fertile Window"
                  >
                    Fertile
                  </div>
                  <div
                    className="bg-muted"
                    style={{ width: `${((result.lutealPhase - 1) / result.cycleLength) * 100}%` }}
                  />
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
          <CardTitle className="text-lg">About Ovulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Ovulation</strong> is when an egg is released from the ovary. It typically occurs about 14 days before the next period (the luteal phase). This is the most fertile time of the menstrual cycle.</p>
          <p><strong>Fertile Window:</strong> The 6-day window (5 days before ovulation plus ovulation day) when conception is possible. Sperm can survive up to 5 days, while the egg lives for 12-24 hours.</p>
          <p><strong>Luteal Phase:</strong> The time between ovulation and the start of the next period. It is usually consistent at 12-16 days for each individual, with 14 days being average.</p>
          <p><strong>Disclaimer:</strong> This calculator provides estimates based on average cycle data. Actual ovulation timing can vary. It should not be used as a sole method of contraception or fertility planning. Consult a healthcare provider for personalized advice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
