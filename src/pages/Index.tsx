import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Brain, Sparkles, Heart, CircuitBoard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] animate-gradient-x">
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
              <Brain className="w-8 h-8 text-amber-400 animate-pulse" />
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
                ComicForge AI
              </h1>
              <CircuitBoard className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-2 transition-all hover:scale-105">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-sm text-gray-400">Standing with Palestine</span>
            </div>
            <p className="text-gray-400 md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Transform your imagination into stunning masterpieces with our advanced AI technology
              <Sparkles className="inline-block w-4 h-4 ml-2 text-amber-400" />
            </p>
          </div>
          <div className="relative transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg blur opacity-20"></div>
            <ImageGenerator />
          </div>
          <div className="mt-24 transition-all duration-500 hover:scale-[1.01]">
            <FAQ />
          </div>
          <div className="mt-16">
            <SocialLinks />
          </div>
        </div>
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;