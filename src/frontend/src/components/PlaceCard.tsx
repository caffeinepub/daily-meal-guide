import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Place } from "../backend.d";

const PLACE_IMAGES: Record<string, string> = {
  restaurant_0: "/assets/generated/restaurant-exterior.dim_400x260.jpg",
  restaurant_1: "/assets/generated/restaurant-sushi.dim_400x260.jpg",
  restaurant_2: "/assets/generated/restaurant-mexican.dim_400x260.jpg",
  mall_0: "/assets/generated/mall-food-court.dim_400x260.jpg",
};

function getPlaceImage(place: Place, index: number): string {
  if (place.placeType === "mall") return PLACE_IMAGES.mall_0 ?? "";
  const key = `restaurant_${index % 3}`;
  return PLACE_IMAGES[key] ?? PLACE_IMAGES.restaurant_0 ?? "";
}

interface PlaceCardProps {
  place: Place;
  index: number;
}

export function PlaceCard({ place, index }: PlaceCardProps) {
  const isMall = place.placeType === "mall";
  const image = getPlaceImage(place, index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 * index, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
      data-ocid={`places.item.${index + 1}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-[130px] overflow-hidden bg-cream-200">
        <img
          src={image}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {isMall && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-semibold bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-full text-muted-foreground">
              🏬 Mall
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-3">
        <p className="font-bold text-sm text-foreground leading-tight truncate">
          {place.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {place.cuisine}
        </p>

        {/* Meta row */}
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-brand" />
            {place.distance}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {typeof place.rating === "number"
              ? place.rating.toFixed(1)
              : place.rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
