# Daily Meal Guide

## Current State
The app suggests one meal per slot (breakfast, lunch, dinner) per region. Each region has exactly 3 meals (one per slot) hardcoded in the backend. When the user clicks "Regenerate All Meals", the same meals always appear because there's only one option per slot. African region has: Akara (breakfast), Jollof Rice (lunch), Egusi Soup (dinner).

## Requested Changes (Diff)

### Add
- Multiple meal options per slot per region (at least 3 options per slot = 9 meals per region pool)
- Daily rotation logic: use the current day-of-year + seed to cycle through meal options so users see variety each day and when they click Regenerate
- Expand all regions with more meal variety, especially African cuisine

### Modify
- Backend `getMealSuggestions`: Update meal data arrays to have multiple options per slot, improve rotation algorithm to pick one per slot from the pool
- Each region's meal pool: expand from 3 meals to 9 meals (3 options × 3 slots)

### Remove
- Nothing removed

## Implementation Plan
1. Expand meal arrays for all regions to 9 meals each (3 per slot)
2. Update `getSortedMealSuggestions` to select one meal per slot from the expanded pool using the seed for variety
3. African region gets the most expansion with authentic variety: Akara, Pap & Fried Egg, Ogi (breakfast); Jollof Rice, Fufu & Egusi, Nkwobi (lunch); Egusi Soup, Pounded Yam & Ofe Onugbu, Suya (dinner)
4. No frontend changes needed -- the existing Regenerate button already provides new seeds
