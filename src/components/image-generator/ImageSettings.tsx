import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GenerateButton } from "./settings/GenerateButton";

interface ImageSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  VoiceInput: React.ReactNode;
}

export function ImageSettings({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  onGenerate,
  isLoading,
  VoiceInput,
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt" className="text-white">Your Vision</Label>
              {VoiceInput}
            </div>
            <Textarea
              id="prompt"
              placeholder="Describe your dream image in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-20 sm:h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="negative-prompt" className="text-white flex items-center gap-2">
              Refine Your Image
              <span className="text-xs text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="negative-prompt"
              placeholder="Specify what you don't want in the image..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="h-20 sm:h-24 resize-none bg-black/20 border-gray-800 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base"
            />
          </div>

          <GenerateButton onGenerate={onGenerate} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}