
import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";
import { motion } from "framer-motion";

const themes: { value: Theme; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "rose", label: "Rose" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "violet", label: "Violet" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a theme"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ 
                backgroundColor: `hsl(var(--primary))`,
                border: "1px solid hsl(var(--border))"
              }}
            />
            <span>{themes.find((t) => t.value === theme)?.label || "Rose"}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {themes.map((t) => (
                <CommandItem
                  key={t.value}
                  value={t.value}
                  onSelect={(value) => {
                    setTheme(value as Theme);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <motion.div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ 
                      backgroundColor: `var(--${t.value}-theme-primary, hsl(var(--primary)))`,
                      border: "1px solid hsl(var(--border))"
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  />
                  {t.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      theme === t.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
