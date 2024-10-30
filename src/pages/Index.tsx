import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { Sparkles, Wand2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black">
      <div className="min-h-screen backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-12">
          <div className="space-y-6 text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-center gap-2 mb-4">
                <Wand2 className="w-10 h-10 text-amber-400 animate-pulse" />
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  ComicForge AI
                </h1>
                <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-400 md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Transform your imagination into stunning masterpieces with our state-of-the-art AI technology. 
              Create unique, photorealistic artwork in seconds.
            </p>
          </div>
          <ImageGenerator />
          <SocialLinks />
        </div>
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;