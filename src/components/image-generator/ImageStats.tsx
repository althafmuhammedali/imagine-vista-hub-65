import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from "lucide-react";

interface GenerationStats {
  date: string;
  count: number;
}

export function ImageStats() {
  const [stats, setStats] = useState<GenerationStats[]>([]);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('generationStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const recordGeneration = () => {
    const today = new Date().toISOString().split('T')[0];
    const updatedStats = [...stats];
    const todayIndex = updatedStats.findIndex(stat => stat.date === today);
    
    if (todayIndex >= 0) {
      updatedStats[todayIndex].count += 1;
    } else {
      updatedStats.push({ date: today, count: 1 });
    }
    
    // Keep only last 7 days
    const last7Days = updatedStats.slice(-7);
    setStats(last7Days);
    localStorage.setItem('generationStats', JSON.stringify(last7Days));
  };

  return (
    <Card className="p-4 backdrop-blur-xl bg-black/20 border-gray-800/50">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-amber-400">Generation Stats</h3>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats}>
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
