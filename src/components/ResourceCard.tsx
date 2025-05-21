
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

interface ResourceCardProps {
  resource: Resource;
  index: number;
  className?: string;
}

export function ResourceCard({ resource, index, className }: ResourceCardProps) {
  return (
    <Card 
      className={cn("hover:shadow-md transition-all duration-300", className)}
      style={{ 
        animationDelay: `${index * 40}ms`,
        animationFillMode: "backwards"
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
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
        <CardDescription>{resource.description}</CardDescription>
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
  );
}
