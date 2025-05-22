import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // We're keeping the component, but it's just a static dark mode icon
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
