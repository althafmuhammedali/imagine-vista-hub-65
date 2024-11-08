import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Boxes, Battery, CircuitBoard, MonitorPlay, HardDrive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PlatformBudget() {
  const [hours, setHours] = useState(1);
  const [totalCost, setTotalCost] = useState(26);
  const { toast } = useToast();
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const RATE_LIMIT_MS = 500;

  const baseComponents = [
    { name: "CPU", icon: Cpu, cost: 8, description: "AMD Ryzen 5 5600X" },
    { name: "RAM", icon: Boxes, cost: 2, description: "16GB DDR4" },
    { name: "Power Supply", icon: Battery, cost: 1, description: "750W Bronze" },
    { name: "Motherboard", icon: CircuitBoard, cost: 2, description: "B550M" },
    { name: "GPU", icon: MonitorPlay, cost: 12, description: "RTX 3060 (hourly rental)" },
    { name: "Storage", icon: HardDrive, cost: 1, description: "1TB SSD (model weights)" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (now - lastInputTime < RATE_LIMIT_MS) return;
    setLastInputTime(now);

    const value = e.target.value;
    const numValue = parseInt(value) || 1;
    
    if (numValue > 168) {
      toast({
        title: "Invalid Input",
        description: "Maximum allowed hours is 168 (1 week)",
        variant: "destructive"
      });
      setHours(168);
      return;
    }
    
    if (numValue < 1) {
      toast({
        title: "Invalid Input",
        description: "Minimum allowed hours is 1",
        variant: "destructive"
      });
      setHours(1);
      return;
    }
    
    setHours(numValue);
  };

  useEffect(() => {
    const hourlyGpuCost = 12 * hours;
    const fixedCosts = baseComponents.reduce((acc, component) => {
      if (component.name !== "GPU") return acc + component.cost;
      return acc;
    }, 0);
    setTotalCost(fixedCosts + hourlyGpuCost);
  }, [hours]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          Platform Budget in Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {baseComponents.map((component) => (
            <div
              key={component.name}
              className="flex items-center space-x-4 p-4 rounded-lg bg-card border"
            >
              <component.icon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{component.name}</p>
                <p className="text-sm text-muted-foreground">{component.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary">
                  €{component.name === "GPU" ? component.cost * hours : component.cost}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border">
          <div className="flex items-center space-x-4">
            <label htmlFor="hours" className="font-medium">Hours:</label>
            <input
              id="hours"
              type="number"
              min="1"
              max="168"
              value={hours}
              onChange={handleInputChange}
              className="w-24 px-3 py-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Total Cost:</p>
            <p className="text-3xl font-bold text-primary">€{totalCost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}