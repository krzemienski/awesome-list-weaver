
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
        className={cn("hover:border-primary transition-all duration-300 bg-card border-border", className)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{resource.title}</span>
              {resource.bookmark && <span className="text-primary">★</span>}
            </CardTitle>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Visit ${resource.title}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            {resource.source && <span>{resource.source}</span>}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
              {resource.category}
            </Badge>
            {resource.tags && resource.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs border-primary/20 bg-primary/5">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
