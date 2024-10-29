import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Image as ImageIcon } from "lucide-react";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
] as const;

interface GeneratorFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  resolution: typeof resolutions[number]["value"];
  setResolution: (value: typeof resolutions[number]["value"]) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  seed: string;
  setSeed: (value: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export function GeneratorForm({
  prompt,
  setPrompt,
  resolution,
  setResolution,
  negativePrompt,
  setNegativePrompt,
  seed,
  setSeed,
  isLoading,
  onGenerate,
}: GeneratorFormProps) {
  const handleSeedChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setSeed(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Wand2 className="w-6 h-6" />
          Image Settings
        </CardTitle>
        <CardDescription>
          Configure your image generation parameters
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to see..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
          <Input
            id="negative-prompt"
            placeholder="What to exclude from the image..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <select
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value as typeof resolution)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {resolutions.map((res) => (
                <option key={res.value} value={res.value}>
                  {res.label} ({res.width}x{res.height})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seed">Seed (Optional)</Label>
            <Input
              id="seed"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Random seed..."
              value={seed}
              onChange={(e) => handleSeedChange(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}