import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


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

  let supportedRegions = ["asian", "mediterranean", "american", "mexican", "indian", "african", "default"];

  // ── Asian ──────────────────────────────────────────────────────────────────
  let asianMealSuggestions : [MealSuggestion] = [
    { id = 1;  slot = "breakfast"; name = "Congee";           description = "Rice porridge with savory toppings";                 cuisine = "Asian"; emoji = "🍚" },
    { id = 2;  slot = "breakfast"; name = "Dim Sum";          description = "Steamed dumplings with dipping sauces";             cuisine = "Asian"; emoji = "🥟" },
    { id = 3;  slot = "breakfast"; name = "Onigiri";          description = "Rice balls wrapped in seaweed";                     cuisine = "Asian"; emoji = "🍙" },
    { id = 4;  slot = "lunch";     name = "Sushi";            description = "Vinegared rice with fish and vegetables";           cuisine = "Asian"; emoji = "🍣" },
    { id = 5;  slot = "lunch";     name = "Ramen";            description = "Noodles in rich broth with toppings";               cuisine = "Asian"; emoji = "🍜" },
    { id = 6;  slot = "lunch";     name = "Bibimbap";         description = "Korean mixed rice bowl with vegetables and egg";    cuisine = "Asian"; emoji = "🥗" },
    { id = 7;  slot = "dinner";    name = "Pad Thai";         description = "Stir-fried noodles with shrimp and peanuts";        cuisine = "Asian"; emoji = "🍜" },
    { id = 8;  slot = "dinner";    name = "Korean BBQ";       description = "Grilled marinated meats with banchan";             cuisine = "Asian"; emoji = "🥩" },
    { id = 9;  slot = "dinner";    name = "Pho";              description = "Vietnamese beef noodle soup with herbs";            cuisine = "Asian"; emoji = "🍲" },
  ];

  // ── Mediterranean ──────────────────────────────────────────────────────────
  let mediterraneanMealSuggestions : [MealSuggestion] = [
    { id = 10; slot = "breakfast"; name = "Greek Yogurt";     description = "Yogurt with honey and nuts";                       cuisine = "Mediterranean"; emoji = "🥣" },
    { id = 11; slot = "breakfast"; name = "Shakshuka";        description = "Eggs poached in spiced tomato sauce";              cuisine = "Mediterranean"; emoji = "🍳" },
    { id = 12; slot = "breakfast"; name = "Labneh & Pita";    description = "Strained yogurt dip with warm flatbread";          cuisine = "Mediterranean"; emoji = "🫓" },
    { id = 13; slot = "lunch";     name = "Falafel";          description = "Chickpea balls with salad and pita";               cuisine = "Mediterranean"; emoji = "🥙" },
    { id = 14; slot = "lunch";     name = "Greek Salad";      description = "Tomatoes, cucumber, olives, and feta";             cuisine = "Mediterranean"; emoji = "🥗" },
    { id = 15; slot = "lunch";     name = "Hummus Platter";   description = "Creamy hummus with vegetables and flatbread";      cuisine = "Mediterranean"; emoji = "🫙" },
    { id = 16; slot = "dinner";    name = "Paella";           description = "Rice dish with seafood and saffron";               cuisine = "Mediterranean"; emoji = "🥘" },
    { id = 17; slot = "dinner";    name = "Lamb Kofta";       description = "Spiced lamb skewers with tzatziki";               cuisine = "Mediterranean"; emoji = "🍢" },
    { id = 18; slot = "dinner";    name = "Moussaka";         description = "Layered eggplant, meat, and béchamel bake";       cuisine = "Mediterranean"; emoji = "🍽️" },
  ];

  // ── American ───────────────────────────────────────────────────────────────
  let americanMealSuggestions : [MealSuggestion] = [
    { id = 19; slot = "breakfast"; name = "Pancakes";         description = "Fluffy pancakes with maple syrup";                 cuisine = "American"; emoji = "🥞" },
    { id = 20; slot = "breakfast"; name = "Eggs Benedict";    description = "Poached eggs on Canadian bacon and hollandaise";  cuisine = "American"; emoji = "🍳" },
    { id = 21; slot = "breakfast"; name = "French Toast";     description = "Thick-cut bread dipped in egg batter and fried";  cuisine = "American"; emoji = "🍞" },
    { id = 22; slot = "lunch";     name = "Burger";           description = "Beef patty with lettuce, tomato, and cheese";     cuisine = "American"; emoji = "🍔" },
    { id = 23; slot = "lunch";     name = "Club Sandwich";    description = "Triple-decker with turkey, bacon, and avocado";   cuisine = "American"; emoji = "🥪" },
    { id = 24; slot = "lunch";     name = "BBQ Ribs";         description = "Slow-smoked ribs with tangy barbecue sauce";      cuisine = "American"; emoji = "🍖" },
    { id = 25; slot = "dinner";    name = "Steak";            description = "Grilled steak with mashed potatoes";              cuisine = "American"; emoji = "🥩" },
    { id = 26; slot = "dinner";    name = "Mac & Cheese";     description = "Creamy baked macaroni with cheddar crust";        cuisine = "American"; emoji = "🧀" },
    { id = 27; slot = "dinner";    name = "Pot Roast";        description = "Slow-braised beef with root vegetables";          cuisine = "American"; emoji = "🍲" },
  ];

  // ── Mexican ────────────────────────────────────────────────────────────────
  let mexicanMealSuggestions : [MealSuggestion] = [
    { id = 28; slot = "breakfast"; name = "Chilaquiles";      description = "Tortilla chips with salsa and eggs";              cuisine = "Mexican"; emoji = "🍳" },
    { id = 29; slot = "breakfast"; name = "Huevos Rancheros"; description = "Fried eggs on tortillas with ranchero sauce";     cuisine = "Mexican"; emoji = "🍅" },
    { id = 30; slot = "breakfast"; name = "Tamales";          description = "Steamed corn dough with savory fillings";          cuisine = "Mexican"; emoji = "🫔" },
    { id = 31; slot = "lunch";     name = "Tacos";            description = "Corn tortillas with meat and vegetables";          cuisine = "Mexican"; emoji = "🌮" },
    { id = 32; slot = "lunch";     name = "Torta";            description = "Mexican sandwich with beans, meat, and cheese";   cuisine = "Mexican"; emoji = "🥪" },
    { id = 33; slot = "lunch";     name = "Chiles Rellenos"; description = "Stuffed peppers in tomato sauce";                 cuisine = "Mexican"; emoji = "🌶️" },
    { id = 34; slot = "dinner";    name = "Quesadilla";       description = "Tortilla filled with cheese and other ingredients"; cuisine = "Mexican"; emoji = "🧀" },
    { id = 35; slot = "dinner";    name = "Enchiladas";       description = "Rolled tortillas smothered in chili sauce";       cuisine = "Mexican"; emoji = "🌯" },
    { id = 36; slot = "dinner";    name = "Mole Chicken";     description = "Chicken in rich chocolate-chili mole sauce";      cuisine = "Mexican"; emoji = "🍗" },
  ];

  // ── Indian ─────────────────────────────────────────────────────────────────
  let indianMealSuggestions : [MealSuggestion] = [
    { id = 37; slot = "breakfast"; name = "Dosa";             description = "Fermented crepe with potato filling";              cuisine = "Indian"; emoji = "🥞" },
    { id = 38; slot = "breakfast"; name = "Idli Sambar";      description = "Steamed rice cakes with lentil soup";             cuisine = "Indian"; emoji = "🍚" },
    { id = 39; slot = "breakfast"; name = "Poha";             description = "Flattened rice with mustard seeds and curry leaves"; cuisine = "Indian"; emoji = "🍛" },
    { id = 40; slot = "lunch";     name = "Biryani";          description = "Spiced rice with meat or vegetables";              cuisine = "Indian"; emoji = "🍚" },
    { id = 41; slot = "lunch";     name = "Thali";            description = "Balanced platter with dal, sabzi, rice, and roti"; cuisine = "Indian"; emoji = "🍱" },
    { id = 42; slot = "lunch";     name = "Chole Bhature";    description = "Spicy chickpea curry with fried puffed bread";    cuisine = "Indian"; emoji = "🫓" },
    { id = 43; slot = "dinner";    name = "Butter Chicken";   description = "Chicken cooked in creamy tomato sauce";           cuisine = "Indian"; emoji = "🍗" },
    { id = 44; slot = "dinner";    name = "Dal Makhani";      description = "Slow-cooked black lentils in buttery sauce";      cuisine = "Indian"; emoji = "🍲" },
    { id = 45; slot = "dinner";    name = "Lamb Rogan Josh";  description = "Slow-braised lamb in Kashmiri spice gravy";       cuisine = "Indian"; emoji = "🥘" },
  ];

  // ── African ────────────────────────────────────────────────────────────────
  let africanMealSuggestions : [MealSuggestion] = [
    { id = 46; slot = "breakfast"; name = "Akara";            description = "Crispy fried bean cakes served with pap";         cuisine = "African"; emoji = "🫓" },
    { id = 47; slot = "breakfast"; name = "Pap & Fried Egg";  description = "Smooth maize porridge with fried egg and tomato"; cuisine = "African"; emoji = "🍳" },
    { id = 48; slot = "breakfast"; name = "Mandazi";          description = "East African fried doughnuts with chai tea";      cuisine = "African"; emoji = "🍩" },
    { id = 49; slot = "lunch";     name = "Jollof Rice";      description = "Spiced tomato rice with chicken and fried plantain"; cuisine = "African"; emoji = "🍛" },
    { id = 50; slot = "lunch";     name = "Fufu & Egusi";     description = "Pounded yam with rich melon seed soup";           cuisine = "African"; emoji = "🍲" },
    { id = 51; slot = "lunch";     name = "Injera & Wat";     description = "Ethiopian sourdough flatbread with spiced stew";  cuisine = "African"; emoji = "🫔" },
    { id = 52; slot = "dinner";    name = "Egusi Soup";       description = "Rich melon seed soup with leafy greens and meat"; cuisine = "African"; emoji = "🍲" },
    { id = 53; slot = "dinner";    name = "Suya";             description = "Grilled spiced beef skewers with onion and tomato"; cuisine = "African"; emoji = "🍢" },
    { id = 54; slot = "dinner";    name = "Bobotie";          description = "South African spiced minced meat bake with egg";  cuisine = "African"; emoji = "🥘" },
  ];

  // ── Default ────────────────────────────────────────────────────────────────
  let defaultMealSuggestions : [MealSuggestion] = [
    { id = 55; slot = "breakfast"; name = "Omelette";         description = "Eggs with cheese and vegetables";                 cuisine = "Default"; emoji = "🍳" },
    { id = 56; slot = "breakfast"; name = "Avocado Toast";    description = "Smashed avocado on sourdough with poached egg";  cuisine = "Default"; emoji = "🥑" },
    { id = 57; slot = "breakfast"; name = "Granola Bowl";     description = "Oats with fruit, nuts, and honey";                cuisine = "Default"; emoji = "🥣" },
    { id = 58; slot = "lunch";     name = "Sandwich";         description = "Bread with assorted fillings";                    cuisine = "Default"; emoji = "🥪" },
    { id = 59; slot = "lunch";     name = "Caesar Salad";     description = "Romaine lettuce with parmesan and croutons";      cuisine = "Default"; emoji = "🥗" },
    { id = 60; slot = "lunch";     name = "Tomato Soup";      description = "Creamy tomato soup with crusty bread";            cuisine = "Default"; emoji = "🍵" },
    { id = 61; slot = "dinner";    name = "Pasta";            description = "Noodles with tomato sauce and cheese";            cuisine = "Default"; emoji = "🍝" },
    { id = 62; slot = "dinner";    name = "Grilled Salmon";   description = "Pan-seared salmon with roasted vegetables";       cuisine = "Default"; emoji = "🐟" },
    { id = 63; slot = "dinner";    name = "Vegetable Curry";  description = "Spiced mixed vegetable curry with rice";          cuisine = "Default"; emoji = "🍛" },
  ];

  let asianPlaces : [Place] = [
    { id = 1;  name = "Sushi Bar";         placeType = "Restaurant"; cuisine = "Asian"; distance = "2km";   rating = 4.5 },
    { id = 2;  name = "Noodle House";      placeType = "Restaurant"; cuisine = "Asian"; distance = "1.5km"; rating = 4.2 },
    { id = 3;  name = "Dim Sum Cafe";      placeType = "Cafe";       cuisine = "Asian"; distance = "3km";   rating = 4.0 },
    { id = 4;  name = "Bubble Tea Shop";   placeType = "Cafe";       cuisine = "Asian"; distance = "0.5km"; rating = 4.7 },
    { id = 5;  name = "Ramen Shop";        placeType = "Restaurant"; cuisine = "Asian"; distance = "2.5km"; rating = 4.4 },
    { id = 6;  name = "Korean BBQ";        placeType = "Restaurant"; cuisine = "Asian"; distance = "4km";   rating = 4.6 },
  ];

  let mediterraneanPlaces : [Place] = [
    { id = 7;  name = "Greek Taverna";     placeType = "Restaurant"; cuisine = "Mediterranean"; distance = "2.2km"; rating = 4.3 },
    { id = 8;  name = "Italian Bistro";    placeType = "Restaurant"; cuisine = "Mediterranean"; distance = "1.8km"; rating = 4.5 },
    { id = 9;  name = "Spanish Tapas Bar"; placeType = "Bar";        cuisine = "Mediterranean"; distance = "3.5km"; rating = 4.1 },
    { id = 10; name = "Moroccan Cafe";     placeType = "Cafe";       cuisine = "Mediterranean"; distance = "1km";   rating = 4.6 },
    { id = 11; name = "French Bakery";     placeType = "Bakery";     cuisine = "Mediterranean"; distance = "0.8km"; rating = 4.8 },
    { id = 12; name = "Turkish Grill";     placeType = "Restaurant"; cuisine = "Mediterranean"; distance = "2.7km"; rating = 4.4 },
  ];

  let americanPlaces : [Place] = [
    { id = 13; name = "Burger Joint";      placeType = "Restaurant"; cuisine = "American"; distance = "1.2km"; rating = 4.2 },
    { id = 14; name = "Steakhouse";        placeType = "Restaurant"; cuisine = "American"; distance = "3km";   rating = 4.7 },
    { id = 15; name = "Pancake House";     placeType = "Restaurant"; cuisine = "American"; distance = "2.8km"; rating = 4.0 },
    { id = 16; name = "Diner";             placeType = "Restaurant"; cuisine = "American"; distance = "1.7km"; rating = 4.3 },
    { id = 17; name = "BBQ Grill";         placeType = "Restaurant"; cuisine = "American"; distance = "4.2km"; rating = 4.5 },
    { id = 18; name = "Coffee Shop";       placeType = "Cafe";       cuisine = "American"; distance = "0.6km"; rating = 4.6 },
  ];

  let mexicanPlaces : [Place] = [
    { id = 19; name = "Taco Stand";        placeType = "Restaurant"; cuisine = "Mexican"; distance = "1km";   rating = 4.4 },
    { id = 20; name = "Burrito Bar";       placeType = "Restaurant"; cuisine = "Mexican"; distance = "2.3km"; rating = 4.2 },
    { id = 21; name = "Cantina";           placeType = "Bar";        cuisine = "Mexican"; distance = "3.2km"; rating = 4.1 },
    { id = 22; name = "Quesadilla House";  placeType = "Restaurant"; cuisine = "Mexican"; distance = "1.5km"; rating = 4.3 },
    { id = 23; name = "Mexican Grill";     placeType = "Restaurant"; cuisine = "Mexican"; distance = "2.9km"; rating = 4.6 },
    { id = 24; name = "Salsa Bar";         placeType = "Bar";        cuisine = "Mexican"; distance = "0.7km"; rating = 4.5 },
  ];

  let indianPlaces : [Place] = [
    { id = 25; name = "Curry House";       placeType = "Restaurant"; cuisine = "Indian"; distance = "2.1km"; rating = 4.5 },
    { id = 26; name = "Tandoori Grill";    placeType = "Restaurant"; cuisine = "Indian"; distance = "1.6km"; rating = 4.4 },
    { id = 27; name = "Dosa Cafe";         placeType = "Cafe";       cuisine = "Indian"; distance = "2.8km"; rating = 4.3 },
    { id = 28; name = "Spice Bar";         placeType = "Bar";        cuisine = "Indian"; distance = "3.7km"; rating = 4.2 },
    { id = 29; name = "Biryani House";     placeType = "Restaurant"; cuisine = "Indian"; distance = "1.3km"; rating = 4.6 },
    { id = 30; name = "Indian Sweets";     placeType = "Bakery";     cuisine = "Indian"; distance = "0.9km"; rating = 4.8 },
  ];

  let africanPlaces : [Place] = [
    { id = 31; name = "Jollof Kitchen";    placeType = "Restaurant"; cuisine = "African"; distance = "1.4km"; rating = 4.6 },
    { id = 32; name = "Suya Spot";         placeType = "Restaurant"; cuisine = "African"; distance = "0.8km"; rating = 4.5 },
    { id = 33; name = "Mama Africa Eatery"; placeType = "Restaurant"; cuisine = "African"; distance = "2.3km"; rating = 4.7 },
    { id = 34; name = "Afro Cafe";         placeType = "Cafe";       cuisine = "African"; distance = "1.1km"; rating = 4.4 },
    { id = 35; name = "Buka Restaurant";   placeType = "Restaurant"; cuisine = "African"; distance = "3.2km"; rating = 4.3 },
    { id = 36; name = "Safari Grill";      placeType = "Restaurant"; cuisine = "African"; distance = "2.7km"; rating = 4.5 },
  ];

  let defaultPlaces : [Place] = [
    { id = 37; name = "Local Cafe";        placeType = "Cafe";       cuisine = "Default"; distance = "1.7km"; rating = 4.3 },
    { id = 38; name = "Family Restaurant"; placeType = "Restaurant"; cuisine = "Default"; distance = "2.6km"; rating = 4.2 },
    { id = 39; name = "Bakery";            placeType = "Bakery";     cuisine = "Default"; distance = "1.4km"; rating = 4.7 },
    { id = 40; name = "Food Court";        placeType = "Restaurant"; cuisine = "Default"; distance = "3.4km"; rating = 4.0 },
    { id = 41; name = "Deli";              placeType = "Restaurant"; cuisine = "Default"; distance = "2.2km"; rating = 4.5 },
    { id = 42; name = "Juice Bar";         placeType = "Bar";        cuisine = "Default"; distance = "1.1km"; rating = 4.6 },
  ];

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Pick one meal per slot using seed for variety.
  // Each region has 9 meals: indices 0-2 = breakfast, 3-5 = lunch, 6-8 = dinner.
  func pickOneMealPerSlot(suggestions : [MealSuggestion], seed : Nat) : [MealSuggestion] {
    let n = suggestions.size();
    if (n == 0) { return [] };

    // Collect meals by slot
    let breakfastMeals = suggestions.filter(func(m) { m.slot == "breakfast" });
    let lunchMeals     = suggestions.filter(func(m) { m.slot == "lunch" });
    let dinnerMeals    = suggestions.filter(func(m) { m.slot == "dinner" });

    let bSize = breakfastMeals.size();
    let lSize = lunchMeals.size();
    let dSize = dinnerMeals.size();

    if (bSize == 0 or lSize == 0 or dSize == 0) { return suggestions };

    let bIdx = seed % bSize;
    let lIdx = (seed + 1) % lSize;
    let dIdx = (seed + 2) % dSize;

    [breakfastMeals[Int.abs(bIdx)], lunchMeals[Int.abs(lIdx)], dinnerMeals[Int.abs(dIdx)]];
  };

  func getMealSuggestionsForRegion(region : Text) : [MealSuggestion] {
    switch (region) {
      case ("asian" or "ASIAN") { asianMealSuggestions };
      case ("mediterranean" or "MEDITERRANEAN") { mediterraneanMealSuggestions };
      case ("american" or "AMERICAN") { americanMealSuggestions };
      case ("mexican" or "MEXICAN") { mexicanMealSuggestions };
      case ("indian" or "INDIAN") { indianMealSuggestions };
      case ("african" or "AFRICAN") { africanMealSuggestions };
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
      case ("african" or "AFRICAN") { africanPlaces };
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
    pickOneMealPerSlot(baseSuggestions, seed);
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
