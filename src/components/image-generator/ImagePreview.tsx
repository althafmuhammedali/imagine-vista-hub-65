import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ImagePreviewProps {
  isLoading: boolean;
  generatedImage: string | null;
}

export function ImagePreview({ isLoading, generatedImage }: ImagePreviewProps) {
  return (
    <Card className="relative overflow-hidden min-h-[300px] md:min-h-[400px] w-full">
      {(generatedImage || isLoading) && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Creating your masterpiece...
                </p>
              </div>
            </div>
          ) : generatedImage && (
            <div className="h-full p-4">
              <img
                src={generatedImage}
                alt="Generated artwork"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      )}
      {!generatedImage && !isLoading && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
            <p>Your generated image will appear here</p>
          </div>
        </div>
      )}
    </Card>
  );
}