import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CalculatorSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-24 w-full" />
    </CardContent>
  </Card>
);

const calculatorImports: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "simple-calculator": () => import("@/components/calculators/SimpleCalculator"),
  "percentage-calculator": () => import("@/components/calculators/PercentageCalculator").then(m => ({ default: m.PercentageCalculator })),
  "bmi-calculator": () => import("@/components/calculators/BMICalculator").then(m => ({ default: m.BMICalculator })),
  "mortgage-calculator": () => import("@/components/calculators/MortgageCalculator").then(m => ({ default: m.MortgageCalculator })),
  "tip-calculator": () => import("@/components/calculators/TipCalculator").then(m => ({ default: m.TipCalculator })),
  "age-calculator": () => import("@/components/calculators/AgeCalculator").then(m => ({ default: m.AgeCalculator })),
  "length-converter": () => import("@/components/calculators/LengthConverter").then(m => ({ default: m.LengthConverter })),
  "gpa-calculator": () => import("@/components/calculators/GPACalculator").then(m => ({ default: m.GPACalculator })),
  "calorie-calculator": () => import("@/components/calculators/CalorieCalculator").then(m => ({ default: m.CalorieCalculator })),
  "compound-interest-calculator": () => import("@/components/calculators/CompoundInterestCalculator").then(m => ({ default: m.CompoundInterestCalculator })),
  "temperature-converter": () => import("@/components/calculators/TemperatureConverter").then(m => ({ default: m.TemperatureConverter })),
  "scientific-calculator": () => import("@/components/calculators/ScientificCalculator").then(m => ({ default: m.ScientificCalculator })),
  "fraction-calculator": () => import("@/components/calculators/FractionCalculator"),
  "binary-calculator": () => import("@/components/calculators/BinaryCalculator"),
  "hex-calculator": () => import("@/components/calculators/HexCalculator"),
  "quadratic-formula-calculator": () => import("@/components/calculators/QuadraticFormulaCalculator"),
  "log-calculator": () => import("@/components/calculators/LogCalculator"),
  "root-calculator": () => import("@/components/calculators/RootCalculator"),
  "ratio-calculator": () => import("@/components/calculators/RatioCalculator"),
  "lcm-calculator": () => import("@/components/calculators/LCMCalculator"),
  "gcf-calculator": () => import("@/components/calculators/GCFCalculator"),
  "factor-calculator": () => import("@/components/calculators/FactorCalculator"),
  "rounding-calculator": () => import("@/components/calculators/RoundingCalculator"),
  "scientific-notation-calculator": () => import("@/components/calculators/ScientificNotationCalculator"),
  "big-number-calculator": () => import("@/components/calculators/BigNumberCalculator"),
  "random-number-generator": () => import("@/components/calculators/RandomNumberGenerator"),
  "percent-error-calculator": () => import("@/components/calculators/PercentErrorCalculator"),
  "exponent-calculator": () => import("@/components/calculators/ExponentCalculator"),
  "half-life-calculator": () => import("@/components/calculators/HalfLifeCalculator"),
  "standard-deviation-calculator": () => import("@/components/calculators/StandardDeviationCalculator"),
  "mean-median-mode-calculator": () => import("@/components/calculators/MeanMedianModeCalculator"),
  "probability-calculator": () => import("@/components/calculators/ProbabilityCalculator"),
  "permutation-combination-calculator": () => import("@/components/calculators/PermutationCombinationCalculator"),
  "z-score-calculator": () => import("@/components/calculators/ZScoreCalculator"),
  "triangle-calculator": () => import("@/components/calculators/TriangleCalculator"),
  "pythagorean-theorem-calculator": () => import("@/components/calculators/PythagoreanTheoremCalculator"),
  "circle-calculator": () => import("@/components/calculators/CircleCalculator"),
  "volume-calculator": () => import("@/components/calculators/VolumeCalculator"),
  "area-calculator": () => import("@/components/calculators/AreaCalculator"),
  "slope-calculator": () => import("@/components/calculators/SlopeCalculator"),
  "distance-calculator": () => import("@/components/calculators/DistanceCalculator"),
  "surface-area-calculator": () => import("@/components/calculators/SurfaceAreaCalculator"),
  "right-triangle-calculator": () => import("@/components/calculators/RightTriangleCalculator"),
  "matrix-calculator": () => import("@/components/calculators/MatrixCalculator"),
  "sample-size-calculator": () => import("@/components/calculators/SampleSizeCalculator"),
  "confidence-interval-calculator": () => import("@/components/calculators/ConfidenceIntervalCalculator"),
  "number-sequence-calculator": () => import("@/components/calculators/NumberSequenceCalculator"),
  "statistics-calculator": () => import("@/components/calculators/StatisticsCalculator"),
  "body-fat-calculator": () => import("@/components/calculators/BodyFatCalculator"),
  "ideal-weight-calculator": () => import("@/components/calculators/IdealWeightCalculator"),
  "water-intake-calculator": () => import("@/components/calculators/WaterIntakeCalculator"),
  "loan-calculator": () => import("@/components/calculators/LoanCalculator"),
  "currency-converter": () => import("@/components/calculators/CurrencyConverter"),
  "weight-converter": () => import("@/components/calculators/WeightConverter"),
  "area-converter": () => import("@/components/calculators/AreaConverter"),
  "speed-converter": () => import("@/components/calculators/SpeedConverter"),
  "date-difference-calculator": () => import("@/components/calculators/DateDifferenceCalculator"),
  "days-until-calculator": () => import("@/components/calculators/DaysUntilCalculator"),
  "time-zone-converter": () => import("@/components/calculators/TimeZoneConverter"),
  "working-days-calculator": () => import("@/components/calculators/WorkingDaysCalculator"),
  "grade-calculator": () => import("@/components/calculators/GradeCalculator"),
  "test-score-percentage": () => import("@/components/calculators/TestScoreCalculator"),
  "study-time-calculator": () => import("@/components/calculators/StudyTimeCalculator"),
  "assignment-deadline-tracker": () => import("@/components/calculators/AssignmentDeadlineCalculator"),
  "salary-calculator": () => import("@/components/calculators/SalaryCalculator"),
  "income-tax-calculator": () => import("@/components/calculators/IncomeTaxCalculator"),
  "savings-calculator": () => import("@/components/calculators/SavingsCalculator"),
  "auto-loan-calculator": () => import("@/components/calculators/AutoLoanCalculator"),
  "roi-calculator": () => import("@/components/calculators/ROICalculator"),
  "inflation-calculator": () => import("@/components/calculators/InflationCalculator"),
  "discount-calculator": () => import("@/components/calculators/DiscountCalculator"),
  "profit-margin-calculator": () => import("@/components/calculators/ProfitMarginCalculator"),
  "credit-card-payoff-calculator": () => import("@/components/calculators/CreditCardPayoffCalculator"),
  "retirement-calculator": () => import("@/components/calculators/RetirementCalculator"),
  "pregnancy-calculator": () => import("@/components/calculators/PregnancyCalculator"),
  "tdee-calculator": () => import("@/components/calculators/TDEECalculator"),
  "macro-calculator": () => import("@/components/calculators/MacroCalculator"),
  "bmr-calculator": () => import("@/components/calculators/BMRCalculator"),
  "ovulation-calculator": () => import("@/components/calculators/OvulationCalculator"),
  "pace-calculator": () => import("@/components/calculators/PaceCalculator"),
  "volume-converter": () => import("@/components/calculators/VolumeConverter"),
  "data-converter": () => import("@/components/calculators/DataConverter"),
  "energy-converter": () => import("@/components/calculators/EnergyConverter"),
  "fuel-calculator": () => import("@/components/calculators/FuelCalculator"),
  "electricity-cost-calculator": () => import("@/components/calculators/ElectricityCostCalculator"),
  "square-footage-calculator": () => import("@/components/calculators/SquareFootageCalculator"),
  "hours-calculator": () => import("@/components/calculators/HoursCalculator"),
  "average-calculator": () => import("@/components/calculators/AverageCalculator"),
  "power-converter": () => import("@/components/calculators/PowerConverter"),
};

const calculatorCache: Record<string, LazyExoticComponent<ComponentType>> = {};

export function getCalculatorComponent(calculatorId: string): LazyExoticComponent<ComponentType> | null {
  if (!calculatorImports[calculatorId]) {
    return null;
  }
  
  if (!calculatorCache[calculatorId]) {
    calculatorCache[calculatorId] = lazy(calculatorImports[calculatorId]);
  }
  
  return calculatorCache[calculatorId];
}

export function LazyCalculator({ calculatorId }: { calculatorId: string }) {
  const Component = getCalculatorComponent(calculatorId);
  
  if (!Component) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">This calculator is coming soon!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <Suspense fallback={<CalculatorSkeleton />}>
        <Component />
      </Suspense>
      <div className="text-center mt-4 py-3 border-t" data-testid="text-powered-by">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <a href="https://thecalcuniverse.com" className="font-semibold text-primary hover:underline">
            The Calc Universe
          </a>
        </p>
      </div>
    </div>
  );
}
