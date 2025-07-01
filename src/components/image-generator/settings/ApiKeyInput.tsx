import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Check, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { setApiKey, hasCustomApiKey } from "@/lib/api";

export function ApiKeyInput() {
  const [apiKey, setApiKeyState] = useState("");
  const [open, setOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    setHasCustomKey(hasCustomApiKey());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      toast({
        title: "Error",
        description: "Please enter a valid Hugging Face API key",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for Hugging Face API key format
    if (!trimmedKey.startsWith('hf_')) {
      toast({
        title: "Invalid Format",
        description: "Hugging Face API keys should start with 'hf_'",
        variant: "destructive",
      });
      return;
    }

    if (trimmedKey.length < 20) {
      toast({
        title: "Invalid Key",
        description: "The API key appears to be too short. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setApiKey(trimmedKey);
    setHasCustomKey(true);
    setOpen(false);
    setApiKeyState("");
    
    toast({
      title: "Success!",
      description: "API key saved successfully. You can now generate images!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-2 text-xs transition-all ${
            hasCustomKey 
              ? "bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400" 
              : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400"
          }`}
        >
          {hasCustomKey ? (
            <>
              <Check className="w-3 h-3" />
              API Key Active
            </>
          ) : (
            <>
              <Key className="w-3 h-3" />
              Set API Key
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-amber-400">Hugging Face API Key</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your Hugging Face API key to use your own account for image generation.
            <br />
            <a 
              href="https://huggingface.co/settings/tokens" 
              target="_blank" 
              rel="noreferrer" 
              className="text-amber-500 hover:underline inline-flex items-center gap-1 mt-2"
            >
              Get your API key here →
            </a>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="hf-api-key"
              type="password"
              placeholder="hf_********************************"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="col-span-3 bg-black/20 border-gray-700 focus:border-amber-500 text-white"
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3" />
              Your API key is stored locally and never shared
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
