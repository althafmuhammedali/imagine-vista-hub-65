import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Paintbrush, Camera, Palette, Sparkles, Brush } from "lucide-react";

interface StyleControlsProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const styles = [
  { id: "realistic", label: "Realistic", icon: Camera },
  { id: "artistic", label: "Artistic", icon: Palette },
  { id: "anime", label: "Anime", icon: Brush },
  { id: "fantasy", label: "Fantasy", icon: Sparkles },
  { id: "abstract", label: "Abstract", icon: Paintbrush },
];

export function StyleControls({ selectedStyle, onStyleChange }: StyleControlsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Choose Your Style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {styles.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedStyle === id ? "default" : "outline"}
            className={`flex flex-col items-center gap-2 p-4 h-auto transition-all ${
              selectedStyle === id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            }`}
            onClick={() => onStyleChange(id)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}