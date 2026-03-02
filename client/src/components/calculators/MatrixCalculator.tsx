import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatrixCalculator() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState<{ matrix: number[][]; steps: string[] } | null>(null);
  const [determinantResult, setDeterminantResult] = useState<{ value: number; steps: string[] } | null>(null);

  const updateMatrixSize = (newRows: number, newCols: number) => {
    const newMatrixA = Array(newRows).fill(0).map((_, i) => 
      Array(newCols).fill(0).map((_, j) => matrixA[i]?.[j] || 0)
    );
    const newMatrixB = Array(newRows).fill(0).map((_, i) => 
      Array(newCols).fill(0).map((_, j) => matrixB[i]?.[j] || 0)
    );
    setRows(newRows);
    setCols(newCols);
    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
  };

  const updateCell = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const num = parseFloat(value) || 0;
    if (matrix === "A") {
      const newMatrix = matrixA.map((r, i) => 
        i === row ? r.map((c, j) => j === col ? num : c) : r
      );
      setMatrixA(newMatrix);
    } else {
      const newMatrix = matrixB.map((r, i) => 
        i === row ? r.map((c, j) => j === col ? num : c) : r
      );
      setMatrixB(newMatrix);
    }
  };

  const calculateDeterminant = (m: number[][]): number => {
    const n = m.length;
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = m.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)]);
      det += Math.pow(-1, j) * m[0][j] * calculateDeterminant(minor);
    }
    return det;
  };

  const calculate = () => {
    const steps: string[] = [];
    let resultMatrix: number[][] = [];

    switch (operation) {
      case "add":
        steps.push("Matrix Addition: Add corresponding elements");
        steps.push("");
        resultMatrix = matrixA.map((row, i) =>
          row.map((val, j) => {
            const sum = val + matrixB[i][j];
            steps.push(`Position [${i + 1},${j + 1}]: ${val} + ${matrixB[i][j]} = ${sum}`);
            return sum;
          })
        );
        break;

      case "subtract":
        steps.push("Matrix Subtraction: Subtract corresponding elements");
        steps.push("");
        resultMatrix = matrixA.map((row, i) =>
          row.map((val, j) => {
            const diff = val - matrixB[i][j];
            steps.push(`Position [${i + 1},${j + 1}]: ${val} - ${matrixB[i][j]} = ${diff}`);
            return diff;
          })
        );
        break;

      case "multiply":
        if (cols !== rows) {
          steps.push("Error: For multiplication, Matrix A columns must equal Matrix B rows");
          setResult({ matrix: [], steps });
          return;
        }
        steps.push("Matrix Multiplication: Row × Column dot products");
        steps.push("");
        resultMatrix = matrixA.map((row, i) =>
          matrixB[0].map((_, j) => {
            let sum = 0;
            const parts: string[] = [];
            for (let k = 0; k < cols; k++) {
              sum += row[k] * matrixB[k][j];
              parts.push(`${row[k]}×${matrixB[k][j]}`);
            }
            steps.push(`Position [${i + 1},${j + 1}]: ${parts.join(" + ")} = ${sum}`);
            return sum;
          })
        );
        break;

      case "scalar":
        const scalar = matrixB[0][0];
        steps.push(`Scalar Multiplication: Multiply each element by ${scalar}`);
        steps.push("");
        resultMatrix = matrixA.map((row, i) =>
          row.map((val, j) => {
            const product = val * scalar;
            steps.push(`Position [${i + 1},${j + 1}]: ${val} × ${scalar} = ${product}`);
            return product;
          })
        );
        break;

      case "transpose":
        steps.push("Matrix Transpose: Swap rows and columns");
        steps.push("");
        resultMatrix = matrixA[0].map((_, j) =>
          matrixA.map((row, i) => {
            steps.push(`New [${j + 1},${i + 1}] = Old [${i + 1},${j + 1}] = ${row[j]}`);
            return row[j];
          })
        );
        break;
    }

    setResult({ matrix: resultMatrix, steps });
  };

  const calcDeterminant = () => {
    if (rows !== cols) {
      setDeterminantResult({ value: 0, steps: ["Error: Determinant requires a square matrix"] });
      return;
    }

    const steps: string[] = [];
    steps.push(`Calculating determinant of ${rows}×${cols} matrix`);
    steps.push("");

    if (rows === 2) {
      const det = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0];
      steps.push("For 2×2 matrix: det = ad - bc");
      steps.push(`det = (${matrixA[0][0]} × ${matrixA[1][1]}) - (${matrixA[0][1]} × ${matrixA[1][0]})`);
      steps.push(`det = ${matrixA[0][0] * matrixA[1][1]} - ${matrixA[0][1] * matrixA[1][0]}`);
      steps.push(`det = ${det}`);
      setDeterminantResult({ value: det, steps });
    } else {
      steps.push("Using cofactor expansion along the first row:");
      const det = calculateDeterminant(matrixA);
      steps.push(`Determinant = ${det}`);
      setDeterminantResult({ value: det, steps });
    }
  };

  const renderMatrix = (matrix: number[][], name: string, editable: boolean) => (
    <div className="space-y-2">
      <Label className="font-semibold">Matrix {name}</Label>
      <div className="inline-block border rounded p-2 bg-muted/50">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((val, j) => (
              <Input
                key={j}
                type="number"
                value={val}
                onChange={(e) => editable && updateCell(name as "A" | "B", i, j, e.target.value)}
                className="w-16 h-10 text-center"
                disabled={!editable}
                data-testid={`input-matrix-${name.toLowerCase()}-${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Matrix Calculator
            <Badge variant="secondary">Linear Algebra</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Rows</Label>
              <Select value={rows.toString()} onValueChange={(v) => updateMatrixSize(parseInt(v), cols)}>
                <SelectTrigger className="w-20" data-testid="select-rows">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select value={cols.toString()} onValueChange={(v) => updateMatrixSize(rows, parseInt(v))}>
                <SelectTrigger className="w-20" data-testid="select-cols">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operation</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="w-40" data-testid="select-operation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add (A + B)</SelectItem>
                  <SelectItem value="subtract">Subtract (A - B)</SelectItem>
                  <SelectItem value="multiply">Multiply (A × B)</SelectItem>
                  <SelectItem value="scalar">Scalar (A × k)</SelectItem>
                  <SelectItem value="transpose">Transpose (Aᵀ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderMatrix(matrixA, "A", true)}
            {operation !== "transpose" && renderMatrix(matrixB, "B", true)}
          </div>

          <div className="flex gap-2">
            <Button onClick={calculate} className="flex-1" data-testid="button-calculate">
              Calculate
            </Button>
            {rows === cols && (
              <Button onClick={calcDeterminant} variant="outline" data-testid="button-determinant">
                Determinant
              </Button>
            )}
          </div>

          {result && result.matrix.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
              <div>
                <p className="font-semibold mb-2">Result Matrix:</p>
                <div className="inline-block border rounded p-2 bg-background">
                  {result.matrix.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((val, j) => (
                        <div key={j} className="w-16 h-10 flex items-center justify-center font-mono text-primary">
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Step-by-Step:</p>
                <div className="text-sm font-mono bg-background p-3 rounded max-h-48 overflow-y-auto">
                  {result.steps.map((step, i) => (
                    <div key={i}>{step || <br />}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {determinantResult && (
            <div className="mt-4 p-4 bg-accent rounded-lg">
              <p className="text-lg font-bold text-center">
                Determinant = <span className="text-primary">{determinantResult.value}</span>
              </p>
              <div className="mt-2 text-sm font-mono">
                {determinantResult.steps.map((step, i) => (
                  <div key={i}>{step || <br />}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding Matrices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>What is a matrix?</strong> A matrix is like a grid of numbers arranged in rows and columns, kind of like a spreadsheet!</p>
          <p><strong>Addition/Subtraction:</strong> Add or subtract matching positions - like adding the top-left of A to the top-left of B.</p>
          <p><strong>Multiplication:</strong> Each result cell is the sum of multiplying row elements by column elements.</p>
          <p><strong>Transpose:</strong> Flip the matrix - rows become columns and columns become rows.</p>
          <p><strong>Determinant:</strong> A special number that tells us things about the matrix (only works for square matrices).</p>
        </CardContent>
      </Card>
    </div>
  );
}
