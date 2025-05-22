
import { Search, Github, Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopBarProps {
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  listName: string;
  githubUrl: string;
}

export function TopBar({ 
  onOpenSearch, 
  onToggleSidebar, 
  sidebarOpen,
  listName = "Awesome List",
  githubUrl = "https://github.com" 
}: TopBarProps) {
  // Clean up the list name to make it more readable
  const displayName = listName
    .replace(/^\[.*?\]\s*/, '') // Remove any leading [tags]
    .replace(/\s*\(https:.*?\)/, '') // Remove URLs in parentheses
    .replace(/\[\[Awesome\]\]/, 'Awesome') // Clean up [[Awesome]] format
    .trim();

  return (
    <header className="sticky top-0 z-40 w-full glass-morphism">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="hover:bg-secondary"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-bold truncate max-w-[220px]">{displayName}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources... (Press / to focus)"
              className="pl-8"
              onClick={onOpenSearch}
              onFocus={onOpenSearch}
              readOnly
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            className="md:hidden"
            onClick={onOpenSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
            aria-label="GitHub repository"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
