import { Globe, Heart } from "lucide-react";
import { ReferralShare } from "./ReferralShare";
import { PaymentDialog } from "./payments/PaymentDialog";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { SocialMediaLinks } from "./social/SocialMediaLinks";
import { FeedbackForm } from "./feedback/FeedbackForm";

export function SocialLinks() {
  return (
    <footer className="w-full py-6 sm:py-8 mt-8 sm:mt-12 border-t border-amber-900/20 bg-black/90 backdrop-blur-sm z-10">
      <div className="container flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-2 text-amber-400">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          <p className="text-sm sm:text-base font-medium">
            Kerala's First AI Image Generation Platform
          </p>
        </div>

        <p className="text-xs sm:text-sm text-amber-300">
          Built and maintained by Muhammed Adnan
        </p>

        <TooltipProvider>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <SocialMediaLinks />
            
            <PaymentDialog handleRazorpayClick={() => {}} />

            <Tooltip>
              <TooltipTrigger asChild>
                <ReferralShare />
              </TooltipTrigger>
              <TooltipContent>
                <p>Share ComicForge AI</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        
        <FeedbackForm />

        <a 
          href="https://www.producthunt.com/posts/comicforgeai?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-comicforgeai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity mt-2 sm:mt-4"
        >
          <img 
            src="https://s3.producthunt.com/static/badges/daily1.svg"
            alt="ComicForge AI - Daily #1 Product on Product Hunt"
            className="h-8 sm:h-10 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}