
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subcategory } from "@/types";

interface SubcategoryItemProps {
  subcategory: Subcategory;
  isSelected: boolean;
  onClick: () => void;
}

export function SubcategoryItem({ subcategory, isSelected, onClick }: SubcategoryItemProps) {
  return (
    <Button
      key={subcategory.id}
      variant="ghost"
      className={cn(
        "w-full justify-between px-2 py-1 h-8 mb-1",
        isSelected && "bg-secondary"
      )}
      onClick={onClick}
    >
      <span className="text-left truncate">{subcategory.name}</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {subcategory.resources.length}
      </span>
    </Button>
  );
}
