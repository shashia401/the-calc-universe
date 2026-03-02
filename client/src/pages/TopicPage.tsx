import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import { Calculator, BookOpen, ChevronRight, Lightbulb, GraduationCap } from "lucide-react";
import { getAllCalculators, getCategoryById, type CalculatorInfo } from "@/lib/calculatorData";

const topicContent: Record<string, {
  title: string;
  description: string;
  categoryId: string;
  introduction: string;
  sections: { title: string; content: string; formula?: string }[];
  keyTerms: { term: string; definition: string }[];
  realWorldExamples: { title: string; description: string }[];
  relatedCalculators: string[];
}> = {
  "percentages-guide": {
    title: "Complete Guide to Percentages",
    description: "Learn everything about percentages: how to calculate, convert, and apply them in real life.",
    categoryId: "math",
    introduction: "Percentages are everywhere in our daily lives - from shopping discounts to test scores, from interest rates to nutritional labels. Understanding percentages is a fundamental math skill that helps you make better decisions about money, health, and more.",
    sections: [
      {
        title: "What is a Percentage?",
        content: "A percentage is a way of expressing a number as a fraction of 100. The word 'percent' comes from Latin 'per centum' meaning 'by the hundred'. When we say 50%, we mean 50 out of 100, or half.",
        formula: "Percentage = (Part / Whole) x 100"
      },
      {
        title: "Converting Between Fractions, Decimals, and Percentages",
        content: "To convert a decimal to a percentage, multiply by 100. To convert a percentage to a decimal, divide by 100. For example, 0.75 = 75% and 25% = 0.25. To convert a fraction to a percentage, first divide the numerator by the denominator, then multiply by 100.",
      },
      {
        title: "Finding a Percentage of a Number",
        content: "To find what X% of a number is, multiply the number by X and divide by 100. For example, to find 20% of 150: (150 x 20) / 100 = 30.",
        formula: "Result = (Number x Percentage) / 100"
      },
      {
        title: "Percentage Increase and Decrease",
        content: "To calculate percentage change, find the difference between the new and old values, divide by the old value, and multiply by 100. A positive result means an increase; a negative result means a decrease.",
        formula: "% Change = ((New - Old) / Old) x 100"
      }
    ],
    keyTerms: [
      { term: "Percent", definition: "A ratio expressed as a fraction of 100" },
      { term: "Base", definition: "The original amount or whole number" },
      { term: "Rate", definition: "The percentage being calculated" },
      { term: "Percentage Point", definition: "The difference between two percentages" }
    ],
    realWorldExamples: [
      { title: "Shopping Discounts", description: "A shirt originally costs $40 and is 25% off. The discount is $40 x 0.25 = $10, so you pay $30." },
      { title: "Test Scores", description: "If you got 85 out of 100 questions right, your score is (85/100) x 100 = 85%" },
      { title: "Tips at Restaurants", description: "For a $50 meal with a 20% tip, the tip amount is $50 x 0.20 = $10" }
    ],
    relatedCalculators: ["percentage-calculator", "tip-calculator", "percent-error-calculator"]
  },
  "bmi-health-guide": {
    title: "Understanding BMI and Body Health",
    description: "A comprehensive guide to Body Mass Index, what it means, and its limitations.",
    categoryId: "health",
    introduction: "Body Mass Index (BMI) is a simple measurement that uses your height and weight to estimate body fat. While it's a useful screening tool, it's important to understand both its uses and limitations.",
    sections: [
      {
        title: "What is BMI?",
        content: "BMI stands for Body Mass Index. It was developed in the 1800s by Belgian mathematician Adolphe Quetelet. BMI gives you a single number that helps categorize your weight status relative to your height.",
        formula: "BMI = Weight (kg) / Height (m)^2"
      },
      {
        title: "BMI Categories",
        content: "Standard BMI categories for adults are: Underweight (below 18.5), Normal weight (18.5-24.9), Overweight (25-29.9), and Obese (30 and above). These categories help identify potential health risks."
      },
      {
        title: "Limitations of BMI",
        content: "BMI doesn't distinguish between muscle and fat. Athletes with high muscle mass may have a high BMI but low body fat. It also doesn't account for age, gender, or where fat is distributed on the body."
      },
      {
        title: "Complementary Health Metrics",
        content: "For a more complete picture of health, consider measuring waist circumference, body fat percentage, waist-to-hip ratio, and consulting with healthcare professionals about your overall health markers."
      }
    ],
    keyTerms: [
      { term: "BMI", definition: "Body Mass Index - a measure of body fat based on height and weight" },
      { term: "Underweight", definition: "BMI below 18.5, may indicate nutritional deficiency" },
      { term: "Overweight", definition: "BMI of 25-29.9, indicating excess body weight" },
      { term: "Obesity", definition: "BMI of 30 or higher, associated with increased health risks" }
    ],
    realWorldExamples: [
      { title: "Regular Health Checkups", description: "Doctors often calculate BMI during annual checkups as a quick health screening tool." },
      { title: "Fitness Goals", description: "Understanding your BMI can help set realistic weight management goals with your healthcare provider." },
      { title: "Insurance Assessments", description: "Some insurance companies consider BMI as one factor in health risk assessments." }
    ],
    relatedCalculators: ["bmi-calculator", "calorie-calculator"]
  },
  "compound-interest-guide": {
    title: "The Power of Compound Interest",
    description: "Learn how compound interest works and why Einstein called it the 'eighth wonder of the world'.",
    categoryId: "finance",
    introduction: "Compound interest is often called the most powerful force in finance. Unlike simple interest, compound interest earns interest on your interest, creating exponential growth over time. Understanding it is key to building wealth.",
    sections: [
      {
        title: "Simple vs Compound Interest",
        content: "Simple interest is calculated only on the initial principal. Compound interest is calculated on the principal plus all accumulated interest. This difference becomes dramatic over time.",
        formula: "Compound Interest: A = P(1 + r/n)^(nt)"
      },
      {
        title: "The Power of Time",
        content: "The longer your money compounds, the more dramatic the growth. This is why starting to save and invest early is so important. Someone who starts investing at 25 can end up with more money than someone who starts at 35, even with smaller contributions."
      },
      {
        title: "Compounding Frequency",
        content: "Interest can compound annually, semi-annually, quarterly, monthly, or even daily. The more frequent the compounding, the more interest you earn (or pay, if you're borrowing)."
      },
      {
        title: "The Rule of 72",
        content: "A quick way to estimate how long it takes to double your money: divide 72 by the annual interest rate. At 8% interest, your money doubles in approximately 72/8 = 9 years.",
        formula: "Years to Double ≈ 72 / Interest Rate"
      }
    ],
    keyTerms: [
      { term: "Principal", definition: "The initial amount of money invested or borrowed" },
      { term: "Interest Rate", definition: "The percentage charged for borrowing or earned on savings" },
      { term: "Compounding", definition: "Earning interest on previously earned interest" },
      { term: "APY", definition: "Annual Percentage Yield - the real rate of return including compounding" }
    ],
    realWorldExamples: [
      { title: "Retirement Savings", description: "Investing $500/month at 7% for 30 years grows to over $600,000 - you only contributed $180,000!" },
      { title: "Credit Card Debt", description: "Compound interest works against you with debt. A $5,000 balance at 20% can grow rapidly if only minimum payments are made." },
      { title: "Emergency Fund", description: "Even a high-yield savings account at 4% will grow your emergency fund through compound interest." }
    ],
    relatedCalculators: ["compound-interest-calculator", "mortgage-calculator"]
  }
};

