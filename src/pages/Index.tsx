import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { DynamicAdDisplay } from "@/components/DynamicAdDisplay";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Hero } from "@/components/home/Hero";
import { FeedbackForm } from "@/components/home/FeedbackForm";
import { ImageHistory } from "@/components/image-generator/ImageHistory";
import { ImageStats } from "@/components/image-generator/ImageStats";
import { ImageShortcuts } from "@/components/image-generator/ImageShortcuts";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] animate-gradient-x">
      <Alert className="rounded-none border-none bg-amber-500/10 backdrop-blur-sm">
        <Info className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200 text-xs sm:text-sm">
          This platform's prompt generation is heavily influenced by our unique prompting style
        </AlertDescription>
      </Alert>
      
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-2 sm:py-4 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
          <Hero />

          <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <ImageGenerator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ImageHistory />
              <ImageStats />
              <ImageShortcuts />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <FAQ />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <Documentation />
            </div>

            <FeedbackForm />

            <div>
              <SocialLinks />
            </div>
          </div>
        </div>
        <ChatBot />
      </div>
      <DynamicAdDisplay />
    </div>
  );
};

export default Index;