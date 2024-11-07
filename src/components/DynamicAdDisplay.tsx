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
    <div className="w-full py-px bg-black/5 backdrop-blur-[1px] fixed bottom-0 left-0 z-50">
      <div className="container max-w-sm mx-auto px-px relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-px -right-px bg-black/60 hover:bg-black text-white rounded-full z-10 transition-colors w-2 h-2 sm:w-2.5 sm:h-2.5 min-h-0 min-w-0 p-px"
            onClick={handleRemove}
          >
            <X className="h-1 w-1 sm:h-1.5 sm:w-1.5" />
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
                  className="w-full max-w-[60px] h-3 sm:h-4 object-contain rounded shadow-sm mx-auto"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-24 sm:w-28 bg-black/70 border-gray-800"
              side="top"
            >
              <div className="space-y-px">
                <h4 className="text-[6px] sm:text-[8px] font-medium text-amber-400">{currentAd.title}</h4>
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