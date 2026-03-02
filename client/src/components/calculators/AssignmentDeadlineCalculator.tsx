import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, AlertTriangle } from "lucide-react";

interface Assignment {
  id: number;
  name: string;
  deadline: string;
  estimatedHours: string;
  priority: "high" | "medium" | "low";
}

interface ScheduleResult {
  assignments: {
    name: string;
    deadline: Date;
    daysLeft: number;
    hoursNeeded: number;
    hoursPerDay: number;
    status: "urgent" | "warning" | "ok";
  }[];
  steps: string[];
}

export default function AssignmentDeadlineCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: "Math Homework", deadline: "", estimatedHours: "3", priority: "high" },
    { id: 2, name: "Essay", deadline: "", estimatedHours: "8", priority: "medium" },
  ]);
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [result, setResult] = useState<ScheduleResult | null>(null);

  const addAssignment = () => {
    setAssignments([...assignments, { 
      id: Date.now(), 
      name: `Assignment ${assignments.length + 1}`, 
      deadline: "", 
      estimatedHours: "2",
      priority: "medium" 
    }]);
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const updateAssignment = (id: number, field: keyof Assignment, value: string) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const calculate = () => {
    const now = new Date();
    const dailyHours = parseFloat(hoursPerDay) || 4;
    const steps: string[] = [];

    steps.push("ASSIGNMENT DEADLINE ANALYSIS");
    steps.push(`Available study hours per day: ${dailyHours}`);
    steps.push("");

    const analyzed = assignments
      .filter(a => a.deadline && a.estimatedHours)
      .map(a => {
        const deadline = new Date(a.deadline + "T23:59:59");
        const diffMs = deadline.getTime() - now.getTime();
        const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        const hoursNeeded = parseFloat(a.estimatedHours) || 0;
        const hpd = daysLeft > 0 ? hoursNeeded / daysLeft : hoursNeeded;

        let status: "urgent" | "warning" | "ok" = "ok";
        if (daysLeft <= 1 || hpd > dailyHours) status = "urgent";
        else if (daysLeft <= 3 || hpd > dailyHours * 0.5) status = "warning";

        return {
          name: a.name,
          deadline,
          daysLeft,
          hoursNeeded,
          hoursPerDay: hpd,
          status,
          priority: a.priority,
        };
      })
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    let totalHoursNeeded = 0;

    analyzed.forEach(a => {
      steps.push(`📚 ${a.name}`);
      steps.push(`   Deadline: ${a.deadline.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`);
      steps.push(`   Days left: ${a.daysLeft}`);
      steps.push(`   Hours needed: ${a.hoursNeeded}`);
      steps.push(`   Hours/day required: ${a.hoursPerDay.toFixed(1)}`);
      steps.push(`   Status: ${a.status.toUpperCase()}`);
      steps.push("");
      totalHoursNeeded += a.hoursNeeded;
    });

    steps.push("SUMMARY:");
    steps.push(`Total work hours needed: ${totalHoursNeeded}`);
    steps.push(`Total days of work (at ${dailyHours}h/day): ${(totalHoursNeeded / dailyHours).toFixed(1)}`);

    const urgentCount = analyzed.filter(a => a.status === "urgent").length;
    const warningCount = analyzed.filter(a => a.status === "warning").length;

    if (urgentCount > 0) {
      steps.push("");
      steps.push(`⚠️ ${urgentCount} urgent assignment(s) need immediate attention!`);
    }

    setResult({ assignments: analyzed, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assignment Deadline Tracker
            <Badge variant="secondary">Education</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hours">Available Study Hours per Day</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="16"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="w-32"
              data-testid="input-hours-per-day"
            />
          </div>

          <div className="space-y-3">
            {assignments.map((a, i) => (
              <div key={a.id} className="flex gap-2 items-end p-3 bg-muted rounded-lg">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Assignment Name</Label>
                  <Input
                    value={a.name}
                    onChange={(e) => updateAssignment(a.id, "name", e.target.value)}
                    placeholder="Assignment name"
                    data-testid={`input-name-${i}`}
                  />
                </div>
                <div className="w-36 space-y-1">
                  <Label className="text-xs">Deadline</Label>
                  <Input
                    type="date"
                    value={a.deadline}
                    onChange={(e) => updateAssignment(a.id, "deadline", e.target.value)}
                    data-testid={`input-deadline-${i}`}
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">Est. Hours</Label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={a.estimatedHours}
                    onChange={(e) => updateAssignment(a.id, "estimatedHours", e.target.value)}
                    data-testid={`input-hours-${i}`}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeAssignment(a.id)} data-testid={`button-remove-${i}`}>
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
            Analyze Deadlines
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                {result.assignments.map((a, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border-l-4 ${
                      a.status === "urgent" 
                        ? "bg-red-50 dark:bg-red-900/20 border-red-500" 
                        : a.status === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                        : "bg-green-50 dark:bg-green-900/20 border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {a.name}
                          {a.status === "urgent" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {a.deadline.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" data-testid={`text-days-${i}`}>{a.daysLeft}</p>
                        <p className="text-xs text-muted-foreground">days left</p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span>{a.hoursNeeded}h total</span>
                      <span>•</span>
                      <span>{a.hoursPerDay.toFixed(1)}h/day needed</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-semibold mb-2">Analysis:</p>
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
          <CardTitle className="text-lg">Deadline Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Start Early:</strong> Begin assignments when they're assigned, not when they're due.</p>
          <p><strong>Break It Down:</strong> Divide large assignments into smaller, manageable tasks.</p>
          <p><strong>Buffer Time:</strong> Always add 20% extra time for unexpected issues.</p>
          <p><strong>Prioritize:</strong> Focus on urgent + important tasks first.</p>
        </CardContent>
      </Card>
    </div>
  );
}
