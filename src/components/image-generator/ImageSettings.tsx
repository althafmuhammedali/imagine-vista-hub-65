import { Loader2, Wand2, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  resolution: string;
  setResolution: (value: string) => void;
  seed: string;
  setSeed: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  resolutions: Array<{ value: string; width: number; height: number; label: string; }>;
}

export function ImageSettings({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  resolution,
  setResolution,
  seed,
  setSeed,
  onGenerate,
  isLoading,
  resolutions,
}: ImageSettingsProps) {
  return (
    <Card className="backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl">
      <CardContent className="p-6 space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-2xl text-amber-300">
            <Wand2 className="w-6 h-6" />
            Image Settings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your image generation parameters
          </CardDescription>
        </CardHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-gray-300">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to see..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="negative-prompt" className="text-gray-300">Negative Prompt (Optional)</Label>
            <Input
              id="negative-prompt"
              placeholder="What to exclude from the image..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resolution" className="text-gray-300">Resolution</Label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-800 bg-black/20 text-gray-300 focus:border-amber-500 focus:ring-amber-500/20"
              >
                {resolutions.map((res) => (
                  <option key={res.value} value={res.value}>
                    {res.label} ({res.width}x{res.height})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed" className="text-gray-300">Seed (Optional)</Label>
              <Input
                id="seed"
                type="number"
                placeholder="Random seed..."
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
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
        </div>
      </CardContent>
    </Card>
  );
}