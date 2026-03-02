import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  j: { name: "Joules (J)", toJoules: 1 },
  kj: { name: "Kilojoules (kJ)", toJoules: 1000 },
  cal: { name: "Calories (cal)", toJoules: 4.184 },
  kcal: { name: "Kilocalories (kcal)", toJoules: 4184 },
  wh: { name: "Watt-hours (Wh)", toJoules: 3600 },
  kwh: { name: "Kilowatt-hours (kWh)", toJoules: 3600000 },
  btu: { name: "BTU", toJoules: 1055.06 },
  ev: { name: "Electronvolts (eV)", toJoules: 1.602176634e-19 },
  ftlb: { name: "Foot-pounds (ft-lb)", toJoules: 1.35582 },
  therm: { name: "Therms", toJoules: 105506000 },
};

type UnitKey = keyof typeof UNITS;

export default function EnergyConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    j: "1000",
    kj: "",
    cal: "",
    kcal: "",
    wh: "",
    kwh: "",
    btu: "",
    ev: "",
    ftlb: "",
    therm: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("j");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inJoules = sourceValue * UNITS[lastEdited].toJoules;
    const newSteps: string[] = [];

    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${UNITS[lastEdited].name} = ${inJoules.toLocaleString()} J`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inJoules / UNITS[unit].toJoules;
        if (Math.abs(converted) < 0.0001 || Math.abs(converted) > 999999999999) {
          newValues[unit] = converted.toExponential(4);
        } else {
          newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        }
        newSteps.push(`${UNITS[unit].name}: ${inJoules.toLocaleString()} J / ${UNITS[unit].toJoules} = ${newValues[unit]}`);
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
            Energy Converter
            <Badge variant="secondary">Conversion</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a value in any field to convert between energy units instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(UNITS) as [UnitKey, typeof UNITS[UnitKey]][]).map(([unit, { name }]) => (
              <div key={unit} className="space-y-2">
                <Label htmlFor={unit}>{name}</Label>
                <Input
                  id={unit}
                  type="text"
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
              <div className="text-sm font-mono max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Understanding Energy Units</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold mb-1">Common Conversions</p>
            <p><strong>1 kWh</strong> = 3,600,000 joules = 3,412 BTU</p>
            <p><strong>1 kcal</strong> = 4,184 joules (food calorie)</p>
            <p><strong>1 BTU</strong> = 1,055 joules (heating/cooling)</p>
            <p><strong>1 therm</strong> = 100,000 BTU (natural gas billing)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Practical Context</p>
            <p>A food Calorie (capital C) is actually a kilocalorie (kcal). Running a 100W light bulb for 1 hour uses 0.1 kWh of energy. The average US household uses about 30 kWh per day.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
