
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptSuggestions } from "./image-generator/PromptSuggestions";
import { VoiceInput } from "./VoiceInput";
import { translateToEnglish } from "@/lib/api/translation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GenerateResponse {
  images: string[];
  error?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [error, setError] = useState<string | null>(null);
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const checkNetworkConnectivity = useCallback(async () => {
    try {
      console.log("Checking network connectivity...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, { 
        signal: controller.signal,
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      clearTimeout(timeoutId);
      console.log("Network check response:", response.status, response.ok);
      
      if (!response.ok) {
        const data = await response.json();
        console.error("Health check failed:", data);
      }
      
      return response.ok;
    } catch (error) {
      console.error("Network connectivity check failed:", error);
      return false;
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    
    // Check if API key is configured
    if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      setError("Hugging Face API key is not configured. Please add it to your environment variables.");
      toast({
        title: "Configuration Error",
        description: "API key is missing. Check the console for details.",
        variant: "destructive",
      });
      return;
    }

    // Check network connectivity first
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      setError("Network connection issue. Please check your internet connection and try again.");
      toast({
        title: "Network Error",
        description: "Cannot connect to the server. Please check your connection.",
        variant: "destructive",
      });
      return;
    }

    let retries = 0;
    setIsLoading(true);
    setGeneratedImages([]);
    
    while (retries < MAX_RETRIES) {
      try {
        console.log("Translating prompt if needed...");
        const translatedPrompt = selectedLanguage !== "en" 
          ? await translateToEnglish(prompt, selectedLanguage)
          : prompt;
          
        const translatedNegativePrompt = negativePrompt && selectedLanguage !== "en" 
          ? await translateToEnglish(negativePrompt, selectedLanguage)
          : negativePrompt;

        console.log("Translated prompt:", translatedPrompt);
        console.log("Translated negative prompt:", translatedNegativePrompt);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 190000); // 3 minutes + buffer

        console.log("Sending generate request...");
        console.log("API URL:", import.meta.env.VITE_API_URL);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: translatedPrompt,
            negativePrompt: translatedNegativePrompt,
            numImages,
          }),
        });

        clearTimeout(timeoutId);
        console.log("Generate response status:", response.status);

        if (!response.ok) {
          const data = await response.json();
          console.error("API Error:", data);
          
          // Handle different error status codes
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.");
          } else if (response.status === 401) {
            throw new Error("API configuration error. Please check your API key.");
          } else if (response.status === 503) {
            throw new Error("The AI model is currently busy. Please try again in a few moments.");
          } else if (response.status === 504) {
            throw new Error("Request timed out. Please try again with a simpler prompt.");
          } else {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
          }
        }

        const data: GenerateResponse = await response.json();
        console.log("Generated images:", data.images?.length || 0);
        
        if (!data.images || data.images.length === 0) {
          throw new Error("No images were generated");
        }
        
        setGeneratedImages(data.images);
        setError(null);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
        break;
        
      } catch (error) {
        console.error('Generation error:', error);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError("Request timed out. Please try again with a simpler prompt.");
            toast({
              title: "Timeout",
              description: "Request timed out. Please try again with a simpler prompt.",
              variant: "destructive",
            });
            break;
          }

          if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            if (retries < MAX_RETRIES - 1) {
              console.log(`Network error, retrying (${retries + 1}/${MAX_RETRIES})...`);
              await sleep(RETRY_DELAY * Math.pow(2, retries));
              retries++;
              continue;
            } else {
              setError("Network error. Please check your internet connection and try again.");
            }
          } else {
            setError(error.message);
          }
          
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setError("An unexpected error occurred");
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
        
        break;
      }
    }
    
    setIsLoading(false);
  }, [prompt, negativePrompt, numImages, selectedLanguage, checkNetworkConnectivity]);

  const handleVoiceInput = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-5 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ImageSettings
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            numImages={numImages}
            setNumImages={setNumImages}
            VoiceInput={<VoiceInput onTranscript={handleVoiceInput} selectedLanguage={selectedLanguage} />}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <PromptSuggestions
            inputText={prompt}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
        <ImageDisplay images={generatedImages} isLoading={isLoading} />
      </div>
    </div>
  );
}
