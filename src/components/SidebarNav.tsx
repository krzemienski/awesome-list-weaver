
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Category } from "@/types";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { useSidebarState } from "@/hooks/use-sidebar-state";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const isMobile = useIsMobile();
  const { mobileSheetOpen, setMobileSheetOpen } = useSidebarState();

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

  // Mobile view with sheet
  if (isMobile) {
    return (
      <MobileSidebar
        categories={filteredCategories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        expanded={expanded}
        searchQuery={searchQuery}
        sheetOpen={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        onSearchChange={setSearchQuery}
        onSelectCategory={onSelectCategory}
        onSelectSubcategory={onSelectSubcategory}
        onToggleExpanded={toggleExpanded}
      />
    );
  }

  // For desktop view
  return (
    <DesktopSidebar
      isOpen={isOpen}
      categories={filteredCategories}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      expanded={expanded}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectCategory={onSelectCategory}
      onSelectSubcategory={onSelectSubcategory}
      onToggleExpanded={toggleExpanded}
    />
  );
}
