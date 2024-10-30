import { Loader2, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
}

export function ImagePreview({ generatedImage, isLoading }: ImagePreviewProps) {
  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl min-h-[400px]">
      {(generatedImage || isLoading) && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                <p className="text-sm text-gray-400">
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
        <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
          <div className="text-center space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
            <p>Your generated image will appear here</p>
          </div>
        </div>
      )}
    </Card>
  );
}