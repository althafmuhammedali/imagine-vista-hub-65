import { ImageIcon, Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SocialShareButton } from "./SocialShareButton";
import { useMemo } from "react";

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
  error?: string;
  prompt?: string;
}

export function ImagePreview({ generatedImage, isLoading, error, prompt = "" }: ImagePreviewProps) {
  const getStyleFromPrompt = useMemo(() => {
    const promptLower = prompt.toLowerCase();
    
    const styles = {
      fantasy: promptLower.includes('fantasy') || promptLower.includes('magical') || promptLower.includes('dragon'),
      scifi: promptLower.includes('sci-fi') || promptLower.includes('futuristic') || promptLower.includes('cyber'),
      nature: promptLower.includes('nature') || promptLower.includes('landscape') || promptLower.includes('forest'),
      portrait: promptLower.includes('portrait') || promptLower.includes('character') || promptLower.includes('person'),
      abstract: promptLower.includes('abstract') || promptLower.includes('surreal') || promptLower.includes('artistic'),
    };

    if (styles.fantasy) {
      return "bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 border-indigo-800/50";
    }
    if (styles.scifi) {
      return "bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 border-cyan-800/50";
    }
    if (styles.nature) {
      return "bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 border-green-800/50";
    }
    if (styles.portrait) {
      return "bg-gradient-to-br from-amber-900/40 via-orange-900/40 to-red-900/40 border-amber-800/50";
    }
    if (styles.abstract) {
      return "bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/40 border-pink-800/50";
    }
    
    return "bg-black/20 border-gray-800/50";
  }, [prompt]);

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comicforgeai_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!generatedImage) return;

    try {
      toast({
        title: "Uploading",
        description: "Please wait while we upload your image...",
      });

      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, `comicforgeai_${Date.now()}.png`);
      formData.append('key', '73ffc7abc53c74281c83c278d6a9a82b');

      const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`relative overflow-hidden backdrop-blur-xl shadow-2xl min-h-[300px] sm:min-h-[400px] md:min-h-[450px] group transition-all duration-700 hover:shadow-amber-500/20 ${getStyleFromPrompt}`}>
      {error && (
        <Alert variant="destructive" className="m-2 sm:m-4 animate-fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-amber-400 animate-pulse text-sm sm:text-base md:text-lg">Creating your masterpiece...</div>
        </div>
      ) : generatedImage ? (
        <div className="h-full p-3 sm:p-4 md:p-6 animate-fade-in relative">
          <img
            src={generatedImage}
            alt="Generated artwork"
            className="w-full h-full object-contain rounded-lg transition-all duration-700 group-hover:scale-105 pointer-events-none shadow-2xl"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-3 bg-black/80 backdrop-blur-md p-2 rounded-full shadow-xl">
            <Button
              onClick={handleUpload}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 px-4 py-2"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 px-4 py-2"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
          <SocialShareButton imageUrl={generatedImage} />
        </div>
      ) : !error && (
        <div className="flex items-center justify-center h-full min-h-[300px] sm:min-h-[400px] md:min-h-[450px] text-gray-400">
          <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 animate-fade-in">
            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto opacity-50 text-amber-400" />
            <div>
              <p className="text-xl sm:text-2xl font-medium text-amber-400 mb-2">Your Canvas Awaits</p>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                Enter your prompt and let our AI bring your vision to life with stunning detail
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}