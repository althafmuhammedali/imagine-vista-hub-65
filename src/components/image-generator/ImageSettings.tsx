import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PromptExampleCard } from "./prompt-examples/PromptExampleCard";
import { ResolutionSelect } from "./settings/ResolutionSelect";
import { GenerateButton } from "./settings/GenerateButton";

interface ImageSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  resolution: string;
  setResolution: (value: string) => void;
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
  onGenerate,
  isLoading,
  resolutions,
}: ImageSettingsProps) {
  return (
    <Card className="backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl h-full">
      <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-amber-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            Create Your Masterpiece
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400">
            Let your imagination run wild and create stunning artwork
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 sm:space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Label htmlFor="prompt" className="text-white text-sm sm:text-base">Your Vision</Label>
            <PromptExampleCard examples={promptExamples} setPrompt={setPrompt} />
          </div>
          
          <div className="space-y-2">
            <Textarea
              id="prompt"
              placeholder="Describe your dream image in detail... (e.g., 'A magical treehouse in a mystical forest at sunset')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-16 sm:h-20 md:h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="negative-prompt" className="text-white text-sm sm:text-base flex items-center gap-2">
              Refine Your Image
              <span className="text-xs text-gray-400">(Optional)</span>
            </Label>
            <Input
              id="negative-prompt"
              placeholder="Specify what you don't want in the image... (e.g., 'blurry, low quality, dark')"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-xs sm:text-sm md:text-base"
            />
          </div>

          <div>
            <ResolutionSelect
              resolution={resolution}
              setResolution={setResolution}
              resolutions={resolutions}
            />
          </div>

          <GenerateButton onGenerate={onGenerate} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}