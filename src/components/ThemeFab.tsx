
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeSelector } from "@/components/ThemeSelector";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export function ThemeFab() {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="rounded-full shadow-lg h-12 w-12"
            aria-label="Select theme"
          >
            <Palette className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-4 shadow-lg" align="end" side="top">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-medium text-sm">Theme</h3>
            <ThemeSelector />
          </motion.div>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
