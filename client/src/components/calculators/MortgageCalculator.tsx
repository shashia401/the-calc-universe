import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";
import { 
  Home, DollarSign, Percent, Calendar, TrendingDown, ChevronDown, ChevronUp,
  Shield, Building2, Receipt, Settings2, HelpCircle, Info
} from "lucide-react";

interface MortgageResult {
  monthlyPayment: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  monthlyOther: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  schedule: AmortizationEntry[];
  yearlySchedule: YearlyEntry[];
  pmiDropoffMonth: number | null;
}

interface AmortizationEntry {
  month: number;
  date: string;
  payment: number;
  principalInterest: number;
  principal: number;
  interest: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  other: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
  ltvPercent: number;
}

interface YearlyEntry {
  year: number;
  yearLabel: string;
  principalPaid: number;
  interestPaid: number;
  taxesPaid: number;
  insurancePaid: number;
  pmiPaid: number;
  hoaPaid: number;
  otherPaid: number;
  totalPaid: number;
  endingBalance: number;
  startingBalance: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MortgageCalculator() {
  const currentDate = new Date();
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [downPaymentType, setDownPaymentType] = useState<"dollar" | "percent">("percent");
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState("");
  const [startMonth, setStartMonth] = useState(String(currentDate.getMonth()));
  const [startYear, setStartYear] = useState(String(currentDate.getFullYear()));
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.2");
  const [homeInsurance, setHomeInsurance] = useState("1500");
  const [pmiRate, setPmiRate] = useState("0.5");
  const [hoaFee, setHoaFee] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }, []);

  const calculate = () => {
    const price = parseFloat(homePrice);
    const termYears = parseInt(loanTerm);
    const rate = parseFloat(interestRate);
    const taxRate = parseFloat(propertyTaxRate) || 0;
    const insurance = parseFloat(homeInsurance) || 0;
    const pmi = parseFloat(pmiRate) || 0;
    const hoa = parseFloat(hoaFee) || 0;
    const other = parseFloat(otherCosts) || 0;
    
    let down: number;
    if (downPaymentType === "percent") {
      down = (parseFloat(downPayment) / 100) * price;
    } else {
      down = parseFloat(downPayment);
    }

    if (price > 0 && down >= 0 && termYears > 0 && rate >= 0) {
      const principal = price - down;
      const monthlyRate = rate / 100 / 12;
      const numPayments = termYears * 12;
      const downPaymentPercent = (down / price) * 100;

      let monthlyPrincipalInterest: number;
      if (rate === 0) {
        monthlyPrincipalInterest = principal / numPayments;
      } else {
        monthlyPrincipalInterest =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
      }

      const monthlyPropertyTax = (price * (taxRate / 100)) / 12;
      const monthlyInsurance = insurance / 12;
      const monthlyHOA = hoa;
      const monthlyOther = other / 12;
      
      const needsPMI = downPaymentPercent < 20;
      const monthlyPMIBase = needsPMI ? (principal * (pmi / 100)) / 12 : 0;

      const schedule: AmortizationEntry[] = [];
      let balance = principal;
      let cumulativePrincipal = 0;
      let cumulativeInterest = 0;
      let pmiDropoffMonth: number | null = null;
      const startMonthNum = parseInt(startMonth);
      const startYearNum = parseInt(startYear);

      for (let month = 1; month <= numPayments; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPrincipalInterest - interestPayment;
        
        const ltvPercent = (balance / price) * 100;
        const currentPMI = ltvPercent > 80 ? monthlyPMIBase : 0;
        
        if (pmiDropoffMonth === null && ltvPercent <= 80 && needsPMI) {
          pmiDropoffMonth = month;
        }
        
        const totalPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + currentPMI + monthlyHOA + monthlyOther;
        
        balance -= principalPayment;
        cumulativePrincipal += principalPayment;
        cumulativeInterest += interestPayment;

        const paymentDate = new Date(startYearNum, startMonthNum + month - 1, 1);
        const dateStr = `${SHORT_MONTHS[paymentDate.getMonth()]} ${paymentDate.getFullYear()}`;

        schedule.push({
          month,
          date: dateStr,
          payment: totalPayment,
          principalInterest: monthlyPrincipalInterest,
          principal: principalPayment,
          interest: interestPayment,
          propertyTax: monthlyPropertyTax,
          insurance: monthlyInsurance,
          pmi: currentPMI,
          hoa: monthlyHOA,
          other: monthlyOther,
          balance: Math.max(0, balance),
          totalPrincipal: cumulativePrincipal,
          totalInterest: cumulativeInterest,
          ltvPercent,
        });
      }

      const yearlySchedule: YearlyEntry[] = [];
      for (let year = 1; year <= termYears; year++) {
        const startIdx = (year - 1) * 12;
        const endIdx = year * 12;
        const yearPayments = schedule.slice(startIdx, endIdx);
        
        const principalPaid = yearPayments.reduce((sum, p) => sum + p.principal, 0);
        const interestPaid = yearPayments.reduce((sum, p) => sum + p.interest, 0);
        const taxesPaid = yearPayments.reduce((sum, p) => sum + p.propertyTax, 0);
        const insurancePaid = yearPayments.reduce((sum, p) => sum + p.insurance, 0);
        const pmiPaid = yearPayments.reduce((sum, p) => sum + p.pmi, 0);
        const hoaPaid = yearPayments.reduce((sum, p) => sum + p.hoa, 0);
        const otherPaid = yearPayments.reduce((sum, p) => sum + p.other, 0);
        const startingBalance = startIdx === 0 ? principal : schedule[startIdx - 1].balance;
        const endingBalance = yearPayments[yearPayments.length - 1]?.balance || 0;

        const firstPaymentDate = new Date(startYearNum, startMonthNum + startIdx, 1);
        const lastPaymentDate = new Date(startYearNum, startMonthNum + endIdx - 1, 1);
        const yearLabel = `Year ${year} (${SHORT_MONTHS[firstPaymentDate.getMonth()]} ${firstPaymentDate.getFullYear()} - ${SHORT_MONTHS[lastPaymentDate.getMonth()]} ${lastPaymentDate.getFullYear()})`;

        yearlySchedule.push({
          year,
          yearLabel,
          principalPaid,
          interestPaid,
          taxesPaid,
          insurancePaid,
          pmiPaid,
          hoaPaid,
          otherPaid,
          totalPaid: principalPaid + interestPaid + taxesPaid + insurancePaid + pmiPaid + hoaPaid + otherPaid,
          startingBalance,
          endingBalance,
        });
      }

      const totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0);
      const totalPayment = schedule.reduce((sum, p) => sum + p.payment, 0);
      
      const firstMonthPMI = schedule[0]?.pmi || 0;

      setResult({
        monthlyPayment: schedule[0]?.payment || 0,
        monthlyPrincipalInterest,
        monthlyPropertyTax,
        monthlyInsurance,
        monthlyPMI: firstMonthPMI,
        monthlyHOA,
        monthlyOther,
        totalPayment,
        totalInterest,
        principal,
        schedule,
        yearlySchedule,
        pmiDropoffMonth,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyPrecise = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const pieData = useMemo(() => {
    if (!result) return [];
    const data = [
      { name: "Principal & Interest", value: result.monthlyPrincipalInterest, color: "hsl(var(--primary))" },
    ];
    if (result.monthlyPropertyTax > 0) {
      data.push({ name: "Property Tax", value: result.monthlyPropertyTax, color: "hsl(220, 70%, 50%)" });
    }
    if (result.monthlyInsurance > 0) {
      data.push({ name: "Insurance", value: result.monthlyInsurance, color: "hsl(150, 60%, 45%)" });
    }
    if (result.monthlyPMI > 0) {
      data.push({ name: "PMI", value: result.monthlyPMI, color: "hsl(45, 90%, 50%)" });
    }
    if (result.monthlyHOA > 0) {
      data.push({ name: "HOA", value: result.monthlyHOA, color: "hsl(280, 60%, 55%)" });
    }
    if (result.monthlyOther > 0) {
      data.push({ name: "Other", value: result.monthlyOther, color: "hsl(0, 0%, 50%)" });
    }
    return data;
  }, [result]);

  const paymentBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Principal & Interest", value: result.monthlyPrincipalInterest, color: "hsl(var(--primary))" },
      { name: "Property Tax", value: result.monthlyPropertyTax, color: "hsl(220, 70%, 50%)" },
      { name: "Insurance", value: result.monthlyInsurance, color: "hsl(150, 60%, 45%)" },
      { name: "PMI", value: result.monthlyPMI, color: "hsl(45, 90%, 50%)" },
      { name: "HOA", value: result.monthlyHOA, color: "hsl(280, 60%, 55%)" },
      { name: "Other", value: result.monthlyOther, color: "hsl(0, 0%, 50%)" },
    ].filter(item => item.value > 0);
  }, [result]);

  const balanceChartData = useMemo(() => {
    if (!result) return [];
    return result.yearlySchedule.map((entry) => ({
      year: `Y${entry.year}`,
      balance: Math.round(entry.endingBalance),
      principalPaid: Math.round(entry.principalPaid),
      interestPaid: Math.round(entry.interestPaid),
    }));
  }, [result]);

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const getMonthsForYear = (year: number) => {
    if (!result) return [];
    const startMonth = (year - 1) * 12;
    const endMonth = year * 12;
    return result.schedule.slice(startMonth, endMonth);
  };

  const downPaymentPercent = useMemo(() => {
    if (!homePrice || !downPayment) return 0;
    const price = parseFloat(homePrice);
    if (downPaymentType === "percent") {
      return parseFloat(downPayment);
    }
    return (parseFloat(downPayment) / price) * 100;
  }, [homePrice, downPayment, downPaymentType]);

  const Tooltip_Label = ({ label }: { label: string }) => (
    <span className="inline-flex items-center gap-1 cursor-help" title={label}>
      <HelpCircle className="h-3 w-3 text-muted-foreground" />
    </span>
  );

  return (
    <div className="space-y-6" data-testid="calculator-mortgage">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Mortgage Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="home-price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Home Price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="home-price"
                type="number"
                placeholder="400,000"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                className="pl-7"
                data-testid="input-home-price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="down-payment" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              Down Payment
              <Tooltip_Label label="The amount you pay upfront. 20% or more avoids PMI." />
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {downPaymentType === "dollar" ? "$" : ""}
                </span>
                <Input
                  id="down-payment"
                  type="number"
                  placeholder={downPaymentType === "dollar" ? "80,000" : "20"}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className={downPaymentType === "dollar" ? "pl-7" : ""}
                  data-testid="input-down-payment"
                />
                {downPaymentType === "percent" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                )}
              </div>
              <Select value={downPaymentType} onValueChange={(v) => setDownPaymentType(v as "dollar" | "percent")}>
                <SelectTrigger className="w-20" data-testid="select-down-payment-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dollar">$</SelectItem>
                  <SelectItem value="percent">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {homePrice && downPayment && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{downPaymentPercent.toFixed(1)}% of home price</span>
                {downPaymentPercent < 20 && (
                  <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                    PMI Required
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan-term" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Loan Term
                <Tooltip_Label label="How long you'll pay off the mortgage" />
              </Label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger data-testid="select-loan-term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 years</SelectItem>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="30">30 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Interest Rate
                <Tooltip_Label label="Annual interest rate from your lender" />
              </Label>
              <div className="relative">
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.125"
                  placeholder="6.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="pr-7"
                  data-testid="input-interest-rate"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Start Date
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={startMonth} onValueChange={setStartMonth}>
                <SelectTrigger data-testid="select-start-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={startYear} onValueChange={setStartYear}>
                <SelectTrigger data-testid="select-start-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between" data-testid="button-toggle-advanced">
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Taxes & Insurance
                </span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm text-blue-800 dark:text-blue-200 flex gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>These costs are added to your monthly payment. They don't affect your loan amount.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-tax" className="flex items-center gap-2 text-sm">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    Property Tax
                    <Tooltip_Label label="Annual tax based on home value, varies by location" />
                  </Label>
                  <div className="relative">
                    <Input
                      id="property-tax"
                      type="number"
                      step="0.1"
                      placeholder="1.2"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(e.target.value)}
                      className="pr-7"
                      data-testid="input-property-tax"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">per year of home value</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="home-insurance" className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Home Insurance
                    <Tooltip_Label label="Annual homeowner's insurance premium" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="home-insurance"
                      type="number"
                      placeholder="1,500"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(e.target.value)}
                      className="pl-7"
                      data-testid="input-home-insurance"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">per year</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pmi-rate" className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    PMI Rate
                    <Tooltip_Label label="Private Mortgage Insurance, required if down payment < 20%" />
                  </Label>
                  <div className="relative">
                    <Input
                      id="pmi-rate"
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      value={pmiRate}
                      onChange={(e) => setPmiRate(e.target.value)}
                      className="pr-7"
                      disabled={downPaymentPercent >= 20}
                      data-testid="input-pmi-rate"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {downPaymentPercent >= 20 ? "Not required (20%+ down)" : "per year of loan amount"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hoa-fee" className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    HOA Fee
                    <Tooltip_Label label="Homeowners Association fee, if applicable" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="hoa-fee"
                      type="number"
                      placeholder="0"
                      value={hoaFee}
                      onChange={(e) => setHoaFee(e.target.value)}
                      className="pl-7"
                      data-testid="input-hoa-fee"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-costs" className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Other Annual Costs
                  <Tooltip_Label label="Maintenance, utilities, or other recurring costs" />
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="other-costs"
                    type="number"
                    placeholder="0"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(e.target.value)}
                    className="pl-7"
                    data-testid="input-other-costs"
                  />
                </div>
                <p className="text-xs text-muted-foreground">per year</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={calculate} className="w-full" size="lg" data-testid="button-calculate">
            Calculate Mortgage
          </Button>
        </CardContent>
      </Card>

      {result !== null && (
        <>
          <Card data-testid="result-mortgage">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">Total Monthly Payment</p>
                <p className="text-5xl font-bold text-primary" data-testid="text-monthly-payment">
                  {formatCurrency(result.monthlyPayment)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Starting {MONTHS[parseInt(startMonth)]} {startYear} for {loanTerm} years
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Principal & Interest</p>
                  <p className="text-sm font-semibold">{formatCurrency(result.monthlyPrincipalInterest)}</p>
                </div>
                {result.monthlyPropertyTax > 0 && (
                  <div className="text-center p-3 bg-blue-100 dark:bg-blue-950/50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Property Tax</p>
                    <p className="text-sm font-semibold">{formatCurrency(result.monthlyPropertyTax)}</p>
                  </div>
                )}
                {result.monthlyInsurance > 0 && (
                  <div className="text-center p-3 bg-green-100 dark:bg-green-950/50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Insurance</p>
                    <p className="text-sm font-semibold">{formatCurrency(result.monthlyInsurance)}</p>
                  </div>
                )}
                {result.monthlyPMI > 0 && (
                  <div className="text-center p-3 bg-amber-100 dark:bg-amber-950/50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-0.5">PMI</p>
                    <p className="text-sm font-semibold">{formatCurrency(result.monthlyPMI)}</p>
                  </div>
                )}
                {result.monthlyHOA > 0 && (
                  <div className="text-center p-3 bg-purple-100 dark:bg-purple-950/50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-0.5">HOA</p>
                    <p className="text-sm font-semibold">{formatCurrency(result.monthlyHOA)}</p>
                  </div>
                )}
                {result.monthlyOther > 0 && (
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Other</p>
                    <p className="text-sm font-semibold">{formatCurrency(result.monthlyOther)}</p>
                  </div>
                )}
              </div>

              {result.pmiDropoffMonth && (
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-sm text-green-800 dark:text-green-200 text-center">
                  <span className="font-medium">PMI drops off at payment #{result.pmiDropoffMonth}</span>
                  {" "}when your loan-to-value reaches 80%
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                  <p className="text-lg font-semibold" data-testid="text-loan-amount">{formatCurrency(result.principal)}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                  <p className="text-lg font-semibold text-destructive" data-testid="text-total-interest">{formatCurrency(result.totalInterest)}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total of All Payments</p>
                  <p className="text-lg font-semibold" data-testid="text-total-payment">{formatCurrency(result.totalPayment)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-center">Monthly Payment Breakdown</h4>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          align="right" 
                          verticalAlign="middle"
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3 text-center">Loan Balance Over Time</h4>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={balanceChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.2}
                          name="Remaining Balance"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Yearly Principal vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={balanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="principalPaid" name="Principal" fill="hsl(var(--primary))" stackId="a" />
                    <Bar dataKey="interestPaid" name="Interest" fill="hsl(var(--destructive))" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle className="text-lg">Amortization Schedule</CardTitle>
                <Tabs value={scheduleView} onValueChange={(v) => setScheduleView(v as "yearly" | "monthly")}>
                  <TabsList>
                    <TabsTrigger value="yearly" data-testid="tab-yearly">Yearly</TabsTrigger>
                    <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {scheduleView === "yearly" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/50 rounded-lg">
                    <div className="col-span-2">Year</div>
                    <div className="text-right">Principal</div>
                    <div className="text-right">Interest</div>
                    <div className="text-right">Total Paid</div>
                    <div className="text-right">Balance</div>
                  </div>
                  {result.yearlySchedule.map((entry) => (
                    <div key={entry.year}>
                      <div 
                        className="grid grid-cols-6 gap-2 text-sm px-3 py-3 rounded-lg hover-elevate cursor-pointer border border-transparent hover:border-border"
                        onClick={() => toggleYear(entry.year)}
                        data-testid={`row-year-${entry.year}`}
                      >
                        <div className="col-span-2 flex items-center gap-2 font-medium">
                          {expandedYears.has(entry.year) ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{entry.yearLabel}</span>
                        </div>
                        <div className="text-right text-primary">{formatCurrency(entry.principalPaid)}</div>
                        <div className="text-right text-destructive">{formatCurrency(entry.interestPaid)}</div>
                        <div className="text-right">{formatCurrency(entry.totalPaid)}</div>
                        <div className="text-right font-medium">{formatCurrency(entry.endingBalance)}</div>
                      </div>
                      
                      {expandedYears.has(entry.year) && (
                        <div className="ml-6 mt-2 mb-4 border-l-2 border-muted pl-4 overflow-x-auto">
                          <div className="min-w-[600px]">
                            <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground px-2 py-1">
                              <div>Date</div>
                              <div className="text-right">Principal</div>
                              <div className="text-right">Interest</div>
                              <div className="text-right">Tax</div>
                              <div className="text-right">Insurance</div>
                              <div className="text-right">PMI</div>
                              <div className="text-right">Payment</div>
                              <div className="text-right">Balance</div>
                            </div>
                            {getMonthsForYear(entry.year).map((month) => (
                              <div 
                                key={month.month} 
                                className="grid grid-cols-8 gap-2 text-xs px-2 py-1.5 hover:bg-muted/30 rounded"
                                data-testid={`row-month-${month.month}`}
                              >
                                <div className="font-medium">{month.date}</div>
                                <div className="text-right text-primary">{formatCurrencyPrecise(month.principal)}</div>
                                <div className="text-right text-destructive">{formatCurrencyPrecise(month.interest)}</div>
                                <div className="text-right">{formatCurrencyPrecise(month.propertyTax)}</div>
                                <div className="text-right">{formatCurrencyPrecise(month.insurance)}</div>
                                <div className="text-right">{month.pmi > 0 ? formatCurrencyPrecise(month.pmi) : "-"}</div>
                                <div className="text-right font-medium">{formatCurrencyPrecise(month.payment)}</div>
                                <div className="text-right">{formatCurrencyPrecise(month.balance)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/50 rounded-lg sticky top-0">
                      <div>Date</div>
                      <div className="text-right">Principal</div>
                      <div className="text-right">Interest</div>
                      <div className="text-right">Tax</div>
                      <div className="text-right">Insurance</div>
                      <div className="text-right">PMI</div>
                      <div className="text-right">Total</div>
                      <div className="text-right">Balance</div>
                    </div>
                    <div className="space-y-0.5 mt-2">
                      {result.schedule.map((entry) => (
                        <div 
                          key={entry.month} 
                          className="grid grid-cols-8 gap-2 text-xs px-3 py-2 hover:bg-muted/30 rounded"
                          data-testid={`row-payment-${entry.month}`}
                        >
                          <div className="font-medium">{entry.date}</div>
                          <div className="text-right text-primary">{formatCurrencyPrecise(entry.principal)}</div>
                          <div className="text-right text-destructive">{formatCurrencyPrecise(entry.interest)}</div>
                          <div className="text-right">{formatCurrencyPrecise(entry.propertyTax)}</div>
                          <div className="text-right">{formatCurrencyPrecise(entry.insurance)}</div>
                          <div className="text-right">{entry.pmi > 0 ? formatCurrencyPrecise(entry.pmi) : "-"}</div>
                          <div className="text-right font-medium">{formatCurrencyPrecise(entry.payment)}</div>
                          <div className="text-right">{formatCurrencyPrecise(entry.balance)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">How We Calculated This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">The Mortgage Payment Formula</h4>
                <div className="font-mono text-lg text-center py-3 bg-background rounded border">
                  M = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> - 1]
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-mono font-bold">M</span> = Monthly payment (principal + interest)</div>
                  <div><span className="font-mono font-bold">P</span> = Principal (loan amount)</div>
                  <div><span className="font-mono font-bold">r</span> = Monthly interest rate</div>
                  <div><span className="font-mono font-bold">n</span> = Total number of payments</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Property Taxes
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Property taxes are calculated as a percentage of your home's value. 
                    The formula is: <span className="font-mono">Home Price × Tax Rate ÷ 12</span>
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Home Insurance
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Homeowner's insurance protects your home against damage. 
                    We divide your annual premium by 12 to get the monthly cost.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    PMI (Private Mortgage Insurance)
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Required when your down payment is less than 20%. PMI protects the lender if you default. 
                    It automatically drops off when your loan-to-value ratio reaches 80%.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    HOA Fees
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    If your property is in a homeowners association, you'll pay monthly dues 
                    for shared amenities and community maintenance.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Understanding Amortization</h4>
                <p className="text-sm text-muted-foreground">
                  Amortization is how your loan is paid off over time. In the early years, most of your 
                  payment goes toward interest. As you pay down the principal, more of each payment goes 
                  toward the loan balance. This is why the stacked bar chart shows interest (red) 
                  decreasing and principal (blue) increasing over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
