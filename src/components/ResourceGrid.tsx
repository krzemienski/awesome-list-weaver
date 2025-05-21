
import { Resource } from "@/types";
import { ResourceCard } from "@/components/ResourceCard";

interface ResourceGridProps {
  resources: Resource[];
  title: string;
}

export function ResourceGrid({ resources, title }: ResourceGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            index={index}
            className="animate-fade-in"
          />
        ))}
      </div>
    </div>
  );
}
