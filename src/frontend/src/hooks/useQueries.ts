import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FavoriteMeal,
  MealSuggestion,
  Place,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

function useIsAuthenticated() {
  const { identity } = useInternetIdentity();
  return !!identity && !identity.getPrincipal().isAnonymous();
}

export function useGetMealSuggestions(region: string, seed: bigint) {
  const { actor, isFetching } = useActor();
  const normalizedRegion = region.toLowerCase();
  return useQuery<MealSuggestion[]>({
    queryKey: ["meals", normalizedRegion, seed.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMealSuggestions(normalizedRegion, seed);
    },
    enabled: !!actor && !isFetching && !!region,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetNearbyPlaces(region: string) {
  const { actor, isFetching } = useActor();
  const normalizedRegion = region.toLowerCase();
  return useQuery<Place[]>({
    queryKey: ["places", normalizedRegion],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearbyPlaces(normalizedRegion);
    },
    enabled: !!actor && !isFetching && !!region,
    staleTime: 1000 * 60 * 10,
  });
}

export function useGetSupportedRegions() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSupportedRegions();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  const isAuthenticated = useIsAuthenticated();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProfile();
      } catch {
        // User not yet registered — auto-register with empty profile
        await actor.saveProfile("", []);
        return await actor.getProfile();
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      dietaryPreferences,
    }: {
      displayName: string;
      dietaryPreferences: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveProfile(displayName, dietaryPreferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useGetFavoriteMeals() {
  const { actor, isFetching } = useActor();
  const isAuthenticated = useIsAuthenticated();
  return useQuery<FavoriteMeal[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavoriteMeals();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddFavoriteMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (meal: FavoriteMeal) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFavoriteMeal(meal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mealId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.removeFavoriteMeal(mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
