import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
    </div>
  );
}