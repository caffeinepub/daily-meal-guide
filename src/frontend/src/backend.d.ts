import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MealSuggestion {
    id: bigint;
    name: string;
    slot: string;
    description: string;
    emoji: string;
    cuisine: string;
}
export interface FavoriteMeal {
    id: bigint;
    name: string;
    slot: string;
    emoji: string;
    cuisine: string;
}
export interface UserProfile {
    displayName: string;
    dietaryPreferences: Array<string>;
    favoriteMeals: Array<FavoriteMeal>;
}
export interface Place {
    id: bigint;
    placeType: string;
    name: string;
    distance: string;
    cuisine: string;
    rating: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavoriteMeal(meal: FavoriteMeal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavoriteMeals(): Promise<Array<FavoriteMeal>>;
    getMealSuggestions(region: string, seed: bigint): Promise<Array<MealSuggestion>>;
    getNearbyPlaces(region: string): Promise<Array<Place>>;
    getProfile(): Promise<UserProfile>;
    getSupportedRegions(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFavoriteMeal(mealId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProfile(displayName: string, dietaryPreferences: Array<string>): Promise<void>;
}
