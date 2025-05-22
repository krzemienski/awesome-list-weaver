
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading awesome resources..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
