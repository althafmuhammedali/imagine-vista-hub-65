import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { X } from 'lucide-react';
import { Button } from './ui/button';

const AD_REFRESH_INTERVAL = 5000; // 5 seconds

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % STATIC_ADS.length);
    }, AD_REFRESH_INTERVAL / STATIC_ADS.length);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const handleAdClick = () => {
    const currentAd = STATIC_ADS[currentAdIndex];
    if (currentAd?.redirect_url) {
      window.open(currentAd.redirect_url, '_blank');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const currentAd = STATIC_ADS[currentAdIndex];
  if (!currentAd) return null;

  return (
    <div className="w-full py-1 sm:py-2 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50">
      <div className="container max-w-4xl mx-auto px-4 relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 bg-black/80 hover:bg-black text-white rounded-full z-10 transition-colors"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div 
                className="cursor-pointer transition-all hover:scale-105 relative"
                onClick={handleAdClick}
              >
                <img
                  src={currentAd.display_url}
                  alt="Advertisement"
                  className="w-full max-w-xs h-12 sm:h-16 object-contain rounded-lg shadow-lg mx-auto royal-shadow"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-48 sm:w-64 bg-black/90 border-gray-800">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt="Advertisement"
                  className="w-full h-auto rounded-lg"
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