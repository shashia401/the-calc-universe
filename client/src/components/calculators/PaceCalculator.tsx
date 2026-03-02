import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer } from "lucide-react";

interface PaceResult {
  pace: string;
  pacePerKm: string;
  pacePerMile: string;
  speed: { kmh: number; mph: number };
  finishTime: string;
  splits: { distance: string; time: string }[];
  steps: string[];
}

const commonDistances = [
  { id: "custom", name: "Custom Distance", km: 0 },
  { id: "1k", name: "1K", km: 1 },
  { id: "5k", name: "5K", km: 5 },
  { id: "10k", name: "10K", km: 10 },
  { id: "half", name: "Half Marathon (21.1K)", km: 21.0975 },
  { id: "full", name: "Marathon (42.2K)", km: 42.195 },
];

export default function PaceCalculator() {
  const [mode, setMode] = useState("pace");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [presetDistance, setPresetDistance] = useState("custom");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [paceMin, setPaceMin] = useState("");
  const [paceSec, setPaceSec] = useState("");
  const [paceUnit, setPaceUnit] = useState("km");
  const [result, setResult] = useState<PaceResult | null>(null);

  const getDistanceKm = (): number => {
    const preset = commonDistances.find((d) => d.id === presetDistance);
    if (preset && preset.km > 0) return preset.km;

    const d = parseFloat(distance);
    if (isNaN(d) || d <= 0) return 0;
    return distanceUnit === "miles" ? d * 1.60934 : d;
  };

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatPace = (secondsPerUnit: number): string => {
    const m = Math.floor(secondsPerUnit / 60);
    const s = Math.round(secondsPerUnit % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const calculate = () => {
    const steps: string[] = [];
    const distKm = getDistanceKm();
    const distMiles = distKm / 1.60934;

    if (mode === "pace") {
      const h = parseInt(hours || "0");
      const m = parseInt(minutes || "0");
      const s = parseInt(seconds || "0");
      const totalSeconds = h * 3600 + m * 60 + s;

      if (distKm <= 0 || totalSeconds <= 0) return;

      steps.push("MODE: Calculate Pace from Time and Distance");
      steps.push(`Distance: ${distKm.toFixed(3)} km (${distMiles.toFixed(3)} miles)`);
      steps.push(`Time: ${formatTime(totalSeconds)}`);
      steps.push("");

      const secPerKm = totalSeconds / distKm;
      const secPerMile = totalSeconds / distMiles;
      const speedKmh = distKm / (totalSeconds / 3600);
      const speedMph = distMiles / (totalSeconds / 3600);

      steps.push("CALCULATION:");
      steps.push(`Pace per km = ${totalSeconds} seconds / ${distKm.toFixed(3)} km = ${secPerKm.toFixed(1)} sec/km = ${formatPace(secPerKm)} /km`);
      steps.push(`Pace per mile = ${totalSeconds} seconds / ${distMiles.toFixed(3)} miles = ${secPerMile.toFixed(1)} sec/mile = ${formatPace(secPerMile)} /mile`);
      steps.push("");
      steps.push(`Speed = ${speedKmh.toFixed(2)} km/h (${speedMph.toFixed(2)} mph)`);

      const splits: { distance: string; time: string }[] = [];
      const splitInterval = distKm <= 5 ? 1 : distKm <= 21.1 ? 5 : 10;
      for (let d = splitInterval; d <= distKm; d += splitInterval) {
        splits.push({ distance: `${d} km`, time: formatTime(secPerKm * d) });
      }
      if (distKm % splitInterval !== 0) {
        splits.push({ distance: `${distKm.toFixed(2)} km`, time: formatTime(totalSeconds) });
      }

      setResult({
        pace: formatPace(secPerKm),
        pacePerKm: formatPace(secPerKm),
        pacePerMile: formatPace(secPerMile),
        speed: { kmh: speedKmh, mph: speedMph },
        finishTime: formatTime(totalSeconds),
        splits,
        steps,
      });
    } else if (mode === "time") {
      const pm = parseInt(paceMin || "0");
      const ps = parseInt(paceSec || "0");
      const paceSeconds = pm * 60 + ps;

      if (distKm <= 0 || paceSeconds <= 0) return;

      steps.push("MODE: Calculate Finish Time from Pace and Distance");
      steps.push(`Distance: ${distKm.toFixed(3)} km (${distMiles.toFixed(3)} miles)`);

      let secPerKm: number;
      if (paceUnit === "miles") {
        secPerKm = paceSeconds / 1.60934;
        steps.push(`Pace: ${formatPace(paceSeconds)} /mile = ${formatPace(secPerKm)} /km`);
      } else {
        secPerKm = paceSeconds;
        steps.push(`Pace: ${formatPace(paceSeconds)} /km`);
      }
      steps.push("");

      const totalSeconds = secPerKm * distKm;
      const secPerMile = secPerKm * 1.60934;
      const speedKmh = 3600 / secPerKm;
      const speedMph = speedKmh / 1.60934;

      steps.push("CALCULATION:");
      steps.push(`Finish Time = Pace x Distance`);
      steps.push(`Finish Time = ${secPerKm.toFixed(1)} sec/km x ${distKm.toFixed(3)} km = ${totalSeconds.toFixed(0)} seconds`);
      steps.push(`Finish Time = ${formatTime(totalSeconds)}`);
      steps.push("");
      steps.push(`Speed = ${speedKmh.toFixed(2)} km/h (${speedMph.toFixed(2)} mph)`);

      const splits: { distance: string; time: string }[] = [];
      const splitInterval = distKm <= 5 ? 1 : distKm <= 21.1 ? 5 : 10;
      for (let d = splitInterval; d <= distKm; d += splitInterval) {
        splits.push({ distance: `${d} km`, time: formatTime(secPerKm * d) });
      }
      if (distKm % splitInterval !== 0) {
        splits.push({ distance: `${distKm.toFixed(2)} km`, time: formatTime(totalSeconds) });
      }

      setResult({
        pace: formatPace(secPerKm),
        pacePerKm: formatPace(secPerKm),
        pacePerMile: formatPace(secPerMile),
        speed: { kmh: speedKmh, mph: speedMph },
        finishTime: formatTime(totalSeconds),
        splits,
        steps,
      });
    } else {
      const h = parseInt(hours || "0");
      const m = parseInt(minutes || "0");
      const s = parseInt(seconds || "0");
      const totalSeconds = h * 3600 + m * 60 + s;

      const pm = parseInt(paceMin || "0");
      const ps = parseInt(paceSec || "0");
      const paceSeconds = pm * 60 + ps;

      if (totalSeconds <= 0 || paceSeconds <= 0) return;

      steps.push("MODE: Calculate Distance from Time and Pace");
      steps.push(`Time: ${formatTime(totalSeconds)}`);

      let secPerKm: number;
      if (paceUnit === "miles") {
        secPerKm = paceSeconds / 1.60934;
        steps.push(`Pace: ${formatPace(paceSeconds)} /mile = ${formatPace(secPerKm)} /km`);
      } else {
        secPerKm = paceSeconds;
        steps.push(`Pace: ${formatPace(paceSeconds)} /km`);
      }
      steps.push("");

      const calcDistKm = totalSeconds / secPerKm;
      const calcDistMiles = calcDistKm / 1.60934;
      const secPerMile = secPerKm * 1.60934;
      const speedKmh = 3600 / secPerKm;
      const speedMph = speedKmh / 1.60934;

      steps.push("CALCULATION:");
      steps.push(`Distance = Time / Pace`);
      steps.push(`Distance = ${totalSeconds} seconds / ${secPerKm.toFixed(1)} sec/km`);
      steps.push(`Distance = ${calcDistKm.toFixed(3)} km (${calcDistMiles.toFixed(3)} miles)`);
      steps.push("");
      steps.push(`Speed = ${speedKmh.toFixed(2)} km/h (${speedMph.toFixed(2)} mph)`);

      setResult({
        pace: formatPace(secPerKm),
        pacePerKm: formatPace(secPerKm),
        pacePerMile: formatPace(secPerMile),
        speed: { kmh: speedKmh, mph: speedMph },
        finishTime: formatTime(totalSeconds),
        splits: [],
        steps,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-green-500" />
            Pace Calculator
            <Badge variant="secondary">Fitness</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calculate</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger data-testid="select-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pace">Pace (from time + distance)</SelectItem>
                <SelectItem value="time">Finish Time (from pace + distance)</SelectItem>
                <SelectItem value="distance">Distance (from time + pace)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode !== "distance" && (
            <>
              <div className="space-y-2">
                <Label>Distance</Label>
                <Select value={presetDistance} onValueChange={setPresetDistance}>
                  <SelectTrigger data-testid="select-preset-distance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonDistances.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {presetDistance === "custom" && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="any"
                    placeholder="Distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="flex-1"
                    data-testid="input-distance"
                  />
                  <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                    <SelectTrigger className="w-24" data-testid="select-distance-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="miles">miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {(mode === "pace" || mode === "distance") && (
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    data-testid="input-hours"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    data-testid="input-minutes"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Seconds</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    data-testid="input-seconds"
                  />
                </div>
              </div>
            </div>
          )}

          {(mode === "time" || mode === "distance") && (
            <div className="space-y-2">
              <Label>Pace</Label>
              <div className="flex gap-2">
                <div className="flex gap-1 flex-1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="min"
                    value={paceMin}
                    onChange={(e) => setPaceMin(e.target.value)}
                    data-testid="input-pace-min"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="sec"
                    value={paceSec}
                    onChange={(e) => setPaceSec(e.target.value)}
                    data-testid="input-pace-sec"
                  />
                </div>
                <Select value={paceUnit} onValueChange={setPaceUnit}>
                  <SelectTrigger className="w-24" data-testid="select-pace-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">per km</SelectItem>
                    <SelectItem value="miles">per mile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button onClick={calculate} className="w-full" data-testid="button-calculate">
            <Timer className="h-4 w-4 mr-2" />
            Calculate
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
                  <p className="text-xs text-muted-foreground">Pace (per km)</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-pace-km">
                    {result.pacePerKm} /km
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                  <p className="text-xs text-muted-foreground">Pace (per mile)</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-pace-mile">
                    {result.pacePerMile} /mi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-lg font-bold" data-testid="text-speed">
                    {result.speed.kmh.toFixed(1)} km/h
                  </p>
                  <p className="text-xs text-muted-foreground">{result.speed.mph.toFixed(1)} mph</p>
                </div>
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Finish Time</p>
                  <p className="text-lg font-bold" data-testid="text-finish-time">
                    {result.finishTime}
                  </p>
                </div>
              </div>

              {result.splits.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Splits</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {result.splits.map((split, i) => (
                      <div key={i} className="flex justify-between p-2 bg-muted rounded" data-testid={`split-${i}`}>
                        <span className="text-muted-foreground">{split.distance}</span>
                        <span className="font-mono font-semibold">{split.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded max-h-48 overflow-y-auto">
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
          <CardTitle className="text-lg">Running Pace Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Pace</strong> is the time it takes to cover a unit of distance (usually per kilometer or per mile). It is the inverse of speed and is the most common way runners measure their performance.</p>
          <p><strong>Common race distances:</strong> 5K (3.1 mi), 10K (6.2 mi), Half Marathon (13.1 mi / 21.1 km), Marathon (26.2 mi / 42.2 km).</p>
          <p><strong>Easy pace:</strong> For most recreational runners, an easy pace is around 6:00-7:00 /km (9:40-11:15 /mile). Train at this pace for most of your runs.</p>
          <p><strong>Conversions:</strong> To convert pace/km to pace/mile, multiply by 1.60934. To convert speed (km/h) to pace (min/km), divide 60 by speed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
