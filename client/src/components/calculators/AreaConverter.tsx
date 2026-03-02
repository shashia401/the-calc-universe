import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  sqm: { name: "Square Meters", toSqm: 1 },
  sqkm: { name: "Square Kilometers", toSqm: 1000000 },
  sqcm: { name: "Square Centimeters", toSqm: 0.0001 },
  sqft: { name: "Square Feet", toSqm: 0.092903 },
  sqyd: { name: "Square Yards", toSqm: 0.836127 },
  sqmi: { name: "Square Miles", toSqm: 2589988.11 },
  acre: { name: "Acres", toSqm: 4046.86 },
  hectare: { name: "Hectares", toSqm: 10000 },
  sqin: { name: "Square Inches", toSqm: 0.00064516 },
};

type UnitKey = keyof typeof UNITS;

export default function AreaConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    sqm: "1",
    sqkm: "",
    sqcm: "",
    sqft: "",
    sqyd: "",
    sqmi: "",
    acre: "",
    hectare: "",
    sqin: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("sqm");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inSqm = sourceValue * UNITS[lastEdited].toSqm;
    const newSteps: string[] = [];
    
    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${lastEdited} = ${inSqm.toFixed(6)} m²`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inSqm / UNITS[unit].toSqm;
        newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        newSteps.push(`${UNITS[unit].name}: ${inSqm.toFixed(4)} m² ÷ ${UNITS[unit].toSqm} = ${converted.toPrecision(6)}`);
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
            Area Converter
            <Badge variant="secondary">Conversion</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a value in any field to convert to all other units instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(UNITS) as [UnitKey, typeof UNITS[UnitKey]][]).map(([unit, { name }]) => (
              <div key={unit} className="space-y-2">
                <Label htmlFor={unit}>{name}</Label>
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
          <CardTitle className="text-lg">Common Area Conversions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1 square meter</strong> = 10.764 sq ft = 1.196 sq yards</p>
          <p><strong>1 acre</strong> = 4,047 m² = 43,560 sq ft</p>
          <p><strong>1 hectare</strong> = 10,000 m² = 2.471 acres</p>
          <p><strong>1 square mile</strong> = 640 acres = 2.59 km²</p>
        </CardContent>
      </Card>
    </div>
  );
}
