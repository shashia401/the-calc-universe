import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UNITS = {
  b: { name: "Bytes (B)", toBytes: 1 },
  kb: { name: "Kilobytes (KB)", toBytes: 1024 },
  mb: { name: "Megabytes (MB)", toBytes: 1048576 },
  gb: { name: "Gigabytes (GB)", toBytes: 1073741824 },
  tb: { name: "Terabytes (TB)", toBytes: 1099511627776 },
  pb: { name: "Petabytes (PB)", toBytes: 1125899906842624 },
  bit: { name: "Bits", toBytes: 0.125 },
  kbit: { name: "Kilobits (Kb)", toBytes: 128 },
  mbit: { name: "Megabits (Mb)", toBytes: 131072 },
  gbit: { name: "Gigabits (Gb)", toBytes: 134217728 },
};

type UnitKey = keyof typeof UNITS;

export default function DataConverter() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    b: "",
    kb: "",
    mb: "1",
    gb: "",
    tb: "",
    pb: "",
    bit: "",
    kbit: "",
    mbit: "",
    gbit: "",
  });
  const [lastEdited, setLastEdited] = useState<UnitKey>("mb");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const sourceValue = parseFloat(values[lastEdited]);
    if (isNaN(sourceValue)) return;

    const inBytes = sourceValue * UNITS[lastEdited].toBytes;
    const newSteps: string[] = [];

    newSteps.push(`Converting from ${UNITS[lastEdited].name}`);
    newSteps.push(`${sourceValue} ${UNITS[lastEdited].name} = ${inBytes.toLocaleString()} bytes`);
    newSteps.push("");

    const newValues: Record<UnitKey, string> = {} as Record<UnitKey, string>;
    (Object.keys(UNITS) as UnitKey[]).forEach((unit) => {
      if (unit === lastEdited) {
        newValues[unit] = values[lastEdited];
      } else {
        const converted = inBytes / UNITS[unit].toBytes;
        if (converted < 0.0001 || converted > 999999999999) {
          newValues[unit] = converted.toExponential(4);
        } else {
          newValues[unit] = converted.toPrecision(8).replace(/\.?0+$/, "");
        }
        newSteps.push(`${UNITS[unit].name}: ${inBytes.toLocaleString()} B / ${UNITS[unit].toBytes.toLocaleString()} = ${newValues[unit]}`);
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
            Data Storage Converter
            <Badge variant="secondary">Conversion</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a value in any field to convert between data storage and transfer units. Uses binary (base-2) prefixes.
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
          <CardTitle className="text-lg">Understanding Data Units</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold mb-1">Binary vs Decimal</p>
            <p>This converter uses binary (base-2) prefixes where 1 KB = 1,024 bytes. Some systems use decimal (base-10) where 1 KB = 1,000 bytes.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Common References</p>
            <p><strong>1 KB</strong> = 1,024 bytes (a short email)</p>
            <p><strong>1 MB</strong> = 1,024 KB (a high-res photo)</p>
            <p><strong>1 GB</strong> = 1,024 MB (about 250 songs in MP3)</p>
            <p><strong>1 TB</strong> = 1,024 GB (about 500 hours of HD video)</p>
            <p><strong>1 PB</strong> = 1,024 TB (about 13.3 years of HD video)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Bits vs Bytes</p>
            <p>1 byte = 8 bits. Internet speeds are typically measured in bits per second (Mbps), while file sizes use bytes (MB).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
