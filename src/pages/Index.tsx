import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { PlatformBudget } from "@/components/PlatformBudget";
import { DynamicAdDisplay } from "@/components/DynamicAdDisplay";
import { Sparkles, Rocket, Star, Gem, Infinity, Heart, Award } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] animate-gradient-x">
      <Alert className="rounded-none border-none bg-amber-500/10 backdrop-blur-sm">
        <Rocket className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200">
          Experience next-gen AI art creation with our unique prompting style and advanced features
        </AlertDescription>
      </Alert>
      
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <AuthButtons />
        <div className="container max-w-6xl py-4 sm:py-6 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 md:space-y-6 text-center mb-6 sm:mb-8 md:mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gem className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
                ComicForge AI
              </h1>
              <Gem className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 my-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Infinity className="w-6 h-6 text-amber-400" />
                  <span className="text-sm text-gray-400">Unlimited Creativity</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Star className="w-6 h-6 text-amber-400" />
                  <span className="text-sm text-gray-400">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Rocket className="w-6 h-6 text-amber-400" />
                  <span className="text-sm text-gray-400">Next-Gen AI</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span className="text-sm text-gray-400">Fast Generation</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 transition-all hover:scale-105 mb-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-400">Standing with Palestine</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-200">Featured on Product Hunt</span>
              </div>
              
              <a 
                href={`https://www.producthunt.com/posts/comicforgeai?api_key=${import.meta.env.VITE_PRODUCTHUNT_API_KEY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-90 transition-opacity"
              >
                <img 
                  src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=564210&theme=light&period=daily&api_key=${import.meta.env.VITE_PRODUCTHUNT_API_KEY}`}
                  alt="ComicForge AI - Create professional 40K AI art & images instantly | Product Hunt"
                  width={250}
                  height={54}
                  className="w-[250px] h-[54px]"
                  loading="lazy"
                />
              </a>
            </div>

            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-gray-400 px-4">
              Experience the future of AI art creation with our enterprise-grade technology. Unlike other platforms, we offer advanced features like custom negative prompts, seed control, and AI-assisted creativity.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <ImageGenerator />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <FAQ />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <Documentation />
            </div>

            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
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
