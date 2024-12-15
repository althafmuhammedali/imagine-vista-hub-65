import { Sparkles, Shield, Star, Briefcase, Zap, Heart } from "lucide-react";

export function Hero() {
  return (
    <div className="space-y-6 sm:space-y-8 text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
        <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 text-amber-400 animate-pulse" />
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-gradient-x">
          ComicForge AI
        </h1>
        <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 text-amber-400 animate-pulse" />
      </div>
      
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400" />
            <span className="text-sm sm:text-base text-gray-300">Secure Platform</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Star className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400" />
            <span className="text-sm sm:text-base text-gray-300">Premium Quality</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Briefcase className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400" />
            <span className="text-sm sm:text-base text-gray-300">Professional Tools</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all">
            <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400" />
            <span className="text-sm sm:text-base text-gray-300">Fast Generation</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 transition-all hover:scale-105 bg-black/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse" />
          <span className="text-sm sm:text-base text-gray-300">Standing with Palestine</span>
        </div>
      </div>
      
      <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-gray-300 px-4 sm:px-6">
        Transform your creative vision into stunning masterpieces with our enterprise-grade AI technology
      </p>
    </div>
  );
}