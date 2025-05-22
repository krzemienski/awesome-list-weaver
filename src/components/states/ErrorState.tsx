
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-4xl mb-4">😢</div>
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">{message}</p>
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md" 
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
}
