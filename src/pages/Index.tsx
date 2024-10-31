import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { PlatformBudget } from "@/components/PlatformBudget";
import { Sparkles, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] animate-gradient-x">
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-4 sm:py-6 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 md:space-y-6 text-center mb-6 sm:mb-8 md:mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
                ComicForge AI
              </h1>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-2 transition-all hover:scale-105">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-gray-400">Standing with Palestine</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-gray-400 px-4">
              Transform your imagination into stunning masterpieces with our state-of-the-art AI technology
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
            <div className="transition-all duration-500 hover:scale-[1.01]">
              <PlatformBudget />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01]">
              <ImageGenerator />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01]">
              <FAQ />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01]">
              <Documentation />
            </div>

            <div>
              <SocialLinks />
            </div>
          </div>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}

export default Index;