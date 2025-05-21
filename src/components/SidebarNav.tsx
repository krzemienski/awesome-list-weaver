
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { mockCategories } from "@/data/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarNavProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
}

export function SidebarNav({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: SidebarNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectSubcategory(categoryId, subcategoryId);
    if (isMobile) {
      setIsOpen(false);
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
              <div className="pl-4 pt-1">
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
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <Menu size={16} />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={30}
        collapsible
        className="hidden md:block border-r"
      >
        <NavContent />
      </ResizablePanel>
      <ResizableHandle withHandle />
    </ResizablePanelGroup>
  );
}
