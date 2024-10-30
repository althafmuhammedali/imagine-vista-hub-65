import { Loader2, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
}

export function ImagePreview({ generatedImage, isLoading }: ImagePreviewProps) {
  return (
    <Card className="relative overflow-hidden">
      {(generatedImage || isLoading) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Creating your masterpiece...
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full p-4">
              <img
                src={generatedImage!}
                alt="Generated"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      )}
      {!generatedImage && !isLoading && (
        <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
          <div className="text-center space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
            <p>Your generated image will appear here</p>
          </div>
        </div>
      )}
    </Card>
  );
}