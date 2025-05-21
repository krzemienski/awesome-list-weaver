
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Resource, SearchResult } from "@/types";
import { mockResources } from "@/data/mock-data";
import Fuse from "fuse.js";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResource: (resource: Resource) => void;
}

export function SearchDialog({ 
  open, 
  onOpenChange,
  onSelectResource 
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Initialize Fuse.js for searching
  const fuse = new Fuse(mockResources, {
    keys: ["title", "description"],
    includeScore: true,
    threshold: 0.3
  });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !open) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);
  
  // Handle search
  useEffect(() => {
    if (query) {
      setResults(fuse.search(query));
    } else {
      setResults([]);
    }
  }, [query]);
  
  const handleSelect = (result: SearchResult) => {
    onSelectResource(result.item);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search resources..."
              value={query}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 outline-none placeholder:text-muted-foreground"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={result.item.id}
                  onSelect={() => handleSelect(result)}
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{result.item.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.item.description}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
