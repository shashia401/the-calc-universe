import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { motion } from "framer-motion";
import { Calculator, Plus, Minus, X, Divide, Equal, Delete, RotateCcw, Lightbulb, BookOpen } from "lucide-react";

interface HistoryItem {
  expression: string;
  result: string;
}

export default function SimpleCalculator() {
  const [expression, setExpression] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [lastExpression, setLastExpression] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [justCalculated, setJustCalculated] = useState(false);
  
  const { saveCalculation } = useCalculatorHistory("simple-calculator");

  const handleNumber = (num: string) => {
    if (justCalculated) {
      setExpression("");
      setCurrentInput(num);
      setLastResult(null);
      setLastExpression("");
      setJustCalculated(false);
    } else {
      if (currentInput === "0" && num !== "0") {
        setCurrentInput(num);
      } else if (currentInput === "0" && num === "0") {
      } else {
        setCurrentInput(currentInput + num);
      }
    }
  };

  const handleDecimal = () => {
    if (justCalculated) {
      setExpression("");
      setCurrentInput("0.");
      setLastResult(null);
      setLastExpression("");
      setJustCalculated(false);
    } else if (!currentInput.includes(".")) {
      setCurrentInput(currentInput === "" ? "0." : currentInput + ".");
    }
  };

  const handleOperation = (op: string) => {
    if (justCalculated && lastResult) {
      setExpression(lastResult + " " + op + " ");
      setCurrentInput("");
      setLastResult(null);
      setLastExpression("");
      setJustCalculated(false);
    } else if (currentInput !== "" || expression !== "") {
      if (expression.endsWith(" ") && currentInput === "") {
        const trimmed = expression.slice(0, -3);
        setExpression(trimmed + " " + op + " ");
      } else {
        setExpression(expression + currentInput + " " + op + " ");
        setCurrentInput("");
      }
    }
  };

  const evaluateExpression = (expr: string): number => {
    const tokens = expr.trim().split(" ").filter(t => t !== "");
    
    if (tokens.length === 0) return 0;
    if (tokens.length === 1) return parseFloat(tokens[0]) || 0;

    const processedTokens: (number | string)[] = [];
    for (const token of tokens) {
      const num = parseFloat(token);
      if (!isNaN(num)) {
        processedTokens.push(num);
      } else {
        processedTokens.push(token);
      }
    }

    let i = 0;
    while (i < processedTokens.length) {
      if (processedTokens[i] === "×" || processedTokens[i] === "÷") {
        const left = processedTokens[i - 1] as number;
        const right = processedTokens[i + 1] as number;
        const op = processedTokens[i] as string;
        const res = op === "×" ? left * right : (right !== 0 ? left / right : NaN);
        processedTokens.splice(i - 1, 3, res);
        i = Math.max(0, i - 1);
      } else {
        i++;
      }
    }

    i = 0;
    while (i < processedTokens.length) {
      if (processedTokens[i] === "+" || processedTokens[i] === "-") {
        const left = processedTokens[i - 1] as number;
        const right = processedTokens[i + 1] as number;
        const op = processedTokens[i] as string;
        const res = op === "+" ? left + right : left - right;
        processedTokens.splice(i - 1, 3, res);
        i = Math.max(0, i - 1);
      } else {
        i++;
      }
    }

    return processedTokens[0] as number;
  };

  const handleEquals = () => {
    if (justCalculated) return;
    
    const fullExpr = expression + currentInput;
    if (fullExpr.trim() === "") return;
    
    const calcResult = evaluateExpression(fullExpr);
    const resultStr = isNaN(calcResult) ? "Error" : String(parseFloat(calcResult.toFixed(10)));
    
    setHistory(prev => [...prev.slice(-4), { expression: fullExpr, result: resultStr }]);
    
    saveCalculation({
      calculatorName: "Simple Calculator",
      categoryId: "math",
      inputs: {
        "Expression": fullExpr,
      },
      result: resultStr,
      formula: "Following order of operations (PEMDAS)",
      steps: [
        { label: "Step 1", value: `Expression: ${fullExpr}` },
        { label: "Step 2", value: `Calculate: ${fullExpr} = ${resultStr}` },
      ],
    });
    
    setLastExpression(fullExpr);
    setLastResult(resultStr);
    setExpression("");
    setCurrentInput("");
    setJustCalculated(true);
  };

  const handleClear = () => {
    setExpression("");
    setCurrentInput("");
    setLastResult(null);
    setLastExpression("");
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated) {
      handleClear();
    } else if (currentInput.length > 0) {
      setCurrentInput(currentInput.slice(0, -1));
    } else if (expression.length > 0) {
      const trimmed = expression.trimEnd();
      const parts = trimmed.split(" ");
      if (parts.length >= 2) {
        parts.pop();
        const lastPart = parts.pop() || "";
        setExpression(parts.length > 0 ? parts.join(" ") + " " : "");
        setCurrentInput(lastPart);
      }
    }
  };

  const handlePlusMinus = () => {
    if (justCalculated && lastResult) {
      const num = parseFloat(lastResult);
      if (!isNaN(num)) {
        const newResult = String(-num);
        setLastResult(newResult);
      }
    } else if (currentInput.startsWith("-")) {
      setCurrentInput(currentInput.substring(1));
    } else if (currentInput !== "") {
      setCurrentInput("-" + currentInput);
    }
  };

  const handlePercent = () => {
    if (justCalculated && lastResult) {
      const num = parseFloat(lastResult);
      if (!isNaN(num)) {
        setLastResult(String(num / 100));
      }
    } else {
      const num = parseFloat(currentInput);
      if (!isNaN(num)) {
        setCurrentInput(String(num / 100));
      }
    }
  };

  const getMainDisplay = () => {
    if (justCalculated && lastResult) {
      return lastResult;
    }
    const display = expression + currentInput;
    return display || "0";
  };

  const getSecondaryDisplay = () => {
    if (justCalculated && lastExpression) {
      return lastExpression + " =";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Simple Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 mb-4 min-h-[100px] flex flex-col justify-between">
            <div className="text-sm text-muted-foreground text-left font-mono h-6">
              {getSecondaryDisplay()}
            </div>
            <motion.div
              key={getMainDisplay()}
              initial={{ scale: 0.98, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl md:text-5xl font-mono text-right overflow-x-auto whitespace-nowrap"
              data-testid="display-result"
            >
              {getMainDisplay()}
            </motion.div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button variant="secondary" onClick={handleClear} data-testid="button-clear">
              C
            </Button>
            <Button variant="secondary" onClick={handlePlusMinus} data-testid="button-plusminus">
              ±
            </Button>
            <Button variant="secondary" onClick={handlePercent} data-testid="button-percent">
              %
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleOperation("÷")}
              data-testid="button-divide"
            >
              <Divide className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => handleNumber("7")} data-testid="button-7">7</Button>
            <Button variant="outline" onClick={() => handleNumber("8")} data-testid="button-8">8</Button>
            <Button variant="outline" onClick={() => handleNumber("9")} data-testid="button-9">9</Button>
            <Button 
              variant="outline"
              onClick={() => handleOperation("×")}
              data-testid="button-multiply"
            >
              <X className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => handleNumber("4")} data-testid="button-4">4</Button>
            <Button variant="outline" onClick={() => handleNumber("5")} data-testid="button-5">5</Button>
            <Button variant="outline" onClick={() => handleNumber("6")} data-testid="button-6">6</Button>
            <Button 
              variant="outline"
              onClick={() => handleOperation("-")}
              data-testid="button-subtract"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => handleNumber("1")} data-testid="button-1">1</Button>
            <Button variant="outline" onClick={() => handleNumber("2")} data-testid="button-2">2</Button>
            <Button variant="outline" onClick={() => handleNumber("3")} data-testid="button-3">3</Button>
            <Button 
              variant="outline"
              onClick={() => handleOperation("+")}
              data-testid="button-add"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => handleNumber("0")} data-testid="button-0">
              0
            </Button>
            <Button variant="outline" onClick={handleDecimal} data-testid="button-decimal">
              .
            </Button>
            <Button variant="secondary" onClick={handleBackspace} data-testid="button-backspace">
              <Delete className="h-4 w-4" />
            </Button>
            <Button onClick={handleEquals} data-testid="button-equals">
              <Equal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="text-lg">Session History</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setHistory([])}
                data-testid="button-clear-history"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm font-mono gap-2 flex-wrap"
                  data-testid={`history-item-${idx}`}
                >
                  <span className="text-muted-foreground">{item.expression}</span>
                  <span className="font-medium">= {item.result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Learn About Basic Arithmetic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              The Four Basic Operations
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible">
              <div className="p-3 bg-muted/50 rounded-lg min-w-[200px] sm:min-w-0">
                <div className="flex items-center gap-2 font-medium mb-1">
                  <Plus className="h-4 w-4 text-green-500" />
                  Addition
                </div>
                <p className="text-muted-foreground text-sm">Combines numbers into a sum. Example: 5 + 3 = 8</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg min-w-[200px] sm:min-w-0">
                <div className="flex items-center gap-2 font-medium mb-1">
                  <Minus className="h-4 w-4 text-red-500" />
                  Subtraction
                </div>
                <p className="text-muted-foreground text-sm">Finds the difference. Example: 8 - 3 = 5</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg min-w-[200px] sm:min-w-0">
                <div className="flex items-center gap-2 font-medium mb-1">
                  <X className="h-4 w-4 text-blue-500" />
                  Multiplication
                </div>
                <p className="text-muted-foreground text-sm">Repeated addition. Example: 4 × 3 = 12</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg min-w-[200px] sm:min-w-0">
                <div className="flex items-center gap-2 font-medium mb-1">
                  <Divide className="h-4 w-4 text-purple-500" />
                  Division
                </div>
                <p className="text-muted-foreground text-sm">Splits into equal parts. Example: 12 ÷ 3 = 4</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order of Operations (PEMDAS)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              When multiple operations appear, follow this order:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">1. Parentheses</Badge>
              <Badge variant="outline">2. Exponents</Badge>
              <Badge variant="outline">3. × and ÷</Badge>
              <Badge variant="outline">4. + and -</Badge>
            </div>
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium mb-1">Quick Tip</h4>
            <p className="text-sm text-muted-foreground">
              This calculator follows PEMDAS. Example: 2 + 3 × 4 = 14 (not 20), because multiplication comes first.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
