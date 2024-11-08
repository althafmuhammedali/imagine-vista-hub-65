import { useState, useEffect, useCallback } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const AD_REFRESH_INTERVAL = 5000;
const POPUP_DELAY = 30000; // 30 seconds

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
  },
  {
    display_url: "https://i.ibb.co/9bLj1zz/image-removebg-preview-3.png",
    title: "Support",
    redirect_url: "https://rzp.io/rzp/jcLyIhz"
  }
];

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const { toast } = useToast();

  // Handle exit intent
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0) {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    // Show popup after delay
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, POPUP_DELAY);

    // Add exit intent detection
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(popupTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

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
      toast({
        title: "Opening advertisement",
        description: `Redirecting to ${currentAd.title}`,
      });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    toast({
      title: "Advertisement hidden",
      description: "You can refresh the page to see ads again",
    });
  };

  const currentAd = STATIC_ADS[currentAdIndex];
  if (!currentAd) return null;

  return (
    <>
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-[425px] bg-black/80 border-gray-800">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-400">{currentAd.title}</h2>
            <img
              src={currentAd.display_url}
              alt={currentAd.title}
              className="w-full h-auto rounded-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={handleAdClick}
            />
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black"
              onClick={handleAdClick}
            >
              Learn More
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full py-1 bg-black/10 backdrop-blur-sm fixed bottom-0 left-0 z-50">
        <div className="container max-w-[468px] mx-auto px-4 relative">
          <div className="relative flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-black/80 hover:bg-black text-white rounded-full z-10 transition-colors"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div 
                  className="cursor-pointer transition-all hover:scale-105 relative"
                  onClick={handleAdClick}
                >
                  <div className="w-[468px] h-[40px] relative">
                    <img
                      src={currentAd.display_url}
                      alt={currentAd.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-64 bg-black/60 border-gray-800"
                side="top"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-amber-400">{currentAd.title}</h4>
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
    </>
  );
}