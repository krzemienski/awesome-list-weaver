
import { motion } from "framer-motion";
import { SearchInput } from "./SearchInput";
import { CategoryList } from "./CategoryList";
import { Category } from "@/types";

interface DesktopSidebarProps {
  isOpen: boolean;
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

export function DesktopSidebar({
  isOpen,
  categories,
  selectedCategory,
  selectedSubcategory,
  expanded,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onSelectSubcategory,
  onToggleExpanded,
}: DesktopSidebarProps) {
  if (!isOpen) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 0, opacity: 0 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block border-r h-[calc(100vh-4rem)]"
      />
    );
  }

  return (
    <motion.div
      initial={{ width: "280px", opacity: 1 }}
      animate={{ width: "280px", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block border-r h-[calc(100vh-4rem)]"
    >
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        expanded={expanded}
        onSelectCategory={onSelectCategory}
        onSelectSubcategory={onSelectSubcategory}
        onToggleExpanded={onToggleExpanded}
      />
    </motion.div>
  );
}
