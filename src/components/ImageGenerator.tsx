import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api/imageGeneration";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { VoiceInput } from "./VoiceInput";
import { enhancePrompt, enhanceNegativePrompt } from "@/lib/api/promptEnhancer";

const supportedLanguages = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  bn: "Bengali",
  mal: "Malayalam",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  mr: "Marathi",
  gu: "Gujarati",
  ur: "Urdu",
  fa: "Persian",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  fil: "Filipino",
  tr: "Turkish",
  el: "Greek",
  he: "Hebrew",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  hu: "Hungarian",
  cs: "Czech",
  sk: "Slovak",
  ro: "Romanian",
  bg: "Bulgarian",
  uk: "Ukrainian"
};

const translateToEnglish = async (text: string, sourceLang: string): Promise<string> => {
  if (sourceLang === 'en' || !text.trim()) return text;
  
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${sourceLang}-en`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    return result[0].translation_text;
  } catch (error) {
    console.error('Translation error:', error);
    toast({
      title: "Translation Error",
      description: "Failed to translate prompt. Proceeding with original text.",
      variant: "destructive",
    });
    return text;
  }
};

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (trimmedPrompt.length < 3) {
      toast({
        title: "Error",
        description: "Prompt must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // Clear previous URLs
      generatedImages.forEach(url => URL.revokeObjectURL(url));
      setGeneratedImages([]);

      // Translate prompt if not in English
      let translatedPrompt = trimmedPrompt;
      let translatedNegativePrompt = negativePrompt;

      if (selectedLanguage !== "en") {
        translatedPrompt = await translateToEnglish(trimmedPrompt, selectedLanguage);
        if (negativePrompt) {
          translatedNegativePrompt = await translateToEnglish(negativePrompt, selectedLanguage);
        }
      }

      const enhancedPrompt = enhancePrompt(translatedPrompt);
      const enhancedNegativePrompt = enhanceNegativePrompt(translatedNegativePrompt.trim());

      const imageUrl = await generateImage({
        prompt: enhancedPrompt,
        width: window.innerWidth >= 1024 ? 1024 : 512,
        height: window.innerWidth >= 1024 ? 1024 : 512,
        negativePrompt: enhancedNegativePrompt,
      });

      setGeneratedImages([imageUrl]);
      setError(undefined);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setError(errorMessage);
      setGeneratedImages([]);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, generatedImages, selectedLanguage]);

  const handleVoiceInput = useCallback((transcript: string) => {
    setPrompt(transcript);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-2 sm:px-4 lg:px-6 backdrop-blur-xl bg-gradient-to-b from-background/10 via-background/50 to-background/10 border border-border/50 rounded-lg shadow-2xl">
      <div className="grid gap-4 md:gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="order-2 lg:order-1">
          <ImageSettings
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            numImages={1}
            setNumImages={() => {}}
            VoiceInput={<VoiceInput onTranscript={handleVoiceInput} selectedLanguage={selectedLanguage} />}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
        <div className="order-1 lg:order-2">
          <ImagePreview
            generatedImage={generatedImages[0] || null}
            isLoading={isLoading}
            error={error}
            prompt={prompt}
          />
        </div>
      </div>
    </div>
  );
}
