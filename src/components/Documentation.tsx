import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Image, MessageCircle, PenLine, Wand2 } from "lucide-react";

export function Documentation() {
  return (
    <Card className="backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
              <PenLine className="w-6 h-6" />
              How to Use ComicForge AI
            </h2>
            <p className="text-gray-400">
              Learn how to create amazing artwork with our AI tools
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="image-generation" className="bg-black/20 rounded-lg border-none px-4">
              <AccordionTrigger className="text-amber-200 hover:text-amber-400">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Image Generation
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 space-y-3">
                <p>To generate an image:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Enter a detailed description of your desired image in the prompt field</li>
                  <li>Optionally, specify what you don't want in the image using the "Refine Your Image" field</li>
                  <li>Choose your preferred image size from the dropdown menu</li>
                  <li>Optionally, set a seed number for reproducible results</li>
                  <li>Click "Generate Artwork" and wait for your masterpiece!</li>
                </ol>
                <p className="mt-4 text-sm text-amber-400/80">
                  Tip: Be specific in your prompts! Include details about style, lighting, and atmosphere.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-chat" className="bg-black/20 rounded-lg border-none px-4">
              <AccordionTrigger className="text-amber-200 hover:text-amber-400">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Chat Assistant
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 space-y-3">
                <p>Our AI chat assistant can help you:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Get prompt suggestions for image generation</li>
                  <li>Learn more about AI art creation</li>
                  <li>Troubleshoot any issues you encounter</li>
                </ul>
                <p>To use the chat:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Click the chat bubble icon in the bottom right corner</li>
                  <li>Type your question or request</li>
                  <li>Press Enter or click the send button</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tips" className="bg-black/20 rounded-lg border-none px-4">
              <AccordionTrigger className="text-amber-200 hover:text-amber-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Pro Tips
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 space-y-3">
                <p>To get the best results:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use descriptive adjectives in your prompts (e.g., "vibrant," "detailed," "atmospheric")</li>
                  <li>Specify art styles (e.g., "digital art," "oil painting," "watercolor")</li>
                  <li>Include lighting details (e.g., "sunset lighting," "dramatic shadows")</li>
                  <li>Use the negative prompt to remove unwanted elements</li>
                  <li>Save the seed number of images you like to recreate similar styles</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features" className="bg-black/20 rounded-lg border-none px-4">
              <AccordionTrigger className="text-amber-200 hover:text-amber-400">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Key Features
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li>High-quality image generation using state-of-the-art AI models</li>
                  <li>Multiple image size options for different use cases</li>
                  <li>Seed control for reproducible results</li>
                  <li>Negative prompts for fine-tuned control</li>
                  <li>Intelligent AI chat assistant for help and guidance</li>
                  <li>Free to use!</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}