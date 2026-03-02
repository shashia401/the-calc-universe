import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Thermometer } from "lucide-react";

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [kelvin, setKelvin] = useState("");
  const [activeInput, setActiveInput] = useState<"c" | "f" | "k" | null>(null);

  useEffect(() => {
    if (activeInput === "c" && celsius !== "") {
      const c = parseFloat(celsius);
      if (!isNaN(c)) {
        setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
        setKelvin((c + 273.15).toFixed(2));
      }
    }
  }, [celsius, activeInput]);

  useEffect(() => {
    if (activeInput === "f" && fahrenheit !== "") {
      const f = parseFloat(fahrenheit);
      if (!isNaN(f)) {
        const c = ((f - 32) * 5) / 9;
        setCelsius(c.toFixed(2));
        setKelvin((c + 273.15).toFixed(2));
      }
    }
  }, [fahrenheit, activeInput]);

  useEffect(() => {
    if (activeInput === "k" && kelvin !== "") {
      const k = parseFloat(kelvin);
      if (!isNaN(k)) {
        const c = k - 273.15;
        setCelsius(c.toFixed(2));
        setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
      }
    }
  }, [kelvin, activeInput]);

  const handleCelsiusChange = (value: string) => {
    setActiveInput("c");
    setCelsius(value);
    if (value === "") {
      setFahrenheit("");
      setKelvin("");
    }
  };

  const handleFahrenheitChange = (value: string) => {
    setActiveInput("f");
    setFahrenheit(value);
    if (value === "") {
      setCelsius("");
      setKelvin("");
    }
  };

  const handleKelvinChange = (value: string) => {
    setActiveInput("k");
    setKelvin(value);
    if (value === "") {
      setCelsius("");
      setFahrenheit("");
    }
  };

  const getTemperatureColor = (celsius: number) => {
    if (celsius <= 0) return "text-blue-500";
    if (celsius <= 15) return "text-cyan-500";
    if (celsius <= 25) return "text-green-500";
    if (celsius <= 35) return "text-yellow-500";
    return "text-red-500";
  };

  const celsiusValue = parseFloat(celsius);

  return (
    <Card data-testid="calculator-temperature">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className={`h-5 w-5 ${!isNaN(celsiusValue) ? getTemperatureColor(celsiusValue) : ""}`} />
          Temperature Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter a value in any field to convert between temperature units.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="celsius">Celsius (°C)</Label>
            <Input
              id="celsius"
              type="number"
              placeholder="e.g., 25"
              value={celsius}
              onChange={(e) => handleCelsiusChange(e.target.value)}
              className={activeInput === "c" ? "ring-2 ring-primary" : ""}
              data-testid="input-celsius"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
            <Input
              id="fahrenheit"
              type="number"
              placeholder="e.g., 77"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(e.target.value)}
              className={activeInput === "f" ? "ring-2 ring-primary" : ""}
              data-testid="input-fahrenheit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kelvin">Kelvin (K)</Label>
            <Input
              id="kelvin"
              type="number"
              placeholder="e.g., 298.15"
              value={kelvin}
              onChange={(e) => handleKelvinChange(e.target.value)}
              className={activeInput === "k" ? "ring-2 ring-primary" : ""}
              data-testid="input-kelvin"
            />
          </div>
        </div>

        {celsius && !isNaN(celsiusValue) && (
          <div className="p-4 rounded-lg bg-accent" data-testid="result-temperature">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Thermometer className={`h-6 w-6 ${getTemperatureColor(celsiusValue)}`} />
              <span className={`text-2xl font-bold ${getTemperatureColor(celsiusValue)}`}>
                {celsiusValue.toFixed(1)}°C
              </span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {celsiusValue <= 0
                ? "Freezing cold!"
                : celsiusValue <= 15
                ? "Cool temperature"
                : celsiusValue <= 25
                ? "Comfortable temperature"
                : celsiusValue <= 35
                ? "Warm temperature"
                : "Hot!"}
            </p>
          </div>
        )}

        <div className="text-sm text-muted-foreground pt-4 border-t space-y-2">
          <p className="font-medium">Reference Points:</p>
          <ul className="space-y-1 text-xs">
            <li>Water freezes: 0°C = 32°F = 273.15K</li>
            <li>Water boils: 100°C = 212°F = 373.15K</li>
            <li>Body temp: 37°C = 98.6°F = 310.15K</li>
            <li>Room temp: 20°C = 68°F = 293.15K</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
