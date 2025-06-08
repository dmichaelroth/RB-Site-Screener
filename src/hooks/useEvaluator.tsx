import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./use-toast";
// import {getAMIByFIPS} from '@lib/ILData'
import { useMapAPIContext } from "@/Context/MapContextApi";
import { getAreaMedianIncome, getMSA } from "@/lib/location-data";

interface Site {
  address: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  county: string;
  msa: string;
  qapScore?: number;
  marketScore?: number;
  priorityScore?: number;
  isQCT?: boolean;
  isDDA?: boolean;
  amiPercent?: number;
  effectiveAmi?: number;
  vliAmount?: number;
  sixtyPercentAmi?: number;
  awardProbability?: string;
  floodZone?: string;
  amenities?: {
    grocery: { exists: boolean; distance: number };
    transit: { exists: boolean; distance: number };
    school: { exists: boolean; distance: number };
    healthcare: { exists: boolean; distance: number };
  };
  marketData?: {
    jobGrowth: number;
    unemployment: number;
    schoolRating: number;
    walkScore: number;
    transitScore: number;
  };
  riskData?: {
    floodRisk: string;
    crimeIndex: number;
    naturalDisasterRisk: string;
  };
}

interface FilterSettings {
  state: string;
  county: string;
  qctOnly: boolean;
  ddaOnly: boolean;
  minMarketScore: number;
  minQAPScore: number;
  awardProbability: string;
  amenities: {
    grocery: string;
    transit: string;
    school: string;
    healthcare: string;
  };
  excludeFloodZones: boolean;
  lowCrimeOnly: boolean;
}

