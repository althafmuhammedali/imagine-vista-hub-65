import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

const AD_REFRESH_INTERVAL = 5000;

const STATIC_ADS = [
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar App - Business Accounting Software",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar App - Simplify Your Business",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/8MydcJj/image-removebg-preview-1.png",
    title: "Great Learning - Transform Your Career",
    redirect_url: "https://www.mygreatlearning.com/academy?referrer_code=GLL44ZJATMMKQ"
  },
  {
    display_url: "https://i.ibb.co/TmpvKQ7/image-removebg-preview-2.png",
    title: "Digital Growth Community",
    redirect_url: "https://digitalgrowthcommunity.in/home-9400?am_id=muhammad5507"
  }
];

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % STATIC_ADS.length);
      setIsImageLoaded(false);
    }, AD_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const handleAdClick = () => {
    const currentAd = STATIC_ADS[currentAdIndex];
    if (currentAd?.redirect_url) {
      window.open(currentAd.redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const currentAd = STATIC_ADS[currentAdIndex];
  if (!currentAd) return null;

  return (
    <div className="w-full py-2 sm:py-3 md:py-4 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50 border-t border-primary/10">
      <div className="container max-w-4xl mx-auto px-4 relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 bg-black/80 hover:bg-black text-white rounded-full z-10 transition-colors w-6 h-6 sm:w-8 sm:h-8"
            onClick={handleRemove}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div 
                className="cursor-pointer transition-all hover:scale-105 relative"
                onClick={handleAdClick}
              >
                <div className={`transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <img
                    src={currentAd.display_url}
                    alt={currentAd.title}
                    className="w-full max-w-xs h-12 sm:h-16 md:h-20 object-contain rounded-lg shadow-lg mx-auto royal-shadow"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsImageLoaded(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw"
                  />
                </div>
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-48 sm:w-64 md:w-72 bg-black/90 border-gray-800 backdrop-blur-md"
              side="top"
            >
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-semibold text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}