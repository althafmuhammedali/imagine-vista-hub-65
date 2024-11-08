import { useRef } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { SocialLinks } from "@/components/SocialLinks";
import { AuthButtons } from "@/components/AuthButtons";
import { Documentation } from "@/components/Documentation";
import { PlatformBudget } from "@/components/PlatformBudget";
import { Sparkles, ArrowRight, Download, Share2, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const imageGeneratorRef = useRef<HTMLDivElement>(null);

  const scrollToImageGenerator = () => {
    imageGeneratorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    {
      title: "Input Your Idea",
      description: "Describe your vision in detail",
      icon: Sparkles,
    },
    {
      title: "AI Generates",
      description: "Watch as AI brings your idea to life",
      icon: ArrowRight,
    },
    {
      title: "Download & Share",
      description: "Save and share your creation",
      icon: Share2,
    },
  ];

  const testimonials = [
    {
      quote: "This AI completely transformed how I create art!",
      author: "Sarah K.",
      rating: 5,
    },
    {
      quote: "Incredible results with minimal effort. A game-changer.",
      author: "Michael R.",
      rating: 5,
    },
    {
      quote: "The quality of generated images is outstanding.",
      author: "David L.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-background/80 backdrop-blur-sm" />
        <div className="container relative z-10 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Unlock Creativity with AI
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning artwork with our state-of-the-art AI
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={scrollToImageGenerator}
          >
            Generate Art Now
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="bg-black/40 border-primary/20">
                <CardHeader>
                  <step.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Generator */}
      <section ref={imageGeneratorRef} className="py-20">
        <div className="container">
          <ImageGenerator />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            What Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-lg mb-4">{testimonial.quote}</p>
                  <p className="text-sm text-muted-foreground">
                    - {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="py-20">
        <div className="container">
          <Documentation />
        </div>
      </section>

      {/* Platform Budget */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container">
          <PlatformBudget />
        </div>
      </section>

      {/* Footer */}
      <footer>
        <SocialLinks />
      </footer>
    </div>
  );
};

export default Index;