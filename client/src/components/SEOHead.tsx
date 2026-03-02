import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  structuredData?: object;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | The Calc Universe - Free Online Calculators`;

    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta("description", description);

    if (noindex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "The Calc Universe", true);
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    if (canonicalUrl) {
      updateMeta("og:url", canonicalUrl, true);
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    if (structuredData) {
      let script = document.querySelector('script[data-type="structured-data"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-type", "structured-data");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {};
  }, [title, description, canonicalUrl, ogImage, ogType, structuredData, noindex]);

  return null;
}

export function generateCalculatorSchema(calculator: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.name,
    description: calculator.description,
    url: calculator.url,
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "The Calc Universe",
      url: "https://calchub.com",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Calc Universe",
    url: "https://calchub.com",
    description: "Free online calculators for math, finance, health, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://calchub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
