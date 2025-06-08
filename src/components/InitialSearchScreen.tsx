import { useEvaluator } from "@/hooks/useEvaluator";
import { useToast } from "@/hooks/use-toast";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";

export default function InitialSearchScreen() {
  const { evaluateAddress, isLoading, selectedSite } = useEvaluator();
  const { toast } = useToast();

  // Don't show this component if a site is selected
  if (selectedSite) return null;

  const handlePlaceSelected = (
    place: google.maps.places.PlaceResult | { formatted_address: string }
  ) => {
    if (place && place.formatted_address) {
      evaluateAddress(place, place.formatted_address);
    } else {
      toast({
        title: "Invalid Address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg z-50 w-[500px] max-w-[90vw]">
      <div className="flex flex-col items-center mb-6">
        {/* Logo */}
        <img
          src="/RBM_Logo.png"
          alt="RBM Logo"
          className="h-10 w-auto mb-3"
        />

        {/* Tool Name */}
        <h1 className="text-rbmblue text-2xl font-bold text-center">
          Prospective Site Evaluation Tool
        </h1>
      </div>

      {/* Address Search Input */}
      <div className="w-full">
        <GooglePlacesAutocomplete
          onPlaceSelected={handlePlaceSelected}
          placeholder="Enter an address to evaluate..."
          className="w-full h-10 text-lg rounded-md"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="  flex w-full justify-center items-center mt-4">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
