
import { useState, useEffect } from "react";
import { Resource } from "@/types";
import { ResourceCard } from "@/components/ResourceCard";
import { motion } from "framer-motion";
import { Filter, Grid2x2, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/states/EmptyState";
import { 
  Pagination, 
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface ResourceGridProps {
  resources: Resource[];
  title: string;
  selectedTags?: string[];
  onTagSelect?: (tag: string) => void;
  onToggleFilters?: () => void;
  showFilters?: boolean;
  onClearFilters?: () => void;
}

export function ResourceGrid({ 
  resources, 
  title,
  selectedTags = [],
  onTagSelect,
  onToggleFilters,
  showFilters = false,
  onClearFilters,
}: ResourceGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  
  // Reset to page 1 when resources change
  useEffect(() => {
    setCurrentPage(1);
  }, [resources.length, selectedTags]);
  
  useEffect(() => {
    // Extract all unique tags from resources
    const tags = new Set<string>();
    resources.forEach(resource => {
      if (resource.tags) {
        resource.tags.forEach(tag => tags.add(tag));
      }
      // Also add category as a tag option
      if (resource.category) {
        tags.add(resource.category);
      }
    });
    setAvailableTags(Array.from(tags).sort());
  }, [resources]);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resources.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Add middle pages with ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.push('ellipsis');
      }
      
      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <span className="text-muted-foreground text-sm">
              ({resources.length} {resources.length === 1 ? 'resource' : 'resources'})
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className={cn("p-1 h-8 w-8", viewMode === "grid" && "bg-accent")}
              onClick={() => setViewMode("grid")}
            >
              <Grid2x2 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn("p-1 h-8 w-8", viewMode === "list" && "bg-accent")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button 
              variant={showFilters ? "default" : "outline"} 
              size="sm" 
              className="flex gap-2 text-xs"
              onClick={onToggleFilters}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-card/50 backdrop-blur-sm rounded-md border p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Filter by tags</h3>
              {selectedTags && selectedTags.length > 0 && onClearFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={onClearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-32 pr-4">
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags?.includes(tag) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer hover:bg-primary/10",
                      selectedTags?.includes(tag) && "hover:bg-primary/80"
                    )}
                    onClick={() => onTagSelect?.(tag)}
                  >
                    {tag}
                    {selectedTags?.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </div>
      
      {resources.length === 0 ? (
        <EmptyState onAction={onClearFilters} actionLabel={selectedTags?.length ? "Clear filters" : undefined} />
      ) : (
        <>
          <motion.div 
            className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col space-y-3"
            )}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {currentItems.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                className={viewMode === "list" ? "w-full" : ""}
              />
            ))}
          </motion.div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(Number(page))}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
