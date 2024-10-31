import { Sparkles } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface PromptExample {
  category: string;
  prompts: string[];
}

interface PromptExampleCardProps {
  examples: PromptExample[];
  setPrompt: (prompt: string) => void;
}

export function PromptExampleCard({ examples, setPrompt }: PromptExampleCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-amber-400 group"
        >
          Need inspiration?
          <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse text-amber-400" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[280px] sm:w-96 bg-black/90 border-gray-800">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Spark Your Imagination
          </h4>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {examples.map((category, i) => (
              <div key={i} className="space-y-2">
                <h5 className="text-xs font-medium text-amber-300/80">
                  {category.category}
                </h5>
                <div className="grid gap-2">
                  {category.prompts.map((example, j) => (
                    <div
                      key={j}
                      className="p-2 rounded-md hover:bg-white/5 cursor-pointer transition-all duration-200 group"
                      onClick={() => setPrompt(example)}
                    >
                      <p className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors">
                        {example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Click any prompt to use it as your starting point
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}