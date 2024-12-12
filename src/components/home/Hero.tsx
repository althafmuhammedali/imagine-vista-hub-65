import { Sparkles, Shield, Star, Briefcase, Zap, Heart } from "lucide-react";

export function Hero() {
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center mb-4 sm:mb-6 md:mb-12 animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
          ComicForge AI
        </h1>
        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
      </div>
      
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 md:gap-8 my-4 sm:my-6">
          <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
            <span className="text-xs sm:text-sm text-gray-400">Secure Platform</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
            <span className="text-xs sm:text-sm text-gray-400">Premium Quality</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
            <span className="text-xs sm:text-sm text-gray-400">Professional Tools</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
            <span className="text-xs sm:text-sm text-gray-400">Fast Generation</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 transition-all hover:scale-105 mb-3 sm:mb-4 bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
          <span className="text-xs sm:text-sm text-gray-400">Standing with Palestine</span>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed text-gray-400 px-3 sm:px-4">
        Transform your creative vision into stunning masterpieces with our enterprise-grade AI technology
      </p>
    </div>
  );
}