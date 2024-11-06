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
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <CardHeader className="p-0 space-y-2 sm:space-y-3">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400" />
            Create Your Masterpiece
          </CardTitle>
          <CardDescription className="text-sm sm:text-base md:text-lg text-gray-400">
            Transform your imagination into stunning artwork
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base sm:text-lg text-amber-200 font-medium">
              Select Language
            </Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full bg-black/30 border-gray-800/50">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt" className="text-base sm:text-lg text-amber-200 font-medium">
                Your Vision
              </Label>
              {VoiceInput}
            </div>
            <Textarea
              id="prompt"
              placeholder="Describe your dream image in vivid detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] sm:min-h-[150px] md:min-h-[200px] resize-none bg-black/30 border-gray-800/50 focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-500 text-white text-sm sm:text-base transition-all duration-300 hover:bg-black/40"
              dir={selectedLanguage === "ur" ? "rtl" : "ltr"}
            />
          </div>

          <GenerateButton onGenerate={onGenerate} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}