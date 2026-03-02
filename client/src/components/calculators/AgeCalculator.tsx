import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Cake } from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: number;
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    if (!birthDate || !toDate) return;

    const birth = new Date(birthDate);
    const to = new Date(toDate);

    if (birth > to) return;

    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    let nextBirthday: Date;
    const thisYearBirthday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
    if (thisYearBirthday > to) {
      nextBirthday = thisYearBirthday;
    } else {
      nextBirthday = new Date(to.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: daysUntilBirthday,
    });
  };

  return (
    <Card data-testid="calculator-age">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Age Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birth-date">Date of Birth</Label>
          <Input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            data-testid="input-birth-date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-date">Age on Date</Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            data-testid="input-to-date"
          />
        </div>

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate Age
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-age">
            <div className="p-6 rounded-lg bg-accent text-center">
              <p className="text-sm text-muted-foreground">Your Age</p>
              <p className="text-3xl font-bold">
                <span className="text-primary">{result.years}</span> years{" "}
                <span className="text-primary">{result.months}</span> months{" "}
                <span className="text-primary">{result.days}</span> days
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-2xl font-bold">{result.totalDays.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-2xl font-bold">{result.totalWeeks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Weeks</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-2xl font-bold">{result.totalMonths}</p>
                <p className="text-xs text-muted-foreground">Total Months</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/10 text-primary">
              <Cake className="h-5 w-5" />
              <span className="font-medium">
                {result.nextBirthday === 0
                  ? "Happy Birthday! 🎉"
                  : `${result.nextBirthday} days until your next birthday`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
