import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  mps: { name: "Meters per Second", toMps: 1 },
  kmph: { name: "Kilometers per Hour", toMps: 0.277778 },
  mph: { name: "Miles per Hour", toMps: 0.44704 },
  fps: { name: "Feet per Second", toMps: 0.3048 },
  knot: { name: "Knots", toMps: 0.514444 },
  mach: { name: "Mach (at sea level)", toMps: 343 },
  lightspeed: { name: "Speed of Light (c)", toMps: 299792458 },
};

type UnitKey = keyof typeof UNITS;

export default function SpeedConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    mps: "",
    kmph: "100",
    mph: "",
    fps: "",
    knot: "",
    mach: "",
    lightspeed: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("kmph");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inMps = sourceValue * UNITS[lastEdited].toMps;
    const newSteps: string[] = [];
    
    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${lastEdited} = ${inMps.toFixed(6)} m/s`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inMps / UNITS[unit].toMps;
        if (converted < 0.0001 || converted > 999999999) {
          newValues[unit] = converted.toExponential(4);
        } else {
          newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        }
        newSteps.push(`${UNITS[unit].name}: ${inMps.toFixed(4)} m/s ÷ ${UNITS[unit].toMps} = ${newValues[unit]}`);
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
            Speed Converter
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
          <CardTitle className="text-lg">Speed Facts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1 km/h</strong> = 0.621 mph = 0.278 m/s</p>
          <p><strong>1 knot</strong> = 1.852 km/h (used for ships and aircraft)</p>
          <p><strong>Mach 1</strong> = 1,235 km/h = 767 mph (speed of sound)</p>
          <p><strong>Speed of light</strong> = 299,792 km/s = 670,616,629 mph</p>
        </CardContent>
      </Card>
    </div>
  );
}
