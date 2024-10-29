import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end">
      <div className="min-h-screen bg-background/95">
        <ImageGenerator />
        <SocialLinks />
      </div>
    </div>
  );
};

export default Index;