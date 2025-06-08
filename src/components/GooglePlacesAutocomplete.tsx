import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, AlertCircle } from "lucide-react";

interface GooglePlacesAutocompleteProps {
  onPlaceSelected: (
    place: google.maps.places.PlaceResult | { formatted_address: string }
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function GooglePlacesAutocomplete({
  onPlaceSelected,
  placeholder = "Enter address...",
  className = "",
  disabled = false,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setApiLoaded(true);
        return true;
      }
      return false;
    };

    // If already loaded
    if (checkGoogleMapsLoaded()) {
      return;
    }

    // If not loaded yet, check periodically
    const intervalId = setInterval(() => {
      if (checkGoogleMapsLoaded()) {
        clearInterval(intervalId);
      }
    }, 500);

    // Set a timeout to stop checking after 10 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (!apiLoaded) {
        console.error("Google Maps API failed to load within timeout");
        setApiError(true);
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [apiLoaded]);

  // Initialize autocomplete when API is loaded
  useEffect(() => {
    if (!apiLoaded || !inputRef.current || autocompleteRef.current) return;

    try {
      const options = {
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry", "name"],
        types: ["address"],
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        if (autocompleteRef.current) {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
            onPlaceSelected(place);
            setInputValue(place.formatted_address);
          }
        }
      });

      console.log("Google Places Autocomplete initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
      setApiError(true);
    }
  }, [apiLoaded, onPlaceSelected]);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (window.google && autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  // Handle manual input for fallback mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && apiError) {
      e.preventDefault();
      onPlaceSelected({ formatted_address: inputValue });
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
        {apiError ? (
          <AlertCircle className="h-6 w-6 text-red-500" />
        ) : (
          <MapPin className="h-6 w-6" />
        )}
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={apiError ? "Enter address manually..." : placeholder}
        className={`pl-12 pr-4 py-6 text-lg font-medium border-slate-300 shadow-md text-slate-800 ${className} ${
          apiError ? "border-red-300" : ""
        }`}
        disabled={disabled}
        autoComplete="off"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ fontSize: "1.125rem" }}
      />
      {apiError && (
        <div className="text-sm text-red-500 mt-1 font-medium">
          Google Maps API not available. Enter address manually and press Enter.
        </div>
      )}
    </div>
  );
}
