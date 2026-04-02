# MealMaven

## Current State
The app is a location-based daily meal guide that:
- Detects user geolocation and maps it to a cuisine region (asian, mediterranean, american, mexican, indian, default)
- Fetches breakfast, lunch, and dinner meal suggestions from the Motoko backend based on region + seed
- Shows nearby restaurant/mall place cards
- Has a Header with nav links (Plan Today, Recipes, Explore, Account) — Account is currently a dead link
- Backend has `getMealSuggestions`, `getNearbyPlaces`, and `getSupportedRegions` public queries
- No authentication or user profiles exist yet

## Requested Changes (Diff)

### Add
- Internet Identity login/logout via the `authorization` Caffeine component
- User profile stored on-chain per principal: display name, dietary preferences (Vegetarian, Halal, Gluten-Free, Vegan, Dairy-Free, Nut-Free), and saved favorite meals (list of meal IDs with names/emojis)
- Backend functions: `getProfile`, `saveProfile`, `addFavoriteMeal`, `removeFavoriteMeal`
- Account page/panel accessible from the Header "Account" nav link — shows login prompt if unauthenticated, or profile + favorites if logged in
- Favorite button (heart icon) on each MealCard — toggles save/unsave, only visible/active when logged in
- Meal suggestions filtered by dietary preferences when a user is logged in and has set preferences
- Visual indicator on MealCards when a meal matches the user's dietary preferences

### Modify
- Header: "Account" nav link opens the Account panel/page; show avatar/initial + logged-in state when authenticated
- MealCard: add a favorite heart button overlay
- App.tsx: integrate auth state, pass favorites and preferences down to meal section
- Backend: add user profile management functions alongside existing meal/place queries; meal suggestions can optionally be filtered by dietary tag

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` Caffeine component
2. Generate updated Motoko backend with:
   - `UserProfile` type: `{ displayName: Text; dietaryPreferences: [Text]; favoriteMealIds: [Nat] }`
   - `FavoriteMeal` type: `{ id: Nat; name: Text; emoji: Text; cuisine: Text; slot: Text }`
   - Stable var `profiles : TrieMap<Principal, UserProfile>`
   - `getProfile()` — returns caller's profile (or default empty profile)
   - `saveProfile(displayName, dietaryPreferences)` — upsert profile
   - `addFavoriteMeal(meal: FavoriteMeal)` — add to favorites
   - `removeFavoriteMeal(mealId: Nat)` — remove from favorites
   - Meal suggestions still returned as-is (filtering happens on frontend based on preferences)
3. Frontend:
   - Wire Internet Identity login/logout using `useInternetIdentity` hook (already present)
   - Create `AccountPanel` component (slide-in sheet or page section) with:
     - Login/logout button
     - Display name input
     - Dietary preferences multi-select checkboxes
     - Saved favorites list
   - Update `Header` to show login state and open `AccountPanel`
   - Add heart favorite button to `MealCard`, wired to `addFavoriteMeal`/`removeFavoriteMeal`
   - Filter/highlight meal suggestions based on dietary preferences client-side
