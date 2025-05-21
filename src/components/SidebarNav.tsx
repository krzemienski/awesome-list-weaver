
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { mockCategories } from "@/data/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarNavProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
  isOpen: boolean;
}

export function SidebarNav({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  isOpen,
}: SidebarNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleExpanded = (categoryId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectSubcategory(categoryId, subcategoryId);
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  const NavContent = () => (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="py-4 px-2">
        {mockCategories.map((category) => (
          <div key={category.id} className="mb-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start px-2",
                  selectedCategory === category.id && "bg-secondary"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span>{category.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {category.resources.length}
                </span>
              </Button>
              {category.subcategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8"
                  onClick={() => toggleExpanded(category.id)}
                >
                  {expanded[category.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
              )}
            </div>
            
            {expanded[category.id] && category.subcategories.length > 0 && (
              <motion.div 
                className="pl-4 pt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {category.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-2 py-1 h-8 mb-1",
                      selectedSubcategory === subcategory.id && "bg-secondary"
                    )}
                    onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                  >
                    <span>{subcategory.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {subcategory.resources.length}
                    </span>
                  </Button>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle>Categories</SheetTitle>
            <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  if (!isOpen) {
    return null; // Hide sidebar when collapsed on desktop
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "280px", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block border-r h-[calc(100vh-4rem)]"
    >
      <NavContent />
    </motion.div>
  );
}
