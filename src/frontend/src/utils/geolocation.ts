export type Region =
  | "Asian"
  | "Mediterranean"
  | "American"
  | "Mexican"
  | "Indian"
  | "Default";

export interface LocationInfo {
  region: Region;
  displayName: string;
  lat: number;
  lng: number;
}

/**
 * Map lat/lng to a supported backend region.
 */
export function latLngToRegion(lat: number, lng: number): Region {
  // Indian subcontinent
  if (lat >= 8 && lat <= 35 && lng >= 68 && lng <= 88) return "Indian";
  // Asian (broader East/Southeast Asia)
  if (lat >= 10 && lat <= 55 && lng >= 70 && lng <= 145) return "Asian";
  // Mediterranean
  if (lat >= 30 && lat <= 47 && lng >= -5 && lng <= 37) return "Mediterranean";
  // Mexico
  if (lat >= 15 && lat <= 30 && lng >= -117 && lng <= -87) return "Mexican";
  // North America
  if (lat >= 25 && lat <= 50 && lng >= -125 && lng <= -65) return "American";
  return "Default";
}

// Rough city lookup table (lat, lng, name)
const CITY_LOOKUP: Array<[number, number, string, string]> = [
  // [lat, lng, city, country]
  [40.7128, -74.006, "New York", "NY"],
  [34.0522, -118.2437, "Los Angeles", "CA"],
  [41.8781, -87.6298, "Chicago", "IL"],
  [29.7604, -95.3698, "Houston", "TX"],
  [33.749, -84.388, "Atlanta", "GA"],
  [47.6062, -122.3321, "Seattle", "WA"],
  [37.7749, -122.4194, "San Francisco", "CA"],
  [25.7617, -80.1918, "Miami", "FL"],
  [51.5074, -0.1278, "London", "UK"],
  [48.8566, 2.3522, "Paris", "France"],
  [52.52, 13.405, "Berlin", "Germany"],
  [41.9028, 12.4964, "Rome", "Italy"],
  [40.4168, -3.7038, "Madrid", "Spain"],
  [35.6762, 139.6503, "Tokyo", "Japan"],
  [31.2304, 121.4737, "Shanghai", "China"],
  [22.3193, 114.1694, "Hong Kong", "HK"],
  [1.3521, 103.8198, "Singapore", "SG"],
  [-33.8688, 151.2093, "Sydney", "Australia"],
  [19.076, 72.8777, "Mumbai", "India"],
  [28.6139, 77.209, "Delhi", "India"],
  [13.0827, 80.2707, "Chennai", "India"],
  [37.5665, 126.978, "Seoul", "South Korea"],
  [-23.5505, -46.6333, "São Paulo", "Brazil"],
  [19.4326, -99.1332, "Mexico City", "Mexico"],
  [55.7558, 37.6173, "Moscow", "Russia"],
  [30.0444, 31.2357, "Cairo", "Egypt"],
  [6.5244, 3.3792, "Lagos", "Nigeria"],
];

/**
 * Return a human-readable city/region name from lat/lng.
 * Falls back to formatted coordinates if no close match.
 */
export function latLngToDisplayName(lat: number, lng: number): string {
  let closest: string | null = null;
  let minDist = Number.POSITIVE_INFINITY;

  for (const [clat, clng, city, region] of CITY_LOOKUP) {
    const dist = Math.sqrt((lat - clat) ** 2 + (lng - clng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = `${city}, ${region}`;
    }
  }

  // If reasonably close (within ~3 degrees), use the city name
  if (minDist < 3 && closest) return closest;

  // Otherwise show coordinates
  const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
  const lngStr = `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lngStr}`;
}

/**
 * Detect user location using Geolocation API.
 * Resolves to LocationInfo; rejects with an error message on failure.
 */
export function detectLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        resolve({
          region: latLngToRegion(lat, lng),
          displayName: latLngToDisplayName(lat, lng),
          lat,
          lng,
        });
      },
      (err) => {
        reject(new Error(err.message || "Location access denied."));
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  });
}
