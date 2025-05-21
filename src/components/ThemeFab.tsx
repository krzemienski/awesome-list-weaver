
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeSelector } from "@/components/ThemeSelector";

export function ThemeFab() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="rounded-full shadow-lg h-12 w-12">
            <Palette className="h-5 w-5" />
            <span className="sr-only">Select theme</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-4" align="end" side="top">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Theme</h3>
            <ThemeSelector />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
