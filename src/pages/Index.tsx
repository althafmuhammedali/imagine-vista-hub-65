import React from 'react';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { ImageGenerator } from '@/components/ImageGenerator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Wand2 } from 'lucide-react';
import { PlatformBudget } from '@/components/PlatformBudget';
import { SocialLinks } from '@/components/SocialLinks';
import { PopupAd } from '@/components/PopupAd';
import { HeroSection } from '@/components/hero/HeroSection';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen fluid-container">
      <PopupAd />
      
      <HeroSection />

      <main className="space-y-12 mt-8">
        <Card className="glass-panel p-4 sm:p-6">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create">
                <Wand2 className="mr-2 h-4 w-4" />
                Create Art
              </TabsTrigger>
              <TabsTrigger value="enhance">
                <Sparkles className="mr-2 h-4 w-4" />
                Enhance Images
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <ImageGenerator />
            </TabsContent>
            <TabsContent value="enhance">
              <ImageGenerator mode="enhance" />
            </TabsContent>
          </Tabs>
        </Card>

        <PlatformBudget />
      </main>

      <SocialLinks />
      <PWAInstallPrompt />
    </div>
  );
};

export default IndexPage;