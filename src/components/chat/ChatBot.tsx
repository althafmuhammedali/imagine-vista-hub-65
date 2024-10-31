import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { toast } from "@/components/ui/use-toast";

const INITIAL_MESSAGE = "Hi! I'm ForgeAI, your creative assistant. I can help you with:\n• Generating effective prompts\n• Learning AI art techniques\n• Troubleshooting issues\n\nWhat would you like to explore?";

const PROMPT_SUGGESTIONS = {
  fantasy: ["magical forest with glowing crystals", "ancient dragon's lair with treasure"],
  scifi: ["futuristic cityscape with flying cars", "alien marketplace with exotic creatures"],
  nature: ["serene mountain lake at sunset", "mystical garden with rare flowers"],
  portrait: ["cyberpunk character with neon accessories", "ethereal fairy queen with butterfly wings"]
};

const ART_TIPS = [
  "Use specific adjectives to describe textures and materials",
  "Include lighting details like 'golden hour' or 'dramatic shadows'",
  "Specify art styles like 'oil painting' or 'digital art'",
  "Add atmospheric elements like 'misty', 'ethereal', or 'dramatic'"
];

async function getChatResponse(message: string): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing Hugging Face API key");
  }

  // Enhance the prompt with art-specific context
  const enhancedMessage = `As an AI art assistant, help with this request: ${message}. 
    If it's about prompts, suggest specific details and artistic elements.
    If it's about techniques, explain clearly with examples.
    If it's troubleshooting, provide step-by-step solutions.`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: enhancedMessage,
        options: {
          wait_for_model: true
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get response from AI");
  }

  const result = await response.json();
  return result[0].generated_text;
}

function getQuickSuggestion(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("prompt") || lowerMessage.includes("suggestion")) {
    const categories = Object.keys(PROMPT_SUGGESTIONS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const suggestions = PROMPT_SUGGESTIONS[randomCategory as keyof typeof PROMPT_SUGGESTIONS];
    return `Here's a creative prompt suggestion: "${suggestions[Math.floor(Math.random() * suggestions.length)]}"`;
  }
  
  if (lowerMessage.includes("tip") || lowerMessage.includes("technique")) {
    return `Pro Tip: ${ART_TIPS[Math.floor(Math.random() * ART_TIPS.length)]}`;
  }
  
  return null;
}

export function ChatBot() {
  const [messages, setMessages] = useState([{ text: INITIAL_MESSAGE, isBot: true }]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      // First check for quick suggestions
      const quickResponse = getQuickSuggestion(userMessage);
      if (quickResponse) {
        setMessages((prev) => [...prev, { text: quickResponse, isBot: true }]);
      } else {
        const botResponse = await getChatResponse(userMessage);
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[440px] h-[96vh] sm:h-[600px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            ForgeAI Creative Assistant
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isBot={message.isBot}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about prompts, tips, or troubleshooting..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}