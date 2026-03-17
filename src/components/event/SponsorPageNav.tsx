import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SponsorPageNavProps {
  otherEvent: {
    label: string;
    path: string;
  };
}

const SponsorPageNav = ({ otherEvent }: SponsorPageNavProps) => {
  const [open, setOpen] = useState(false);

  const links: NavLink[] = [
    { label: "Basecamp Outdoor", href: "https://wearetheoutdoorindustry.com", external: true },
    { label: "Basecamp Match", href: "https://basecampjobs.com", external: true },
    { label: "Events Hub", href: "/events" },
    { label: otherEvent.label, href: otherEvent.path },
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open navigation"
            className="p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-md hover:bg-background transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-display text-lg">Navigate</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors font-body text-sm"
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors font-body text-sm"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SponsorPageNav;
