import { ImageIcon, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SocialShareButton } from "./SocialShareButton";

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

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl min-h-[300px] md:min-h-[400px] group transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
      {error && (
        <Alert variant="destructive" className="m-4 animate-fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-amber-400 animate-pulse">Generating your masterpiece...</div>
        </div>
      ) : generatedImage ? (
        <div className="h-full p-4 animate-fade-in relative">
          <img
            src={generatedImage}
            alt="Generated artwork"
            className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
          />
          <Button
            onClick={handleDownload}
            className="absolute bottom-6 right-6 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <SocialShareButton imageUrl={generatedImage} />
        </div>
      ) : !error && (
        <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] text-gray-400">
          <div className="text-center space-y-4 p-4 animate-fade-in">
            <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
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