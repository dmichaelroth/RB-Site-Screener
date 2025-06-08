import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return address.trim();
}

export function formatNumber(
  num: number | undefined,
  decimals: number = 0
): string {
  if (num === undefined) return "N/A";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(
  value: number | undefined,
  decimals: number = 1
): string {
  if (value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-green-500";
  if (score >= 60) return "bg-lime-500";
  if (score >= 50) return "bg-yellow-500";
  if (score >= 40) return "bg-amber-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-red-500";
}

export function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 70) return "text-green-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 40) return "text-amber-600";
  if (score >= 30) return "text-orange-600";
  return "text-red-600";
}

export function truncate(str: string, length: number): string {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function getDistanceBetweenPoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d / 1609.344; // Convert meters to miles
}

export const TEXAS_COORDINATES: {
  [key: string]: { lat: number; lng: number };
} = {
  Victoria: { lat: 28.8053, lng: -96.9852 },
  Austin: { lat: 30.2672, lng: -97.7431 },
  Houston: { lat: 29.7604, lng: -95.3698 },
  Dallas: { lat: 32.7767, lng: -96.797 },
};

export const getAddressFromLatLng = async (
  lat: number,
  lng: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();

    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        resolve(results[0]);
      } else {
        reject(
          new Error(
            `Geocoder failed due to: ${status}. No results found for coordinates.`
          )
        );
      }
    });
  });
};
