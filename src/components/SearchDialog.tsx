
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
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResource: (resource: Resource) => void;
  resources: Resource[];
}

export function SearchDialog({ 
  open, 
  onOpenChange,
  onSelectResource,
  resources
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Initialize Fuse.js for searching with specified options
  const fuse = new Fuse(resources, {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "description", weight: 0.3 },
      { name: "category", weight: 0.2 },
      { name: "tags", weight: 0.2 }
    ],
    includeScore: true,
    threshold: 0.5,
    ignoreLocation: true
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
      // Cast the Fuse results to our SearchResult type since we've made them compatible
      const fuseResults = fuse.search(query);
      setResults(fuseResults as SearchResult[]);
    } else {
      setResults([]);
    }
  }, [query, fuse]);
  
  const handleSelect = (result: SearchResult) => {
    onSelectResource(result.item);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden backdrop-blur-sm">
              <Command className="rounded-lg border shadow-md">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder="Search resources..."
                    value={query}
                    onValueChange={setQuery}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Results">
                    {results.slice(0, 15).map((result) => (
                      <CommandItem
                        key={result.item.id}
                        onSelect={() => handleSelect(result)}
                        className="py-3"
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{result.item.title}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="text-xs text-primary bg-primary/10 rounded px-1.5 py-0.5">
                              {result.item.category}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-[400px]">
                              {result.item.description}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
