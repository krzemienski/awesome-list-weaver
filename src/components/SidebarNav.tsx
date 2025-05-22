
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

interface SidebarNavProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
  isOpen: boolean;
}

export function SidebarNav({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  isOpen,
}: SidebarNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const isMobile = useIsMobile();

  // Update filtered categories when the original list changes
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Auto-expand the selected category
  useEffect(() => {
    if (selectedCategory) {
      setExpanded(prev => ({
        ...prev,
        [selectedCategory]: true
      }));
    }
  }, [selectedCategory]);

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = categories.map(category => {
      const matchesCategory = category.name.toLowerCase().includes(query);
      
      // Filter subcategories
      const matchingSubcategories = category.subcategories.filter(sub => 
        sub.name.toLowerCase().includes(query)
      );
      
      // If the category matches or has matching subcategories, include it
      if (matchesCategory || matchingSubcategories.length > 0) {
        return {
          ...category,
          subcategories: matchingSubcategories
        };
      }
      
      return null;
    }).filter(Boolean) as Category[];
    
    setFilteredCategories(filtered);
    
    // Auto-expand categories with matching subcategories
    const newExpanded = { ...expanded };
    filtered.forEach(category => {
      if (category.subcategories.length > 0) {
        newExpanded[category.id] = true;
      }
    });
    setExpanded(newExpanded);
    
  }, [searchQuery, categories]);

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
    <>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 bg-background/50"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="py-2 px-2">
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-2",
                    selectedCategory === category.id && "bg-secondary"
                  )}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="text-left truncate">{category.name}</span>
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
              
              <AnimatePresence>
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
                          "w-full justify-between px-2 py-1 h-8 mb-1",
                          selectedSubcategory === subcategory.id && "bg-secondary"
                        )}
                        onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                      >
                        <span className="text-left truncate">{subcategory.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {subcategory.resources.length}
                        </span>
                      </Button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No categories found
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );

  // Mobile view with sheet
  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSheetOpen(true)}
          className="md:hidden fixed bottom-20 left-4 z-40 shadow-md bg-background"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
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
      </>
    );
  }

  // For desktop view - always render with proper visibility controlled by width
  return (
    <motion.div
      initial={{ width: isOpen ? "280px" : 0, opacity: isOpen ? 1 : 0 }}
      animate={{ width: isOpen ? "280px" : 0, opacity: isOpen ? 1 : 0 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block border-r h-[calc(100vh-4rem)]"
    >
      {isOpen && <NavContent />}
    </motion.div>
  );
}
