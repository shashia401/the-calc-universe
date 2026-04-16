import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection, type FAQItem } from "@/components/FAQSection";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { CalculatorHistory } from "@/components/CalculatorHistory";
import { EmbedWidget } from "@/components/EmbedWidget";
import { SEOHead, generateCalculatorSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/components/SEOHead";
import { getCalculatorById, getCategoryById, type CalculatorInfo } from "@/lib/calculatorData";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { LazyCalculator } from "@/lib/calculatorLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Printer, BookmarkPlus, Info, Lightbulb, Check, Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HowToUse {
  steps: string[];
}

interface TipExample {
  title: string;
  description: string;
}

const calculatorHowToUse: Record<string, HowToUse> = {
  "percentage-calculator": {
    steps: [
      "Choose what you want to calculate: find a percentage, find what percent one number is of another, or calculate percentage change.",
      "Enter the values in the appropriate fields.",
      "Click 'Calculate' to see the result with step-by-step explanation.",
      "Review the formula breakdown to understand how the calculation works.",
      "Try different values to practice percentage calculations.",
    ],
  },
  "bmi-calculator": {
    steps: [
      "Select your preferred unit system (Metric or Imperial).",
      "Enter your height in meters/centimeters or feet/inches.",
      "Enter your weight in kilograms or pounds.",
      "Click 'Calculate BMI' to see your Body Mass Index.",
      "Review your BMI category and health recommendations.",
    ],
  },
  "mortgage-calculator": {
    steps: [
      "Enter the home price or loan amount you're considering.",
      "Input your down payment amount or percentage.",
      "Set the loan term (typically 15 or 30 years).",
      "Enter the annual interest rate from your lender.",
      "View your monthly payment breakdown and total cost over the loan term.",
    ],
  },
  "tip-calculator": {
    steps: [
      "Enter the total bill amount before tip.",
      "Select or enter a tip percentage (common: 15%, 18%, 20%).",
      "If dining with others, enter the number of people to split.",
      "Click 'Calculate' to see the tip amount and total.",
      "View how much each person pays when splitting the bill.",
    ],
  },
  "age-calculator": {
    steps: [
      "Enter your date of birth using the date picker.",
      "Optionally, enter a specific date to calculate age at that time.",
      "Click 'Calculate Age' to see your exact age.",
      "View your age in years, months, weeks, and days.",
      "See interesting facts about your age milestones.",
    ],
  },
  "length-converter": {
    steps: [
      "Enter a value in any length unit (meters, feet, inches, etc.).",
      "Select the source unit from the dropdown.",
      "Choose the target unit you want to convert to.",
      "See the converted value instantly.",
      "Copy the result or try other unit combinations.",
    ],
  },
  "gpa-calculator": {
    steps: [
      "Add each course by entering the course name.",
      "Enter the number of credit hours for each course.",
      "Select the letter grade you received (A, B, C, etc.).",
      "Add more courses as needed to calculate cumulative GPA.",
      "View your calculated GPA on the 4.0 scale.",
    ],
  },
  "calorie-calculator": {
    steps: [
      "Enter your age, gender, height, and weight.",
      "Select your activity level from sedentary to very active.",
      "Choose your goal: maintain, lose, or gain weight.",
      "Click 'Calculate' to see your daily calorie needs.",
      "View macronutrient breakdown (protein, carbs, fat).",
    ],
  },
  "compound-interest-calculator": {
    steps: [
      "Enter your initial principal (starting amount).",
      "Input the annual interest rate as a percentage.",
      "Set the compounding frequency (monthly, quarterly, yearly).",
      "Enter the time period in years.",
      "View your total with interest and growth breakdown.",
    ],
  },
  "temperature-converter": {
    steps: [
      "Enter a temperature value in the input field.",
      "Select the source unit (Celsius, Fahrenheit, or Kelvin).",
      "Choose the target unit for conversion.",
      "See the converted temperature instantly.",
      "Review the conversion formula used.",
    ],
  },
  "scientific-calculator": {
    steps: [
      "Use the number pad to enter values.",
      "Select mathematical operations (+, -, ×, ÷).",
      "Use scientific functions (sin, cos, tan, log, etc.).",
      "Press '=' or Enter to calculate the result.",
      "Use 'C' to clear or 'DEL' to delete the last entry.",
    ],
  },
  "fraction-calculator": {
    steps: [
      "Enter the numerator and denominator of the first fraction.",
      "Select the operation (add, subtract, multiply, divide).",
      "Enter the second fraction's numerator and denominator.",
      "Click 'Calculate' to see the result.",
      "View the simplified fraction and step-by-step solution.",
    ],
  },
  "binary-calculator": {
    steps: [
      "Enter a binary number (using only 0s and 1s).",
      "Or enter a decimal number to convert to binary.",
      "Select the operation type (convert, add, subtract).",
      "Click 'Calculate' to see the result.",
      "View the conversion steps and binary representation.",
    ],
  },
  "hex-calculator": {
    steps: [
      "Enter a hexadecimal number (0-9, A-F).",
      "Or enter a decimal number to convert to hex.",
      "Select the conversion direction or operation.",
      "Click 'Calculate' to see the result.",
      "View all number representations (hex, decimal, binary).",
    ],
  },
  "quadratic-formula-calculator": {
    steps: [
      "Identify your quadratic equation in the form ax² + bx + c = 0.",
      "Enter the coefficient 'a' (the x² term).",
      "Enter the coefficient 'b' (the x term).",
      "Enter the coefficient 'c' (the constant).",
      "View the solutions (roots) and the discriminant.",
    ],
  },
  "log-calculator": {
    steps: [
      "Enter the number you want to find the logarithm of.",
      "Select the base (common log base 10, natural log, or custom).",
      "Click 'Calculate' to see the logarithm value.",
      "Review the step-by-step explanation.",
      "Understand the relationship between logs and exponents.",
    ],
  },
  "root-calculator": {
    steps: [
      "Enter the number you want to find the root of (the radicand).",
      "Enter the root index (2 for square root, 3 for cube root, etc.).",
      "Click 'Calculate' to see the result.",
      "View the exact and decimal form of the answer.",
      "See the verification (result raised to the power).",
    ],
  },
  "ratio-calculator": {
    steps: [
      "Enter the first number in the ratio.",
      "Enter the second number in the ratio.",
      "Click 'Simplify' to reduce the ratio to lowest terms.",
      "Or enter a missing value to solve ratio proportions.",
      "View equivalent ratios and scaling examples.",
    ],
  },
  "lcm-calculator": {
    steps: [
      "Enter two or more numbers separated by commas.",
      "Click 'Calculate LCM' to find the Least Common Multiple.",
      "View the prime factorization of each number.",
      "See the step-by-step process of finding the LCM.",
      "Understand how LCM is used in adding fractions.",
    ],
  },
  "gcf-calculator": {
    steps: [
      "Enter two or more numbers separated by commas.",
      "Click 'Calculate GCF' to find the Greatest Common Factor.",
      "View all factors of each number.",
      "See the common factors and identify the greatest.",
      "Understand how GCF helps simplify fractions.",
    ],
  },
  "factor-calculator": {
    steps: [
      "Enter a whole number you want to factor.",
      "Click 'Find Factors' to see all factor pairs.",
      "View the complete list of factors.",
      "See the prime factorization of the number.",
      "Learn if the number is prime or composite.",
    ],
  },
  "rounding-calculator": {
    steps: [
      "Enter the number you want to round.",
      "Select the rounding place (nearest 10, 100, decimal place, etc.).",
      "Choose rounding method (standard, round up, round down).",
      "Click 'Round' to see the result.",
      "View the rounding rule explanation.",
    ],
  },
  "scientific-notation-calculator": {
    steps: [
      "Enter a very large or very small number.",
      "Or enter a number in scientific notation (e.g., 3.5 × 10^8).",
      "Click 'Convert' to toggle between formats.",
      "View the mantissa and exponent separately.",
      "Practice with examples from science and astronomy.",
    ],
  },
  "big-number-calculator": {
    steps: [
      "Enter very large numbers without worrying about limits.",
      "Select the operation (add, subtract, multiply, divide).",
      "Enter the second large number.",
      "Click 'Calculate' to see the exact result.",
      "View the full result without rounding or overflow.",
    ],
  },
  "random-number-generator": {
    steps: [
      "Enter the minimum value for your range.",
      "Enter the maximum value for your range.",
      "Select how many random numbers you need.",
      "Choose if numbers should be unique (no duplicates).",
      "Click 'Generate' to see your random numbers.",
    ],
  },
  "percent-error-calculator": {
    steps: [
      "Enter the experimental (measured) value.",
      "Enter the theoretical (expected/true) value.",
      "Click 'Calculate' to find the percent error.",
      "View the step-by-step calculation.",
      "Understand if your measurement is accurate.",
    ],
  },
  "exponent-calculator": {
    steps: [
      "Enter the base number.",
      "Enter the exponent (power).",
      "Click 'Calculate' to see the result.",
      "View the expanded form (base × base × ...).",
      "Learn about negative and fractional exponents.",
    ],
  },
  "half-life-calculator": {
    steps: [
      "Enter the initial amount of substance.",
      "Enter the half-life period and select units.",
      "Enter the elapsed time.",
      "Click 'Calculate' to see the remaining amount.",
      "View the decay curve and number of half-lives passed.",
    ],
  },
  "standard-deviation-calculator": {
    steps: [
      "Enter your data set, separating numbers with commas.",
      "Select if this is a sample or population data.",
      "Click 'Calculate' to see the standard deviation.",
      "View the mean, variance, and other statistics.",
      "See the step-by-step deviation calculations.",
    ],
  },
  "mean-median-mode-calculator": {
    steps: [
      "Enter your data set, separating numbers with commas.",
      "Click 'Calculate' to find all three measures.",
      "View the mean (average) with calculation steps.",
      "See the median (middle value) explained.",
      "Find the mode (most frequent value).",
    ],
  },
  "probability-calculator": {
    steps: [
      "Enter the number of favorable outcomes.",
      "Enter the total number of possible outcomes.",
      "Click 'Calculate' to see the probability.",
      "View the probability as a fraction, decimal, and percentage.",
      "Explore the odds and complementary probability.",
    ],
  },
  "permutation-combination-calculator": {
    steps: [
      "Enter 'n' (the total number of items).",
      "Enter 'r' (the number of items to select).",
      "Choose Permutation (order matters) or Combination (order doesn't matter).",
      "Click 'Calculate' to see the result.",
      "View the formula and step-by-step factorial calculations.",
    ],
  },
  "z-score-calculator": {
    steps: [
      "Enter the raw score (your data point).",
      "Enter the mean (average) of the data set.",
      "Enter the standard deviation.",
      "Click 'Calculate' to find the z-score.",
      "View where your value falls on the normal distribution.",
    ],
  },
  "triangle-calculator": {
    steps: [
      "Enter the values you know (sides and/or angles).",
      "Select the type of calculation (area, perimeter, missing sides).",
      "Click 'Calculate' to solve for unknowns.",
      "View the step-by-step solution using appropriate formulas.",
      "See a diagram of the triangle with labeled parts.",
    ],
  },
  "pythagorean-theorem-calculator": {
    steps: [
      "Identify which sides you know: two legs (a, b) or one leg and hypotenuse (c).",
      "Enter the known side lengths.",
      "Click 'Calculate' to find the missing side.",
      "View the step-by-step calculation using a² + b² = c².",
      "Verify the result with the proof check.",
    ],
  },
  "circle-calculator": {
    steps: [
      "Enter one known value: radius, diameter, circumference, or area.",
      "Click 'Calculate' to find all other values.",
      "View the relationships between circle measurements.",
      "See the formulas used (πr², 2πr, etc.).",
      "Explore how changing one value affects others.",
    ],
  },
  "volume-calculator": {
    steps: [
      "Select the 3D shape (cube, sphere, cylinder, cone, etc.).",
      "Enter the required dimensions for your shape.",
      "Click 'Calculate' to find the volume.",
      "View the result in your chosen units.",
      "See the formula and step-by-step calculation.",
    ],
  },
  "area-calculator": {
    steps: [
      "Select the 2D shape (square, rectangle, triangle, circle, etc.).",
      "Enter the required dimensions for your shape.",
      "Click 'Calculate' to find the area.",
      "View the result in square units.",
      "See the formula and calculation steps.",
    ],
  },
  "slope-calculator": {
    steps: [
      "Enter the coordinates of the first point (x₁, y₁).",
      "Enter the coordinates of the second point (x₂, y₂).",
      "Click 'Calculate' to find the slope.",
      "View the slope in different forms (fraction, decimal, percentage).",
      "See the line equation and visual representation.",
    ],
  },
  "distance-calculator": {
    steps: [
      "Enter the x and y coordinates of the first point.",
      "Enter the x and y coordinates of the second point.",
      "Click 'Calculate' to find the distance.",
      "View the step-by-step distance formula application.",
      "See the midpoint of the two points.",
    ],
  },
  "surface-area-calculator": {
    steps: [
      "Select the 3D shape (cube, sphere, cylinder, cone, etc.).",
      "Enter the required dimensions for your shape.",
      "Click 'Calculate' to find the surface area.",
      "View the total surface area in square units.",
      "See the formula breakdown for each face.",
    ],
  },
  "right-triangle-calculator": {
    steps: [
      "Enter any two known values (sides or one angle).",
      "Click 'Calculate' to solve the entire triangle.",
      "View all three sides and all three angles.",
      "See the area and perimeter calculations.",
      "Review trigonometric ratios (sin, cos, tan).",
    ],
  },
  "matrix-calculator": {
    steps: [
      "Select the matrix size (rows and columns).",
      "Enter values into Matrix A and Matrix B.",
      "Choose an operation (add, subtract, multiply, transpose).",
      "Click 'Calculate' to see the result.",
      "View step-by-step calculations for each element.",
    ],
  },
  "sample-size-calculator": {
    steps: [
      "Select your desired confidence level (90%, 95%, or 99%).",
      "Enter your acceptable margin of error percentage.",
      "Set the expected proportion (use 50% if unsure).",
      "Optionally enter population size for finite adjustment.",
      "View the required sample size for your survey.",
    ],
  },
  "confidence-interval-calculator": {
    steps: [
      "Choose between mean or proportion calculation.",
      "Enter your sample statistics (mean, std dev, size).",
      "Select the confidence level.",
      "Click 'Calculate' to see the interval.",
      "View the lower and upper bounds with margin of error.",
    ],
  },
  "number-sequence-calculator": {
    steps: [
      "Choose to analyze or generate a sequence.",
      "For analysis, enter numbers separated by commas.",
      "For generation, set first term and common difference/ratio.",
      "Click 'Analyze' or 'Generate' for results.",
      "View pattern type, formula, and next terms.",
    ],
  },
  "statistics-calculator": {
    steps: [
      "Enter your data set separated by commas or spaces.",
      "Click 'Calculate All Statistics'.",
      "View mean, median, mode, range, and more.",
      "See variance and standard deviation.",
      "Review quartiles and IQR.",
    ],
  },
  "body-fat-calculator": {
    steps: [
      "Select your gender and unit system.",
      "Enter height and weight.",
      "Measure and enter neck circumference.",
      "Measure and enter waist (and hip for females).",
      "View body fat percentage and category.",
    ],
  },
  "ideal-weight-calculator": {
    steps: [
      "Select your gender.",
      "Enter your height in cm or inches.",
      "Click 'Calculate Ideal Weight'.",
      "View results from multiple formulas.",
      "See the healthy BMI weight range.",
    ],
  },
  "water-intake-calculator": {
    steps: [
      "Enter your body weight.",
      "Select your activity level.",
      "Choose your climate conditions.",
      "Click 'Calculate Daily Water Intake'.",
      "View recommendations in liters, cups, and bottles.",
    ],
  },
  "loan-calculator": {
    steps: [
      "Enter the loan amount (principal).",
      "Set the annual interest rate.",
      "Enter the loan term in years or months.",
      "Click 'Calculate Loan'.",
      "View monthly payment and amortization schedule.",
    ],
  },
  "currency-converter": {
    steps: [
      "Enter the amount to convert.",
      "Select the source currency.",
      "Choose the target currency.",
      "Click 'Convert Currency'.",
      "View the converted amount and exchange rate.",
    ],
  },
  "weight-converter": {
    steps: [
      "Enter a value in any weight unit field.",
      "All other units update automatically.",
      "Switch between kg, lb, oz, and more.",
      "View conversion steps and formulas.",
      "Use for cooking, shipping, or fitness.",
    ],
  },
  "area-converter": {
    steps: [
      "Enter a value in any area unit field.",
      "All other units update automatically.",
      "Convert between sq meters, sq feet, acres, etc.",
      "View conversion steps.",
      "Useful for real estate and land measurement.",
    ],
  },
  "speed-converter": {
    steps: [
      "Enter a speed value in any unit field.",
      "All other units update automatically.",
      "Convert between km/h, mph, m/s, knots, and more.",
      "See conversion calculations.",
      "Compare everyday speeds to sound and light.",
    ],
  },
  "date-difference-calculator": {
    steps: [
      "Enter the start date.",
      "Enter the end date.",
      "Click 'Calculate Difference'.",
      "View the difference in years, months, weeks, and days.",
      "See total days, hours, and minutes.",
    ],
  },
  "days-until-calculator": {
    steps: [
      "Enter an event name (optional).",
      "Select the target date.",
      "View the live countdown.",
      "See days, hours, minutes, seconds remaining.",
      "Use quick buttons for common holidays.",
    ],
  },
  "time-zone-converter": {
    steps: [
      "Enter the date and time.",
      "Select the source time zone.",
      "Choose the target time zone.",
      "Click 'Convert Time'.",
      "View the converted time and date.",
    ],
  },
  "working-days-calculator": {
    steps: [
      "Choose to count or add working days.",
      "Enter start and end dates (for counting).",
      "Or enter start date and days to add.",
      "Exclude weekends as needed.",
      "View working days count or end date.",
    ],
  },
  "grade-calculator": {
    steps: [
      "Add your assignments/tests with names.",
      "Enter score, maximum score, and weight for each.",
      "Add more items as needed.",
      "Click 'Calculate Grade'.",
      "View your weighted average and letter grade.",
    ],
  },
  "test-score-percentage": {
    steps: [
      "Choose your calculation mode (score, needed, or from wrong).",
      "Enter correct answers and total questions.",
      "Or enter target percentage to find needed correct.",
      "Click 'Calculate' for results.",
      "View percentage and letter grade.",
    ],
  },
  "study-time-calculator": {
    steps: [
      "Enter total pages or topics to study.",
      "Set your reading speed (pages/hour).",
      "Enter days available before the exam.",
      "Select difficulty level.",
      "View total hours and daily schedule.",
    ],
  },
  "assignment-deadline-tracker": {
    steps: [
      "Add assignments with names and deadlines.",
      "Estimate hours needed for each.",
      "Set your available study hours per day.",
      "Click 'Analyze Deadlines'.",
      "View priority list with urgency indicators.",
    ],
  },
};

