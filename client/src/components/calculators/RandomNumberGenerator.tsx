import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);

  const generate = () => {
    const minNum = parseInt(min) || 0;
    const maxNum = parseInt(max) || 100;
    const countNum = Math.min(parseInt(count) || 1, allowDuplicates ? 1000 : maxNum - minNum + 1);

    const newNumbers: number[] = [];

    if (allowDuplicates) {
      for (let i = 0; i < countNum; i++) {
        const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        newNumbers.push(randomNum);
      }
    } else {
      const availableNumbers = Array.from({ length: maxNum - minNum + 1 }, (_, i) => minNum + i);
      for (let i = 0; i < countNum && availableNumbers.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        newNumbers.push(availableNumbers.splice(randomIndex, 1)[0]);
      }
    }

    setResults(newNumbers);
    setHistory((prev) => [newNumbers, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Random Number Generator
            <Badge variant="secondary">Math</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Minimum Value</Label>
              <Input
                id="min"
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                data-testid="input-min"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum Value</Label>
              <Input
                id="max"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                data-testid="input-max"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">How Many Numbers</Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                data-testid="input-count"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="duplicates"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="h-4 w-4"
              data-testid="checkbox-duplicates"
            />
            <Label htmlFor="duplicates">Allow duplicate numbers</Label>
          </div>

          <Button onClick={generate} className="w-full" data-testid="button-generate">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Random Numbers
          </Button>

          {results.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Generated {results.length} number{results.length > 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-2">
                {results.map((num, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-lg font-bold"
                    data-testid={`text-result-${i}`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {history.length > 1 && (
            <div className="border-t pt-4">
              <p className="font-semibold mb-2">History:</p>
              <div className="space-y-2">
                {history.slice(1).map((nums, i) => (
                  <div key={i} className="text-sm text-muted-foreground">
                    {nums.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Random Number Generation Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">What is a Random Number?</h3>
            <p className="text-muted-foreground">
              A random number is a number chosen by chance, where each possible number has an equal probability 
              of being selected. Think of it like rolling a fair die - each number from 1 to 6 has the same 
              chance of appearing.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">The Formula</h3>
            <p className="font-mono text-sm text-primary">
              Random Number = floor(random() × (max - min + 1)) + min
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Where:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li><strong>random()</strong> generates a decimal between 0 and 1</li>
              <li><strong>(max - min + 1)</strong> is the range of possible values</li>
              <li><strong>floor()</strong> rounds down to the nearest whole number</li>
              <li><strong>+ min</strong> shifts the range to start at the minimum value</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Example: Random Number Between 1 and 10</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Computer generates random decimal: 0.7342</li>
              <li>Calculate range: (10 - 1 + 1) = 10</li>
              <li>Multiply: 0.7342 × 10 = 7.342</li>
              <li>Round down: floor(7.342) = 7</li>
              <li>Add minimum: 7 + 1 = 8</li>
              <li>Result: 8 (a random number between 1 and 10)</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Real-World Uses</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Lotteries and games:</strong> Picking winning numbers fairly</li>
              <li><strong>Scientific research:</strong> Random sampling for experiments</li>
              <li><strong>Computer security:</strong> Generating passwords and encryption keys</li>
              <li><strong>Video games:</strong> Creating unpredictable gameplay</li>
              <li><strong>Surveys:</strong> Selecting random participants</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Probability</h3>
            <p className="text-muted-foreground">
              When generating a random number between min and max, the probability of getting any 
              specific number is:
            </p>
            <p className="font-mono text-primary text-center py-2">
              P = 1 / (max - min + 1)
            </p>
            <p className="text-muted-foreground">
              For example, with numbers 1-10, each number has a 1/10 = 10% chance of being selected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
