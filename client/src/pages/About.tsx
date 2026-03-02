import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Users, Shield, Zap } from "lucide-react";
import { getCalculatorCount } from "@/lib/calculatorData";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About The Calc Universe</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted destination for free, accurate, and easy-to-use online calculators.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto mb-12">
          <p>
            The Calc Universe was founded with a simple mission: to make complex calculations accessible to everyone.
            Whether you're a student working on homework, a professional planning finances, or someone
            trying to convert units, we have the tools you need.
          </p>
          <p>
            Our team of developers and mathematicians work tirelessly to ensure every calculator
            is accurate, user-friendly, and always free to use. We believe that access to good
            calculation tools shouldn't be limited by cost or technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 h-fit">
                <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{getCalculatorCount()}+ Calculators</h3>
                <p className="text-sm text-muted-foreground">
                  From basic math to advanced financial planning, we cover every calculation need.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3 h-fit">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Millions of Users</h3>
                <p className="text-sm text-muted-foreground">
                  Trusted by students, professionals, and curious minds worldwide.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3 h-fit">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">100% Private</h3>
                <p className="text-sm text-muted-foreground">
                  All calculations happen in your browser. We never store or transmit your data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3 h-fit">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  No waiting, no loading. Get your answers in milliseconds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-accent/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Calc Universe will always be free to use. We believe everyone deserves access to 
              high-quality calculation tools without barriers. Our calculators are regularly 
              updated and verified for accuracy by our team of experts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