const calculatorTipsExamples: Record<string, TipExample[]> = {
  "percentage-calculator": [
    { title: "Shopping Discounts", description: "If a $80 item is 25% off, calculate: $80 × 0.25 = $20 discount. Final price: $80 - $20 = $60." },
    { title: "Grade Calculations", description: "If you scored 45 out of 50 on a test, your percentage is: (45 ÷ 50) × 100 = 90%." },
  ],
  "bmi-calculator": [
    { title: "Track Progress", description: "Calculate your BMI monthly to track fitness progress. A healthy goal is to aim for 18.5-24.9 BMI range." },
    { title: "Muscle vs Fat", description: "Athletes may have higher BMI due to muscle mass. Consider body fat percentage for more accuracy." },
  ],
  "mortgage-calculator": [
    { title: "15 vs 30 Year", description: "A 15-year mortgage has higher payments but saves thousands in interest. Compare both to find your best option." },
    { title: "Down Payment Impact", description: "20% down eliminates PMI (Private Mortgage Insurance), saving $100-200 monthly on average." },
  ],
  "tip-calculator": [
    { title: "Quick 20% Tip", description: "For 20% tip, move the decimal left once (10%) and double it. $45 bill: $4.50 × 2 = $9 tip." },
    { title: "Splitting Evenly", description: "Calculate total with tip first, then divide. Easier than each person calculating separately." },
  ],
  "age-calculator": [
    { title: "Days Alive", description: "Multiply your age in years by 365.25 (accounting for leap years) for approximate days lived." },
    { title: "Birthday Countdown", description: "Calculate days until your next birthday to track milestones and celebrations." },
  ],
  "length-converter": [
    { title: "Quick Feet to Meters", description: "Multiply feet by 0.3048 for meters. Example: 6 feet × 0.3048 = 1.83 meters." },
    { title: "Height Conversion", description: "To convert 5'8\" to cm: (5 × 12 + 8) × 2.54 = 172.72 cm." },
  ],
  "gpa-calculator": [
    { title: "Weighted Courses", description: "Honor/AP courses often add 0.5-1.0 to your GPA. A 'B' in AP might equal an 'A' in regular courses." },
    { title: "GPA Goal Setting", description: "To maintain a 3.5 GPA, aim for mostly A's and B's. One C drops your average significantly." },
  ],
  "calorie-calculator": [
    { title: "Safe Weight Loss", description: "A 500-calorie daily deficit leads to about 1 pound lost per week. Don't go below 1200 calories." },
    { title: "Activity Multiplier", description: "Exercise can increase your daily needs by 300-600 calories. Adjust on active days." },
  ],
  "compound-interest-calculator": [
    { title: "Rule of 72", description: "Divide 72 by your interest rate to estimate years to double your money. 6% rate: 72 ÷ 6 = 12 years." },
    { title: "Start Early", description: "Starting 10 years earlier can double your final amount due to compound growth." },
  ],
  "temperature-converter": [
    { title: "Quick C to F", description: "Double the Celsius, subtract 10%, add 32. Example: 20°C → 40 - 4 + 32 = 68°F (actually 68°F)." },
    { title: "Key References", description: "Water freezes at 0°C/32°F, boils at 100°C/212°F. Room temp is about 20°C/68°F." },
  ],
  "scientific-calculator": [
    { title: "Order of Operations", description: "Remember PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract from left to right." },
    { title: "Memory Functions", description: "Use M+ to add to memory, MR to recall. Great for multi-step calculations." },
  ],
  "fraction-calculator": [
    { title: "Adding Fractions", description: "Find common denominator first. 1/4 + 1/3: Common denominator is 12. = 3/12 + 4/12 = 7/12." },
    { title: "Simplify by GCF", description: "Divide both numerator and denominator by their greatest common factor. 8/12 ÷ 4 = 2/3." },
  ],
  "binary-calculator": [
    { title: "Binary Place Values", description: "Each position is a power of 2: ...16, 8, 4, 2, 1. So 1011 = 8+0+2+1 = 11 in decimal." },
    { title: "Computer Bytes", description: "8 bits make a byte. Maximum value of 1 byte (11111111) is 255 in decimal." },
  ],
  "hex-calculator": [
    { title: "Hex to Binary", description: "Each hex digit is 4 binary digits. A = 1010, F = 1111. So AF = 10101111." },
    { title: "Color Codes", description: "Web colors use hex: #FF0000 = red (255 red, 0 green, 0 blue)." },
  ],
  "quadratic-formula-calculator": [
    { title: "Discriminant Check", description: "If b² - 4ac > 0: two real solutions. = 0: one solution. < 0: no real solutions (complex numbers)." },
    { title: "Graphing Parabolas", description: "The solutions (roots) are where the parabola crosses the x-axis." },
  ],
  "log-calculator": [
    { title: "Logarithm Basics", description: "log₁₀(100) = 2 means 10² = 100. The log asks 'what power gives me this number?'" },
    { title: "Natural Log (ln)", description: "ln uses base e ≈ 2.718. It's used in growth/decay problems and calculus." },
  ],
  "root-calculator": [
    { title: "Square Root Shortcut", description: "√144 = 12 because 12 × 12 = 144. Memorize perfect squares up to 225." },
    { title: "Cube Roots", description: "∛27 = 3 because 3 × 3 × 3 = 27. Useful for volume problems." },
  ],
  "ratio-calculator": [
    { title: "Recipe Scaling", description: "If a recipe serves 4 and you need 6 servings, multiply all ingredients by 6/4 = 1.5." },
    { title: "Map Scales", description: "A 1:100 scale means 1 cm on the map = 100 cm (1 meter) in real life." },
  ],
  "lcm-calculator": [
    { title: "Adding Fractions", description: "The LCM of denominators becomes your common denominator. LCM(4,6) = 12 for 1/4 + 1/6." },
    { title: "Scheduling Events", description: "Two events occur every 3 and 4 days. They coincide every LCM(3,4) = 12 days." },
  ],
  "gcf-calculator": [
    { title: "Simplifying Fractions", description: "Divide by GCF to simplify. 24/36: GCF is 12, so 24/36 = 2/3." },
    { title: "Factoring Expressions", description: "For 12x + 18y, GCF(12,18) = 6. Factor out: 6(2x + 3y)." },
  ],
  "factor-calculator": [
    { title: "Factor Pairs", description: "Factors come in pairs. For 24: (1,24), (2,12), (3,8), (4,6). Total: 8 factors." },
    { title: "Prime Factorization", description: "Break down to primes: 60 = 2² × 3 × 5. Useful for LCM and GCF." },
  ],
  "rounding-calculator": [
    { title: "5 Rounds Up", description: "Standard rounding: 0-4 round down, 5-9 round up. 3.45 → 3.5, 3.44 → 3.4." },
    { title: "Significant Figures", description: "In science, round to match your least precise measurement. 2.3 × 1.25 = 2.875 → 2.9." },
  ],
  "scientific-notation-calculator": [
    { title: "Large Numbers", description: "The Sun is 150,000,000 km away = 1.5 × 10⁸ km. Much easier to write and compare!" },
    { title: "Small Numbers", description: "Atoms are about 0.0000000001 m = 1 × 10⁻¹⁰ m in diameter." },
  ],
  "big-number-calculator": [
    { title: "National Debt", description: "Work with trillions exactly: $33,000,000,000,000 without losing precision." },
    { title: "Astronomical Math", description: "Calculate with galaxy distances or particle counts without overflow errors." },
  ],
  "random-number-generator": [
    { title: "Fair Games", description: "Use for dice rolls, lottery picks, or random selection in games and experiments." },
    { title: "Password Generation", description: "Generate random numbers to help create secure, unpredictable passwords." },
  ],
  "percent-error-calculator": [
    { title: "Lab Experiments", description: "If you measured 4.8g but the true value is 5.0g: |4.8-5.0|/5.0 × 100 = 4% error." },
    { title: "Acceptable Range", description: "In most science labs, under 5% error is considered good. Under 1% is excellent." },
  ],
  "exponent-calculator": [
    { title: "Negative Exponents", description: "2⁻³ = 1/2³ = 1/8. Negative exponents flip the base to a fraction." },
    { title: "Power of Powers", description: "(2³)² = 2⁶ = 64. Multiply the exponents when raising a power to a power." },
  ],
  "half-life-calculator": [
    { title: "Radioactive Decay", description: "Carbon-14 has a half-life of 5,730 years. After 11,460 years, only 1/4 remains." },
    { title: "Medicine Dosage", description: "If a drug's half-life is 4 hours, after 8 hours only 25% of the original dose remains." },
  ],
  "standard-deviation-calculator": [
    { title: "Consistency Measure", description: "Low standard deviation = data points cluster near the mean. High = more spread out." },
    { title: "Grade Distribution", description: "Test scores with SD of 5 are more consistent than scores with SD of 15." },
  ],
  "mean-median-mode-calculator": [
    { title: "Choosing the Right Average", description: "Use median for data with outliers (like house prices). Mean is pulled by extremes." },
    { title: "Mode for Categories", description: "Mode works for non-numeric data too, like 'most popular color voted.'" },
  ],
  "probability-calculator": [
    { title: "Coin Flip", description: "Probability of heads = 1/2 = 0.5 = 50%. Fair coin means equal outcomes." },
    { title: "Dice Rolling", description: "Probability of rolling a 6 = 1/6 ≈ 16.67%. Each face is equally likely." },
  ],
  "permutation-combination-calculator": [
    { title: "Password Arrangements", description: "4-digit PIN with 10 digits: 10⁴ = 10,000 permutations (order matters, can repeat)." },
    { title: "Lottery Odds", description: "Pick 6 from 49 balls: C(49,6) = 13,983,816 combinations. That's why lotteries are hard to win!" },
  ],
  "z-score-calculator": [
    { title: "Test Score Comparison", description: "Z-score of 1.5 means your score is 1.5 standard deviations above the mean - top 6.7%!" },
    { title: "Normal Distribution", description: "About 68% of data falls within z = ±1, and 95% within z = ±2." },
  ],
  "triangle-calculator": [
    { title: "Heron's Formula", description: "Find area with just 3 sides: A = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2." },
    { title: "Triangle Inequality", description: "Sum of any two sides must be greater than the third, or it can't form a triangle." },
  ],
  "pythagorean-theorem-calculator": [
    { title: "3-4-5 Triangle", description: "Common right triangle: 3² + 4² = 9 + 16 = 25 = 5². Also works with multiples like 6-8-10." },
    { title: "Diagonal of a Square", description: "Square side 10: diagonal = √(10² + 10²) = √200 ≈ 14.14." },
  ],
  "circle-calculator": [
    { title: "Pizza Math", description: "A 16-inch pizza has 4× the area of an 8-inch pizza! Area = πr², so doubling radius quadruples area." },
    { title: "Wheel Distance", description: "One wheel rotation = circumference = π × diameter. A 26\" bike wheel travels 81.7\" per rotation." },
  ],
  "volume-calculator": [
    { title: "Sphere Volume", description: "A basketball (9.4\" diameter) has volume = 4/3 × π × (4.7)³ ≈ 434.9 cubic inches." },
    { title: "Pool Volume", description: "Rectangular pool 20×10×5 feet = 1,000 cubic feet × 7.48 = 7,480 gallons." },
  ],
  "area-calculator": [
    { title: "Room Square Footage", description: "A 12×15 foot room = 180 square feet. Divide by 9 to get square yards for carpet." },
    { title: "Paint Coverage", description: "Walls 10ft high, 40ft perimeter = 400 sq ft. One gallon covers ~400 sq ft." },
  ],
  "slope-calculator": [
    { title: "Roof Pitch", description: "A 4:12 pitch means 4 inches rise per 12 inches run. Slope = 4/12 = 0.33 or 33%." },
    { title: "Wheelchair Ramps", description: "ADA requires max 1:12 slope (1\" rise per 12\" run) for accessibility." },
  ],
  "distance-calculator": [
    { title: "Map Distance", description: "Find distance between cities on a coordinate grid using √[(x₂-x₁)² + (y₂-y₁)²]." },
    { title: "Screen Diagonal", description: "A 1920×1080 screen diagonal = √(1920² + 1080²) = 2203 pixels ≈ 24\" at standard PPI." },
  ],
  "surface-area-calculator": [
    { title: "Gift Wrapping", description: "A 10×8×4 inch box needs: 2(80+40+32) = 304 sq inches of wrapping paper, plus extra for overlap." },
    { title: "Paint for Sphere", description: "Surface area of a ball radius 6\" = 4π(36) ≈ 452 sq inches to paint." },
  ],
  "right-triangle-calculator": [
    { title: "Ladder Safety", description: "For a 20ft ladder, set base 5ft from wall. Rise = √(20² - 5²) = √375 ≈ 19.4 ft reach." },
    { title: "Building Shadows", description: "A 30ft building casts a 40ft shadow. Angle of sun = arctan(30/40) ≈ 37°." },
  ],
  "matrix-calculator": [
    { title: "Graphics Transformations", description: "3D graphics use matrix multiplication to rotate, scale, and translate objects in games and animations." },
    { title: "Solving Systems", description: "A system of 3 equations with 3 unknowns can be solved using matrix operations - much faster than substitution!" },
  ],
  "sample-size-calculator": [
    { title: "Survey Planning", description: "For a school of 1000 students, you only need about 278 responses for 95% confidence with 5% margin of error." },
    { title: "Margin of Error", description: "Doubling your sample size doesn't halve your margin of error - it only reduces it by about 30%." },
  ],
  "confidence-interval-calculator": [
    { title: "Poll Results", description: "When news says '52% ± 3%', that's a confidence interval. The true value is likely between 49% and 55%." },
    { title: "Higher Confidence", description: "99% confidence is wider than 95% - you're more certain the true value is in a larger range." },
  ],
  "number-sequence-calculator": [
    { title: "Fibonacci Fun", description: "The Fibonacci sequence (1, 1, 2, 3, 5, 8...) appears in nature - spiral shells, flower petals, and more!" },
    { title: "Arithmetic vs Geometric", description: "Arithmetic adds a constant (2, 4, 6, 8). Geometric multiplies by a constant (2, 4, 8, 16)." },
  ],
  "statistics-calculator": [
    { title: "Outlier Detection", description: "Values beyond 1.5 × IQR from Q1 or Q3 are considered outliers - unusually high or low compared to most data." },
    { title: "Range vs IQR", description: "Range is affected by outliers. IQR (middle 50%) gives a more stable measure of spread." },
  ],
  "body-fat-calculator": [
    { title: "Healthy Ranges", description: "Essential fat is 2-5% for men, 10-13% for women. Athletes often maintain 6-13% (men) or 14-20% (women)." },
    { title: "Measurement Tips", description: "Measure at the narrowest point of your neck and widest part of your waist for accurate results." },
  ],
  "ideal-weight-calculator": [
    { title: "Multiple Formulas", description: "Different formulas give different results. The average of Robinson, Miller, Devine, and Hamwi is often most reliable." },
    { title: "Frame Size Matters", description: "Large-boned individuals may have healthy weights at the higher end of the range." },
  ],
  "water-intake-calculator": [
    { title: "8x8 Rule", description: "The '8 glasses of 8 oz' rule (about 2L) is a minimum. Active people in hot climates need much more." },
    { title: "Food Counts Too", description: "About 20% of daily water comes from food. Fruits and vegetables are 80-95% water!" },
  ],
  "loan-calculator": [
    { title: "Extra Payments", description: "An extra $100/month on a $200,000 mortgage at 4% saves over $26,000 in interest and 4+ years!" },
    { title: "APR vs Rate", description: "APR includes fees and shows true cost. A 3.5% rate with fees might be 3.7% APR." },
  ],
  "currency-converter": [
    { title: "Exchange Fee", description: "Banks and airports charge 3-10% markup. Online services typically have better rates." },
    { title: "Rate Fluctuation", description: "Exchange rates can change by 1-2% in a single day. Check rates before large transfers." },
  ],
  "weight-converter": [
    { title: "Kitchen Conversions", description: "1 pound = 16 ounces. A stick of butter (113g) = 4 oz = 1/4 lb." },
    { title: "Shipping Weights", description: "Carriers often round up. 1.1 lbs is charged as 2 lbs for shipping." },
  ],
  "area-converter": [
    { title: "House Sizes", description: "A typical US home is about 2,000 sq ft = 186 sq meters. A football field is about 1.32 acres." },
    { title: "Land Measurement", description: "1 acre = 43,560 sq ft, roughly the size of a football field (without end zones)." },
  ],
  "speed-converter": [
    { title: "Speed Limits", description: "60 mph ≈ 97 km/h. Round to 100 km/h when driving in countries using metric." },
    { title: "Sound and Light", description: "Sound travels at Mach 1 (1,235 km/h). Light is 880,000× faster at 299,792 km/s!" },
  ],
  "date-difference-calculator": [
    { title: "Age in Days", description: "A 30-year-old has lived roughly 10,950 days (30 × 365.25 for leap years)." },
    { title: "Relationship Milestones", description: "100 days, 6 months, 1 year - use this to plan anniversary celebrations!" },
  ],
  "days-until-calculator": [
    { title: "Goal Setting", description: "Set a target date for your goal and watch the countdown motivate you daily!" },
    { title: "Event Planning", description: "Start planning events at least 30-60 days before. Weddings need 6-12 months!" },
  ],
  "time-zone-converter": [
    { title: "Business Hours", description: "When it's 9 AM in New York, it's 2 PM in London, 10 PM in Tokyo, and 6 AM in Los Angeles." },
    { title: "International Calls", description: "Schedule calls during overlapping work hours. NY and London share 9 AM-12 PM NYC time." },
  ],
  "working-days-calculator": [
    { title: "Project Planning", description: "Always add 20% buffer to working day estimates for unexpected delays." },
    { title: "Vacation Days", description: "10 working days = 2 calendar weeks. Perfect for planning time off!" },
  ],
  "grade-calculator": [
    { title: "Weighted Importance", description: "A 50% weighted final exam has more impact than a 10% weighted quiz. Focus study time accordingly!" },
    { title: "What You Need", description: "If you have 85% with 60% of grades in, you need ~78% on remaining 40% to keep an 82% average." },
  ],
  "test-score-percentage": [
    { title: "Quick Mental Math", description: "For a 25-question test, each question is worth 4%. Miss 2 = 92%. Miss 5 = 80%." },
    { title: "Curve Calculation", description: "If teacher curves so highest score = 100%, add the difference to everyone's score." },
  ],
  "study-time-calculator": [
    { title: "Spaced Repetition", description: "Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. Better than cramming!" },
    { title: "Active vs Passive", description: "Active recall (testing yourself) is 2-3× more effective than re-reading notes." },
  ],
  "assignment-deadline-tracker": [
    { title: "Eat the Frog", description: "Do your hardest/most important task first thing. Everything else feels easier after!" },
    { title: "Buffer Time", description: "Plan to finish assignments 1-2 days early. Tech problems and surprises happen." },
  ],
};

