import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
}

export function ImageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (prompt: string, imageUrl: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      prompt,
      imageUrl,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10 items
    setHistory(updatedHistory);
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imageHistory');
    toast({
      title: "History Cleared",
      description: "Your image generation history has been cleared.",
    });
  };

  return (
    <Card className="p-4 backdrop-blur-xl bg-black/20 border-gray-800/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-amber-400">Recent Generations</h3>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
      <ScrollArea className="h-[300px]">
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No images generated yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex gap-4 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{item.prompt}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}