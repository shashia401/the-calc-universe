import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const units = [
  { id: "mm", name: "Millimeters (mm)", factor: 0.001 },
  { id: "cm", name: "Centimeters (cm)", factor: 0.01 },
  { id: "m", name: "Meters (m)", factor: 1 },
  { id: "km", name: "Kilometers (km)", factor: 1000 },
  { id: "in", name: "Inches (in)", factor: 0.0254 },
  { id: "ft", name: "Feet (ft)", factor: 0.3048 },
  { id: "yd", name: "Yards (yd)", factor: 0.9144 },
  { id: "mi", name: "Miles (mi)", factor: 1609.344 },
];

export function LengthConverter() {
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit]);

  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromFactor = units.find((u) => u.id === fromUnit)?.factor || 1;
    const toFactor = units.find((u) => u.id === toUnit)?.factor || 1;

    const meters = value * fromFactor;
    const converted = meters / toFactor;

    setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setFromValue(result.replace(/,/g, ""));
    }
  };

  return (
    <Card data-testid="calculator-length">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Length Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from-value">Value</Label>
          <Input
            id="from-value"
            type="number"
            placeholder="Enter value"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            data-testid="input-from-value"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger data-testid="select-from-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={swapUnits}
            className="mb-0.5"
            data-testid="button-swap"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger data-testid="select-to-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="p-6 rounded-lg bg-accent text-center" data-testid="result-length">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-3xl font-bold break-all">
              {result} <span className="text-xl text-muted-foreground">{toUnit}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {fromValue} {fromUnit} = {result} {toUnit}
            </p>
          </div>
        )}

        <div className="text-sm text-muted-foreground pt-4 border-t">
          <p className="font-medium mb-2">Quick Reference:</p>
          <ul className="space-y-1 text-xs">
            <li>1 inch = 2.54 cm</li>
            <li>1 foot = 0.3048 m</li>
            <li>1 mile = 1.609 km</li>
            <li>1 meter = 3.281 feet</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