const calculatorFAQs: Record<string, FAQItem[]> = {
  "percentage-calculator": [
    { question: "How do I calculate percentage increase?", answer: "To calculate percentage increase, subtract the original value from the new value, divide by the original value, and multiply by 100. For example, if a price goes from $100 to $125, the increase is (125-100)/100 × 100 = 25%." },
    { question: "What is the difference between percentage and percentile?", answer: "A percentage represents a portion out of 100, while a percentile indicates the value below which a given percentage of observations fall. For example, being in the 90th percentile means you scored higher than 90% of the group." },
    { question: "How do I find what percentage one number is of another?", answer: "Divide the smaller number by the larger number and multiply by 100. For example, 25 is what percent of 200? (25/200) × 100 = 12.5%." },
  ],
  "bmi-calculator": [
    { question: "What is a healthy BMI range?", answer: "A healthy BMI is generally considered to be between 18.5 and 24.9. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is considered obese. However, BMI doesn't account for muscle mass or body composition." },
    { question: "Is BMI accurate for athletes?", answer: "BMI may not be accurate for athletes or people with high muscle mass, as muscle weighs more than fat. Athletes may have a high BMI but low body fat percentage. Other measurements like body fat percentage may be more useful." },
    { question: "How often should I check my BMI?", answer: "Checking your BMI once a month is usually sufficient for tracking progress. More frequent checks aren't necessary as weight can fluctuate daily due to water retention and other factors." },
  ],
  "mortgage-calculator": [
    { question: "What is included in a mortgage payment?", answer: "A mortgage payment typically includes principal (loan amount), interest, property taxes, and homeowner's insurance (PITI). Some loans also include private mortgage insurance (PMI) if your down payment is less than 20%." },
    { question: "How much house can I afford?", answer: "A common guideline is that your monthly housing costs shouldn't exceed 28% of your gross monthly income. This includes mortgage payment, taxes, and insurance. Your total debt payments shouldn't exceed 36% of income." },
    { question: "Should I get a 15-year or 30-year mortgage?", answer: "A 15-year mortgage has higher monthly payments but lower total interest. A 30-year mortgage has lower monthly payments but more interest over time. Choose based on your monthly budget and long-term financial goals." },
  ],
  "fraction-calculator": [
    { question: "How do I add fractions with different denominators?", answer: "First, find a common denominator (the LCM of both denominators). Convert each fraction to have this denominator, then add the numerators. For example, 1/4 + 1/3: common denominator is 12, so 3/12 + 4/12 = 7/12." },
    { question: "What does it mean to simplify a fraction?", answer: "Simplifying means dividing both the numerator and denominator by their greatest common factor (GCF) until they can't be divided further. For example, 8/12 ÷ 4 = 2/3." },
    { question: "Can all decimals be converted to fractions?", answer: "Terminating decimals and repeating decimals can be converted to fractions. For example, 0.5 = 1/2 and 0.333... = 1/3. Non-repeating decimals like π cannot be expressed as exact fractions." },
  ],
  "quadratic-formula-calculator": [
    { question: "What is the quadratic formula?", answer: "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. It solves any equation in the form ax² + bx + c = 0 and always gives you the roots (solutions) of the quadratic equation." },
    { question: "What does the discriminant tell us?", answer: "The discriminant (b²-4ac) tells us the nature of solutions: if positive, there are two real solutions; if zero, there's one repeated solution; if negative, there are two complex (imaginary) solutions." },
    { question: "When should I use the quadratic formula?", answer: "Use it when an equation can't be easily factored. It works for all quadratic equations and is especially useful for equations with non-integer or irrational solutions." },
  ],
  "pythagorean-theorem-calculator": [
    { question: "What is the Pythagorean theorem?", answer: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (longest side) equals the sum of squares of the other two sides: a² + b² = c². It only works for right triangles (those with a 90° angle)." },
    { question: "How do I know which side is the hypotenuse?", answer: "The hypotenuse is always the longest side and is opposite to the right angle (90°). If you're solving for a missing side, the hypotenuse is 'c' in the formula a² + b² = c²." },
    { question: "What are Pythagorean triples?", answer: "Pythagorean triples are sets of three whole numbers that satisfy a² + b² = c². Common examples include (3,4,5), (5,12,13), (8,15,17), and (7,24,25). Any multiple of a triple is also a triple." },
  ],
  "circle-calculator": [
    { question: "What is pi (π)?", answer: "Pi (π) is the ratio of a circle's circumference to its diameter, approximately 3.14159. It's an irrational number, meaning its decimal representation never ends or repeats. We use π in all circle formulas." },
    { question: "What's the difference between radius and diameter?", answer: "The radius is the distance from the center of the circle to any point on its edge. The diameter is the distance across the circle through its center, so diameter = 2 × radius." },
    { question: "How do I find the area of a circle?", answer: "Area = πr², where r is the radius. For example, a circle with radius 5 has area = π × 5² = 25π ≈ 78.54 square units." },
  ],
  "standard-deviation-calculator": [
    { question: "What does standard deviation measure?", answer: "Standard deviation measures how spread out numbers are from the average (mean). A low standard deviation means data points are clustered close to the mean, while a high standard deviation means they're spread far apart." },
    { question: "What's the difference between sample and population standard deviation?", answer: "Population SD uses N (total count) in the formula for when you have data from the entire group. Sample SD uses N-1 to account for the fact that a sample underestimates the true variation, making it slightly larger." },
    { question: "How is variance related to standard deviation?", answer: "Variance is the square of standard deviation. Standard deviation is easier to interpret because it's in the same units as your data, while variance is in squared units." },
  ],
};

const defaultFAQs: FAQItem[] = [
  { question: "How accurate are these calculations?", answer: "Our calculators use industry-standard formulas and are regularly tested for accuracy. All calculations are performed locally in your browser for instant results." },
  { question: "Is my data saved anywhere?", answer: "No, we don't store any of your calculation data on our servers. All calculations happen in your browser. You can optionally save results to your browser's local storage." },
  { question: "Can I use these calculators on mobile?", answer: "Yes! All our calculators are fully responsive and work great on smartphones, tablets, and desktop computers." },
  { question: "Are these calculators free to use?", answer: "Absolutely! All calculators on The Calc Universe are 100% free with no hidden fees or signup required." },
];

const defaultHowToUse: HowToUse = {
  steps: [
    "Enter your values in the input fields provided above.",
    "Click the 'Calculate' button to see your results.",
    "Review the results displayed with step-by-step explanations.",
    "Use the Share or Print buttons to save your calculations.",
    "Try different values to compare results and learn the concepts.",
  ],
};

const defaultTipsExamples: TipExample[] = [
  { title: "Start Simple", description: "Try a few example calculations first to understand how the calculator works before using your own data." },
  { title: "Check Your Work", description: "Use the step-by-step breakdown to verify your calculations match what you expect and to learn the underlying formulas." },
];

export default function CalculatorPage() {
  const [, params] = useRoute("/:categoryId/:calculatorId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState<"prompt" | "success">("prompt");
  
  const categoryId = params?.categoryId;
  const calculatorId = params?.calculatorId;

  const calculator = calculatorId ? getCalculatorById(calculatorId) : undefined;
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  // Detect platform for keyboard shortcut
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const bookmarkShortcut = isMac ? '⌘+D' : 'Ctrl+D';

  if (!calculator || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Calculator Not Found</h1>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const faqs = calculatorFAQs[calculatorId || ""] || defaultFAQs;
  const howToUse = calculatorHowToUse[calculatorId || ""] || defaultHowToUse;
  const tipsExamples = calculatorTipsExamples[calculatorId || ""] || defaultTipsExamples;
  
  const { history } = useCalculatorHistory(calculatorId);

  const handleShare = async () => {
    // Get the most recent calculation to share
    const recentCalc = history[0];
    
    if (!recentCalc) {
      // No calculations yet, share the calculator link
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied!", description: "Calculator link copied to clipboard. Do a calculation first to share results!" });
      } catch {
        toast({ title: "Share", description: "Do a calculation first to share results." });
      }
      return;
    }

    // Format the calculation for sharing
    const inputsText = Object.entries(recentCalc.inputs)
      .map(([key, value]) => {
        const cleanKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
        return `${cleanKey}: ${value}`;
      })
      .join("\n");

    let shareText = `📊 ${recentCalc.calculatorName}\n\n`;
    shareText += `📝 Inputs:\n${inputsText}\n\n`;
    shareText += `✅ Result: ${recentCalc.result}\n`;

    if (recentCalc.formula) {
      shareText += `\n📐 Formula: ${recentCalc.formula}\n`;
    }

    if (recentCalc.steps && recentCalc.steps.length > 0) {
      shareText += `\n📖 Step-by-Step:\n`;
      recentCalc.steps.forEach((step) => {
        shareText += `• ${step.label}: ${step.value}\n`;
      });
    }

    shareText += `\n🔗 Try it yourself: ${window.location.href}`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast({ title: "Calculation copied!", description: "Calculation with steps copied to clipboard." });
    } catch {
      toast({ title: "Share failed", description: "Could not copy to clipboard." });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setBookmarkStatus("prompt");
    setBookmarkDialogOpen(true);
  };

  const handleBookmarkDone = () => {
    setBookmarkStatus("success");
    setTimeout(() => {
      setBookmarkDialogOpen(false);
      setBookmarkStatus("prompt");
    }, 1500);
  };

  const handleCalculatorSelect = (calc: CalculatorInfo) => {
    setLocation(`/${calc.categoryId}/${calc.id}`);
  };

  const canonicalUrl = `https://thecalcuniverse.com/${category.id}/${calculator.id}`;
  
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      generateCalculatorSchema({
        name: calculator.name,
        description: calculator.description,
        url: canonicalUrl,
      }),
      generateBreadcrumbSchema([
        { name: "Home", url: "https://thecalcuniverse.com" },
        { name: category.name, url: `https://thecalcuniverse.com/${category.id}` },
        { name: calculator.name, url: canonicalUrl },
      ]),
      generateFAQSchema(faqs),
    ],
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <SEOHead
        title={calculator.name}
        description={calculator.description}
        canonicalUrl={canonicalUrl}
        structuredData={combinedSchema}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="print:hidden">
          <Breadcrumbs
            items={[
              { label: category.name, href: `/${category.id}` },
              { label: calculator.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <main>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-3">{calculator.name}</h1>
              <p className="text-muted-foreground">{calculator.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 print:hidden">
              <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} data-testid="button-save">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            <LazyCalculator calculatorId={calculatorId || ""} />

            {/* Print footer */}
            <div className="hidden print:block mt-6 pt-4 border-t text-sm text-gray-500">
              <p>Calculator: {window.location.href}</p>
              <p>Printed: {new Date().toLocaleDateString()}</p>
              <p>Powered by The Calc Universe — thecalcuniverse.com</p>
            </div>

            {/* Screen-only history section */}
            <div className="print:hidden">
              <CalculatorHistory calculatorId={calculatorId} maxItems={5} />
            </div>

            <section className="mt-12 print:hidden">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Use This Calculator
              </h2>
              <Card>
                <CardContent className="p-6">
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                    {howToUse.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12 print:hidden">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Tips & Real-World Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tipsExamples.map((tip, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <div className="print:hidden">
              <FAQSection faqs={faqs} />
            </div>

            <div className="print:hidden">
              <EmbedWidget 
                calculatorId={calculatorId || ""} 
                calculatorName={calculator.name}
                categoryId={categoryId || ""}
              />
            </div>
          </main>

          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-20">
              <RelatedCalculators
                calculatorId={calculator.id}
                onSelectCalculator={handleCalculatorSelect}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Bookmark Dialog */}
      <Dialog open={bookmarkDialogOpen} onOpenChange={setBookmarkDialogOpen}>
        <DialogContent className="max-w-sm w-[calc(100%-2rem)] overflow-hidden" data-testid="dialog-bookmark">
          {bookmarkStatus === "prompt" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookmarkPlus className="h-5 w-5" />
                  Add to Bookmarks
                </DialogTitle>
                <DialogDescription>
                  Would you like to bookmark this calculator for quick access?
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-4 bg-muted/50 rounded-lg my-4 overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Keyboard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">Press {bookmarkShortcut}</p>
                    <p className="text-xs text-muted-foreground">to add this calculator to your bookmarks</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-background p-2 rounded border font-mono overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full">
                  {window.location.href}
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button variant="outline" onClick={() => setBookmarkDialogOpen(false)} data-testid="button-bookmark-cancel">
                  Cancel
                </Button>
                <Button onClick={handleBookmarkDone} data-testid="button-bookmark-done">
                  <Check className="h-4 w-4 mr-2" />
                  I've Bookmarked It
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 justify-center">
                  <Check className="h-5 w-5 text-green-500" />
                  Bookmarked!
                </DialogTitle>
                <DialogDescription className="text-center">
                  You can now access this calculator from your browser bookmarks.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