export default function TopicPage() {
  const [, params] = useRoute("/topics/:topicId");
  const topicId = params?.topicId;
  const topic = topicId ? topicContent[topicId] : undefined;

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
            <p className="text-muted-foreground mb-4">The topic you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = getCategoryById(topic.categoryId);
  const allCalcs = getAllCalculators();
  const relatedCalcs = topic.relatedCalculators
    .map(id => allCalcs.find((c: CalculatorInfo) => c.id === id))
    .filter((c): c is CalculatorInfo => c !== undefined);

  const breadcrumbItems = [
    { label: "Topics", href: "/topics" },
    { label: topic.title },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.description,
    author: {
      "@type": "Organization",
      name: "The Calc Universe"
    },
    publisher: {
      "@type": "Organization",
      name: "The Calc Universe"
    }
  };

  const schemaBreadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics" },
    { name: topic.title, url: `/topics/${topicId}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={topic.title}
        description={topic.description}
        structuredData={{
          ...structuredData,
          ...generateBreadcrumbSchema(schemaBreadcrumbs)
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-8" data-testid="topic-header">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" data-testid="badge-category">{category?.name || topic.categoryId}</Badge>
            <Badge variant="outline" data-testid="badge-type">
              <GraduationCap className="h-3 w-3 mr-1" />
              Learning Guide
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-topic-title">{topic.title}</h1>
          <p className="text-xl text-muted-foreground" data-testid="text-topic-description">{topic.description}</p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed">{topic.introduction}</p>
            </CardContent>
          </Card>

          {topic.sections.map((section, idx) => (
            <section key={idx} className="mb-8" data-testid={`section-${idx}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" data-testid={`text-section-title-${idx}`}>
                <BookOpen className="h-6 w-6 text-primary" />
                {section.title}
              </h2>
              <p className="text-muted-foreground mb-4" data-testid={`text-section-content-${idx}`}>{section.content}</p>
              {section.formula && (
                <div className="bg-muted p-4 rounded-lg font-mono text-center text-lg mb-4" data-testid={`text-formula-${idx}`}>
                  {section.formula}
                </div>
              )}
            </section>
          ))}

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              Key Terms to Know
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topic.keyTerms.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <p className="font-bold text-primary">{item.term}</p>
                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
            <div className="space-y-4">
              {topic.realWorldExamples.map((example, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <p className="font-bold mb-2">{example.title}</p>
                    <p className="text-muted-foreground">{example.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {relatedCalcs.length > 0 && (
            <section className="mb-8" data-testid="section-related-calculators">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                Try These Calculators
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedCalcs.map((calc) => calc && (
                  <Link key={calc.id} href={`/${calc.categoryId}/${calc.id}`} data-testid={`link-calculator-${calc.id}`}>
                    <Card className="hover-elevate cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between gap-2">
                          {calc.name}
                          <ChevronRight className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{calc.shortDescription}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export function TopicsListPage() {
  const topics = Object.entries(topicContent);

  return (
    <div className="min-h-screen bg-background" data-testid="page-topics-list">
      <SEOHead
        title="Learning Topics"
        description="Comprehensive guides and tutorials on math, finance, health, and more."
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12" data-testid="topics-header">
          <Badge className="mb-4" data-testid="badge-learning-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Learning Center
          </Badge>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Educational Topics</h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-description">
            Comprehensive guides to help you understand key concepts
          </p>
        </header>

        <div className="grid gap-6" data-testid="topics-grid">
          {topics.map(([id, topic]) => (
            <Link key={id} href={`/topics/${id}`} data-testid={`link-topic-${id}`}>
              <Card className="hover-elevate cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" data-testid={`badge-category-${id}`}>{getCategoryById(topic.categoryId)?.name}</Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl" data-testid={`text-topic-title-${id}`}>{topic.title}</CardTitle>
                  <CardDescription className="text-base" data-testid={`text-topic-desc-${id}`}>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topic.relatedCalculators.slice(0, 3).map(calcId => (
                      <Badge key={calcId} variant="secondary" className="text-xs" data-testid={`badge-calc-${calcId}`}>
                        <Calculator className="h-3 w-3 mr-1" />
                        {calcId.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
