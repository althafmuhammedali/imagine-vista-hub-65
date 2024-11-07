import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

const AD_REFRESH_INTERVAL = 5000;

const STATIC_ADS = [
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar App",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/8MydcJj/image-removebg-preview-1.png",
    title: "Great Learning",
    redirect_url: "https://www.mygreatlearning.com/academy?referrer_code=GLL44ZJATMMKQ"
  },
  {
    display_url: "https://i.ibb.co/TmpvKQ7/image-removebg-preview-2.png",
    title: "Digital Growth",
    redirect_url: "https://digitalgrowthcommunity.in/home-9400?am_id=muhammad5507"
  }
];

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % STATIC_ADS.length);
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
    <div className="w-full py-0.5 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50">
      <div className="container max-w-lg mx-auto px-1 relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-1 -right-1 bg-black/80 hover:bg-black text-white rounded-full z-10 transition-colors w-3 h-3 sm:w-4 sm:h-4 min-h-0 min-w-0 p-0.5"
            onClick={handleRemove}
          >
            <X className="h-2 w-2" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div 
                className="cursor-pointer transition-all hover:scale-105 relative"
                onClick={handleAdClick}
              >
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full max-w-[100px] h-6 sm:h-8 object-contain rounded-md shadow-sm mx-auto"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-32 sm:w-40 bg-black/90 border-gray-800"
              side="top"
            >
              <div className="space-y-1">
                <h4 className="text-[10px] sm:text-xs font-medium text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full h-auto rounded-md"
                  loading="lazy"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}