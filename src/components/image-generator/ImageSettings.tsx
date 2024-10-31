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
  {
    category: "Fantasy",
    prompts: [
      "A mystical dragon's lair filled with glowing crystals and ancient treasures, digital art style",
      "A fairy garden at midnight with bioluminescent flowers and tiny floating lanterns"
    ]
  },
  {
    category: "Sci-Fi",
    prompts: [
      "A futuristic neon-lit cyberpunk marketplace with holographic vendors",
      "A space station observatory with a view of a binary star system"
    ]
  },
  {
    category: "Nature",
    prompts: [
      "An enchanted forest with rays of sunlight filtering through giant mushrooms",
      "A hidden waterfall oasis in a desert canyon at sunset"
    ]
  },
  {
    category: "Urban",
    prompts: [
      "A cozy rooftop garden cafe in Tokyo during cherry blossom season",
      "A steampunk-inspired underground subway station with brass and copper details"
    ]
  }
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
          <div className="flex justify-between items-center">
            <Label htmlFor="prompt" className="text-white">Your Vision</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-amber-400 group"
                >
                  Need inspiration?
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse text-amber-400" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-96 bg-black/90 border-gray-800">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Spark Your Imagination
                  </h4>
                  <div className="space-y-4">
                    {promptExamples.map((category, i) => (
                      <div key={i} className="space-y-2">
                        <h5 className="text-xs font-medium text-amber-300/80">
                          {category.category}
                        </h5>
                        <div className="grid gap-2">
                          {category.prompts.map((example, j) => (
                            <div
                              key={j}
                              className="p-2 rounded-md hover:bg-white/5 cursor-pointer transition-all duration-200 group"
                              onClick={() => setPrompt(example)}
                            >
                              <p className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors">
                                {example}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                      Click any prompt to use it as your starting point. Mix and match ideas to create something unique!
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Textarea
            id="prompt"
            placeholder="Describe your dream image in detail... (e.g., 'A magical treehouse in a mystical forest at sunset')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white"
          />
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
              className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-left">
              <Label htmlFor="resolution" className="text-white">Image Size</Label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-800 bg-black/20 text-white focus:border-amber-500 focus:ring-amber-500/20"
              >
                {resolutions.map((res) => (
                  <option key={res.value} value={res.value} className="bg-gray-900">
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
                className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white"
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
