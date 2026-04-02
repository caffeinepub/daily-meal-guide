import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Loader2,
  LogOut,
  Sparkles,
  Trash2,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { FavoriteMeal } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetFavoriteMeals,
  useGetProfile,
  useRemoveFavoriteMeal,
  useSaveProfile,
} from "../hooks/useQueries";

const DIETARY_OPTIONS = [
  { value: "Vegetarian", emoji: "🥦", description: "No meat or fish" },
  { value: "Halal", emoji: "☪️", description: "Permissible under Islamic law" },
  {
    value: "Gluten-Free",
    emoji: "🌾",
    description: "No gluten-containing grains",
  },
  { value: "Vegan", emoji: "🌱", description: "No animal products" },
  { value: "Dairy-Free", emoji: "🥛", description: "No dairy products" },
  { value: "Nut-Free", emoji: "🥜", description: "No nuts or nut products" },
];

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const SLOT_COLORS: Record<string, string> = {
  breakfast: "bg-amber-100 text-amber-800",
  lunch: "bg-green-100 text-green-800",
  dinner: "bg-orange-100 text-orange-800",
};

function getInitials(displayName: string, principal: string): string {
  if (displayName.trim()) {
    return displayName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return principal.slice(0, 2).toUpperCase();
}

interface AccountPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountPanel({ open, onOpenChange }: AccountPanelProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = identity?.getPrincipal().toString() ?? "";

  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: favorites, isLoading: favoritesLoading } =
    useGetFavoriteMeals();
  const saveProfileMutation = useSaveProfile();
  const removeFavoriteMutation = useRemoveFavoriteMeal();

  const [displayName, setDisplayName] = useState("");
  const [localPrefs, setLocalPrefs] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setLocalPrefs(profile.dietaryPreferences ?? []);
    }
  }, [profile]);

  const handleSaveDisplayName = async () => {
    try {
      await saveProfileMutation.mutateAsync({
        displayName,
        dietaryPreferences: localPrefs,
      });
      toast.success("Name saved!");
    } catch {
      toast.error("Failed to save name. Please try again.");
    }
  };

  const handleTogglePref = async (pref: string) => {
    const newPrefs = localPrefs.includes(pref)
      ? localPrefs.filter((p) => p !== pref)
      : [...localPrefs, pref];
    setLocalPrefs(newPrefs);
    try {
      await saveProfileMutation.mutateAsync({
        displayName,
        dietaryPreferences: newPrefs,
      });
      toast.success(
        `${pref} preference ${newPrefs.includes(pref) ? "added" : "removed"}`,
      );
    } catch {
      setLocalPrefs(localPrefs);
      toast.error("Failed to update preference.");
    }
  };

  const handleRemoveFavorite = async (meal: FavoriteMeal) => {
    try {
      await removeFavoriteMutation.mutateAsync(meal.id);
      toast.success(`${meal.name} removed from favorites`);
    } catch {
      toast.error("Failed to remove favorite.");
    }
  };

  const handleSignOut = () => {
    clear();
    onOpenChange(false);
    toast.success("Signed out successfully");
  };

  const initials = isAuthenticated ? getInitials(displayName, principal) : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[420px] p-0 flex flex-col bg-background"
        data-ocid="account.sheet"
      >
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center h-full px-8 py-12 text-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-card">
                <UtensilsCrossed
                  className="w-8 h-8 text-white"
                  strokeWidth={2}
                />
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Sign in to MealMaven
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Save your favorite meals, set dietary preferences (vegetarian,
                  halal, gluten-free, and more), and get personalized
                  recommendations.
                </p>
              </div>

              <div className="w-full space-y-3">
                {[
                  { icon: "❤️", text: "Save favorite meals" },
                  { icon: "🥦", text: "Set dietary preferences" },
                  { icon: "✨", text: "Personalized daily picks" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-100 border border-border"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl shadow-card"
                data-ocid="account.login.button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Sign in with Internet Identity
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                Secure &amp; private — no passwords required.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col h-full"
            >
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-xs">
                    {initials || <User className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="text-base font-bold text-foreground truncate">
                      {displayName || "MealMaven User"}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {principal.slice(0, 20)}…
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <div className="px-6 py-4 space-y-6">
                  {/* Display Name */}
                  <section data-ocid="account.profile.panel">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-3">
                      Display Name
                    </h3>
                    {profileLoading ? (
                      <Skeleton className="h-10 w-full rounded-lg" />
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your name"
                          className="flex-1 bg-cream-100 border-border focus-visible:ring-brand"
                          data-ocid="account.name.input"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveDisplayName();
                          }}
                        />
                        <Button
                          onClick={handleSaveDisplayName}
                          disabled={saveProfileMutation.isPending}
                          size="sm"
                          className="bg-brand hover:bg-brand-dark text-white flex-shrink-0"
                          data-ocid="account.name.save_button"
                        >
                          {saveProfileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    )}
                  </section>

                  <Separator />

                  {/* Dietary Preferences */}
                  <section data-ocid="account.dietary.panel">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-1">
                      Dietary Preferences
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Toggle preferences — changes save automatically.
                    </p>
                    {profileLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton
                            key={i}
                            className="h-12 w-full rounded-xl"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {DIETARY_OPTIONS.map((opt) => {
                          const isChecked = localPrefs.includes(opt.value);
                          const checkboxId = `pref-${opt.value.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
                          return (
                            <div
                              key={opt.value}
                              className={[
                                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                                isChecked
                                  ? "bg-brand/5 border-brand/40"
                                  : "bg-cream-100 border-border hover:border-brand/30",
                              ].join(" ")}
                              data-ocid={`account.dietary.${opt.value.toLowerCase().replace("-", "_")}.checkbox`}
                            >
                              <Checkbox
                                id={checkboxId}
                                checked={isChecked}
                                onCheckedChange={() =>
                                  handleTogglePref(opt.value)
                                }
                                className="data-[state=checked]:bg-brand data-[state=checked]:border-brand flex-shrink-0"
                              />
                              <label
                                htmlFor={checkboxId}
                                className="flex flex-1 items-center gap-3 cursor-pointer min-w-0"
                              >
                                <span className="text-base flex-shrink-0">
                                  {opt.emoji}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {opt.value}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {opt.description}
                                  </p>
                                </div>
                              </label>
                              {isChecked && (
                                <Sparkles className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  <Separator />

                  {/* Saved Favorites */}
                  <section data-ocid="account.favorites.panel">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-1">
                      Saved Favorites
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your hearted meals appear here.
                    </p>

                    {favoritesLoading ? (
                      <div className="space-y-2">
                        {[1, 2].map((i) => (
                          <Skeleton
                            key={i}
                            className="h-12 w-full rounded-xl"
                          />
                        ))}
                      </div>
                    ) : !favorites || favorites.length === 0 ? (
                      <div
                        className="flex flex-col items-center gap-2 py-8 text-center"
                        data-ocid="account.favorites.empty_state"
                      >
                        <Heart className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          No favorites yet. Heart a meal card to save it here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {favorites.map((meal, idx) => (
                          <motion.div
                            key={meal.id.toString()}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.04 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-100 border border-border"
                            data-ocid={`account.favorites.item.${idx + 1}`}
                          >
                            <span className="text-xl flex-shrink-0">
                              {meal.emoji}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {meal.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                    SLOT_COLORS[meal.slot.toLowerCase()] ??
                                    "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {SLOT_LABELS[meal.slot.toLowerCase()] ??
                                    meal.slot}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {meal.cuisine}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFavorite(meal)}
                              disabled={removeFavoriteMutation.isPending}
                              className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Remove ${meal.name} from favorites`}
                              data-ocid={`account.favorites.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </ScrollArea>

              <div className="px-6 py-4 border-t border-border flex-shrink-0">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-border text-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
                  data-ocid="account.signout.button"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
