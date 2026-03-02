import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fuel } from "lucide-react";

interface FuelResult {
  mpg: number;
  lper100km: number;
  kmPerLiter: number;
  fuelCost: number;
  costPerMile: number;
  costPerKm: number;
  steps: string[];
}

export default function FuelCalculator() {
  const [mode, setMode] = useState("efficiency");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("miles");
  const [fuelUsed, setFuelUsed] = useState("");
  const [fuelUnit, setFuelUnit] = useState("gallons");
  const [fuelPrice, setFuelPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per-gallon");
  const [tripDistance, setTripDistance] = useState("");
  const [tripDistanceUnit, setTripDistanceUnit] = useState("miles");
  const [result, setResult] = useState<FuelResult | null>(null);

  const calculate = () => {
    const dist = parseFloat(distance);
    const fuel = parseFloat(fuelUsed);
    const price = parseFloat(fuelPrice);

    if (isNaN(dist) || isNaN(fuel) || dist <= 0 || fuel <= 0) return;

    const steps: string[] = [];

    let distMiles = dist;
    let fuelGallons = fuel;

    if (distanceUnit === "km") {
      distMiles = dist * 0.621371;
      steps.push(`Distance: ${dist} km = ${distMiles.toFixed(2)} miles`);
    } else {
      steps.push(`Distance: ${dist} miles`);
    }

    if (fuelUnit === "liters") {
      fuelGallons = fuel * 0.264172;
      steps.push(`Fuel used: ${fuel} liters = ${fuelGallons.toFixed(2)} gallons`);
    } else {
      steps.push(`Fuel used: ${fuel} gallons`);
    }

    steps.push("");

    const mpg = distMiles / fuelGallons;
    steps.push(`MPG = ${distMiles.toFixed(2)} miles / ${fuelGallons.toFixed(2)} gallons = ${mpg.toFixed(2)} mpg`);

    const distKm = distanceUnit === "km" ? dist : dist * 1.60934;
    const fuelLiters = fuelUnit === "liters" ? fuel : fuel * 3.78541;
    const lper100km = (fuelLiters / distKm) * 100;
    steps.push(`L/100km = (${fuelLiters.toFixed(2)} L / ${distKm.toFixed(2)} km) x 100 = ${lper100km.toFixed(2)} L/100km`);

    const kmPerLiter = distKm / fuelLiters;
    steps.push(`km/L = ${distKm.toFixed(2)} km / ${fuelLiters.toFixed(2)} L = ${kmPerLiter.toFixed(2)} km/L`);

    let fuelCost = 0;
    let costPerMile = 0;
    let costPerKm = 0;

    if (!isNaN(price) && price > 0) {
      steps.push("");
      let pricePerGallon = price;
      if (priceUnit === "per-liter") {
        pricePerGallon = price * 3.78541;
        steps.push(`Fuel price: $${price}/liter = $${pricePerGallon.toFixed(2)}/gallon`);
      } else {
        steps.push(`Fuel price: $${price}/gallon`);
      }

      fuelCost = fuelGallons * pricePerGallon;
      costPerMile = pricePerGallon / mpg;
      costPerKm = costPerMile / 1.60934;

      steps.push(`Total fuel cost: ${fuelGallons.toFixed(2)} gal x $${pricePerGallon.toFixed(2)} = $${fuelCost.toFixed(2)}`);
      steps.push(`Cost per mile: $${pricePerGallon.toFixed(2)} / ${mpg.toFixed(2)} mpg = $${costPerMile.toFixed(3)}/mile`);
      steps.push(`Cost per km: $${costPerKm.toFixed(3)}/km`);

      const tripDist = parseFloat(tripDistance);
      if (!isNaN(tripDist) && tripDist > 0) {
        steps.push("");
        const tripMiles = tripDistanceUnit === "km" ? tripDist * 0.621371 : tripDist;
        const tripFuelGal = tripMiles / mpg;
        const tripCost = tripFuelGal * pricePerGallon;
        steps.push(`Trip estimate (${tripDist} ${tripDistanceUnit}):`);
        steps.push(`  Fuel needed: ${tripFuelGal.toFixed(2)} gallons (${(tripFuelGal * 3.78541).toFixed(2)} liters)`);
        steps.push(`  Estimated cost: $${tripCost.toFixed(2)}`);
      }
    }

    setResult({ mpg, lper100km, kmPerLiter, fuelCost, costPerMile, costPerKm, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Economy Calculator
            <Badge variant="secondary">Utility</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance Traveled</Label>
              <div className="flex gap-2">
                <Input
                  id="distance"
                  type="number"
                  step="any"
                  placeholder="e.g., 300"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  data-testid="input-distance"
                />
                <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                  <SelectTrigger className="w-28" data-testid="select-distance-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="km">Km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel">Fuel Used</Label>
              <div className="flex gap-2">
                <Input
                  id="fuel"
                  type="number"
                  step="any"
                  placeholder="e.g., 10"
                  value={fuelUsed}
                  onChange={(e) => setFuelUsed(e.target.value)}
                  data-testid="input-fuel"
                />
                <Select value={fuelUnit} onValueChange={setFuelUnit}>
                  <SelectTrigger className="w-28" data-testid="select-fuel-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gallons">Gallons</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Fuel Price (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  step="any"
                  placeholder="e.g., 3.50"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  data-testid="input-price"
                />
                <Select value={priceUnit} onValueChange={setPriceUnit}>
                  <SelectTrigger className="w-32" data-testid="select-price-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-gallon">$/gal</SelectItem>
                    <SelectItem value="per-liter">$/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip">Trip Distance (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="trip"
                  type="number"
                  step="any"
                  placeholder="e.g., 500"
                  value={tripDistance}
                  onChange={(e) => setTripDistance(e.target.value)}
                  data-testid="input-trip"
                />
                <Select value={tripDistanceUnit} onValueChange={setTripDistanceUnit}>
                  <SelectTrigger className="w-28" data-testid="select-trip-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="km">Km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            Calculate Fuel Economy
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Miles Per Gallon</p>
                  <p className="text-2xl font-bold" data-testid="text-mpg">{result.mpg.toFixed(1)} mpg</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Liters per 100km</p>
                  <p className="text-2xl font-bold" data-testid="text-lper100km">{result.lper100km.toFixed(1)} L/100km</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase">Km per Liter</p>
                  <p className="text-2xl font-bold" data-testid="text-kmpl">{result.kmPerLiter.toFixed(1)} km/L</p>
                </div>
              </div>

              {result.fuelCost > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Total Fuel Cost</p>
                    <p className="text-lg font-bold" data-testid="text-cost">${result.fuelCost.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Cost per Mile</p>
                    <p className="text-lg font-bold">${result.costPerMile.toFixed(3)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Cost per Km</p>
                    <p className="text-lg font-bold">${result.costPerKm.toFixed(3)}</p>
                  </div>
                </div>
              )}

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
          <CardTitle className="text-lg">Fuel Economy Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Lower L/100km and higher MPG both mean better fuel efficiency.</p>
          <p><strong>Average US car:</strong> 25-30 MPG (7.8-9.4 L/100km)</p>
          <p><strong>Hybrid vehicles:</strong> 40-60 MPG (3.9-5.9 L/100km)</p>
          <p><strong>Tips to improve efficiency:</strong> Maintain steady speed, keep tires properly inflated, avoid excess idling, reduce weight and drag.</p>
        </CardContent>
      </Card>
    </div>
  );
}
