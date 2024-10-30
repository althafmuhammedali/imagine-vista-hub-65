import { Loader2, ImageIcon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  generatedImage: string | null;
  isLoading: boolean;
}

export function ImagePreview({ generatedImage, isLoading }: ImagePreviewProps) {
  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl min-h-[400px] group">
      {(generatedImage || isLoading) && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
                </div>
                <p className="text-sm text-gray-400">
                  Creating your masterpiece...
                </p>
                <p className="text-xs text-gray-500">This may take a moment</p>
              </div>
            </div>
          ) : (
            <div className="h-full p-4">
              <img
                src={generatedImage!}
                alt="Generated artwork"
                className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          )}
        </div>
      )}
      {!generatedImage && !isLoading && (
        <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-medium text-amber-400">Your Canvas Awaits</p>
              <p className="text-sm text-gray-500">Your generated artwork will appear here</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}