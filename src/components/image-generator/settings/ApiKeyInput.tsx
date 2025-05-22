
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Check } from "lucide-react";
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
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Hugging Face API key",
        variant: "destructive",
      });
      return;
    }

    setApiKey(apiKey.trim());
    setHasCustomKey(true);
    setOpen(false);
    
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-2 text-xs ${hasCustomKey ? "bg-green-500/10 hover:bg-green-500/20 border-green-500/30" : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30"}`}
        >
          {hasCustomKey ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              API Key Set
            </>
          ) : (
            <>
              <Key className="w-3 h-3 text-amber-500" />
              Set API Key
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hugging Face API Key</DialogTitle>
          <DialogDescription>
            Enter your Hugging Face API key to use your own account for image generation.
            Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Hugging Face Settings</a>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="hf-api-key"
            placeholder="hf_********************************"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            className="col-span-3"
          />
          <DialogFooter>
            <Button type="submit">Save API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
