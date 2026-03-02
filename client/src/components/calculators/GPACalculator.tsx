import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "D-": 0.7,
  "F": 0.0,
};

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "", credits: "3", grade: "A" },
    { id: 2, name: "", credits: "3", grade: "B+" },
    { id: 3, name: "", credits: "3", grade: "A-" },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number } | null>(null);

  const addCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id), 0) + 1;
    setCourses([...courses, { id: newId, name: "", credits: "3", grade: "A" }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const credits = parseFloat(course.credits);
      const gradePoint = gradePoints[course.grade] || 0;
      if (credits > 0) {
        totalPoints += credits * gradePoint;
        totalCredits += credits;
      }
    });

    if (totalCredits > 0) {
      setResult({
        gpa: totalPoints / totalCredits,
        totalCredits,
      });
    }
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600 dark:text-green-400";
    if (gpa >= 3.0) return "text-blue-600 dark:text-blue-400";
    if (gpa >= 2.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.9) return "Summa Cum Laude";
    if (gpa >= 3.7) return "Magna Cum Laude";
    if (gpa >= 3.5) return "Cum Laude";
    if (gpa >= 3.0) return "Dean's List";
    if (gpa >= 2.0) return "Good Standing";
    return "Academic Probation";
  };

  return (
    <Card data-testid="calculator-gpa">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          GPA Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {courses.map((course, index) => (
            <div key={course.id} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Course {index + 1}</Label>
                <Input
                  placeholder="Course name (optional)"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  data-testid={`input-course-name-${index}`}
                />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs">Credits</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  data-testid={`input-credits-${index}`}
                />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs">Grade</Label>
                <Select
                  value={course.grade}
                  onValueChange={(v) => updateCourse(course.id, "grade", v)}
                >
                  <SelectTrigger data-testid={`select-grade-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(gradePoints).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCourse(course.id)}
                disabled={courses.length === 1}
                data-testid={`button-remove-${index}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addCourse} className="w-full" data-testid="button-add-course">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>

        <Button onClick={calculate} className="w-full" data-testid="button-calculate">
          Calculate GPA
        </Button>

        {result !== null && (
          <div className="space-y-4" data-testid="result-gpa">
            <div className="p-6 rounded-lg bg-accent text-center">
              <p className="text-sm text-muted-foreground">Your GPA</p>
              <p className={`text-5xl font-bold ${getGPAColor(result.gpa)}`}>
                {result.gpa.toFixed(2)}
              </p>
              <p className="text-sm font-medium mt-2">{getGPALabel(result.gpa)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {result.totalCredits} credit hours
              </p>
            </div>

            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500"
                style={{ width: `${(result.gpa / 4.0) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0</span>
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
