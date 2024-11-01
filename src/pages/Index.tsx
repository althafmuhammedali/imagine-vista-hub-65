import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { PlatformBudget } from "@/components/PlatformBudget";
import { DynamicAdDisplay } from "@/components/DynamicAdDisplay";
import { Sparkles, Briefcase, Shield, Star, Heart, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="min-h-screen backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 md:space-y-8 text-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
                ComicForge AI
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-8">
              {[
                { icon: Shield, text: "Secure Platform", color: "blue" },
                { icon: Star, text: "Premium Quality", color: "teal" },
                { icon: Briefcase, text: "Professional Tools", color: "green" },
                { icon: Zap, text: "Fast Generation", color: "emerald" }
              ].map(({ icon: Icon, text, color }, index) => (
                <div key={index} 
                     className="glass-morphism rounded-2xl p-6 transition-all duration-300 hover:scale-105">
                  <Icon className={`w-6 h-6 mx-auto mb-3 text-${color}-500`} />
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 glass-morphism px-6 py-3 rounded-full mx-auto w-fit">
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm text-gray-600">Standing with Palestine</span>
            </div>

            <p className="text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-gray-600 px-4">
              Transform your creative vision into stunning masterpieces with our enterprise-grade AI technology
            </p>
          </div>

          <div className="space-y-12 sm:space-y-16 md:space-y-20">
            <div className="transition-all duration-500 hover:scale-[1.01] soft-shadow">
              <ImageGenerator />
            </div>

            <div className="glass-morphism rounded-2xl p-6 transition-all duration-300">
              <FAQ />
            </div>

            <div className="glass-morphism rounded-2xl p-6 transition-all duration-300">
              <Documentation />
            </div>

            <div className="glass-morphism rounded-2xl p-6 transition-all duration-300">
              <PlatformBudget />
            </div>

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