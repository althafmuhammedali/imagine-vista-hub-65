import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export function ImageShortcuts() {
  const [shortcuts] = useState<Shortcut[]>([
    {
      key: "⌘/Ctrl + Enter",
      description: "Generate Image",
      action: () => {
        toast({
          title: "Shortcut Used",
          description: "Image generation started",
        });
      }
    },
    {
      key: "⌘/Ctrl + S",
      description: "Save Image",
      action: () => {
        toast({
          title: "Shortcut Used",
          description: "Image saved",
        });
      }
    },
    {
      key: "⌘/Ctrl + Z",
      description: "Undo Last Change",
      action: () => {
        toast({
          title: "Shortcut Used",
          description: "Last change undone",
        });
      }
    }
  ]);

  return (
    <Card className="p-4 backdrop-blur-xl bg-black/20 border-gray-800/50">
      <div className="flex items-center gap-2 mb-4">
        <Command className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-amber-400">Keyboard Shortcuts</h3>
      </div>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 transition-colors"
          >
            <span className="text-sm text-gray-300">{shortcut.description}</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-black/30 rounded text-gray-400 border border-gray-700">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </Card>
  );
}