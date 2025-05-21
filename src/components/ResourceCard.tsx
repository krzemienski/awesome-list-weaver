
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: Resource;
  index: number;
  className?: string;
}

export function ResourceCard({ resource, index, className }: ResourceCardProps) {
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={item}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card 
        className={cn("hover:shadow-md transition-all duration-300", className)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>{resource.title}</span>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Visit ${resource.title}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{resource.category}</Badge>
            {resource.subcategory && (
              <Badge variant="secondary">{resource.subcategory}</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
