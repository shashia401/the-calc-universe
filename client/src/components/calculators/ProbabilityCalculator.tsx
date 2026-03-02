import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProbabilityCalculator() {
  const [favorable, setFavorable] = useState("");
  const [total, setTotal] = useState("");
  const [singleResult, setSingleResult] = useState<{ probability: number; percentage: number; odds: string; steps: string[] } | null>(null);

  const [probA, setProbA] = useState("");
  const [probB, setProbB] = useState("");
  const [combineResult, setCombineResult] = useState<{ 
    pAandB: number; 
    pAorB: number; 
    pNotA: number; 
    steps: string[] 
  } | null>(null);

  const calculateSingle = () => {
    const fav = parseFloat(favorable);
    const tot = parseFloat(total);

    if (isNaN(fav) || isNaN(tot) || tot === 0 || fav < 0 || fav > tot) return;

    const probability = fav / tot;
    const percentage = probability * 100;
    const unfavorable = tot - fav;
    const odds = fav > 0 ? `${fav}:${unfavorable}` : "0:1";

    const steps = [
      `Probability Formula: P = Favorable Outcomes / Total Outcomes`,
      ``,
      `Given:`,
      `  Favorable outcomes = ${fav}`,
      `  Total outcomes = ${tot}`,
      ``,
      `Calculation:`,
      `  P = ${fav} / ${tot} = ${probability.toFixed(4)}`,
      `  Percentage = ${probability.toFixed(4)} × 100 = ${percentage.toFixed(2)}%`,
      ``,
      `Odds in favor: ${fav} : ${unfavorable} (${fav} favorable to ${unfavorable} unfavorable)`,
    ];

    setSingleResult({ probability, percentage, odds, steps });
  };

  const calculateCombined = () => {
    const pA = parseFloat(probA);
    const pB = parseFloat(probB);

    if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) return;

    const pAandB = pA * pB;
    const pAorB = pA + pB - pAandB;
    const pNotA = 1 - pA;

    const steps = [
      `Given: P(A) = ${pA}, P(B) = ${pB}`,
      ``,
      `P(A AND B) - Both events occur (for independent events):`,
      `  P(A ∩ B) = P(A) × P(B)`,
      `  P(A ∩ B) = ${pA} × ${pB} = ${pAandB.toFixed(4)}`,
      ``,
      `P(A OR B) - At least one event occurs:`,
      `  P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`,
      `  P(A ∪ B) = ${pA} + ${pB} - ${pAandB.toFixed(4)} = ${pAorB.toFixed(4)}`,
      ``,
      `P(NOT A) - Event A does not occur:`,
      `  P(A') = 1 - P(A)`,
      `  P(A') = 1 - ${pA} = ${pNotA.toFixed(4)}`,
    ];

    setCombineResult({ pAandB, pAorB, pNotA, steps });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Probability Calculator
            <Badge variant="secondary">Statistics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Event</TabsTrigger>
              <TabsTrigger value="combined">Combined Events</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="favorable">Favorable Outcomes</Label>
                  <Input
                    id="favorable"
                    type="number"
                    min="0"
                    placeholder="e.g., 3"
                    value={favorable}
                    onChange={(e) => setFavorable(e.target.value)}
                    data-testid="input-favorable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total Possible Outcomes</Label>
                  <Input
                    id="total"
                    type="number"
                    min="1"
                    placeholder="e.g., 10"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    data-testid="input-total"
                  />
                </div>
              </div>

              <Button onClick={calculateSingle} className="w-full" data-testid="button-calculate-single">
                Calculate Probability
              </Button>

              {singleResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Probability</p>
                      <p className="text-xl font-bold text-primary" data-testid="text-probability">
                        {singleResult.probability.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Percentage</p>
                      <p className="text-xl font-bold" data-testid="text-percentage">
                        {singleResult.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Odds</p>
                      <p className="text-xl font-bold" data-testid="text-odds">
                        {singleResult.odds}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {singleResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => { setFavorable("1"); setTotal("6"); }}>
                  Rolling 6
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setFavorable("1"); setTotal("2"); }}>
                  Coin Flip
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setFavorable("4"); setTotal("52"); }}>
                  Draw Ace
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="combined" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Enter probabilities as decimals (0 to 1) for independent events
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="probA">P(A) - Probability of Event A</Label>
                  <Input
                    id="probA"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="e.g., 0.5"
                    value={probA}
                    onChange={(e) => setProbA(e.target.value)}
                    data-testid="input-prob-a"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probB">P(B) - Probability of Event B</Label>
                  <Input
                    id="probB"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="e.g., 0.3"
                    value={probB}
                    onChange={(e) => setProbB(e.target.value)}
                    data-testid="input-prob-b"
                  />
                </div>
              </div>

              <Button onClick={calculateCombined} className="w-full" data-testid="button-calculate-combined">
                Calculate Combined Probabilities
              </Button>

              {combineResult && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">P(A AND B)</p>
                      <p className="text-xl font-bold text-primary">
                        {combineResult.pAandB.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">P(A OR B)</p>
                      <p className="text-xl font-bold">
                        {combineResult.pAorB.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">P(NOT A)</p>
                      <p className="text-xl font-bold">
                        {combineResult.pNotA.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-semibold mb-2">Steps:</p>
                    <div className="space-y-1 text-sm">
                      {combineResult.steps.map((step, i) => (
                        <p key={i} className={step === "" ? "h-2" : step.startsWith("  ") ? "ml-4" : ""}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Probability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is Probability?</h3>
            <p className="text-muted-foreground">
              Probability measures how likely an event is to happen. It's expressed as a number 
              between 0 (impossible) and 1 (certain), or as a percentage (0% to 100%).
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Basic Formula</h3>
            <p className="font-mono text-center text-xl text-primary py-2">
              P(Event) = Favorable Outcomes / Total Outcomes
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Probability Rules</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">P(A AND B) = P(A) × P(B)</p>
                <p className="text-muted-foreground">Both events occur (for independent events)</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">P(A OR B) = P(A) + P(B) - P(A AND B)</p>
                <p className="text-muted-foreground">At least one event occurs</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-mono">P(NOT A) = 1 - P(A)</p>
                <p className="text-muted-foreground">Event does NOT occur (complement)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Common Probabilities</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded">Coin flip (heads): 1/2 = 50%</div>
              <div className="p-2 bg-muted rounded">Roll a 6: 1/6 ≈ 16.7%</div>
              <div className="p-2 bg-muted rounded">Draw an ace: 4/52 ≈ 7.7%</div>
              <div className="p-2 bg-muted rounded">Birthday match (23 people): ~50%</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Probability vs Odds</h3>
            <p className="text-muted-foreground">
              <strong>Probability</strong> = favorable / total (e.g., 1/4 = 0.25 = 25%)
            </p>
            <p className="text-muted-foreground">
              <strong>Odds</strong> = favorable : unfavorable (e.g., 1:3 means 1 win for every 3 losses)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
