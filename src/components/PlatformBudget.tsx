import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Boxes, Battery, CircuitBoard, MonitorPlay, HardDrive } from "lucide-react";

export function PlatformBudget() {
  const [hours, setHours] = useState(1);
  const [totalCost, setTotalCost] = useState(26);

  const baseComponents = [
    { name: "CPU", icon: Cpu, cost: 8, description: "AMD Ryzen 5 5600X" },
    { name: "RAM", icon: Boxes, cost: 2, description: "16GB DDR4" },
    { name: "Power Supply", icon: Battery, cost: 1, description: "750W Bronze" },
    { name: "Motherboard", icon: CircuitBoard, cost: 2, description: "B550M" },
    { name: "GPU", icon: MonitorPlay, cost: 12, description: "RTX 3060 (hourly rental)" },
    { name: "Storage", icon: HardDrive, cost: 1, description: "1TB SSD (model weights)" }
  ];

  useEffect(() => {
    const calculateTotal = () => {
      const hourlyGpuCost = 12 * hours;
      const fixedCosts = baseComponents.reduce((acc, component) => {
        if (component.name !== "GPU") return acc + component.cost;
        return acc;
      }, 0);
      setTotalCost(fixedCosts + hourlyGpuCost);
    };

    calculateTotal();
  }, [hours]);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-black/10 border-gray-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-2">
          Platform Budget Calculator
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
              value={hours}
              onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
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