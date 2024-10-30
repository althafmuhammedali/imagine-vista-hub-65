import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Sparkles, Heart, Flag } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-12">
          <div className="space-y-4 text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                ComicForge AI
              </h1>
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-sm text-gray-400 flex items-center gap-2">
                Standing with Palestine
                <Flag className="w-5 h-5" fill="#007A3D" stroke="white" />
              </span>
            </div>
            <p className="text-gray-400 md:text-lg max-w-2xl mx-auto font-light">
              Transform your imagination into stunning masterpieces with our state-of-the-art AI technology
            </p>
          </div>
          <ImageGenerator />
          <FAQ />
          <SocialLinks />
        </div>
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;