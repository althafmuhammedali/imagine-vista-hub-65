import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export function GenerateButton({ onGenerate, isLoading }: GenerateButtonProps) {
  return (
    <Button
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg transform transition-transform hover:scale-[1.02] will-change-transform min-h-[44px] touch-manipulation text-base sm:text-lg py-3 sm:py-4"
      size="lg"
      onClick={onGenerate}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
          Creating Magic...
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Generate Artwork
        </>
      )}
    </Button>
  );
}