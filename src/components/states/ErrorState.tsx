
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">{message}</p>
      <div className="flex flex-col gap-2">
        <Button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md" 
          onClick={onRetry}
        >
          Try Again
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Try setting a different VITE_AWESOME_LIST_URL in your environment variables
        </p>
      </div>
    </div>
  );
}
