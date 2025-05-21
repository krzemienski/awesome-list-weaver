
import { Resource } from "@/types";
import { ResourceCard } from "@/components/ResourceCard";
import { motion } from "framer-motion";

interface ResourceGridProps {
  resources: Resource[];
  title: string;
}

export function ResourceGrid({ resources, title }: ResourceGridProps) {
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
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      
      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">😢</div>
          <h3 className="text-xl font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">Try selecting a different category or searching for something else</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {resources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
