import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, Plus, Trash2 } from "lucide-react";

interface RoomArea {
  id: number;
  name: string;
  shape: string;
  dimensions: Record<string, string>;
  area: number;
}

export default function SquareFootageCalculator() {
  const [rooms, setRooms] = useState<RoomArea[]>([
    { id: 1, name: "Room 1", shape: "rectangle", dimensions: { length: "", width: "" }, area: 0 },
  ]);
  const [unit, setUnit] = useState("feet");
  const [result, setResult] = useState<{ totalArea: number; steps: string[] } | null>(null);
  let nextId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;

  const addRoom = () => {
    setRooms([
      ...rooms,
      { id: nextId, name: `Room ${nextId}`, shape: "rectangle", dimensions: { length: "", width: "" }, area: 0 },
    ]);
  };

  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const updateDimension = (id: number, dim: string, value: string) => {
    setRooms(
      rooms.map((r) =>
        r.id === id ? { ...r, dimensions: { ...r.dimensions, [dim]: value } } : r
      )
    );
  };

  const updateShape = (id: number, shape: string) => {
    let dimensions: Record<string, string> = {};
    switch (shape) {
      case "rectangle":
        dimensions = { length: "", width: "" };
        break;
      case "triangle":
        dimensions = { base: "", height: "" };
        break;
      case "circle":
        dimensions = { radius: "" };
        break;
      case "trapezoid":
        dimensions = { base1: "", base2: "", height: "" };
        break;
    }
    setRooms(rooms.map((r) => (r.id === id ? { ...r, shape, dimensions } : r)));
  };

  const calculateArea = (shape: string, dims: Record<string, string>): { area: number; formula: string } => {
    switch (shape) {
      case "rectangle": {
        const l = parseFloat(dims.length);
        const w = parseFloat(dims.width);
        if (isNaN(l) || isNaN(w)) return { area: 0, formula: "" };
        return { area: l * w, formula: `${l} x ${w} = ${(l * w).toFixed(2)}` };
      }
      case "triangle": {
        const b = parseFloat(dims.base);
        const h = parseFloat(dims.height);
        if (isNaN(b) || isNaN(h)) return { area: 0, formula: "" };
        return { area: (b * h) / 2, formula: `(${b} x ${h}) / 2 = ${((b * h) / 2).toFixed(2)}` };
      }
      case "circle": {
        const r = parseFloat(dims.radius);
        if (isNaN(r)) return { area: 0, formula: "" };
        const a = Math.PI * r * r;
        return { area: a, formula: `π x ${r}² = ${a.toFixed(2)}` };
      }
      case "trapezoid": {
        const b1 = parseFloat(dims.base1);
        const b2 = parseFloat(dims.base2);
        const h = parseFloat(dims.height);
        if (isNaN(b1) || isNaN(b2) || isNaN(h)) return { area: 0, formula: "" };
        const a = ((b1 + b2) / 2) * h;
        return { area: a, formula: `((${b1} + ${b2}) / 2) x ${h} = ${a.toFixed(2)}` };
      }
      default:
        return { area: 0, formula: "" };
    }
  };

  const calculate = () => {
    const steps: string[] = [];
    let totalArea = 0;

    const updatedRooms = rooms.map((room) => {
      const { area, formula } = calculateArea(room.shape, room.dimensions);
      if (area > 0) {
        steps.push(`${room.name} (${room.shape}): ${formula} sq ${unit}`);
        totalArea += area;
      }
      return { ...room, area };
    });

    setRooms(updatedRooms);

    if (totalArea > 0) {
      steps.push("");
      steps.push(`Total: ${totalArea.toFixed(2)} sq ${unit}`);

      if (unit === "feet") {
        const sqMeters = totalArea * 0.092903;
        const acres = totalArea / 43560;
        steps.push(`= ${sqMeters.toFixed(2)} sq meters`);
        steps.push(`= ${acres.toFixed(6)} acres`);
      } else {
        const sqFeet = totalArea / 0.092903;
        steps.push(`= ${sqFeet.toFixed(2)} sq feet`);
      }
    }

    setResult({ totalArea, steps });
  };

  const getDimensionFields = (shape: string) => {
    switch (shape) {
      case "rectangle":
        return [
          { key: "length", label: "Length" },
          { key: "width", label: "Width" },
        ];
      case "triangle":
        return [
          { key: "base", label: "Base" },
          { key: "height", label: "Height" },
        ];
      case "circle":
        return [{ key: "radius", label: "Radius" }];
      case "trapezoid":
        return [
          { key: "base1", label: "Base 1" },
          { key: "base2", label: "Base 2" },
          { key: "height", label: "Height" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Square Footage Calculator
            <Badge variant="secondary">Utility</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Measurement Unit:</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-32" data-testid="select-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feet">Feet</SelectItem>
                <SelectItem value="meters">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                    className="w-40"
                    data-testid={`input-room-name-${room.id}`}
                  />
                  <Select value={room.shape} onValueChange={(v) => updateShape(room.id, v)}>
                    <SelectTrigger className="w-36" data-testid={`select-shape-${room.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="trapezoid">Trapezoid</SelectItem>
                    </SelectContent>
                  </Select>
                  {rooms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRoom(room.id)}
                      data-testid={`button-remove-${room.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getDimensionFields(room.shape).map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label className="text-xs">{field.label} ({unit})</Label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={room.dimensions[field.key] || ""}
                        onChange={(e) => updateDimension(room.id, field.key, e.target.value)}
                        data-testid={`input-${field.key}-${room.id}`}
                      />
                    </div>
                  ))}
                </div>

                {room.area > 0 && (
                  <p className="text-sm text-muted-foreground" data-testid={`text-area-${room.id}`}>
                    Area: {room.area.toFixed(2)} sq {unit}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addRoom} className="w-full" data-testid="button-add-room">
            <Plus className="h-4 w-4 mr-2" /> Add Another Area
          </Button>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Total Square Footage
          </Button>

          {result && result.totalArea > 0 && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Area</p>
                <p className="text-3xl font-bold" data-testid="text-total-area">
                  {result.totalArea.toFixed(2)} sq {unit}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Calculation Steps:</p>
                <div className="text-sm font-mono">
                  {result.steps.map((step, i) => (
                    <div key={i}>{step || <br />}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Square Footage Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold mb-1">Formulas</p>
            <p><strong>Rectangle:</strong> Length x Width</p>
            <p><strong>Triangle:</strong> (Base x Height) / 2</p>
            <p><strong>Circle:</strong> π x Radius²</p>
            <p><strong>Trapezoid:</strong> ((Base1 + Base2) / 2) x Height</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Common Uses</p>
            <p>Square footage is used in real estate, flooring, painting, landscaping, and construction to estimate materials and costs.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Quick Reference</p>
            <p><strong>1 sq foot</strong> = 0.0929 sq meters = 144 sq inches</p>
            <p><strong>1 acre</strong> = 43,560 sq feet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
