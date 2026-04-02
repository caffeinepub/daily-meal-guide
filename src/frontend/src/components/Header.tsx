import { MapPin, User, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import type { LocationInfo } from "../utils/geolocation";

interface HeaderProps {
  location: LocationInfo | null;
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  isAuthenticated?: boolean;
  displayName?: string;
  onAccountClick?: () => void;
}

const NAV_LINKS = ["Plan Today", "Recipes", "Explore", "Account"];

function getInitials(displayName?: string): string | null {
  if (!displayName?.trim()) return null;
  return displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Header({
  location,
  activeNav = "Plan Today",
  onNavChange,
  isAuthenticated = false,
  displayName,
  onAccountClick,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(formatTime(new Date())), 60000);
    return () => clearInterval(id);
  }, []);

  const initials = getInitials(displayName);

  return (
    <header className="bg-cream-100 sticky top-0 z-40">
      <div className="max-w-[1160px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="nav.brand.link"
        >
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-xs">
            <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-brand">
            MealMaven
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isAccount = link === "Account";
            const isActive = activeNav === link;
            return (
              <button
                type="button"
                key={link}
                onClick={() => {
                  if (isAccount) {
                    onAccountClick?.();
                  } else {
                    onNavChange?.(link);
                  }
                }}
                data-ocid={`nav.${link.toLowerCase().replace(" ", "_")}.link`}
                className={[
                  "flex items-center gap-1.5 text-sm font-medium transition-colors pb-0.5",
                  isActive
                    ? "text-brand border-b-2 border-brand"
                    : "text-foreground/70 hover:text-foreground",
                ].join(" ")}
              >
                {isAccount && isAuthenticated ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex-shrink-0">
                    {initials || <User className="w-3 h-3" />}
                  </span>
                ) : null}
                {link}
              </button>
            );
          })}
        </nav>

        {/* Location + Time */}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-brand flex-shrink-0" />
          <span className="font-medium">
            {location ? location.displayName : "Detecting location…"}
          </span>
          <span className="mx-1 opacity-40">|</span>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border" />
    </header>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
