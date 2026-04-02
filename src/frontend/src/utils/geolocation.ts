export type Region =
  | "Asian"
  | "Mediterranean"
  | "American"
  | "Mexican"
  | "Indian"
  | "African"
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
  // Africa (Sub-Saharan, West, East, Southern, and North Africa outside Mediterranean box)
  if (lat >= -35 && lat <= 37 && lng >= -18 && lng <= 52) return "African";
  return "Default";
}

// Rough city lookup table (lat, lng, name)
const CITY_LOOKUP: Array<[number, number, string, string]> = [
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
  [3.139, 101.6869, "Kuala Lumpur", "Malaysia"],
  [13.7563, 100.5018, "Bangkok", "Thailand"],
  [14.5995, 120.9842, "Manila", "Philippines"],
  [-6.2088, 106.8456, "Jakarta", "Indonesia"],
  [24.8607, 67.0011, "Karachi", "Pakistan"],
  [23.8103, 90.4125, "Dhaka", "Bangladesh"],
  [43.6532, -79.3832, "Toronto", "Canada"],
  [45.5017, -73.5673, "Montreal", "Canada"],
  [49.2827, -123.1207, "Vancouver", "Canada"],
  [-34.6037, -58.3816, "Buenos Aires", "Argentina"],
  [-15.7942, -47.8825, "Brasilia", "Brazil"],
  [4.3947, 18.5582, "Bangui", "CAR"],
  [36.8065, 10.1815, "Tunis", "Tunisia"],
  [33.5731, -7.5898, "Casablanca", "Morocco"],
  // Additional African cities
  [-1.2921, 36.8219, "Nairobi", "Kenya"],
  [5.5557, -0.197, "Accra", "Ghana"],
  [15.5527, 32.5324, "Khartoum", "Sudan"],
  [-25.9667, 32.5833, "Maputo", "Mozambique"],
  [-26.3054, 31.1367, "Mbabane", "Eswatini"],
  [-29.3167, 27.4833, "Maseru", "Lesotho"],
  [-33.9249, 18.4241, "Cape Town", "South Africa"],
  [-26.2041, 28.0473, "Johannesburg", "South Africa"],
  [-29.8587, 31.0218, "Durban", "South Africa"],
  [-25.7479, 28.2293, "Pretoria", "South Africa"],
  [0.3476, 32.5825, "Kampala", "Uganda"],
  [-6.1722, 35.7395, "Dodoma", "Tanzania"],
  [-6.7924, 39.2083, "Dar es Salaam", "Tanzania"],
  [9.0765, 7.3986, "Abuja", "Nigeria"],
  [12.3647, -1.5336, "Ouagadougou", "Burkina Faso"],
  [12.6392, -8.0029, "Bamako", "Mali"],
  [13.5137, 2.1098, "Niamey", "Niger"],
  [3.8667, 11.5167, "Yaoundé", "Cameroon"],
  [4.0511, 9.7679, "Douala", "Cameroon"],
  [-4.3217, 15.3222, "Kinshasa", "DRC"],
  [4.3612, 18.555, "Bangui", "CAR"],
  [11.5021, 43.1258, "Djibouti City", "Djibouti"],
  [2.0469, 45.3182, "Mogadishu", "Somalia"],
  [15.3229, 38.9251, "Asmara", "Eritrea"],
  [9.0054, 38.7636, "Addis Ababa", "Ethiopia"],
  [-18.9161, 47.5362, "Antananarivo", "Madagascar"],
  [-13.9626, 33.7741, "Lilongwe", "Malawi"],
  [-15.4167, 28.2833, "Lusaka", "Zambia"],
  [-17.8292, 31.0522, "Harare", "Zimbabwe"],
  [-22.5609, 17.0658, "Windhoek", "Namibia"],
  [-24.6282, 25.9231, "Gaborone", "Botswana"],
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

  // If reasonably close (within ~5 degrees), use the city name
  if (minDist < 5 && closest) return closest;

  // Otherwise show coordinates
  const latStr = `${Math.abs(lat).toFixed(2)}\u00b0${lat >= 0 ? "N" : "S"}`;
  const lngStr = `${Math.abs(lng).toFixed(2)}\u00b0${lng >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lngStr}`;
}

export type LocationErrorType =
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "unknown";

export interface LocationError {
  type: LocationErrorType;
  message: string;
}

/**
 * Detect user location using Geolocation API.
 * Resolves to LocationInfo; rejects with a LocationError on failure.
 */
export function detectLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        type: "unsupported",
        message: "Your browser does not support geolocation.",
      } as LocationError);
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
        let type: LocationErrorType = "unknown";
        let message = "Could not get your location.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            type = "denied";
            message = "Location access was denied.";
            break;
          case err.POSITION_UNAVAILABLE:
            type = "unavailable";
            message = "Location information is currently unavailable.";
            break;
          case err.TIMEOUT:
            type = "timeout";
            message = "Location request timed out.";
            break;
        }

        reject({ type, message } as LocationError);
      },
      { timeout: 12000, maximumAge: 300000, enableHighAccuracy: false },
    );
  });
}
