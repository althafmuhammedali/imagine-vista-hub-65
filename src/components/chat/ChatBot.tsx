import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

const INITIAL_MESSAGE = "Hi! I'm your AI assistant. I can help you with image generation. What would you like to know?";

const helpfulResponses: Record<string, string> = {
  default: "I'm here to help! You can ask me about image generation, prompts, or any other features.",
  prompt: "To create better images, try being specific in your prompts. Include details about style (e.g., 'watercolor', 'digital art'), mood, lighting, and composition.",
  resolution: "You can choose between different resolutions: Square (1:1), Landscape (16:9), or Portrait (9:16). Pick the one that best suits your needs!",
  error: "If you're seeing an error, try refreshing the page or adjusting your prompt. Avoid using explicit or offensive content.",
  download: "You can download your generated images by clicking the download button that appears below each generated image.",
  quality: "For better quality, try adding descriptive terms like 'high quality', 'detailed', 'sharp', or specify the artistic style you want.",
};

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("prompt") || lowerMessage.includes("write")) return helpfulResponses.prompt;
  if (lowerMessage.includes("resolution") || lowerMessage.includes("size")) return helpfulResponses.resolution;
  if (lowerMessage.includes("error") || lowerMessage.includes("not working")) return helpfulResponses.error;
  if (lowerMessage.includes("download") || lowerMessage.includes("save")) return helpfulResponses.download;
  if (lowerMessage.includes("quality") || lowerMessage.includes("better")) return helpfulResponses.quality;
  return helpfulResponses.default;
}

export function ChatBot() {
  const [messages, setMessages] = useState([{ text: INITIAL_MESSAGE, isBot: true }]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getResponse(userMessage);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 500);
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
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[440px] h-[96vh] sm:h-[600px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>AI Assistant</SheetTitle>
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
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}