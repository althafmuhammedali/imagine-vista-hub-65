import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <div className="mt-12 max-w-3xl mx-auto w-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-amber-400">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            Why are you offering this model for free?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            We believe creativity should be accessible to everyone. By offering this model for free, we're breaking down barriers for aspiring artists, storytellers, and everyday users who want to explore the potential of AI-generated art without cost restrictions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            How will my donation be used?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            <p>Your donations will be used to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Improve the AI Model: Enhance its features, expand its styles, and fine-tune its capabilities to generate even more impressive and realistic images.</li>
              <li>Maintain the Free Access: Cover server costs and computing power to keep the model available and free for everyone.</li>
            </ul>
            <p className="mt-4">Your support will directly contribute to advancing AI-generated art and making it available for everyone. By helping us grow, you're empowering creatives to experiment with new art forms, democratizing access to high-quality digital art tools, and fueling future innovations in AI art.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            Can I contribute in other ways besides donating money?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            Absolutely! We appreciate any support, whether it's sharing our project with your friends, giving feedback on new features, or simply using and showcasing our AI-generated art. Building a community is just as valuable as financial contributions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            How do I know my donation will make a difference?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            We're committed to transparency and will share regular updates on how your contributions are being utilized. You can follow our progress on our blog and community channels, where we'll detail new improvements and community milestones.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            Can businesses or organizations support this AI model?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            Absolutely! We welcome support from businesses and organizations. By donating, sponsoring, or partnering with us, businesses can help push the boundaries of AI creativity while gaining visibility within a fast-growing community. Additionally, we offer tailored recognition packages for larger supporters, including branding opportunities and exclusive features.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="bg-black/20 rounded-lg border-none px-4">
          <AccordionTrigger className="text-amber-200 hover:text-amber-400">
            Will the AI model always remain free?
          </AccordionTrigger>
          <AccordionContent className="text-gray-300">
            Yes, that's our commitment! We believe in providing free access to cutting-edge creative tools. However, maintaining and improving this AI model requires resources, which is why we rely on donations. With your support, we can ensure that it remains free and continues to evolve for everyone.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