interface EvaluatorContextType {
  sites: Site[];
  filteredSites: Site[];
  selectedSite: Site | null;
  isLoading: boolean;
  evaluationMode: "single" | "multiple";
  filterSettings: FilterSettings;
  evaluateAddress: (selectedMapObject: any, address: string) => Promise<void>;
  setSelectedSite: (site: Site | null) => void;
  hideSiteDetails: () => void;
  exportSites: (sitesToExport: Site[]) => void;
  updateFilterSettings: (newSettings: Partial<FilterSettings>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const EvaluatorContext = createContext<EvaluatorContextType | null>(null);

export function useEvaluator() {
  const context = useContext(EvaluatorContext);
  if (!context) {
    throw new Error("useEvaluator must be used within an EvaluatorProvider");
  }
  return context;
}

// Texas city coordinates
const TEXAS_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  Victoria: { lat: 28.8053, lng: -96.9852 },
  Austin: { lat: 30.2672, lng: -97.7431 },
  Houston: { lat: 29.7604, lng: -95.3698 },
  Dallas: { lat: 32.7767, lng: -96.797 },
};

interface EvaluatorProviderProps {
  children: ReactNode;
}

export function EvaluatorProvider({ children }: EvaluatorProviderProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationMode, setEvaluationMode] = useState<"single" | "multiple">(
    "single"
  );
  const { toast } = useToast();
  const {
    map,
    geocodedAddress,
    setMapCenter,
    addMarker,
    checkLocationDesignations,
  } = useMapAPIContext();

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    state: "all",
    county: "all",
    qctOnly: false,
    ddaOnly: false,
    minMarketScore: 0,
    minQAPScore: 0,
    awardProbability: "any",
    amenities: {
      grocery: "any",
      transit: "any",
      school: "any",
      healthcare: "any",
    },
    excludeFloodZones: false,
    lowCrimeOnly: false,
  });

  const evaluateAddress = async (selectedMapObject: any, address: string) => {
    setIsLoading(true);

    try {
      // Geocode the address to get coordinates
      const geoCoordinates = [
        selectedMapObject.geometry.location.lat(),
        selectedMapObject.geometry.location.lng(),
      ];

      // Extract city and state from address as fallback
      const cityStateMatch = address.match(/,\s*([^,]+),\s*([A-Z]{2})/);
      let city = cityStateMatch ? cityStateMatch[1] : "Unknown";
      let state = cityStateMatch ? cityStateMatch[2] : "Unknown";

      // Default values in case API calls fail
      let county = "Unknown";
      let msa = "Unknown";
      let isQCT = false;
      let isDDA = false;
      let amiPercent = 70000;
      let vliAmount = 35000;
      let sixtyPercentAmi = 42000;
      let effectiveAmi = 0;

      // Get coordinates for the location
      let lng, lat;
      [lat, lng] = geoCoordinates;
      setMapCenter({ lat, lng });
      console.log("allfeaturex1coors");
      // Add marker and center map on the new site
      if (lng && lat) {
        await addMarker([lng, lat]);
        console.log("allfeaturex2markeradded");
      }
      if (geoCoordinates) {
        // Use geocoded coordinates

        // Fetch county and MSA data from FCC API
        const msaData = await getMSA(lat, lng);
        if (msaData) {
          county = msaData.county;
          state = msaData.state;
          msa = msaData.msa || `${city}, ${state}`;

          // If city wasn't in the address, use the state from the API
          if (city === "Unknown") {
            city = county.split(" ")[0]; // Use first word of county as fallback city
          }
        }
        // Check if the location is in QCT, DDA, and get AMI from Mapbox layers
        const mapDesignations = await checkLocationDesignations([lng, lat]);
        console.log("allfeaturex3mapdesignations", mapDesignations);
        console.log("Map designations returned:", mapDesignations);

        // Use the Mapbox layer data if available, otherwise use API data
        isQCT = mapDesignations.isQCT;
        isDDA = mapDesignations.isDDA;

        // Debugging QCT value
        console.log("QCT value after setting:", isQCT);

        // If AMI is available from the map, use it; otherwise use the API data
        if (mapDesignations.amiPercent !== null) {
          amiPercent = mapDesignations.amiPercent;
          vliAmount = mapDesignations.VLI; // 50% of AMI
          sixtyPercentAmi = amiPercent * 1 * 0.6; // 60% of AMI
          effectiveAmi = vliAmount * 2;
        } else {
          // Fallback to API-based AMI data
          const amiData = await getAreaMedianIncome(county, state);
          amiPercent = amiData.ami;
          vliAmount = amiData.vli;
          sixtyPercentAmi = amiData.sixtyPercent * 0.1;
          effectiveAmi = amiData.vli * 2;
        }
      } else {
        // Fallback to city-based coordinates with random offset
        const cityCoords =
          TEXAS_COORDINATES[city] || TEXAS_COORDINATES["Victoria"];
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        lat = cityCoords.lat + latOffset;
        lng = cityCoords.lng + lngOffset;
      }

      // Create site data with real API data
      const mockSite: Site = {
        address,
        lat,
        lng,
        city,
        state,
        county,
        msa,
        qapScore: Math.floor(Math.random() * 100),
        marketScore: Math.floor(Math.random() * 100),
        priorityScore: Math.floor(Math.random() * 100),
        isQCT,
        isDDA,
        amiPercent,
        effectiveAmi,
        vliAmount,
        sixtyPercentAmi,
        awardProbability: ["High", "Medium", "Low"][
          Math.floor(Math.random() * 3)
        ],
        floodZone: ["X", "AE", "A"][Math.floor(Math.random() * 3)],
        amenities: {
          grocery: { exists: true, distance: Math.random() * 2 },
          transit: { exists: true, distance: Math.random() * 1 },
          school: { exists: true, distance: Math.random() * 2 },
          healthcare: { exists: true, distance: Math.random() * 5 },
        },
        marketData: {
          jobGrowth: Math.random() * 10,
          unemployment: Math.random() * 8,
          schoolRating: Math.floor(Math.random() * 10) + 1,
          walkScore: Math.floor(Math.random() * 100),
          transitScore: Math.floor(Math.random() * 100),
        },
        riskData: {
          floodRisk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
          crimeIndex: Math.floor(Math.random() * 100),
          naturalDisasterRisk: ["Low", "Medium", "High"][
            Math.floor(Math.random() * 3)
          ],
        },
      };

      // Update sites list
      setSites((prevSites) => [...prevSites, mockSite]);
      setSelectedSite(mockSite);

      toast({
        title: "Site Evaluated",
        description: `Evaluation complete for ${address}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error evaluating address:", error);
      toast({
        title: "Evaluation Failed",
        description: "Could not evaluate this address. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("is in finally");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (geocodedAddress)
      evaluateAddress(geocodedAddress, geocodedAddress.formatted_address);
  }, [geocodedAddress]);
  const showSiteDetails = (site: Site) => {
    setSelectedSite(site);
    setMapCenter({ lat: site.lat, lng: site.lng });
  };

  const hideSiteDetails = () => {
    setSelectedSite(null);
  };

  const exportSites = (sitesToExport: Site[]) => {
    const csv = [
      [
        "Address",
        "QAP Score",
        "Market Score",
        "Priority Score",
        "QCT",
        "DDA",
        "AMI",
        "Award Probability",
      ].join(","),
      ...sitesToExport.map((site) =>
        [
          site.address,
          site.qapScore,
          site.marketScore,
          site.priorityScore,
          site.isQCT ? "Yes" : "No",
          site.isDDA ? "Yes" : "No",
          site.amiPercent,
          site.awardProbability,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "site_evaluation.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const updateFilterSettings = (newSettings: Partial<FilterSettings>) => {
    setFilterSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const applyFilters = () => {
    const filtered = sites.filter((site) => {
      if (filterSettings.qctOnly && !site.isQCT) return false;
      if (filterSettings.ddaOnly && !site.isDDA) return false;
      if (site.marketScore && site.marketScore < filterSettings.minMarketScore)
        return false;
      if (site.qapScore && site.qapScore < filterSettings.minQAPScore)
        return false;
      if (
        filterSettings.awardProbability !== "any" &&
        site.awardProbability?.toLowerCase() !== filterSettings.awardProbability
      )
        return false;
      if (filterSettings.excludeFloodZones && site.floodZone !== "X")
        return false;
      if (
        filterSettings.lowCrimeOnly &&
        site.riskData &&
        site.riskData.crimeIndex > 50
      )
        return false;

      return true;
    });

    setFilteredSites(filtered);

    toast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} of ${sites.length} sites`,
      variant: "default",
    });
  };

  const resetFilters = () => {
    setFilterSettings({
      state: "all",
      county: "all",
      qctOnly: false,
      ddaOnly: false,
      minMarketScore: 0,
      minQAPScore: 0,
      awardProbability: "any",
      amenities: {
        grocery: "any",
        transit: "any",
        school: "any",
        healthcare: "any",
      },
      excludeFloodZones: false,
      lowCrimeOnly: false,
    });
    setFilteredSites(sites);

    toast({
      title: "Filters Reset",
      description: "All filters have been reset",
      variant: "default",
    });
  };

  const value = {
    sites,
    filteredSites,
    selectedSite,
    isLoading,
    evaluationMode,
    filterSettings,
    evaluateAddress,
    setSelectedSite,
    hideSiteDetails,
    exportSites,
    updateFilterSettings,
    applyFilters,
    resetFilters,
  };

  return (
    <EvaluatorContext.Provider value={value}>
      {children}
    </EvaluatorContext.Provider>
  );
}
