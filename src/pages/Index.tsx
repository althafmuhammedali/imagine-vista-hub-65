import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { Sparkles } from "lucide-react";

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
            <p className="text-gray-400 md:text-lg max-w-2xl mx-auto font-light">
              Transform your imagination into stunning masterpieces with our state-of-the-art AI technology
            </p>
          </div>
          <ImageGenerator />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default Index;