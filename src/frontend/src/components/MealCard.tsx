import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { MealSuggestion } from "../backend.d";

const SLOT_CONFIG = {
  breakfast: {
    label: "Breakfast",
    gradient: "from-amber-100 to-yellow-200",
    emoji: "🌅",
    image: "/assets/generated/breakfast-pancakes.dim_600x400.jpg",
  },
  lunch: {
    label: "Lunch",
    gradient: "from-green-100 to-emerald-200",
    emoji: "☀️",
    image: "/assets/generated/lunch-salad.dim_600x400.jpg",
  },
  dinner: {
    label: "Dinner",
    gradient: "from-orange-200 to-red-200",
    emoji: "🌙",
    image: "/assets/generated/dinner-pasta.dim_600x400.jpg",
  },
};

interface MealCardProps {
  slot: "breakfast" | "lunch" | "dinner";
  meal: MealSuggestion | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isAuthenticated?: boolean;
}

export function MealCard({
  slot,
  meal,
  isLoading,
  onRefresh,
  index,
  isFavorite = false,
  onToggleFavorite,
  isAuthenticated = false,
}: MealCardProps) {
  const config = SLOT_CONFIG[slot];

  if (isLoading) {
    return (
      <div
        className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
        data-ocid={`meals.${slot}.loading_state`}
      >
        <Skeleton className="w-full h-[200px]" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
        className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group"
        data-ocid={`meals.${slot}.card`}
      >
        {/* Food image */}
        <div className="p-3 pb-0">
          <div
            className={`w-full h-[188px] rounded-xl overflow-hidden bg-gradient-to-br ${config.gradient} relative`}
          >
            <img
              src={config.image}
              alt={meal?.name ?? config.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Slot badge overlay */}
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-xs font-semibold text-foreground">
                {config.emoji} {config.label}
              </span>
            </div>

            {/* Favorite heart button */}
            <div className="absolute top-2 right-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.();
                  }}
                  aria-label={
                    isFavorite
                      ? `Remove ${config.label} from favorites`
                      : `Save ${config.label} to favorites`
                  }
                  className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xs hover:bg-white transition-colors"
                  data-ocid={`meals.${slot}.favorite.toggle`}
                >
                  <Heart
                    className={[
                      "w-4 h-4 transition-colors",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-foreground/60 hover:text-red-400",
                    ].join(" ")}
                  />
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center cursor-default opacity-50">
                      <Heart className="w-4 h-4 text-foreground/40" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">Sign in to save favorites</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-brand mb-0.5">
              {config.label}:
            </p>
            <h3 className="font-bold text-base text-foreground leading-snug truncate">
              {meal?.name ?? "—"}
            </h3>
            {meal?.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {meal.description}
              </p>
            )}
            {meal?.cuisine && (
              <Badge
                variant="secondary"
                className="mt-2 text-xs bg-cream-200 text-foreground/70 border-0"
              >
                {meal.cuisine}
              </Badge>
            )}
          </div>

          {/* Per-card refresh */}
          <button
            type="button"
            onClick={onRefresh}
            data-ocid={`meals.${slot}.refresh.button`}
            aria-label={`Refresh ${config.label}`}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-cream-100 border border-border flex items-center justify-center text-muted-foreground hover:text-brand hover:border-brand transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
