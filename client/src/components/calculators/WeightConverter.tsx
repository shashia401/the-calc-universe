import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  kg: { name: "Kilograms", toKg: 1 },
  g: { name: "Grams", toKg: 0.001 },
  mg: { name: "Milligrams", toKg: 0.000001 },
  lb: { name: "Pounds", toKg: 0.453592 },
  oz: { name: "Ounces", toKg: 0.0283495 },
  st: { name: "Stone", toKg: 6.35029 },
  ton: { name: "Metric Ton", toKg: 1000 },
  shortTon: { name: "Short Ton (US)", toKg: 907.185 },
};

type UnitKey = keyof typeof UNITS;

export default function WeightConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    kg: "1",
    g: "",
    mg: "",
    lb: "",
    oz: "",
    st: "",
    ton: "",
    shortTon: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("kg");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inKg = sourceValue * UNITS[lastEdited].toKg;
    const newSteps: string[] = [];
    
    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${lastEdited} = ${inKg.toFixed(6)} kg`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inKg / UNITS[unit].toKg;
        newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        newSteps.push(`${UNITS[unit].name}: ${inKg.toFixed(6)} kg ÷ ${UNITS[unit].toKg} = ${converted.toPrecision(6)}`);
      }
    });

    setValues(newValues);
    setSteps(newSteps);
  }, [values[lastEdited], lastEdited]);

  const handleChange = (unit: UnitKey, value: string) => {
    setValues((prev) => ({ ...prev, [unit]: value }));
    setLastEdited(unit);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Weight Converter
            <Badge variant="secondary">Conversion</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a value in any field to convert to all other units instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(UNITS) as [UnitKey, typeof UNITS[UnitKey]][]).map(([unit, { name }]) => (
              <div key={unit} className="space-y-2">
                <Label htmlFor={unit}>{name} ({unit})</Label>
                <Input
                  id={unit}
                  type="number"
                  step="any"
                  value={values[unit]}
                  onChange={(e) => handleChange(unit, e.target.value)}
                  className={lastEdited === unit ? "border-primary" : ""}
                  data-testid={`input-${unit}`}
                />
              </div>
            ))}
          </div>

          {steps.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Conversion Steps:</p>
              <div className="text-sm font-mono">
                {steps.map((step, i) => (
                  <div key={i}>{step || <br />}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Weight Conversions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1 kilogram</strong> = 2.205 pounds = 35.274 ounces</p>
          <p><strong>1 pound</strong> = 0.454 kilograms = 16 ounces</p>
          <p><strong>1 stone</strong> = 14 pounds = 6.35 kilograms</p>
          <p><strong>1 metric ton</strong> = 1000 kilograms = 2204.6 pounds</p>
        </CardContent>
      </Card>
    </div>
  );
}
