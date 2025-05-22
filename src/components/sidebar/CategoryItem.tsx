
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types";
import { SubcategoryItem } from "./SubcategoryItem";

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  isExpanded: boolean;
  selectedSubcategory?: string;
  onCategoryClick: () => void;
  onSubcategoryClick: (subcategoryId: string) => void;
  onToggleExpand: () => void;
}

export function CategoryItem({
  category,
  isSelected,
  isExpanded,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
  onToggleExpand,
}: CategoryItemProps) {
  return (
    <div className="mb-2">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between px-2",
            isSelected && "bg-secondary"
          )}
          onClick={onCategoryClick}
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
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && category.subcategories.length > 0 && (
          <motion.div 
            className="pl-4 pt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {category.subcategories.map((subcategory) => (
              <SubcategoryItem
                key={subcategory.id}
                subcategory={subcategory}
                isSelected={selectedSubcategory === subcategory.id}
                onClick={() => onSubcategoryClick(subcategory.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
