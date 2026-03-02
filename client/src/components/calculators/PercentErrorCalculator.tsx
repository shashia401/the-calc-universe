import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CalculationResult {
  percentError: number;
  absoluteError: number;
  steps: string[];
}

export default function PercentErrorCalculator() {
  const [experimental, setExperimental] = useState("");
  const [theoretical, setTheoretical] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    const exp = parseFloat(experimental);
    const theo = parseFloat(theoretical);

    if (isNaN(exp) || isNaN(theo) || theo === 0) return;

    const absoluteError = Math.abs(exp - theo);
    const percentError = (absoluteError / Math.abs(theo)) * 100;

    const steps = [
      `Step 1: Find the absolute error (difference between values)`,
      `Absolute Error = |Experimental - Theoretical|`,
      `Absolute Error = |${exp} - ${theo}| = ${absoluteError.toFixed(4)}`,
      `Step 2: Divide by the theoretical (accepted) value`,
      `${absoluteError.toFixed(4)} ÷ |${theo}| = ${(absoluteError / Math.abs(theo)).toFixed(6)}`,
      `Step 3: Multiply by 100 to get percentage`,
      `${(absoluteError / Math.abs(theo)).toFixed(6)} × 100 = ${percentError.toFixed(2)}%`,
    ];

    setResult({ percentError, absoluteError, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Percent Error Calculator
            <Badge variant="secondary">Science</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experimental">Experimental (Measured) Value</Label>
              <Input
                id="experimental"
                type="number"
                step="any"
                placeholder="Enter your measured value"
                value={experimental}
                onChange={(e) => setExperimental(e.target.value)}
                data-testid="input-experimental"
              />
              <p className="text-xs text-muted-foreground">
                The value you got from your experiment or measurement
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theoretical">Theoretical (Accepted) Value</Label>
              <Input
                id="theoretical"
                type="number"
                step="any"
                placeholder="Enter the accepted value"
                value={theoretical}
                onChange={(e) => setTheoretical(e.target.value)}
                data-testid="input-theoretical"
              />
              <p className="text-xs text-muted-foreground">
                The known or expected correct value
              </p>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Percent Error
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Percent Error</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-percent-error">
                    {result.percentError.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absolute Error</p>
                  <p className="text-3xl font-bold" data-testid="text-absolute-error">
                    {result.absoluteError.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${result.percentError < 5 ? 'bg-green-100 dark:bg-green-900' : result.percentError < 10 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <p className="font-semibold">
                  {result.percentError < 5
                    ? "Excellent! Very accurate measurement."
                    : result.percentError < 10
                    ? "Good accuracy. Within acceptable range for most experiments."
                    : "High error. Consider re-checking your measurement or method."}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Step-by-Step Solution:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {result.steps.map((step, i) => (
                    <p key={i} className={step.startsWith("Step") ? "font-medium text-foreground mt-2" : "ml-4"}>
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Percent Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Percent Error?</h3>
            <p className="text-muted-foreground">
              Percent error tells you how far off your measured (experimental) value is from the true 
              (theoretical) value, expressed as a percentage. It's commonly used in science experiments 
              to evaluate the accuracy of measurements.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <div className="text-center py-4">
              <p className="font-mono text-lg text-primary">
                Percent Error = |Experimental - Theoretical| / |Theoretical| × 100%
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              The vertical bars | | mean "absolute value" - we ignore negative signs because we only 
              care about the size of the error, not its direction.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Measuring the Boiling Point of Water</h3>
            <p className="text-muted-foreground mb-2">
              You measure water boiling at 99.1°C, but the accepted value is 100°C.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Find the absolute error: |99.1 - 100| = |-0.9| = 0.9°C</li>
              <li>Divide by the accepted value: 0.9 ÷ 100 = 0.009</li>
              <li>Multiply by 100: 0.009 × 100 = 0.9%</li>
              <li>Your percent error is 0.9% - very accurate!</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">What's a Good Percent Error?</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><strong className="text-green-600">Less than 5%:</strong> Excellent - your measurement is very accurate</p>
              <p><strong className="text-yellow-600">5% to 10%:</strong> Good - acceptable for most school experiments</p>
              <p><strong className="text-red-600">More than 10%:</strong> High error - you might want to redo the experiment</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Common Causes of Error</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Measurement errors:</strong> Reading instruments incorrectly</li>
              <li><strong>Equipment limitations:</strong> Using imprecise tools</li>
              <li><strong>Environmental factors:</strong> Temperature, humidity, or air pressure changes</li>
              <li><strong>Human error:</strong> Mistakes in procedure or calculation</li>
              <li><strong>Random variations:</strong> Natural fluctuations in measurements</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
