import { Label } from "@/components/ui/label";

interface Resolution {
  value: string;
  width: number;
  height: number;
  label: string;
}

interface ResolutionSelectProps {
  resolution: string;
  setResolution: (value: string) => void;
  resolutions: Resolution[];
}

export function ResolutionSelect({ resolution, setResolution, resolutions }: ResolutionSelectProps) {
  return (
    <div className="space-y-2 text-left">
      <Label htmlFor="resolution" className="text-white text-sm sm:text-base">Image Size</Label>
      <select
        id="resolution"
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-gray-800 bg-black/20 text-white text-xs sm:text-sm md:text-base focus:border-amber-500 focus:ring-amber-500/20"
      >
        {resolutions.map((res) => (
          <option key={res.value} value={res.value} className="bg-gray-900">
            {res.label} ({res.width}x{res.height})
          </option>
        ))}
      </select>
    </div>
  );
}