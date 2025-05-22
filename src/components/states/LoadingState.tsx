
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg">Loading awesome resources...</p>
    </div>
  );
}
