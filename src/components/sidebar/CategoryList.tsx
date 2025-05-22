
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types";
import { CategoryItem } from "./CategoryItem";

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  expanded: Record<string, boolean>;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string) => void;
  onToggleExpanded: (categoryId: string) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  selectedSubcategory,
  expanded,
  onSelectCategory,
  onSelectSubcategory,
  onToggleExpanded,
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No categories found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="py-2 px-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            isExpanded={!!expanded[category.id]}
            selectedSubcategory={selectedSubcategory}
            onCategoryClick={() => onSelectCategory(category.id)}
            onSubcategoryClick={(subcategoryId) => 
              onSelectSubcategory(category.id, subcategoryId)
            }
            onToggleExpand={() => onToggleExpanded(category.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
