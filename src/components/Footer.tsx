
export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js 14, Tailwind CSS, and shadcn/ui. Powered by the Awesome List community.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          <a 
            href="/about" 
            className="font-medium underline underline-offset-4"
          >
            About
          </a>
        </p>
      </div>
    </footer>
  );
}
