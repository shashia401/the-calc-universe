import { Calculator, Heart, DollarSign, ArrowLeftRight, Clock, GraduationCap, type LucideIcon } from "lucide-react";

export interface CalculatorInfo {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  popular?: boolean;
  new?: boolean;
  tags: string[];
  categoryId: string;
  subcategoryId: string;
}

export interface Subcategory {
  id: string;
  name: string;
  calculators: CalculatorInfo[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "math",
    name: "Math Calculators",
    description: "Essential math calculation tools for basic arithmetic to advanced equations",
    icon: Calculator,
    color: "text-blue-500",
    subcategories: [
      {
        id: "basic-math",
        name: "Basic Math",
        calculators: [
          {
            id: "simple-calculator",
            name: "Simple Calculator",
            description: "A basic calculator for addition, subtraction, multiplication, and division. Perfect for quick everyday calculations with step-by-step explanations.",
            shortDescription: "Basic arithmetic operations",
            popular: true,
            tags: ["calculator", "basic", "arithmetic", "add", "subtract", "multiply", "divide"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "percentage-calculator",
            name: "Percentage Calculator",
            description: "Calculate percentages, percentage increase/decrease, and find what percentage one number is of another. Perfect for discounts, tips, and grade calculations.",
            shortDescription: "Calculate percentages easily",
            popular: true,
            tags: ["percentage", "math", "basic", "percent"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "fraction-calculator",
            name: "Fraction Calculator",
            description: "Add, subtract, multiply, and divide fractions with step-by-step solutions. Learn how to work with numerators and denominators.",
            shortDescription: "Perform fraction operations",
            popular: true,
            tags: ["fraction", "math", "basic", "numerator", "denominator"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "average-calculator",
            name: "Average Calculator",
            description: "Calculate simple and weighted averages from a set of numbers. Includes step-by-step explanations and running average support.",
            shortDescription: "Calculate averages",
            popular: true,
            tags: ["average", "mean", "weighted", "math", "basic"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "random-number-generator",
            name: "Random Number Generator",
            description: "Generate random numbers within a specified range. Perfect for games, lotteries, and statistical sampling.",
            shortDescription: "Generate random numbers",
            tags: ["random", "number", "generator", "lottery"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "percent-error-calculator",
            name: "Percent Error Calculator",
            description: "Calculate the percent error between an experimental value and a theoretical value. Essential for science experiments.",
            shortDescription: "Calculate percent error",
            tags: ["percent", "error", "experimental", "science"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "ratio-calculator",
            name: "Ratio Calculator",
            description: "Simplify ratios, find equivalent ratios, and solve ratio problems. Great for cooking, scaling, and proportions.",
            shortDescription: "Calculate and simplify ratios",
            tags: ["ratio", "proportion", "scale", "simplify"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "rounding-calculator",
            name: "Rounding Calculator",
            description: "Round numbers to any decimal place, significant figures, or to the nearest whole number with clear explanations.",
            shortDescription: "Round numbers accurately",
            tags: ["rounding", "decimal", "significant figures"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "factor-calculator",
            name: "Factor Calculator",
            description: "Find all factors of a number and determine if it's prime. Understand factorization with step-by-step explanations.",
            shortDescription: "Find factors of numbers",
            tags: ["factor", "prime", "divisor", "factorization"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "lcm-calculator",
            name: "Least Common Multiple Calculator",
            description: "Find the LCM of two or more numbers using prime factorization method with detailed steps.",
            shortDescription: "Find LCM of numbers",
            popular: true,
            tags: ["lcm", "least common multiple", "math"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
          {
            id: "gcf-calculator",
            name: "Greatest Common Factor Calculator",
            description: "Find the GCF (or GCD) of two or more numbers using prime factorization with step-by-step solutions.",
            shortDescription: "Find GCF of numbers",
            popular: true,
            tags: ["gcf", "gcd", "greatest common factor", "math"],
            categoryId: "math",
            subcategoryId: "basic-math",
          },
        ],
      },
      {
        id: "advanced-math",
        name: "Advanced Math",
        calculators: [
          {
            id: "scientific-calculator",
            name: "Scientific Calculator",
            description: "Advanced scientific calculator with trigonometric, logarithmic, and exponential functions. Includes sin, cos, tan, log, ln, and more.",
            shortDescription: "Advanced math functions",
            popular: true,
            tags: ["scientific", "trigonometry", "advanced", "sin", "cos", "tan"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "exponent-calculator",
            name: "Exponent Calculator",
            description: "Calculate powers and exponents. Learn about exponential notation and the laws of exponents with examples.",
            shortDescription: "Calculate powers",
            tags: ["exponent", "power", "math", "squared", "cubed"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "log-calculator",
            name: "Log Calculator",
            description: "Calculate logarithms (log, ln, log base n) with step-by-step explanations. Understand the relationship between logs and exponents.",
            shortDescription: "Calculate logarithms",
            tags: ["logarithm", "log", "ln", "natural log", "math"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "root-calculator",
            name: "Root Calculator",
            description: "Calculate square roots, cube roots, and nth roots. Learn how roots relate to exponents with examples.",
            shortDescription: "Calculate roots",
            tags: ["root", "square root", "cube root", "radical"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "quadratic-formula-calculator",
            name: "Quadratic Formula Calculator",
            description: "Solve quadratic equations (ax² + bx + c = 0) using the quadratic formula. See the discriminant and understand real vs complex roots.",
            shortDescription: "Solve quadratic equations",
            popular: true,
            tags: ["quadratic", "equation", "formula", "algebra", "roots"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "half-life-calculator",
            name: "Half-Life Calculator",
            description: "Calculate radioactive decay, half-life, and remaining quantity. Used in physics, chemistry, and medicine.",
            shortDescription: "Calculate half-life decay",
            tags: ["half-life", "decay", "radioactive", "physics"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "matrix-calculator",
            name: "Matrix Calculator",
            description: "Perform matrix operations: addition, subtraction, multiplication, determinant, and inverse. Essential for linear algebra.",
            shortDescription: "Matrix operations",
            tags: ["matrix", "linear algebra", "determinant", "inverse"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "scientific-notation-calculator",
            name: "Scientific Notation Calculator",
            description: "Convert numbers to and from scientific notation. Perform arithmetic with numbers in scientific notation.",
            shortDescription: "Scientific notation converter",
            tags: ["scientific notation", "exponent", "convert"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
          {
            id: "big-number-calculator",
            name: "Big Number Calculator",
            description: "Perform arithmetic with very large numbers that exceed normal calculator limits. Perfect for cryptography and astronomy.",
            shortDescription: "Calculate large numbers",
            tags: ["big number", "large", "arithmetic", "precision"],
            categoryId: "math",
            subcategoryId: "advanced-math",
          },
        ],
      },
      {
        id: "number-systems",
        name: "Number Systems",
        calculators: [
          {
            id: "binary-calculator",
            name: "Binary Calculator",
            description: "Convert between binary and decimal. Perform binary arithmetic (add, subtract, multiply, divide). Essential for computer science.",
            shortDescription: "Binary conversions & math",
            popular: true,
            tags: ["binary", "decimal", "convert", "computer science"],
            categoryId: "math",
            subcategoryId: "number-systems",
          },
          {
            id: "hex-calculator",
            name: "Hex Calculator",
            description: "Convert between hexadecimal, decimal, and binary. Perform hex arithmetic and understand base-16 number system.",
            shortDescription: "Hexadecimal conversions",
            tags: ["hex", "hexadecimal", "decimal", "convert"],
            categoryId: "math",
            subcategoryId: "number-systems",
          },
        ],
      },
      {
        id: "statistics",
        name: "Statistics",
        calculators: [
          {
            id: "mean-median-mode-calculator",
            name: "Mean, Median, Mode, Range Calculator",
            description: "Calculate mean (average), median (middle value), mode (most frequent), and range of a data set. Essential statistics concepts.",
            shortDescription: "Central tendency measures",
            popular: true,
            tags: ["mean", "median", "mode", "range", "average", "statistics"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "standard-deviation-calculator",
            name: "Standard Deviation Calculator",
            description: "Calculate standard deviation and variance for a data set. Understand data spread and dispersion with formulas explained.",
            shortDescription: "Calculate standard deviation",
            popular: true,
            tags: ["standard deviation", "variance", "statistics", "spread"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "probability-calculator",
            name: "Probability Calculator",
            description: "Calculate probability of events, combinations, and expected outcomes. Learn probability theory with examples.",
            shortDescription: "Calculate probabilities",
            tags: ["probability", "chance", "odds", "statistics"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "permutation-combination-calculator",
            name: "Permutation and Combination Calculator",
            description: "Calculate permutations (nPr) and combinations (nCr). Understand the difference between ordered and unordered selections.",
            shortDescription: "Permutations & combinations",
            tags: ["permutation", "combination", "npr", "ncr", "factorial"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "z-score-calculator",
            name: "Z-Score Calculator",
            description: "Calculate z-scores for data points. Understand how many standard deviations a value is from the mean.",
            shortDescription: "Calculate z-scores",
            tags: ["z-score", "standard score", "normal distribution"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "sample-size-calculator",
            name: "Sample Size Calculator",
            description: "Determine the required sample size for surveys and experiments. Account for confidence level and margin of error.",
            shortDescription: "Calculate sample size",
            tags: ["sample size", "survey", "statistics", "margin of error"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "confidence-interval-calculator",
            name: "Confidence Interval Calculator",
            description: "Calculate confidence intervals for population mean. Understand statistical significance and error margins.",
            shortDescription: "Calculate confidence intervals",
            tags: ["confidence interval", "statistics", "margin of error"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "number-sequence-calculator",
            name: "Number Sequence Calculator",
            description: "Find patterns in number sequences. Calculate arithmetic and geometric sequence terms and sums.",
            shortDescription: "Analyze number sequences",
            tags: ["sequence", "pattern", "arithmetic", "geometric"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
          {
            id: "statistics-calculator",
            name: "Statistics Calculator",
            description: "Comprehensive statistics calculator: mean, median, mode, standard deviation, variance, quartiles, and more.",
            shortDescription: "Full statistics suite",
            tags: ["statistics", "data analysis", "quartile", "comprehensive"],
            categoryId: "math",
            subcategoryId: "statistics",
          },
        ],
      },
      {
        id: "geometry",
        name: "Geometry",
        calculators: [
          {
            id: "triangle-calculator",
            name: "Triangle Calculator",
            description: "Calculate triangle area, perimeter, angles, and sides. Supports all triangle types with law of sines and cosines.",
            shortDescription: "Triangle calculations",
            popular: true,
            tags: ["triangle", "geometry", "area", "perimeter", "angles"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "pythagorean-theorem-calculator",
            name: "Pythagorean Theorem Calculator",
            description: "Calculate the missing side of a right triangle using a² + b² = c². Includes step-by-step solutions and proofs.",
            shortDescription: "Right triangle sides",
            popular: true,
            tags: ["pythagorean", "right triangle", "hypotenuse", "geometry"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "right-triangle-calculator",
            name: "Right Triangle Calculator",
            description: "Complete right triangle calculator: find sides, angles, area, and perimeter. Uses trigonometry and Pythagorean theorem.",
            shortDescription: "Right triangle solver",
            tags: ["right triangle", "trigonometry", "hypotenuse", "legs"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "circle-calculator",
            name: "Circle Calculator",
            description: "Calculate circle area, circumference, diameter, and radius. Understand pi and circular geometry.",
            shortDescription: "Circle calculations",
            popular: true,
            tags: ["circle", "radius", "diameter", "circumference", "pi"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "area-calculator",
            name: "Area Calculator",
            description: "Calculate area of various shapes: rectangle, triangle, circle, trapezoid, parallelogram, and more.",
            shortDescription: "Area of shapes",
            popular: true,
            tags: ["area", "geometry", "shapes", "square units"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "volume-calculator",
            name: "Volume Calculator",
            description: "Calculate volume of 3D shapes: cube, sphere, cylinder, cone, pyramid, and prism. Learn volume formulas.",
            shortDescription: "3D shape volumes",
            popular: true,
            tags: ["volume", "3d", "cube", "sphere", "cylinder"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "surface-area-calculator",
            name: "Surface Area Calculator",
            description: "Calculate surface area of 3D shapes: cube, sphere, cylinder, cone, and rectangular prism.",
            shortDescription: "3D surface areas",
            tags: ["surface area", "3d", "geometry", "cube", "sphere"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "slope-calculator",
            name: "Slope Calculator",
            description: "Calculate slope between two points, find y-intercept, and write line equations. Understand rise over run.",
            shortDescription: "Calculate line slope",
            tags: ["slope", "line", "coordinates", "rise", "run"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
          {
            id: "distance-calculator",
            name: "Distance Calculator",
            description: "Calculate distance between two points in 2D or 3D space using the distance formula. Includes midpoint calculation.",
            shortDescription: "Distance between points",
            tags: ["distance", "coordinates", "midpoint", "geometry"],
            categoryId: "math",
            subcategoryId: "geometry",
          },
        ],
      },
    ],
  },
  {
    id: "health",
    name: "Health & Fitness",
    description: "Track your health metrics and fitness goals with precision",
    icon: Heart,
    color: "text-red-500",
    subcategories: [
      {
        id: "body-metrics",
        name: "Body Metrics",
        calculators: [
          {
            id: "bmi-calculator",
            name: "BMI Calculator",
            description: "Calculate your Body Mass Index (BMI) to understand your weight status. Get personalized insights based on your height and weight.",
            shortDescription: "Calculate Body Mass Index",
            popular: true,
            tags: ["bmi", "health", "weight"],
            categoryId: "health",
            subcategoryId: "body-metrics",
          },
          {
            id: "body-fat-calculator",
            name: "Body Fat Calculator",
            description: "Estimate your body fat percentage using various methods.",
            shortDescription: "Estimate body fat percentage",
            tags: ["body-fat", "fitness", "health"],
            categoryId: "health",
            subcategoryId: "body-metrics",
          },
          {
            id: "ideal-weight-calculator",
            name: "Ideal Weight Calculator",
            description: "Find your ideal weight range based on height and body frame.",
            shortDescription: "Find your ideal weight",
            tags: ["weight", "ideal", "health"],
            categoryId: "health",
            subcategoryId: "body-metrics",
          },
        ],
      },
      {
        id: "nutrition",
        name: "Nutrition",
        calculators: [
          {
            id: "calorie-calculator",
            name: "Calorie Calculator",
            description: "Calculate daily calorie needs based on your activity level, age, and goals. Perfect for weight loss or muscle gain planning.",
            shortDescription: "Daily calorie needs",
            popular: true,
            tags: ["calorie", "nutrition", "diet"],
            categoryId: "health",
            subcategoryId: "nutrition",
          },
          {
            id: "water-intake-calculator",
            name: "Water Intake Calculator",
            description: "Calculate your recommended daily water intake.",
            shortDescription: "Daily water needs",
            tags: ["water", "hydration", "health"],
            categoryId: "health",
            subcategoryId: "nutrition",
          },
          {
            id: "tdee-calculator",
            name: "TDEE Calculator",
            description: "Calculate your Total Daily Energy Expenditure based on activity level. Understand how many calories you burn each day for weight management.",
            shortDescription: "Total daily energy expenditure",
            popular: true,
            tags: ["tdee", "energy", "calories", "metabolism", "fitness"],
            categoryId: "health",
            subcategoryId: "nutrition",
          },
          {
            id: "macro-calculator",
            name: "Macro Calculator",
            description: "Calculate your daily macronutrient needs — protein, carbs, and fat — based on your goals. Choose from balanced, low-carb, keto, and high-protein presets.",
            shortDescription: "Protein, carbs & fat goals",
            popular: true,
            tags: ["macro", "protein", "carbs", "fat", "diet", "nutrition"],
            categoryId: "health",
            subcategoryId: "nutrition",
          },
          {
            id: "bmr-calculator",
            name: "BMR Calculator",
            description: "Calculate your Basal Metabolic Rate — the number of calories your body needs at rest. Compare Harris-Benedict and Mifflin-St Jeor formulas.",
            shortDescription: "Basal metabolic rate",
            popular: true,
            tags: ["bmr", "metabolism", "calories", "resting", "energy"],
            categoryId: "health",
            subcategoryId: "nutrition",
          },
        ],
      },
      {
        id: "womens-health",
        name: "Women's Health",
        calculators: [
          {
            id: "pregnancy-calculator",
            name: "Pregnancy Due Date Calculator",
            description: "Calculate your baby's due date, track trimester progress, and view key pregnancy milestones week by week using Naegele's Rule.",
            shortDescription: "Baby due date calculator",
            popular: true,
            tags: ["pregnancy", "due date", "baby", "trimester", "prenatal"],
            categoryId: "health",
            subcategoryId: "womens-health",
          },
          {
            id: "ovulation-calculator",
            name: "Ovulation Calculator",
            description: "Calculate your fertile window and ovulation date based on your menstrual cycle. Track your most fertile days for family planning.",
            shortDescription: "Fertile window tracker",
            tags: ["ovulation", "fertility", "cycle", "period", "conception"],
            categoryId: "health",
            subcategoryId: "womens-health",
          },
        ],
      },
      {
        id: "fitness",
        name: "Fitness",
        calculators: [
          {
            id: "pace-calculator",
            name: "Pace Calculator",
            description: "Calculate running or walking pace, finish time, or distance. Includes preset race distances (5K, 10K, half marathon, marathon) and split times.",
            shortDescription: "Running pace & finish time",
            tags: ["pace", "running", "walking", "marathon", "speed", "race"],
            categoryId: "health",
            subcategoryId: "fitness",
          },
        ],
      },
    ],
  },
  {
    id: "financial",
    name: "Financial",
    description: "Smart financial planning tools for loans, investments, and savings",
    icon: DollarSign,
    color: "text-green-500",
    subcategories: [
      {
        id: "loans",
        name: "Loans & Mortgages",
        calculators: [
          {
            id: "mortgage-calculator",
            name: "Mortgage Calculator",
            description: "Calculate monthly mortgage payments, total interest, and amortization schedule. Compare different loan scenarios to find the best option.",
            shortDescription: "Monthly mortgage payments",
            popular: true,
            tags: ["mortgage", "loan", "home"],
            categoryId: "financial",
            subcategoryId: "loans",
          },
          {
            id: "loan-calculator",
            name: "Loan Calculator",
            description: "Calculate loan payments for any type of loan.",
            shortDescription: "General loan payments",
            tags: ["loan", "payment", "interest"],
            categoryId: "financial",
            subcategoryId: "loans",
          },
          {
            id: "auto-loan-calculator",
            name: "Auto Loan Calculator",
            description: "Calculate monthly car loan payments with trade-in value, down payment, and sales tax. Compare loan terms from 24 to 84 months with full amortization schedule.",
            shortDescription: "Car loan payments",
            popular: true,
            tags: ["auto", "car", "loan", "vehicle", "payment", "finance"],
            categoryId: "financial",
            subcategoryId: "loans",
          },
          {
            id: "credit-card-payoff-calculator",
            name: "Credit Card Payoff Calculator",
            description: "Calculate how long it takes to pay off credit card debt and how much interest you'll pay. Compare minimum vs. fixed payment strategies.",
            shortDescription: "Pay off credit card debt",
            tags: ["credit card", "debt", "payoff", "interest", "payment"],
            categoryId: "financial",
            subcategoryId: "loans",
          },
        ],
      },
      {
        id: "investments",
        name: "Investments",
        calculators: [
          {
            id: "compound-interest-calculator",
            name: "Compound Interest Calculator",
            description: "See how your money grows over time with compound interest. Visualize investment growth with detailed projections.",
            shortDescription: "Investment growth",
            popular: true,
            tags: ["compound", "interest", "investment"],
            categoryId: "financial",
            subcategoryId: "investments",
          },
          {
            id: "roi-calculator",
            name: "ROI Calculator",
            description: "Calculate Return on Investment to measure the profitability of your investments. Includes annualized ROI and total return with step-by-step breakdown.",
            shortDescription: "Return on investment",
            popular: true,
            tags: ["roi", "return", "investment", "profit", "annualized"],
            categoryId: "financial",
            subcategoryId: "investments",
          },
          {
            id: "savings-calculator",
            name: "Savings Calculator",
            description: "Calculate how your savings will grow over time with regular deposits and compound interest. Set savings goals and track progress.",
            shortDescription: "Savings growth projections",
            popular: true,
            tags: ["savings", "deposit", "interest", "goal", "growth"],
            categoryId: "financial",
            subcategoryId: "investments",
          },
          {
            id: "retirement-calculator",
            name: "Retirement Calculator",
            description: "Plan your retirement with 401(k), IRA, and Roth IRA projections. Factor in employer match, inflation, and estimate monthly retirement income.",
            shortDescription: "Retirement planning",
            popular: true,
            tags: ["retirement", "401k", "ira", "pension", "savings"],
            categoryId: "financial",
            subcategoryId: "investments",
          },
          {
            id: "inflation-calculator",
            name: "Inflation Calculator",
            description: "Calculate the future value of money adjusted for inflation. See how purchasing power erodes over time with year-by-year projections.",
            shortDescription: "Inflation impact on money",
            tags: ["inflation", "purchasing power", "future value", "money"],
            categoryId: "financial",
            subcategoryId: "investments",
          },
        ],
      },
      {
        id: "tax-salary",
        name: "Tax & Salary",
        calculators: [
          {
            id: "salary-calculator",
            name: "Salary Calculator",
            description: "Convert between annual, monthly, biweekly, weekly, and hourly salary. Estimate federal tax, state tax, FICA, and take-home pay.",
            shortDescription: "Salary & take-home pay",
            popular: true,
            tags: ["salary", "paycheck", "income", "wage", "hourly", "annual"],
            categoryId: "financial",
            subcategoryId: "tax-salary",
          },
          {
            id: "income-tax-calculator",
            name: "Income Tax Calculator",
            description: "Calculate US federal income tax using 2024 tax brackets. Supports single, married, and head of household filing statuses with standard or itemized deductions.",
            shortDescription: "Federal income tax",
            popular: true,
            tags: ["tax", "income", "federal", "bracket", "deduction", "irs"],
            categoryId: "financial",
            subcategoryId: "tax-salary",
          },
        ],
      },
      {
        id: "everyday",
        name: "Everyday Finance",
        calculators: [
          {
            id: "tip-calculator",
            name: "Tip Calculator",
            description: "Calculate tips and split bills among friends easily. Perfect for restaurants and services.",
            shortDescription: "Calculate tips easily",
            popular: true,
            tags: ["tip", "restaurant", "split"],
            categoryId: "financial",
            subcategoryId: "everyday",
          },
          {
            id: "currency-converter",
            name: "Currency Converter",
            description: "Convert between world currencies with live rates.",
            shortDescription: "Convert currencies",
            tags: ["currency", "exchange", "money"],
            categoryId: "financial",
            subcategoryId: "everyday",
          },
          {
            id: "discount-calculator",
            name: "Discount Calculator",
            description: "Calculate sale prices with percentage or fixed discounts. Stack multiple discounts and add sales tax to find your final price.",
            shortDescription: "Sale price & discounts",
            popular: true,
            tags: ["discount", "sale", "price", "tax", "shopping", "coupon"],
            categoryId: "financial",
            subcategoryId: "everyday",
          },
          {
            id: "profit-margin-calculator",
            name: "Profit Margin Calculator",
            description: "Calculate gross and net profit margins, markup percentages, and selling prices. Essential for business pricing decisions.",
            shortDescription: "Profit margin & markup",
            tags: ["margin", "profit", "markup", "business", "pricing"],
            categoryId: "financial",
            subcategoryId: "everyday",
          },
        ],
      },
    ],
  },
  {
    id: "conversion",
    name: "Conversion Tools",
    description: "Convert between units of measurement quickly and accurately",
    icon: ArrowLeftRight,
    color: "text-purple-500",
    subcategories: [
      {
        id: "length-weight",
        name: "Length & Weight",
        calculators: [
          {
            id: "length-converter",
            name: "Length Converter",
            description: "Convert between meters, feet, inches, miles, kilometers, and more. Supports metric and imperial units.",
            shortDescription: "Convert length units",
            popular: true,
            tags: ["length", "distance", "conversion"],
            categoryId: "conversion",
            subcategoryId: "length-weight",
          },
          {
            id: "weight-converter",
            name: "Weight Converter",
            description: "Convert between kilograms, pounds, ounces, and more.",
            shortDescription: "Convert weight units",
            tags: ["weight", "mass", "conversion"],
            categoryId: "conversion",
            subcategoryId: "length-weight",
          },
        ],
      },
      {
        id: "temperature-area",
        name: "Temperature & Area",
        calculators: [
          {
            id: "temperature-converter",
            name: "Temperature Converter",
            description: "Convert between Celsius, Fahrenheit, and Kelvin.",
            shortDescription: "Convert temperatures",
            popular: true,
            tags: ["temperature", "celsius", "fahrenheit"],
            categoryId: "conversion",
            subcategoryId: "temperature-area",
          },
          {
            id: "area-converter",
            name: "Area Converter",
            description: "Convert between square meters, acres, hectares, and more.",
            shortDescription: "Convert area units",
            tags: ["area", "square", "conversion"],
            categoryId: "conversion",
            subcategoryId: "temperature-area",
          },
          {
            id: "speed-converter",
            name: "Speed Converter",
            description: "Convert between mph, km/h, m/s, and more.",
            shortDescription: "Convert speed units",
            tags: ["speed", "velocity", "conversion"],
            categoryId: "conversion",
            subcategoryId: "temperature-area",
          },
        ],
      },
      {
        id: "volume-energy",
        name: "Volume & Energy",
        calculators: [
          {
            id: "volume-converter",
            name: "Volume Converter",
            description: "Convert between liters, gallons, cups, fluid ounces, tablespoons, teaspoons, and more. Supports US and UK measurements.",
            shortDescription: "Convert volume units",
            popular: true,
            tags: ["volume", "liters", "gallons", "cups", "conversion", "liquid"],
            categoryId: "conversion",
            subcategoryId: "volume-energy",
          },
          {
            id: "energy-converter",
            name: "Energy Converter",
            description: "Convert between joules, calories, kilowatt-hours, BTU, electronvolts, and more energy units.",
            shortDescription: "Convert energy units",
            tags: ["energy", "joules", "calories", "kwh", "btu", "conversion"],
            categoryId: "conversion",
            subcategoryId: "volume-energy",
          },
          {
            id: "power-converter",
            name: "Power Converter",
            description: "Convert between watts, kilowatts, horsepower, BTU/hour, and more power units. Essential for electrical, HVAC, and automotive calculations.",
            shortDescription: "Convert power units",
            popular: true,
            tags: ["power", "watts", "kilowatts", "horsepower", "btu", "conversion"],
            categoryId: "conversion",
            subcategoryId: "volume-energy",
          },
        ],
      },
      {
        id: "data-fuel",
        name: "Data & Fuel",
        calculators: [
          {
            id: "data-converter",
            name: "Data Storage Converter",
            description: "Convert between bytes, KB, MB, GB, TB, PB, and bit units. Uses standard binary (base-2) prefixes.",
            shortDescription: "Convert data sizes",
            tags: ["data", "bytes", "megabytes", "gigabytes", "storage", "conversion"],
            categoryId: "conversion",
            subcategoryId: "data-fuel",
          },
          {
            id: "fuel-calculator",
            name: "Fuel Economy Calculator",
            description: "Calculate fuel economy in MPG, L/100km, and km/L. Estimate fuel costs for trips and compare vehicle efficiency.",
            shortDescription: "MPG & fuel cost",
            tags: ["fuel", "mpg", "gas", "mileage", "economy", "cost"],
            categoryId: "conversion",
            subcategoryId: "data-fuel",
          },
        ],
      },
      {
        id: "practical",
        name: "Practical Tools",
        calculators: [
          {
            id: "electricity-cost-calculator",
            name: "Electricity Cost Calculator",
            description: "Calculate how much electricity your appliances use and what they cost to run. Includes presets for common devices like AC, TV, and computers.",
            shortDescription: "Appliance power costs",
            popular: true,
            tags: ["electricity", "power", "cost", "watt", "energy", "bill", "appliance"],
            categoryId: "conversion",
            subcategoryId: "practical",
          },
          {
            id: "square-footage-calculator",
            name: "Square Footage Calculator",
            description: "Calculate square footage for rooms, houses, and land. Add multiple rooms with different shapes (rectangle, triangle, circle, trapezoid).",
            shortDescription: "Calculate square footage",
            popular: true,
            tags: ["square footage", "area", "room", "floor", "house", "sqft"],
            categoryId: "conversion",
            subcategoryId: "practical",
          },
        ],
      },
    ],
  },
  {
    id: "datetime",
    name: "Date & Time",
    description: "Calculate dates, time differences, and manage schedules",
    icon: Clock,
    color: "text-orange-500",
    subcategories: [
      {
        id: "date-calculations",
        name: "Date Calculations",
        calculators: [
          {
            id: "age-calculator",
            name: "Age Calculator",
            description: "Calculate exact age in years, months, and days. Find out how old you are or will be on any date.",
            shortDescription: "Calculate exact age",
            popular: true,
            tags: ["age", "birthday", "date"],
            categoryId: "datetime",
            subcategoryId: "date-calculations",
          },
          {
            id: "date-difference-calculator",
            name: "Date Difference Calculator",
            description: "Calculate days, weeks, or months between two dates.",
            shortDescription: "Days between dates",
            tags: ["date", "difference", "duration"],
            categoryId: "datetime",
            subcategoryId: "date-calculations",
          },
          {
            id: "days-until-calculator",
            name: "Days Until Calculator",
            description: "Count down to any future date or event.",
            shortDescription: "Countdown to a date",
            tags: ["countdown", "future", "event"],
            categoryId: "datetime",
            subcategoryId: "date-calculations",
          },
        ],
      },
      {
        id: "time-calculations",
        name: "Time Calculations",
        calculators: [
          {
            id: "time-zone-converter",
            name: "Time Zone Converter",
            description: "Convert time between different time zones worldwide.",
            shortDescription: "Convert time zones",
            tags: ["timezone", "world", "time"],
            categoryId: "datetime",
            subcategoryId: "time-calculations",
          },
          {
            id: "working-days-calculator",
            name: "Working Days Calculator",
            description: "Calculate business days between dates, excluding weekends.",
            shortDescription: "Count business days",
            tags: ["business", "work", "days"],
            categoryId: "datetime",
            subcategoryId: "time-calculations",
          },
          {
            id: "hours-calculator",
            name: "Hours Calculator",
            description: "Calculate total hours worked between time entries. Add multiple time blocks with break deductions and optional hourly rate for gross pay.",
            shortDescription: "Calculate hours worked",
            popular: true,
            tags: ["hours", "time", "work", "clock", "duration", "timesheet"],
            categoryId: "datetime",
            subcategoryId: "time-calculations",
          },
        ],
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "Academic tools for students and educators",
    icon: GraduationCap,
    color: "text-indigo-500",
    subcategories: [
      {
        id: "grades",
        name: "Grades & GPA",
        calculators: [
          {
            id: "gpa-calculator",
            name: "GPA Calculator",
            description: "Calculate your Grade Point Average for semester or cumulative GPA. Supports weighted and unweighted calculations.",
            shortDescription: "Calculate GPA",
            popular: true,
            tags: ["gpa", "grades", "school"],
            categoryId: "education",
            subcategoryId: "grades",
          },
          {
            id: "grade-calculator",
            name: "Grade Calculator",
            description: "Calculate your final grade based on weighted assignments.",
            shortDescription: "Final grade calculator",
            tags: ["grade", "final", "weighted"],
            categoryId: "education",
            subcategoryId: "grades",
          },
          {
            id: "test-score-percentage",
            name: "Test Score Percentage",
            description: "Convert test scores to percentages and letter grades.",
            shortDescription: "Score to percentage",
            tags: ["test", "score", "percentage"],
            categoryId: "education",
            subcategoryId: "grades",
          },
        ],
      },
      {
        id: "study",
        name: "Study Tools",
        calculators: [
          {
            id: "study-time-calculator",
            name: "Study Time Calculator",
            description: "Plan your study schedule based on material and exam dates.",
            shortDescription: "Plan study time",
            tags: ["study", "time", "schedule"],
            categoryId: "education",
            subcategoryId: "study",
          },
          {
            id: "assignment-deadline-tracker",
            name: "Assignment Deadline Tracker",
            description: "Track multiple assignment deadlines and prioritize tasks.",
            shortDescription: "Track deadlines",
            tags: ["assignment", "deadline", "tracker"],
            categoryId: "education",
            subcategoryId: "study",
          },
        ],
      },
    ],
  },
];

export function getAllCalculators(): CalculatorInfo[] {
  const calculators: CalculatorInfo[] = [];
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      calculators.push(...subcategory.calculators);
    });
  });
  return calculators;
}

export function getPopularCalculators(): CalculatorInfo[] {
  return getAllCalculators().filter((calc) => calc.popular);
}

export function getCalculatorById(id: string): CalculatorInfo | undefined {
  return getAllCalculators().find((calc) => calc.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getRelatedCalculators(calculatorId: string, limit = 4): CalculatorInfo[] {
  const calculator = getCalculatorById(calculatorId);
  if (!calculator) return [];
  
  const allCalcs = getAllCalculators().filter((c) => c.id !== calculatorId);
  const sameCategory = allCalcs.filter((c) => c.categoryId === calculator.categoryId);
  const others = allCalcs.filter((c) => c.categoryId !== calculator.categoryId);
  
  return [...sameCategory, ...others].slice(0, limit);
}

export function searchCalculators(query: string): CalculatorInfo[] {
  const lowerQuery = query.toLowerCase();
  return getAllCalculators().filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery) ||
      calc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoryCount(): number {
  return categories.length;
}

export function getCalculatorCount(): number {
  return getAllCalculators().length;
}

export function getCategoryCalculatorCount(categoryId: string): number {
  const category = getCategoryById(categoryId);
  if (!category) return 0;
  return category.subcategories.reduce((acc, sub) => acc + sub.calculators.length, 0);
}
