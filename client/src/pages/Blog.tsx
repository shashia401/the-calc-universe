import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Calendar, Clock, ArrowRight, User, BookOpen } from "lucide-react";
import { blogPostsData } from "./BlogPost";

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  wordCount: number;
  calculatorLink?: string;
}

const blogPosts: BlogPostPreview[] = Object.values(blogPostsData).map(post => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
  readTime: post.readTime,
  category: post.category,
  author: post.author,
  wordCount: post.wordCount,
  calculatorLink: post.calculatorLink,
}));

const sortedBlogPosts = blogPosts.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB.getTime() - dateA.getTime();
});

const categories = Array.from(new Set(blogPosts.map(p => p.category)));

function generateBlogListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The Calc Universe Blog",
    "description": "Tips, guides, and educational content about calculations, math, finance, health, and more.",
    "url": "https://thecalcuniverse.com/blog",
    "blogPost": sortedBlogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": new Date(post.date).toISOString(),
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "url": `https://thecalcuniverse.com/blog/${post.id}`
    }))
  };
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Calculator Blog | Tips, Guides & Tutorials | The Calc Universe"
        description={`Explore ${blogPosts.length} in-depth guides about math, finance, health, and more. Learn calculation tips, formulas, and real-world examples. Free calculators included.`}
        canonicalUrl="https://thecalcuniverse.com/blog"
        structuredData={generateBlogListSchema()}
      />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">The Calc Universe Blog</h1>
          <p className="text-xl text-muted-foreground mb-4">
            In-depth guides, tutorials, and tips to help you master calculations
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {blogPosts.length} Articles
            </span>
            <span className="flex items-center gap-1">
              Categories: {categories.join(", ")}
            </span>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <Badge key={cat} variant="secondary" className="cursor-default">
              {cat} ({blogPosts.filter(p => p.category === cat).length})
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          {sortedBlogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="hover-elevate cursor-pointer" data-testid={`card-blog-${post.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {post.wordCount.toLocaleString()} words
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all" data-testid={`link-read-more-${post.id}`}>
                      Read full article
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">More Articles Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            We're constantly adding new guides covering all our calculators. 
            Each article includes formulas, step-by-step explanations, real case studies, and FAQs.
          </p>
          <p className="text-sm text-muted-foreground">
            Have a topic you'd like us to cover? Let us know through our contact page!
          </p>
        </div>
      </div>
    </div>
  );
}
