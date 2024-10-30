import { Loader2, ImageIcon, Sparkles, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
  error?: string;
}

export function ImagePreview({ generatedImage, isLoading, error }: ImagePreviewProps) {
  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-artwork-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl min-h-[300px] md:min-h-[400px] group">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {(generatedImage || isLoading) && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Creating your masterpiece...</p>
                  <p className="text-xs text-gray-500">This may take a moment</p>
                  <p className="text-xs text-gray-500">We're using advanced AI models to generate your image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full p-4">
              <img
                src={generatedImage!}
                alt="Generated artwork"
                className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <Button
                className="absolute bottom-6 right-6 bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      )}
      {!generatedImage && !isLoading && !error && (
        <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] text-gray-400">
          <div className="text-center space-y-4 p-4">
            <div className="relative inline-block">
              <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-medium text-amber-400">Your Canvas Awaits</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">Enter your prompt and let our AI bring your vision to life</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}