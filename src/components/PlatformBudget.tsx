import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Boxes, Battery, CircuitBoard, MonitorPlay, HardDrive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PlatformBudget() {
  const [hours, setHours] = useState(1);
  const [totalCost, setTotalCost] = useState(26);
  const { toast } = useToast();
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const RATE_LIMIT_MS = 500; // Minimum time between inputs

  const baseComponents = [
    { name: "CPU", icon: Cpu, cost: 8, description: "AMD Ryzen 5 5600X" },
    { name: "RAM", icon: Boxes, cost: 2, description: "16GB DDR4" },
    { name: "Power Supply", icon: Battery, cost: 1, description: "750W Bronze" },
    { name: "Motherboard", icon: CircuitBoard, cost: 2, description: "B550M" },
    { name: "GPU", icon: MonitorPlay, cost: 12, description: "RTX 3060 (hourly rental)" },
    { name: "Storage", icon: HardDrive, cost: 1, description: "1TB SSD (model weights)" }
  ];

  const sanitizeAndValidateInput = (value: string): number => {
    // Remove any non-numeric characters
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const numValue = parseInt(sanitizedValue) || 1;
    
    // Enforce reasonable limits
    if (numValue > 168) { // Max 1 week worth of hours
      toast({
        title: "Invalid Input",
        description: "Maximum allowed hours is 168 (1 week)",
        variant: "destructive"
      });
      return 168;
    }
    if (numValue < 1) {
      toast({
        title: "Invalid Input",
        description: "Minimum allowed hours is 1",
        variant: "destructive"
      });
      return 1;
    }
    return numValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (now - lastInputTime < RATE_LIMIT_MS) {
      return; // Rate limit exceeded
    }
    setLastInputTime(now);

    const validatedHours = sanitizeAndValidateInput(e.target.value);
    setHours(validatedHours);
  };

  useEffect(() => {
    const calculateTotal = () => {
      try {
        const hourlyGpuCost = 12 * hours;
        const fixedCosts = baseComponents.reduce((acc, component) => {
          if (component.name !== "GPU") return acc + component.cost;
          return acc;
        }, 0);
        const total = fixedCosts + hourlyGpuCost;
        
        // Validate final total
        if (total > 5000) {
          toast({
            title: "Security Alert",
            description: "Invalid total cost calculation detected",
            variant: "destructive"
          });
          return;
        }
        
        setTotalCost(total);
      } catch (error) {
        toast({
          title: "Calculation Error",
          description: "An error occurred while calculating the total",
          variant: "destructive"
        });
      }
    };

    calculateTotal();
  }, [hours, toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-2">
          Platform Budget in Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {baseComponents.map((component) => (
            <div
              key={component.name}
              className="flex items-center space-x-4 p-4 rounded-lg bg-black/20 border border-gray-800"
            >
              <component.icon className="w-6 h-6 text-amber-400" />
              <div className="flex-1">
                <p className="font-medium text-white">{component.name}</p>
                <p className="text-sm text-gray-400">{component.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-amber-400">
                  €{component.name === "GPU" ? component.cost * hours : component.cost}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4 p-4 rounded-lg bg-black/20 border border-gray-800">
          <div className="flex items-center space-x-4">
            <label htmlFor="hours" className="text-white">Hours:</label>
            <input
              id="hours"
              type="number"
              min="1"
              max="168"
              value={hours}
              onChange={handleInputChange}
              className="w-20 px-2 py-1 rounded bg-black/30 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="text-center">
            <p className="text-lg text-white">Total Cost:</p>
            <p className="text-3xl font-bold text-amber-400">€{totalCost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}