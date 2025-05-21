
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js 14, Tailwind CSS, and shadcn/ui. Powered by the Awesome List community.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="/about" 
            className="text-sm font-medium underline-offset-4 hover:underline text-muted-foreground"
          >
            About
          </a>
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
        </div>
      </div>
    </footer>
  );
}
