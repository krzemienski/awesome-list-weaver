
import { Resource } from "@/types";
import { ResourceCard } from "@/components/ResourceCard";
import { motion } from "framer-motion";
import { Filter, Grid2x2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResourceGridProps {
  resources: Resource[];
  title: string;
}

export function ResourceGrid({ resources, title }: ResourceGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        
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
          <Button variant="outline" size="sm" className="flex gap-2 text-xs">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </Button>
        </div>
      </div>
      
      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h3 className="text-xl font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">Try selecting a different category or searching for something else</p>
        </div>
      ) : (
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
          {resources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              index={index}
              className={viewMode === "list" ? "w-full" : ""}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
