import { Link } from "wouter";
import { Calculator, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/calculatorData";
import { useState } from "react";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t bg-card print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="footer-logo">
              <Calculator className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold">The Calc Universe</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted source for free online calculators. Making complex calculations simple since 2024.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => onNavigate?.(`/${category.id}`)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    data-testid={`footer-category-${category.id}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.("/about")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="footer-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("/blog")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="footer-blog"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("/contact")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="footer-contact"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("/privacy")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="footer-privacy"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("/terms")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-testid="footer-terms"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get tips, updates, and new calculator announcements.
            </p>
            {subscribed ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" size="icon" data-testid="button-subscribe">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Calc Universe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
