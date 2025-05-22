
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  listName?: string;
}

export function LoadingState({ 
  message,
  listName
}: LoadingStateProps) {
  const displayMessage = message || (listName ? `Loading ${listName}...` : "Loading awesome resources...");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg">{displayMessage}</p>
    </div>
  );
}
