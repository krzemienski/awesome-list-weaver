import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  // We're keeping the component, but removing its functionality
  // since we're always in dark mode now
  
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Dark mode is enabled"
      disabled
    >
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
