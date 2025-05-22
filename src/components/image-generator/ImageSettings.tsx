import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PromptExampleCard } from "./prompt-examples/PromptExampleCard";
import { ResolutionSelect } from "./settings/ResolutionSelect";
import { GenerateButton } from "./settings/GenerateButton";

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
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-amber-300">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            Create Your Masterpiece
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-400">
            Let your imagination run wild and create stunning artwork
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Label htmlFor="prompt" className="text-white">Your Vision</Label>
            <PromptExampleCard examples={promptExamples} setPrompt={setPrompt} />
          </div>
          
          <Textarea
            id="prompt"
            placeholder="Describe your dream image in detail... (e.g., 'A magical treehouse in a mystical forest at sunset')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-20 sm:h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base"
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
              className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ResolutionSelect
              resolution={resolution}
              setResolution={setResolution}
              resolutions={resolutions}
            />

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
                className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base"
              />
            </div>
          </div>

          <GenerateButton onGenerate={onGenerate} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}
