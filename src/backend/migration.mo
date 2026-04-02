import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type Place = {
    id : Nat;
    name : Text;
    placeType : Text;
    cuisine : Text;
    distance : Text;
    rating : Float;
  };

  type MealSuggestion = {
    id : Nat;
    slot : Text;
    name : Text;
    description : Text;
    cuisine : Text;
    emoji : Text;
  };

  type OldActor = {
    supportedRegions : [Text];
    asianMealSuggestions : [MealSuggestion];
    mediterraneanMealSuggestions : [MealSuggestion];
    americanMealSuggestions : [MealSuggestion];
    mexicanMealSuggestions : [MealSuggestion];
    indianMealSuggestions : [MealSuggestion];
    defaultMealSuggestions : [MealSuggestion];
    asianPlaces : [Place];
    mediterraneanPlaces : [Place];
    americanPlaces : [Place];
    mexicanPlaces : [Place];
    indianPlaces : [Place];
    defaultPlaces : [Place];
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

  type NewActor = {
    supportedRegions : [Text];
    asianMealSuggestions : [MealSuggestion];
    mediterraneanMealSuggestions : [MealSuggestion];
    americanMealSuggestions : [MealSuggestion];
    mexicanMealSuggestions : [MealSuggestion];
    indianMealSuggestions : [MealSuggestion];
    defaultMealSuggestions : [MealSuggestion];
    asianPlaces : [Place];
    mediterraneanPlaces : [Place];
    americanPlaces : [Place];
    mexicanPlaces : [Place];
    indianPlaces : [Place];
    defaultPlaces : [Place];
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
