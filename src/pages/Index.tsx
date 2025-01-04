import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { ChatBot } from "@/components/chat/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Documentation } from "@/components/Documentation";
import { DynamicAdDisplay } from "@/components/DynamicAdDisplay";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Hero } from "@/components/home/Hero";
import { FeedbackForm } from "@/components/home/FeedbackForm";
import { ImageHistory } from "@/components/image-generator/ImageHistory";
import { ImageStats } from "@/components/image-generator/ImageStats";
import { ImageShortcuts } from "@/components/image-generator/ImageShortcuts";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProgramInfoPopup } from "@/components/ProgramInfoPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background animate-gradient-x">
      <Alert className="sticky top-0 z-50 rounded-none border-none bg-amber-500/10 backdrop-blur-sm">
        <Info className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200 text-xs sm:text-sm">
         The platform is currently facing some issues with generating AI images. Your support can help make it a more powerful tool, accessible to everyone. Any donation, no matter the amount, will make a difference
        </AlertDescription>
      </Alert>
      
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
          <ProgramInfoPopup />
          <AuthButtons />
        </div>

        <div className="container max-w-7xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
          <Suspense fallback={<LoadingSpinner />}>
            <Hero />
          </Suspense>

          <section className="space-y-8 sm:space-y-12">
            <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
              <Suspense fallback={<LoadingSpinner />}>
                <ImageGenerator />
              </Suspense>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<LoadingSpinner />}>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                  <ImageHistory />
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                  <ImageStats />
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
                  <ImageShortcuts />
                </div>
              </Suspense>
            </div>

            <div className="grid gap-8 sm:gap-12">
              <Suspense fallback={<LoadingSpinner />}>
                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <FAQ />
                </div>

                <div className="transition-all duration-500 hover:scale-[1.01] shadow-xl">
                  <Documentation />
                </div>
              </Suspense>
            </div>

            <div className="bg-black/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <Suspense fallback={<LoadingSpinner />}>
                <FeedbackForm />
              </Suspense>
            </div>
          </section>

          <footer>
            <SocialLinks />
          </footer>
        </div>

        <div className="fixed bottom-4 right-4 z-40">
          <ChatBot />
        </div>
      </div>
      
      <DynamicAdDisplay />
    </div>
  );
};

export default Index;