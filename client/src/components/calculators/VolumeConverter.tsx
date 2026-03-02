import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  l: { name: "Liters (L)", toLiters: 1 },
  ml: { name: "Milliliters (mL)", toLiters: 0.001 },
  gal: { name: "Gallons (US)", toLiters: 3.78541 },
  qt: { name: "Quarts (US)", toLiters: 0.946353 },
  pt: { name: "Pints (US)", toLiters: 0.473176 },
  cup: { name: "Cups (US)", toLiters: 0.236588 },
  floz: { name: "Fluid Ounces (US)", toLiters: 0.0295735 },
  tbsp: { name: "Tablespoons", toLiters: 0.0147868 },
  tsp: { name: "Teaspoons", toLiters: 0.00492892 },
  m3: { name: "Cubic Meters (m³)", toLiters: 1000 },
  cm3: { name: "Cubic Centimeters (cm³)", toLiters: 0.001 },
  galUK: { name: "Gallons (UK)", toLiters: 4.54609 },
};

type UnitKey = keyof typeof UNITS;

export default function VolumeConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    l: "1",
    ml: "",
    gal: "",
    qt: "",
    pt: "",
    cup: "",
    floz: "",
    tbsp: "",
    tsp: "",
    m3: "",
    cm3: "",
    galUK: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("l");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inLiters = sourceValue * UNITS[lastEdited].toLiters;
    const newSteps: string[] = [];

    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${lastEdited} = ${inLiters.toFixed(6)} L`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inLiters / UNITS[unit].toLiters;
        newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        newSteps.push(`${UNITS[unit].name}: ${inLiters.toFixed(6)} L / ${UNITS[unit].toLiters} = ${converted.toPrecision(6)}`);
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
            Volume Converter
            <Badge variant="secondary">Conversion</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a value in any field to convert to all other volume units instantly.
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
          <CardTitle className="text-lg">Common Volume Conversions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>1 liter</strong> = 0.264 US gallons = 4.227 cups</p>
          <p><strong>1 US gallon</strong> = 3.785 liters = 128 fluid ounces</p>
          <p><strong>1 cup</strong> = 16 tablespoons = 48 teaspoons</p>
          <p><strong>1 UK gallon</strong> = 1.201 US gallons = 4.546 liters</p>
          <p><strong>1 cubic meter</strong> = 1,000 liters = 264.2 US gallons</p>
        </CardContent>
      </Card>
    </div>
  );
}
