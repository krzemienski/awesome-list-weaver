
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/hooks/use-theme";

const NotFound = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Resource not found</p>
        <Button asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
