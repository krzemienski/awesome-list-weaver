
import { motion } from "framer-motion";
import { Category, Resource } from "@/types";
import { BreadcrumbTrail } from "./BreadcrumbTrail";
import { ResourceGrid } from "./ResourceGrid";

interface MainContentProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedTags: string[];
  displayResources: Resource[];
  pageTitle: string;
  showFilters: boolean;
  onSelectCategory: (categoryId?: string) => void;
  onSelectSubcategory: (subcategoryId?: string) => void;
  onTagSelect: (tag: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function MainContent({
  categories,
  selectedCategory,
  selectedSubcategory,
  selectedTags,
  displayResources,
  pageTitle,
  showFilters,
  onSelectCategory,
  onSelectSubcategory,
  onTagSelect,
  onToggleFilters,
  onClearFilters,
}: MainContentProps) {
  return (
    <motion.main 
      className="flex-1 container py-6 px-4 md:px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BreadcrumbTrail
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onClearCategory={() => {
          onSelectCategory(undefined);
          onSelectSubcategory(undefined);
        }}
        onClearSubcategory={() => {
          onSelectSubcategory(undefined);
        }}
      />
      
      <ResourceGrid 
        resources={displayResources}
        title={pageTitle}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
        onToggleFilters={onToggleFilters}
        showFilters={showFilters}
        onClearFilters={onClearFilters}
      />
    </motion.main>
  );
}
