import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface PromptSuggestionsProps {
  inputText: string;
  onSuggestionClick: (suggestion: string) => void;
  selectedStyle: string;
}

const basePrompts = {
  character: ["warrior", "mage", "cyberpunk hero", "ethereal fairy"],
  landscape: ["mystical forest", "futuristic city", "ancient ruins", "cosmic space"],
  style: ["oil painting", "digital art", "watercolor", "anime style"],
  mood: ["dramatic", "peaceful", "mysterious", "energetic"],
};

export function PromptSuggestions({ inputText, onSuggestionClick, selectedStyle }: PromptSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = () => {
      const input = inputText.toLowerCase();
      let newSuggestions: string[] = [];

      // Generate suggestions based on input
      Object.entries(basePrompts).forEach(([category, prompts]) => {
        prompts.forEach(prompt => {
          if (
            !input.includes(prompt.toLowerCase()) && 
            (prompt.toLowerCase().includes(input) || input.includes(prompt.toLowerCase()))
          ) {
            const enhancedPrompt = `${inputText}, ${prompt}`;
            newSuggestions.push(enhancedPrompt);
          }
        });
      });

      // Add style suggestions if none exist
      if (newSuggestions.length < 2) {
        basePrompts.style.forEach(style => {
          if (!input.includes(style.toLowerCase())) {
            newSuggestions.push(`${inputText}, ${style}`);
          }
        });
      }

      return newSuggestions.slice(0, 4); // Limit to 4 suggestions
    };

    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
  }, [inputText]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-800">
      <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Suggestions</span>
      </div>
      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left text-gray-300 hover:text-blue-400 hover:bg-black/30"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}