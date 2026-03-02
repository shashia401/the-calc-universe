import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number>(0);
  const [isRadians, setIsRadians] = useState(true);
  const [history, setHistory] = useState<string>("");

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === "0" || prev === "Error" ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    if (display !== "Error") {
      setDisplay((prev) => prev + op);
    }
  };

  const handleDecimal = () => {
    const parts = display.split(/[\+\-\*\/\(\)]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setHistory("");
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleFunction = (fn: string) => {
    try {
      const value = parseFloat(display);
      if (isNaN(value)) return;

      let result: number;
      const angle = isRadians ? value : (value * Math.PI) / 180;

      switch (fn) {
        case "sin":
          result = Math.sin(angle);
          break;
        case "cos":
          result = Math.cos(angle);
          break;
        case "tan":
          result = Math.tan(angle);
          break;
        case "sqrt":
          result = Math.sqrt(value);
          break;
        case "square":
          result = value * value;
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "ln":
          result = Math.log(value);
          break;
        case "exp":
          result = Math.exp(value);
          break;
        case "abs":
          result = Math.abs(value);
          break;
        case "1/x":
          if (value === 0) { setDisplay("Error"); return; }
          result = 1 / value;
          break;
        case "factorial":
          result = factorial(Math.floor(value));
          break;
        case "negate":
          result = -value;
          break;
        default:
          return;
      }

      setHistory(`${fn}(${display}) =`);
      setDisplay(formatResult(result));
    } catch {
      setDisplay("Error");
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const safeEvaluate = (expr: string): number => {
    const sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, String(Math.PI))
      .replace(/e(?![xp])/g, String(Math.E));

    const tokens: (number | string)[] = [];
    let current = "";

    for (let i = 0; i < sanitized.length; i++) {
      const ch = sanitized[i];
      if ("+-*/()".includes(ch)) {
        if (current.trim()) {
          const num = parseFloat(current.trim());
          if (isNaN(num)) return NaN;
          tokens.push(num);
        }
        current = "";
        if (ch === "-" && (tokens.length === 0 || tokens[tokens.length - 1] === "(")) {
          current = "-";
        } else {
          tokens.push(ch);
        }
      } else if (/[\d.]/.test(ch)) {
        current += ch;
      } else if (ch === " ") {
        continue;
      } else {
        return NaN;
      }
    }
    if (current.trim()) {
      const num = parseFloat(current.trim());
      if (isNaN(num)) return NaN;
      tokens.push(num);
    }

    const evalTokens = (toks: (number | string)[]): number => {
      while (toks.includes("(")) {
        const closeIdx = toks.indexOf(")");
        if (closeIdx === -1) return NaN;
        let openIdx = closeIdx - 1;
        while (openIdx >= 0 && toks[openIdx] !== "(") openIdx--;
        if (openIdx < 0) return NaN;
        const inner = toks.slice(openIdx + 1, closeIdx) as (number | string)[];
        const innerResult = evalFlat(inner);
        toks.splice(openIdx, closeIdx - openIdx + 1, innerResult);
      }
      return evalFlat(toks);
    };

    const evalFlat = (toks: (number | string)[]): number => {
      let i = 0;
      while (i < toks.length) {
        if (toks[i] === "*" || toks[i] === "/") {
          const left = toks[i - 1] as number;
          const right = toks[i + 1] as number;
          const res = toks[i] === "*" ? left * right : (right !== 0 ? left / right : NaN);
          toks.splice(i - 1, 3, res);
          i = Math.max(0, i - 1);
        } else {
          i++;
        }
      }
      i = 0;
      while (i < toks.length) {
        if (toks[i] === "+" || toks[i] === "-") {
          const left = (toks[i - 1] ?? 0) as number;
          const right = toks[i + 1] as number;
          const res = toks[i] === "+" ? left + right : left - right;
          toks.splice(i - 1, 3, res);
          i = Math.max(0, i - 1);
        } else {
          i++;
        }
      }
      return toks[0] as number;
    };

    return evalTokens(tokens);
  };

  const handleEquals = () => {
    try {
      const result = safeEvaluate(display);
      setHistory(`${display} =`);
      setDisplay(formatResult(result));
    } catch {
      setDisplay("Error");
    }
  };

  const formatResult = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "Error";
    if (Math.abs(num) < 1e-10) return "0";
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    return parseFloat(num.toPrecision(12)).toString();
  };

  const handleMemory = (action: string) => {
    const value = parseFloat(display);
    switch (action) {
      case "MC":
        setMemory(0);
        break;
      case "MR":
        setDisplay(memory.toString());
        break;
      case "M+":
        if (!isNaN(value)) setMemory((prev) => prev + value);
        break;
      case "M-":
        if (!isNaN(value)) setMemory((prev) => prev - value);
        break;
    }
  };

  const handleConstant = (constant: string) => {
    switch (constant) {
      case "π":
        setDisplay((prev) => (prev === "0" ? "π" : prev + "π"));
        break;
      case "e":
        setDisplay((prev) => (prev === "0" ? String(Math.E) : prev + String(Math.E)));
        break;
    }
  };

  const buttonClass = "h-10 text-sm font-medium";
  const numberClass = `${buttonClass} bg-muted hover:bg-muted/80`;
  const operatorClass = `${buttonClass} bg-primary/10 hover:bg-primary/20 text-primary`;
  const functionClass = `${buttonClass} bg-accent hover:bg-accent/80`;

  return (
    <Card data-testid="calculator-scientific" className="w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Scientific Calculator
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRadians(!isRadians)}
            className="text-xs"
            data-testid="button-angle-mode"
          >
            {isRadians ? "RAD" : "DEG"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 bg-muted rounded-lg text-right" data-testid="display">
          {history && <div className="text-xs text-muted-foreground mb-1">{history}</div>}
          <div className="text-2xl font-mono font-bold break-all">{display}</div>
          {memory !== 0 && <div className="text-xs text-muted-foreground">M: {memory}</div>}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {["MC", "MR", "M+", "M-", "C"].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={functionClass}
              onClick={() => (btn === "C" ? handleClear() : handleMemory(btn))}
              data-testid={`button-${btn.toLowerCase()}`}
            >
              {btn}
            </Button>
          ))}

          {["sin", "cos", "tan", "√", "x²"].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={functionClass}
              onClick={() =>
                handleFunction(btn === "√" ? "sqrt" : btn === "x²" ? "square" : btn)
              }
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}

          {["log", "ln", "eˣ", "π", "e"].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={functionClass}
              onClick={() => {
                if (btn === "π" || btn === "e") handleConstant(btn);
                else handleFunction(btn === "eˣ" ? "exp" : btn);
              }}
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}

          {["7", "8", "9", "÷", "⌫"].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={btn === "÷" ? operatorClass : btn === "⌫" ? functionClass : numberClass}
              onClick={() => {
                if (btn === "÷") handleOperator("/");
                else if (btn === "⌫") handleBackspace();
                else handleNumber(btn);
              }}
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}

          {["4", "5", "6", "×", "("].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={btn === "×" || btn === "(" ? operatorClass : numberClass}
              onClick={() => {
                if (btn === "×") handleOperator("*");
                else if (btn === "(") handleOperator("(");
                else handleNumber(btn);
              }}
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}

          {["1", "2", "3", "-", ")"].map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={btn === "-" || btn === ")" ? operatorClass : numberClass}
              onClick={() => {
                if (btn === "-" || btn === ")") handleOperator(btn);
                else handleNumber(btn);
              }}
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}

          {["0", ".", "±", "+", "="].map((btn) => (
            <Button
              key={btn}
              variant={btn === "=" ? "default" : "outline"}
              className={
                btn === "="
                  ? `${buttonClass} bg-primary hover:bg-primary/90`
                  : btn === "+" || btn === "±"
                  ? operatorClass
                  : numberClass
              }
              onClick={() => {
                if (btn === "=") handleEquals();
                else if (btn === "+") handleOperator("+");
                else if (btn === ".") handleDecimal();
                else if (btn === "±") handleFunction("negate");
                else handleNumber(btn);
              }}
              data-testid={`button-${btn}`}
            >
              {btn}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
