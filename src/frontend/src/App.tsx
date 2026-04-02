import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { MealSuggestion } from "./backend.d";
import { AccountPanel } from "./components/AccountPanel";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { MealCard } from "./components/MealCard";
import { PlaceCard } from "./components/PlaceCard";
import { PlaceCardSkeleton } from "./components/PlaceCardSkeleton";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAddFavoriteMeal,
  useGetFavoriteMeals,
  useGetMealSuggestions,
  useGetNearbyPlaces,
  useGetProfile,
  useRemoveFavoriteMeal,
} from "./hooks/useQueries";
import {
  type LocationError,
  type LocationInfo,
  type Region,
  detectLocation,
} from "./utils/geolocation";

type MealSlot = "breakfast" | "lunch" | "dinner";

const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3"];

function formatTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function App() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(
    null,
  );
  const [region, setRegion] = useState<Region>("Default");
  const [seed, setSeed] = useState<bigint>(() => BigInt(Date.now()));
  const [refreshingSlot, setRefreshingSlot] = useState<MealSlot | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const locationDetected = useRef(false);

  const runDetectLocation = useCallback(() => {
    setLocationError(null);
    detectLocation()
      .then((loc) => {
        setLocation(loc);
        setRegion(loc.region);
        setSeed(BigInt(Date.now()));
        locationDetected.current = true;
      })
      .catch((err: LocationError) => {
        setLocationError(err);
        setRegion("Default");
        if (err.type !== "denied") {
          toast.error(
            "Location unavailable — showing default recommendations.",
            {
              duration: 5000,
            },
          );
        }
      });
  }, []);

  // Detect geolocation on mount
  useEffect(() => {
    if (locationDetected.current) return;
    runDetectLocation();
  }, [runDetectLocation]);

  // Normalize region for backend (backend expects lowercase)
  const normalizedRegion = region.toLowerCase();

  // Fetch all meals and places
  const {
    data: allMeals,
    isLoading: mealsLoading,
    isFetching: mealsFetching,
  } = useGetMealSuggestions(region, seed);

  const { data: places, isLoading: placesLoading } = useGetNearbyPlaces(region);

  // Profile + favorites
  const { data: profile } = useGetProfile();
  const { data: favorites } = useGetFavoriteMeals();
  const addFavoriteMutation = useAddFavoriteMeal();
  const removeFavoriteMutation = useRemoveFavoriteMeal();

  // Build a Set of favorite meal IDs for fast lookup
  const favoriteMealIds = useMemo<Set<bigint>>(() => {
    if (!favorites) return new Set();
    return new Set(favorites.map((f) => f.id));
  }, [favorites]);

  // Per-slot meals (override if slot was individually refreshed)
  const [slotOverrides, setSlotOverrides] = useState<
    Partial<Record<MealSlot, MealSuggestion[]>>
  >({});

  const getMealForSlot = useCallback(
    (slot: MealSlot): MealSuggestion | undefined => {
      const override = slotOverrides[slot];
      if (override) return override.find((m) => m.slot.toLowerCase() === slot);
      return allMeals?.find((m) => m.slot.toLowerCase() === slot);
    },
    [slotOverrides, allMeals],
  );

  const handleRegenerateAll = useCallback(() => {
    const newSeed = BigInt(Date.now());
    setSeed(newSeed);
    setSlotOverrides({});
    queryClient.invalidateQueries({ queryKey: ["meals", normalizedRegion] });
  }, [normalizedRegion, queryClient]);

  const handleRefreshSlot = useCallback(
    async (slot: MealSlot) => {
      if (!actor) return;
      setRefreshingSlot(slot);
      try {
        const results = await actor.getMealSuggestions(
          normalizedRegion,
          BigInt(Date.now()),
        );
        setSlotOverrides((prev) => ({ ...prev, [slot]: results }));
      } catch {
        toast.error(`Couldn't refresh ${slot}. Please try again.`);
      } finally {
        setRefreshingSlot(null);
      }
    },
    [actor, normalizedRegion],
  );

  const handleToggleFavorite = useCallback(
    async (slot: MealSlot) => {
      const meal = getMealForSlot(slot);
      if (!meal || !isAuthenticated) return;

      const alreadyFav = favoriteMealIds.has(meal.id);
      try {
        if (alreadyFav) {
          await removeFavoriteMutation.mutateAsync(meal.id);
          toast.success(`${meal.name} removed from favorites`);
        } else {
          await addFavoriteMutation.mutateAsync({
            id: meal.id,
            name: meal.name,
            slot: meal.slot,
            emoji: meal.emoji,
            cuisine: meal.cuisine,
          });
          toast.success(`${meal.name} saved to favorites! ❤️`);
        }
      } catch {
        toast.error("Failed to update favorites. Please try again.");
      }
    },
    [
      getMealForSlot,
      favoriteMealIds,
      isAuthenticated,
      addFavoriteMutation,
      removeFavoriteMutation,
    ],
  );

  const isLoadingMeals = mealsLoading || mealsFetching;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" />

      <Header
        location={location}
        isAuthenticated={isAuthenticated}
        displayName={profile?.displayName}
        onAccountClick={() => setAccountOpen(true)}
      />

      <AccountPanel open={accountOpen} onOpenChange={setAccountOpen} />

      <main className="flex-1">
        {/* Hero */}
        <HeroSection
          location={location}
          locationError={locationError}
          onRegenerateAll={handleRegenerateAll}
          onRetryLocation={runDetectLocation}
          isLoading={isLoadingMeals}
        />

        {/* Meal Cards Section */}
        <section className="max-w-[1160px] mx-auto px-6 pb-10">
          <h2
            className="text-xl font-bold text-foreground mb-6"
            data-ocid="meals.section.panel"
          >
            Your Meals for Today{" "}
            <span className="text-muted-foreground font-medium text-base">
              ({formatTodayDate()})
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SLOTS.map((slot, idx) => {
              const meal = getMealForSlot(slot);
              return (
                <MealCard
                  key={slot}
                  slot={slot}
                  meal={meal}
                  isLoading={isLoadingMeals || refreshingSlot === slot}
                  onRefresh={() => handleRefreshSlot(slot)}
                  index={idx}
                  isAuthenticated={isAuthenticated}
                  isFavorite={meal ? favoriteMealIds.has(meal.id) : false}
                  onToggleFavorite={() => handleToggleFavorite(slot)}
                />
              );
            })}
          </div>
        </section>

        {/* Nearby Places Section */}
        <section className="max-w-[1160px] mx-auto px-6 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold text-foreground"
              data-ocid="places.section.panel"
            >
              Explore Nearby Restaurants &amp; Malls
            </h2>
          </div>

          {placesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {SKELETON_KEYS.map((k) => (
                <PlaceCardSkeleton key={k} />
              ))}
            </div>
          ) : places && places.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {places.slice(0, 6).map((place, idx) => (
                <PlaceCard
                  key={place.id.toString()}
                  place={place}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="places.empty_state"
            >
              <p className="text-4xl mb-3">🗺️</p>
              <p className="text-base font-medium">
                No nearby places found for your region.
              </p>
              <p className="text-sm">Try adjusting your location settings.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
