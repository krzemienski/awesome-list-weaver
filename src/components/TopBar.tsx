
import { Search, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopBarProps {
  onOpenSearch: () => void;
}

export function TopBar({ onOpenSearch }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-morphism">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">AwesomeListStaticSite</h1>
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
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
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
