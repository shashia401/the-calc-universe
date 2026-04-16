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
  const [height, setHeight] = useState("500");
  const [theme, setTheme] = useState("light");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://thecalcuniverse.com";
  const embedUrl = `${baseUrl}/embed/${categoryId}/${calculatorId}?theme=${theme}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      setCopied(true);
      toast({ title: "Copied!", description: "Embed URL copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please select and copy the URL manually." });
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
          Add this calculator to your website using the embed URL below. "Powered by The Calc Universe" branding is built into the embed and cannot be removed.
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed-height">Height</Label>
            <Select value={height} onValueChange={setHeight}>
              <SelectTrigger id="embed-height" data-testid="select-embed-height">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="700">700px (Tall)</SelectItem>
                <SelectItem value="500">500px (Standard)</SelectItem>
                <SelectItem value="400">400px (Compact)</SelectItem>
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

        {/* Live preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Preview</p>
          <div className="rounded-lg border overflow-hidden" style={{ height: `${height}px` }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`${calculatorName} - The Calc Universe`}
              loading="lazy"
              data-testid="iframe-embed-preview"
            />
          </div>
        </div>

        {/* Embed URL */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Embed URL</span>
          </div>
          <div className="flex items-center gap-2">
            <code
              className="text-xs bg-muted px-3 py-2 rounded break-all flex-1 select-all"
              data-testid="text-embed-url"
            >
              {embedUrl}
            </code>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleCopy}
              data-testid="button-copy-embed"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
