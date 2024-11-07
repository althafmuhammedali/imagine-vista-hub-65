import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

const AD_REFRESH_INTERVAL = 5000;

const STATIC_ADS = [
  {
    display_url: "https://i.ibb.co/BTB2sfN/image-removebg-preview.png",
    title: "Vyapar",
    redirect_url: "https://vyaparapp.in/?referrer_code=NVZ52VY"
  },
  {
    display_url: "https://i.ibb.co/8MydcJj/image-removebg-preview-1.png",
    title: "Learn",
    redirect_url: "https://www.mygreatlearning.com/academy?referrer_code=GLL44ZJATMMKQ"
  },
  {
    display_url: "https://i.ibb.co/TmpvKQ7/image-removebg-preview-2.png",
    title: "Grow",
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
    <div className="w-full py-[0.5px] bg-black/5 backdrop-blur-[0.5px] fixed bottom-0 left-0 z-50">
      <div className="container max-w-xs mx-auto px-[0.5px] relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-[0.5px] -right-[0.5px] bg-black/50 hover:bg-black text-white rounded-full z-10 transition-colors w-1.5 h-1.5 sm:w-2 sm:h-2 min-h-0 min-w-0 p-[0.5px]"
            onClick={handleRemove}
          >
            <X className="h-[3px] w-[3px] sm:h-1 sm:w-1" />
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
                  className="w-full max-w-[40px] h-2 sm:h-3 object-contain rounded shadow-sm mx-auto"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-20 sm:w-24 bg-black/60 border-gray-800"
              side="top"
            >
              <div className="space-y-[0.5px]">
                <h4 className="text-[4px] sm:text-[6px] font-medium text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt={currentAd.title}
                  className="w-full h-auto rounded"
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