import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  type MealSuggestion = {
    id : Nat;
    slot : Text;
    name : Text;
    description : Text;
    cuisine : Text;
    emoji : Text;
  };

  type Place = {
    id : Nat;
    name : Text;
    placeType : Text;
    cuisine : Text;
    distance : Text;
    rating : Float;
  };

  type FavoriteMeal = {
    id : Nat;
    name : Text;
    emoji : Text;
    cuisine : Text;
    slot : Text;
  };

  type UserProfile = {
    displayName : Text;
    dietaryPreferences : [Text];
    favoriteMeals : [FavoriteMeal];
  };

  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let supportedRegions = ["asian", "mediterranean", "american", "mexican", "indian", "default"];

  let asianMealSuggestions : [MealSuggestion] = [
    {
      id = 1;
      slot = "breakfast";
      name = "Congee";
      description = "Rice porridge with savory toppings";
      cuisine = "Asian";
      emoji = "🍚";
    },
    {
      id = 2;
      slot = "lunch";
      name = "Sushi";
      description = "Vinegared rice with fish and vegetables";
      cuisine = "Asian";
      emoji = "🍣";
    },
    {
      id = 3;
      slot = "dinner";
      name = "Pad Thai";
      description = "Stir-fried noodles with shrimp and peanuts";
      cuisine = "Asian";
      emoji = "🍜";
    },
  ];

  let mediterraneanMealSuggestions : [MealSuggestion] = [
    {
      id = 4;
      slot = "breakfast";
      name = "Greek Yogurt";
      description = "Yogurt with honey and nuts";
      cuisine = "Mediterranean";
      emoji = "🥣";
    },
    {
      id = 5;
      slot = "lunch";
      name = "Falafel";
      description = "Chickpea balls with salad and pita";
      cuisine = "Mediterranean";
      emoji = "🥙";
    },
    {
      id = 6;
      slot = "dinner";
      name = "Paella";
      description = "Rice dish with seafood and saffron";
      cuisine = "Mediterranean";
      emoji = "🥘";
    },
  ];

  let americanMealSuggestions : [MealSuggestion] = [
    {
      id = 7;
      slot = "breakfast";
      name = "Pancakes";
      description = "Fluffy pancakes with syrup";
      cuisine = "American";
      emoji = "🥞";
    },
    {
      id = 8;
      slot = "lunch";
      name = "Burger";
      description = "Beef patty with lettuce, tomato, and cheese";
      cuisine = "American";
      emoji = "🍔";
    },
    {
      id = 9;
      slot = "dinner";
      name = "Steak";
      description = "Grilled steak with mashed potatoes";
      cuisine = "American";
      emoji = "🥩";
    },
  ];

  let mexicanMealSuggestions : [MealSuggestion] = [
    {
      id = 10;
      slot = "breakfast";
      name = "Chilaquiles";
      description = "Tortilla chips with salsa and eggs";
      cuisine = "Mexican";
      emoji = "🍳";
    },
    {
      id = 11;
      slot = "lunch";
      name = "Tacos";
      description = "Corn tortillas with meat and vegetables";
      cuisine = "Mexican";
      emoji = "🌮";
    },
    {
      id = 12;
      slot = "dinner";
      name = "Quesadilla";
      description = "Tortilla filled with cheese and other ingredients";
      cuisine = "Mexican";
      emoji = "🧀";
    },
  ];

  let indianMealSuggestions : [MealSuggestion] = [
    {
      id = 13;
      slot = "breakfast";
      name = "Dosa";
      description = "Fermented crepe with potato filling";
      cuisine = "Indian";
      emoji = "🥞";
    },
    {
      id = 14;
      slot = "lunch";
      name = "Biryani";
      description = "Spiced rice with meat or vegetables";
      cuisine = "Indian";
      emoji = "🍚";
    },
    {
      id = 15;
      slot = "dinner";
      name = "Butter Chicken";
      description = "Chicken cooked in creamy tomato sauce";
      cuisine = "Indian";
      emoji = "🍗";
    },
  ];

  let defaultMealSuggestions : [MealSuggestion] = [
    {
      id = 16;
      slot = "breakfast";
      name = "Omelette";
      description = "Eggs with cheese and vegetables";
      cuisine = "Default";
      emoji = "🍳";
    },
    {
      id = 17;
      slot = "lunch";
      name = "Sandwich";
      description = "Bread with assorted fillings";
      cuisine = "Default";
      emoji = "🥪";
    },
    {
      id = 18;
      slot = "dinner";
      name = "Pasta";
      description = "Noodles with tomato sauce and cheese";
      cuisine = "Default";
      emoji = "🍝";
    },
  ];

  let asianPlaces : [Place] = [
    {
      id = 1;
      name = "Sushi Bar";
      placeType = "Restaurant";
      cuisine = "Asian";
      distance = "2km";
      rating = 4.5;
    },
    {
      id = 2;
      name = "Noodle House";
      placeType = "Restaurant";
      cuisine = "Asian";
      distance = "1.5km";
      rating = 4.2;
    },
    {
      id = 3;
      name = "Dim Sum Cafe";
      placeType = "Cafe";
      cuisine = "Asian";
      distance = "3km";
      rating = 4.0;
    },
    {
      id = 4;
      name = "Bubble Tea Shop";
      placeType = "Cafe";
      cuisine = "Asian";
      distance = "0.5km";
      rating = 4.7;
    },
    {
      id = 5;
      name = "Ramen Shop";
      placeType = "Restaurant";
      cuisine = "Asian";
      distance = "2.5km";
      rating = 4.4;
    },
    {
      id = 6;
      name = "Korean BBQ";
      placeType = "Restaurant";
      cuisine = "Asian";
      distance = "4km";
      rating = 4.6;
    },
  ];

  let mediterraneanPlaces : [Place] = [
    {
      id = 7;
      name = "Greek Taverna";
      placeType = "Restaurant";
      cuisine = "Mediterranean";
      distance = "2.2km";
      rating = 4.3;
    },
    {
      id = 8;
      name = "Italian Bistro";
      placeType = "Restaurant";
      cuisine = "Mediterranean";
      distance = "1.8km";
      rating = 4.5;
    },
    {
      id = 9;
      name = "Spanish Tapas Bar";
      placeType = "Bar";
      cuisine = "Mediterranean";
      distance = "3.5km";
      rating = 4.1;
    },
    {
      id = 10;
      name = "Moroccan Cafe";
      placeType = "Cafe";
      cuisine = "Mediterranean";
      distance = "1km";
      rating = 4.6;
    },
    {
      id = 11;
      name = "French Bakery";
      placeType = "Bakery";
      cuisine = "Mediterranean";
      distance = "0.8km";
      rating = 4.8;
    },
    {
      id = 12;
      name = "Turkish Grill";
      placeType = "Restaurant";
      cuisine = "Mediterranean";
      distance = "2.7km";
      rating = 4.4;
    },
  ];

  let americanPlaces : [Place] = [
    {
      id = 13;
      name = "Burger Joint";
      placeType = "Restaurant";
      cuisine = "American";
      distance = "1.2km";
      rating = 4.2;
    },
    {
      id = 14;
      name = "Steakhouse";
      placeType = "Restaurant";
      cuisine = "American";
      distance = "3km";
      rating = 4.7;
    },
    {
      id = 15;
      name = "Pancake House";
      placeType = "Restaurant";
      cuisine = "American";
      distance = "2.8km";
      rating = 4.0;
    },
    {
      id = 16;
      name = "Diner";
      placeType = "Restaurant";
      cuisine = "American";
      distance = "1.7km";
      rating = 4.3;
    },
    {
      id = 17;
      name = "BBQ Grill";
      placeType = "Restaurant";
      cuisine = "American";
      distance = "4.2km";
      rating = 4.5;
    },
    {
      id = 18;
      name = "Coffee Shop";
      placeType = "Cafe";
      cuisine = "American";
      distance = "0.6km";
      rating = 4.6;
    },
  ];

  let mexicanPlaces : [Place] = [
    {
      id = 19;
      name = "Taco Stand";
      placeType = "Restaurant";
      cuisine = "Mexican";
      distance = "1km";
      rating = 4.4;
    },
    {
      id = 20;
      name = "Burrito Bar";
      placeType = "Restaurant";
      cuisine = "Mexican";
      distance = "2.3km";
      rating = 4.2;
    },
    {
      id = 21;
      name = "Cantina";
      placeType = "Bar";
      cuisine = "Mexican";
      distance = "3.2km";
      rating = 4.1;
    },
    {
      id = 22;
      name = "Quesadilla House";
      placeType = "Restaurant";
      cuisine = "Mexican";
      distance = "1.5km";
      rating = 4.3;
    },
    {
      id = 23;
      name = "Mexican Grill";
      placeType = "Restaurant";
      cuisine = "Mexican";
      distance = "2.9km";
      rating = 4.6;
    },
    {
      id = 24;
      name = "Salsa Bar";
      placeType = "Bar";
      cuisine = "Mexican";
      distance = "0.7km";
      rating = 4.5;
    },
  ];

  let indianPlaces : [Place] = [
    {
      id = 25;
      name = "Curry House";
      placeType = "Restaurant";
      cuisine = "Indian";
      distance = "2.1km";
      rating = 4.5;
    },
    {
      id = 26;
      name = "Tandoori Grill";
      placeType = "Restaurant";
      cuisine = "Indian";
      distance = "1.6km";
      rating = 4.4;
    },
    {
      id = 27;
      name = "Dosa Cafe";
      placeType = "Cafe";
      cuisine = "Indian";
      distance = "2.8km";
      rating = 4.3;
    },
    {
      id = 28;
      name = "Spice Bar";
      placeType = "Bar";
      cuisine = "Indian";
      distance = "3.7km";
      rating = 4.2;
    },
    {
      id = 29;
      name = "Biryani House";
      placeType = "Restaurant";
      cuisine = "Indian";
      distance = "1.3km";
      rating = 4.6;
    },
    {
      id = 30;
      name = "Indian Sweets";
      placeType = "Bakery";
      cuisine = "Indian";
      distance = "0.9km";
      rating = 4.8;
    },
  ];

  let defaultPlaces : [Place] = [
    {
      id = 31;
      name = "Local Cafe";
      placeType = "Cafe";
      cuisine = "Default";
      distance = "1.7km";
      rating = 4.3;
    },
    {
      id = 32;
      name = "Family Restaurant";
      placeType = "Restaurant";
      cuisine = "Default";
      distance = "2.6km";
      rating = 4.2;
    },
    {
      id = 33;
      name = "Bakery";
      placeType = "Bakery";
      cuisine = "Default";
      distance = "1.4km";
      rating = 4.7;
    },
    {
      id = 34;
      name = "Food Court";
      placeType = "Restaurant";
      cuisine = "Default";
      distance = "3.4km";
      rating = 4.0;
    },
    {
      id = 35;
      name = "Deli";
      placeType = "Restaurant";
      cuisine = "Default";
      distance = "2.2km";
      rating = 4.5;
    },
    {
      id = 36;
      name = "Juice Bar";
      placeType = "Bar";
      cuisine = "Default";
      distance = "1.1km";
      rating = 4.6;
    },
  ];

  let userProfiles = Map.empty<Principal, UserProfile>();

  func getSortedMealSuggestions(suggestions : [MealSuggestion], seed : Nat) : [MealSuggestion] {
    let n = suggestions.size();
    let offset = seed % n;

    Array.tabulate<MealSuggestion>(
      n,
      func(i) {
        let index = Int.abs(i + offset) % n;
        suggestions[Int.abs(index)];
      },
    );
  };

  func getMealSuggestionsForRegion(region : Text) : [MealSuggestion] {
    switch (region) {
      case ("asian" or "ASIAN") { asianMealSuggestions };
      case ("mediterranean" or "MEDITERRANEAN") { mediterraneanMealSuggestions };
      case ("american" or "AMERICAN") { americanMealSuggestions };
      case ("mexican" or "MEXICAN") { mexicanMealSuggestions };
      case ("indian" or "INDIAN") { indianMealSuggestions };
      case ("default" or "DEFAULT") { defaultMealSuggestions };
      case (_) { Runtime.trap("Region not supported. Use getSupportedRegions() for a list of supported region names. ") };
    };
  };

  func getPlacesForRegion(region : Text) : [Place] {
    switch (region) {
      case ("asian" or "ASIAN") { asianPlaces };
      case ("mediterranean" or "MEDITERRANEAN") { mediterraneanPlaces };
      case ("american" or "AMERICAN") { americanPlaces };
      case ("mexican" or "MEXICAN") { mexicanPlaces };
      case ("indian" or "INDIAN") { indianPlaces };
      case ("default" or "DEFAULT") { defaultPlaces };
      case (_) { Runtime.trap("Region not supported. Use getSupportedRegions() for a list of supported region names. ") };
    };
  };

  func isDuplicateFavorite(existingFavorites : [FavoriteMeal], newMeal : FavoriteMeal) : Bool {
    existingFavorites.any(func(fm) { fm.id == newMeal.id });
  };

  // Public read-only functions - accessible to all including guests
  public query ({ caller }) func getMealSuggestions(region : Text, seed : Nat) : async [MealSuggestion] {
    let baseSuggestions = getMealSuggestionsForRegion(region);
    let sortedSuggestions = getSortedMealSuggestions(baseSuggestions, seed);
    let n = sortedSuggestions.size();
    if (n <= 3) { return sortedSuggestions };
    Array.tabulate<MealSuggestion>(3, func(i) { sortedSuggestions[i] });
  };

  public query ({ caller }) func getNearbyPlaces(region : Text) : async [Place] {
    getPlacesForRegion(region);
  };

  public query ({ caller }) func getSupportedRegions() : async [Text] {
    supportedRegions;
  };

  public shared ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Legacy function names for backward compatibility
  public query ({ caller }) func getProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        { displayName = ""; dietaryPreferences = []; favoriteMeals = [] };
      };
    };
  };

  public shared ({ caller }) func saveProfile(displayName : Text, dietaryPreferences : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        { displayName = ""; dietaryPreferences = []; favoriteMeals = [] };
      };
    };

    let updatedProfile = {
      existingProfile with
      displayName;
      dietaryPreferences;
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func addFavoriteMeal(meal : FavoriteMeal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorite meals");
    };

    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        { displayName = ""; dietaryPreferences = []; favoriteMeals = [] };
      };
    };

    if (isDuplicateFavorite(existingProfile.favoriteMeals, meal)) {
      return;
    };

    let updatedFavorites = List.fromArray<FavoriteMeal>(existingProfile.favoriteMeals);
    updatedFavorites.add(meal);

    let updatedProfile = {
      existingProfile with
      favoriteMeals = updatedFavorites.toArray();
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func removeFavoriteMeal(mealId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorite meals");
    };

    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        { displayName = ""; dietaryPreferences = []; favoriteMeals = [] };
      };
    };

    let originalFavoritesSize = existingProfile.favoriteMeals.size();

    if (originalFavoritesSize == 0) { return };

    let filteredFavorites = existingProfile.favoriteMeals.filter(
      func(fm) { fm.id != mealId }
    );

    if (filteredFavorites.size() == originalFavoritesSize) { return };

    let updatedProfile = {
      existingProfile with
      favoriteMeals = filteredFavorites;
    };

    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getFavoriteMeals() : async [FavoriteMeal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorite meals");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { profile.favoriteMeals };
      case (null) { [] };
    };
  };
};
