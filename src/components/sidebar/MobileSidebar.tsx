
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { CategoryList } from "./CategoryList";
import { Category } from "@/types";

interface MobileSidebarProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  expanded: Record<string, boolean>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
  onToggleExpanded: (categoryId: string) => void;
}

export function MobileSidebar({
  categories,
  selectedCategory,
  selectedSubcategory,
  expanded,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectSubcategory,
  onToggleExpanded,
}: MobileSidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    setSheetOpen(false);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectSubcategory(categoryId, subcategoryId);
    setSheetOpen(false);
  };

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
          
          <SearchInput value={searchQuery} onChange={onSearchChange} />
          
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            expanded={expanded}
            onSelectCategory={handleCategoryClick}
            onSelectSubcategory={handleSubcategoryClick}
            onToggleExpanded={onToggleExpanded}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
