import { Loader2, Wand2, ImageIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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

const promptExamples = [
  "A serene Japanese garden with cherry blossoms, watercolor style",
  "A magical treehouse in a mystical forest at sunset",
  "A cute robot playing with butterflies in a meadow, digital art",
];

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
            <Sparkles className="w-6 h-6" />
            Create Your Masterpiece
          </CardTitle>
          <CardDescription className="text-gray-400">
            Let your imagination run wild and create stunning artwork
          </CardDescription>
        </CardHeader>

        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <Label htmlFor="prompt" className="text-white">Your Vision</Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-400">
                    Need inspiration?
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-black/80 border-gray-800">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-amber-400">Example Prompts:</h4>
                    <ul className="text-sm space-y-2 text-gray-300">
                      {promptExamples.map((example, i) => (
                        <li key={i} className="cursor-pointer hover:text-amber-400" onClick={() => setPrompt(example)}>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Textarea
              id="prompt"
              placeholder="Describe your dream image in detail... (e.g., 'A magical treehouse in a mystical forest at sunset')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="negative-prompt" className="text-white flex items-center gap-2">
              Refine Your Image
              <span className="text-xs text-gray-400">(Optional)</span>
            </Label>
            <Input
              id="negative-prompt"
              placeholder="Specify what you don't want in the image... (e.g., 'blurry, low quality, dark')"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-left">
              <Label htmlFor="resolution" className="text-white">Image Size</Label>
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

            <div className="space-y-2 text-left">
              <Label htmlFor="seed" className="text-white flex items-center gap-2">
                Seed
                <span className="text-xs text-gray-400">(Optional)</span>
              </Label>
              <Input
                id="seed"
                type="number"
                placeholder="For reproducible results..."
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg group relative overflow-hidden"
            size="lg"
            onClick={onGenerate}
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Magic...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Artwork
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}