
import { Category } from "@/types";

interface BreadcrumbTrailProps {
  categories: Category[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  onClearCategory: () => void;
  onClearSubcategory: () => void;
}

export function BreadcrumbTrail({
  categories,
  selectedCategory,
  selectedSubcategory,
  onClearCategory,
  onClearSubcategory,
}: BreadcrumbTrailProps) {
  if (!selectedCategory) return null;
  
  const category = categories.find(c => c.id === selectedCategory);
  if (!category) return null;
  
  return (
    <div className="mb-4 text-sm text-muted-foreground">
      <span className="hover:text-primary cursor-pointer" onClick={onClearCategory}>
        Home
      </span>
      {' / '}
      <span 
        className={!selectedSubcategory ? "text-primary" : "hover:text-primary cursor-pointer"} 
        onClick={onClearSubcategory}
      >
        {category.name}
      </span>
      {selectedSubcategory && (
        <>
          {' / '}
          <span className="text-primary">
            {category.subcategories.find(s => s.id === selectedSubcategory)?.name}
          </span>
        </>
      )}
    </div>
  );
}
