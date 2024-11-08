import { Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerateButton } from "./settings/GenerateButton";

interface ImageSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  numImages: number;
  setNumImages: (value: number) => void;
  VoiceInput: React.ReactNode;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "mal", name: "Malayalam" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "ur", name: "Urdu" }
];

export function ImageSettings({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  onGenerate,
  isLoading,
  VoiceInput,
  selectedLanguage,
  setSelectedLanguage
}: ImageSettingsProps) {
  return (
    <Card className="backdrop-blur-xl bg-black/20 border-gray-800/50 shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
      <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 bg-clip-text text-transparent animate-gradient-x">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
            Create Your Masterpiece
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400">
            Transform your imagination into stunning artwork
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm sm:text-base text-blue-200 font-medium">
              Select Language
            </Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full bg-black/30 border-gray-800/50 text-sm sm:text-base">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-sm sm:text-base">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt" className="text-sm sm:text-base text-blue-200 font-medium">
                Your Vision
              </Label>
              {VoiceInput}
            </div>
            <Textarea
              id="prompt"
              placeholder="Describe your dream image in vivid detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] md:min-h-[150px] resize-none bg-black/30 border-gray-800/50 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base transition-all duration-300 hover:bg-black/40"
              dir={selectedLanguage === "ur" ? "rtl" : "ltr"}
            />
          </div>

          <GenerateButton onGenerate={onGenerate} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}