import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQ() {
  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-semibold text-white">Why Support Us?</h2>
      </div>
      <Accordion type="single" collapsible className="text-left">
        <AccordionItem value="gpu">
          <AccordionTrigger className="text-white hover:text-amber-400">
            GPU Acceleration
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            Your donations help us maintain high-performance GPU servers, enabling faster image generation with reduced waiting times. This ensures you get your masterpieces quickly and efficiently.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="quality">
          <AccordionTrigger className="text-white hover:text-amber-400">
            Enhanced Image Quality
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            We use advanced Karras sigmas technology for superior image quality, producing more detailed and realistic results. Your support helps us continue providing these high-quality features.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scheduler">
          <AccordionTrigger className="text-white hover:text-amber-400">
            Advanced DPMSolverMultistep Technology
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            The DPMSolverMultistep scheduler we use significantly improves image generation speed while maintaining quality. Your support helps us implement and maintain these cutting-edge technologies.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="servers">
          <AccordionTrigger className="text-white hover:text-amber-400">
            High-Performance Servers
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            We operate powerful 505-level servers to handle your image generation requests efficiently. Your donations help us maintain and upgrade this infrastructure for the best possible performance.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other-ways">
          <AccordionTrigger className="text-white hover:text-amber-400">
            Is there another way to help besides donating?
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            Definitely! You can help by:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Sharing our project on social media.</li>
              <li>Trying the model and giving us feedback.</li>
              <li>Creating and sharing your AI-generated art using our hashtag #ComicForgeAI to inspire others.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}