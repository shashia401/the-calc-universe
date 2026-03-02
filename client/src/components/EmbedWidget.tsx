import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Code, Copy, Check, ExternalLink } from "lucide-react";

interface EmbedWidgetProps {
  calculatorId: string;
  calculatorName: string;
  categoryId: string;
}

export function EmbedWidget({ calculatorId, calculatorName, categoryId }: EmbedWidgetProps) {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("600");
  const [theme, setTheme] = useState("light");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://thecalcuniverse.com";
  const embedUrl = `${baseUrl}/embed/${categoryId}/${calculatorId}?theme=${theme}`;

  const iframeCode = `<!-- ${calculatorName} by The Calc Universe (${baseUrl}) -->
<iframe 
  src="${embedUrl}"
  width="${width}"
  height="${height}px"
  frameborder="0"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="${calculatorName} - The Calc Universe"
  loading="lazy"
></iframe>
<p style="font-size: 12px; text-align: center; margin-top: 4px;">
  <a href="${baseUrl}/${categoryId}/${calculatorId}" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: none;">
    ${calculatorName}
  </a> by <a href="${baseUrl}" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: none;">The Calc Universe</a>
</p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      toast({ title: "Copied!", description: "Embed code copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please select and copy the code manually." });
    }
  };

  return (
    <Card className="mt-6" data-testid="embed-widget">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="h-5 w-5" />
          Embed This Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground" data-testid="text-embed-description">
          Add this calculator to your website or blog. Copy the code below and paste it into your HTML.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed-width">Width</Label>
            <Select value={width} onValueChange={setWidth}>
              <SelectTrigger id="embed-width" data-testid="select-embed-width">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100%">Full Width (100%)</SelectItem>
                <SelectItem value="600">600px</SelectItem>
                <SelectItem value="500">500px</SelectItem>
                <SelectItem value="400">400px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-height">Height</Label>
            <Select value={height} onValueChange={setHeight}>
              <SelectTrigger id="embed-height" data-testid="select-embed-height">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800">800px (Tall)</SelectItem>
                <SelectItem value="600">600px (Standard)</SelectItem>
                <SelectItem value="500">500px (Compact)</SelectItem>
                <SelectItem value="400">400px (Small)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="embed-theme" data-testid="select-embed-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="relative">
            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto whitespace-pre-wrap break-all" data-testid="text-embed-code">
              {iframeCode}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={handleCopy}
              data-testid="button-copy-embed"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste this code in your HTML where you want the calculator to appear.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Embed URL:</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded break-all flex-1" data-testid="text-embed-url">
              {embedUrl}
            </code>
            <a 
              href={embedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline whitespace-nowrap"
              data-testid="link-preview-embed"
            >
              Preview
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
