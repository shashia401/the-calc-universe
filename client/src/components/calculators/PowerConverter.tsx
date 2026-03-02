import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  w: { name: "Watts (W)", toWatts: 1 },
  kw: { name: "Kilowatts (kW)", toWatts: 1000 },
  mw: { name: "Megawatts (MW)", toWatts: 1e6 },
  hp: { name: "Horsepower (hp)", toWatts: 745.7 },
  btuh: { name: "BTU/hour", toWatts: 0.29307107 },
  ftlbs: { name: "Foot-pounds/sec", toWatts: 1.35582 },
  cals: { name: "Calories/sec", toWatts: 4.184 },
  kcalh: { name: "Kilocalories/hour", toWatts: 1.163 },
  js: { name: "Joules/sec (J/s)", toWatts: 1 },
  ton: { name: "Ton of refrigeration", toWatts: 3516.85 },
};

type UnitKey = keyof typeof UNITS;

export default function PowerConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    w: "1000",
    kw: "",
    mw: "",
    hp: "",
    btuh: "",
    ftlbs: "",
    cals: "",
    kcalh: "",
    js: "",
    ton: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("w");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inWatts = sourceValue * UNITS[lastEdited].toWatts;
    const newSteps: string[] = [];

    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${UNITS[lastEdited].name} = ${inWatts.toLocaleString()} W`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inWatts / UNITS[unit].toWatts;
        newValues[unit] = converted < 0.0001 || converted > 1e12
          ? converted.toExponential(6)
          : parseFloat(converted.toPrecision(10)).toString();
        newSteps.push(`${UNITS[unit].name}: ${newValues[unit]}`);
      }
    });

    setValues(newValues);
    setSteps(newSteps);
  }, [lastEdited, values[lastEdited]]);

  const handleChange = (unit: UnitKey, value: string) => {
    setLastEdited(unit);
    setValues((prev) => ({ ...prev, [unit]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(UNITS) as UnitKey[]).map((unit) => (
              <div key={unit} className="space-y-1">
                <Label htmlFor={`power-${unit}`}>{UNITS[unit].name}</Label>
                <Input
                  id={`power-${unit}`}
                  data-testid={`input-power-${unit}`}
                  type="number"
                  value={values[unit]}
                  onChange={(e) => handleChange(unit, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step-by-Step Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1" data-testid="text-power-steps">
              {steps.map((step, i) =>
                step === "" ? (
                  <div key={i} className="h-2" />
                ) : (
                  <p key={i} className="text-sm text-muted-foreground">{step}</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Understanding Power Units</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Power measures the rate at which energy is transferred or converted. One watt equals one joule per second.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">1 kW = 1,000 W</Badge>
            <Badge variant="secondary">1 hp = 745.7 W</Badge>
            <Badge variant="secondary">1 BTU/hr = 0.293 W</Badge>
            <Badge variant="secondary">1 ton = 3,516.85 W</Badge>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Watt (W):</strong> The SI unit of power, equal to one joule per second. Used globally for electrical appliances and devices.</p>
            <p><strong>Horsepower (hp):</strong> Originally defined by James Watt to compare steam engine output to draft horses. Still used for car engines and motors.</p>
            <p><strong>BTU/hour:</strong> British Thermal Units per hour, commonly used in HVAC and heating systems in the United States.</p>
            <p><strong>Ton of refrigeration:</strong> Used in air conditioning. One ton equals the cooling power of melting one short ton of ice in 24 hours.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
