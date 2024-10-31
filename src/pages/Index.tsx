import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Sparkles, Star, Wand2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/10 via-black to-black">
      <div className="min-h-screen backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center mb-16">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-64 h-64 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-center gap-2 mb-4 animate-fade-in">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
                  ComicForge AI
                </h1>
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 transition-all hover:scale-105">
              <Star className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-sm text-gray-400">Standing with Palestine</span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-full h-32 bg-amber-500 rounded-full blur-3xl"></div>
              </div>
              <p className="relative text-gray-400 md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Transform your imagination into stunning masterpieces with our state-of-the-art AI technology
                <Wand2 className="inline-block w-5 h-5 ml-2 text-amber-400" />
              </p>
            </div>
          </div>
          <div className="transition-all duration-500 hover:scale-[1.01] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-3xl blur-3xl -z-10"></div>
            <ImageGenerator />
          </div>
          <div className="mt-24 transition-all duration-500 hover:scale-[1.01] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/20 rounded-3xl blur-3xl -z-10"></div>
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