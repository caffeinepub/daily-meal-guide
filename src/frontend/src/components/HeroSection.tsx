import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { LocationInfo } from "../utils/geolocation";

interface HeroSectionProps {
  location: LocationInfo | null;
  locationError: string | null;
  onRegenerateAll: () => void;
  isLoading: boolean;
}

export function HeroSection({
  location,
  locationError,
  onRegenerateAll,
  isLoading,
}: HeroSectionProps) {
  return (
    <section className="max-w-[1160px] mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      {/* Left: hero text */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
          Your Daily Food Guide.
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Curated meals for you in{" "}
          <span className="font-semibold text-foreground">
            {location ? location.displayName : "your area"}
          </span>
        </p>

        {/* Location pill / status */}
        <div className="mt-3 inline-flex items-center gap-2 text-sm">
          {locationError ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {locationError} — showing Default recommendations
            </span>
          ) : location ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {location.region} Cuisine Region
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-muted-foreground text-xs animate-pulse">
              <MapPin className="w-3 h-3" />
              Detecting your location…
            </span>
          )}
        </div>
      </motion.div>

      {/* Right: CTA */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <Button
          onClick={onRegenerateAll}
          disabled={isLoading}
          data-ocid="meals.regenerate_all.button"
          className="bg-brand hover:bg-brand-dark text-white rounded-xl px-5 py-2.5 font-semibold shadow-card flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate All Meals
        </Button>
      </motion.div>
    </section>
  );
}
