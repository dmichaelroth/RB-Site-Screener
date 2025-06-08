import { useCallback, useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { getAMIByFIPS, getHudFipsCode } from "@/lib/ILData";
import { getAddressFromLatLng } from "@/lib/utils";

if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
  throw new Error(
    "VITE_MAPBOX_ACCESS_TOKEN is required but not set in environment variables"
  );
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const layerConfigs = {
  qct: {
    sourceId: "qct-source",
    layerId: "2025_QCT",
    sourceLayer: "2025_QCT",
    url: "mapbox://rbmlivingllc.2025_QCT",
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.5,
    },
  },
  ami: {
    sourceId: "ami-source",
    layerId: "2024_HUD AMI",
    sourceLayer: "2024_HUD_AMI",
    url: "mapbox://rbmlivingllc.2024_HUD_AMI",
    paint: {
      "fill-color": "#f28cb1",
      "fill-opacity": 0.5,
    },
  },
  dda: {
    sourceId: "dda-source",
    layerId: "2025_DDA",
    sourceLayer: "2025_DDA",
    url: "mapbox://rbmlivingllc.2025_DDA",
    paint: {
      "fill-color": "#51bbd6",
      "fill-opacity": 0.5,
    },
  },
};

export type MapLayer = keyof typeof layerConfigs;
export type MapStyle = "standard" | "satellite" | "custom";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000;
const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12";
const CUSTOM_STYLE = "mapbox://styles/rbmlivingllc/cm9ys0y4c01fd01s5e5v3hb1u";
const SATELLITE_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

export const useMapAPI = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<MapLayer>>(
    new Set(["ami", "dda", "qct"])
  );
  const [mapStyle, setMapStyle] = useState<MapStyle>("custom");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<mapboxgl.Marker | null>(
    null
  );
  const [geocodedAddress, setGeocodedAddress] = useState(null);
  const [navigationLocked, setNavigationLocked] = useState(false);
  const retryTimeoutRef = useRef<number | null>(null);
  const retryAttemptsRef = useRef<number>(0);
  const loadedLayersRef = useRef<Set<string>>(new Set());
  const [mainMap, setMainMap] = useState(null);
  const allLayers = ["2024_HUD AMI", "2025_QCT", "2025_DDA"];
  const validateMapboxToken = () => {
    console.log("Mapbox Access Token:", mapboxgl.accessToken);
    if (!mapboxgl.accessToken) {
      const error =
        "Mapbox access token is missing. Please check your environment variables.";
      console.error(error);
      setMapError(error);
      return false;
    }
    if (typeof mapboxgl.accessToken !== "string") {
      const error = "Invalid Mapbox access token type. Token must be a string.";
      console.error(error);
      setMapError(error);
      return false;
    }
    if (mapboxgl.accessToken.trim() === "") {
      const error =
        "Mapbox access token is empty. Please provide a valid token.";
      console.error(error);
      setMapError(error);
      return false;
    }
    if (!mapboxgl.accessToken.startsWith("pk.")) {
      const error =
        'Invalid Mapbox access token format. Public tokens should start with "pk."';
      console.error(error);
      setMapError(error);
      return false;
    }
    return true;
  };

  const getMapStyle = (style: MapStyle): string => {
    switch (style) {
      case "satellite":
        return SATELLITE_STYLE;
      case "standard":
        return DEFAULT_STYLE;
      case "custom":
        return CUSTOM_STYLE;
      default:
        console.warn(
          `Unexpected map style: ${style}. Defaulting to custom style.`
        );
        return CUSTOM_STYLE;
    }
  };

  const addLayer = useCallback(
    (map: mapboxgl.Map, layerType: MapLayer) => {
      const config = layerConfigs[layerType];

      try {
        // Remove existing layer and source if they exist
        if (map.getLayer(config.layerId)) {
          map.removeLayer(config.layerId);
        }
        if (map.getSource(config.sourceId)) {
          map.removeSource(config.sourceId);
        }

        // Add source
        map.addSource(config.sourceId, {
          type: "vector",
          url: config.url,
        });

        // Add layer
        map.addLayer({
          id: config.layerId,
          type: "fill",
          source: config.sourceId,
          "source-layer": config.sourceLayer,
          paint: config.paint,
          layout: {
            visibility: activeLayers.has(layerType) ? "visible" : "none",
          },
        });

        loadedLayersRef.current.add(layerType);
        setMapError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`Error adding ${layerType} layer:`, errorMessage);
        setMapError(`Failed to load ${layerType} layer: ${errorMessage}`);
      }
    },
    [activeLayers]
  );

  const getErrorMessage = (error: unknown): string => {
    // Handle token validation errors first
    if (
      error instanceof Error &&
      error.message.includes("Mapbox access token")
    ) {
      return error.message;
    }

    // Handle MapboxError type
    if (error && typeof error === "object" && "message" in error) {
      const mapboxError = error as { message: string; status?: number };

      // Check for specific error types
      if (mapboxError.status === 401) {
        return "Invalid Mapbox access token. Please check your credentials and ensure the token is valid.";
      }
      if (mapboxError.status === 402) {
        return "Mapbox account has reached its rate limit or requires a payment method. Please check your account status.";
      }
      if (mapboxError.status === 403) {
        return "Access forbidden. Your Mapbox token may not have the required permissions.";
      }
      if (mapboxError.status === 404) {
        return "Map style or resource not found. Please check your style configuration and ensure all URLs are correct.";
      }
      if (mapboxError.message.includes("style")) {
        return "Failed to load map style. Please verify the style URL is correct and accessible.";
      }
      if (mapboxError.message.includes("source")) {
        return "Failed to load map data source. Please check the layer configuration and URLs.";
      }
      if (
        mapboxError.message.includes("network") ||
        mapboxError.message.includes("Failed to fetch")
      ) {
        return "Network error. Please check your internet connection and try again.";
      }

      return `Map error: ${mapboxError.message}`;
    }

    // Handle string errors
    if (typeof error === "string") {
      return `Map error: ${error}`;
    }

    // Handle Error objects
    if (error instanceof Error) {
      return `Map error: ${error.message}`;
    }

    // Fallback for unknown error types
    return "An unexpected error occurred while loading the map. Please check the console for more details.";
  };

  // const handleMapError = (error: unknown) => {
  //   const errorMessage = getErrorMessage(error);
  //   console.error("Map error:", error);
  //   setMapError(errorMessage);

  //   // Don't retry for configuration errors
  //   const isConfigError =
  //     errorMessage.includes("access token") ||
  //     errorMessage.includes("style") ||
  //     errorMessage.includes("rate limit") ||
  //     errorMessage.includes("forbidden");

  //   if (!isConfigError && retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
  //     retryAttemptsRef.current++;
  //     console.log(
  //       `Retrying map initialization (attempt ${retryAttemptsRef.current} of ${MAX_RETRY_ATTEMPTS})...`
  //     );

  //     if (retryTimeoutRef.current) {
  //       window.clearTimeout(retryTimeoutRef.current);
  //     }

  //     retryTimeoutRef.current = window.setTimeout(() => {
  //       if (mapRef.current) {
  //         mapRef.current.remove();
  //         mapRef.current = null;
  //       }
  //       initializeMap(
  //         document.querySelector("#map-container") as HTMLDivElement
  //       );
  //     }, RETRY_DELAY);
  //   } else if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
  //     setMapError(
  //       "Failed to load map after multiple attempts. Please reload the page or contact support if the issue persists."
  //     );
  //   }
  // };
  console.log("xyz", activeLayers);
  const initializeMap = useCallback(
    (container: HTMLDivElement) => {
      // debugger;
      console.log("Initializing map", { container, mapStyle, isInitializing });

      // Prevent multiple simultaneous initialization attempts
      if (isInitializing) {
        console.warn("Map initialization already in progress");
        return;
      }

      setIsInitializing(true);
      setMapError(null);

      // Validate Mapbox token before initialization
      if (!validateMapboxToken()) {
        console.error("Mapbox token validation failed");
        setIsInitializing(false);
        return;
      }

      // Clear any existing map
      if (mapRef.current) {
        console.log("Removing existing map");
        mapRef.current.remove();
      }

      const attemptMapInitialization = () => {
        try {
          console.log("Creating new Mapbox map", {
            style: getMapStyle(mapStyle),
          });

          const newMap = new mapboxgl.Map({
            container,
            style: getMapStyle(mapStyle),
            center: [-98.5795, 39.8283], // Centered on US
            zoom: 3,
            attributionControl: false, // Reduce potential loading issues
          });

          // Add navigation control
          newMap.addControl(new mapboxgl.NavigationControl());

          // Comprehensive event listeners
          newMap.on("load", () => {
            mapRef.current = newMap; // ✅ directly assign here
            setMainMap(newMap); // still OK to keep if you need it
            setIsMapLoaded(true); // let others know it's loaded
            setIsInitializing(false); // stop loading spinner
            retryAttemptsRef.current = 0;
          });

          newMap.on("error", (e: mapboxgl.ErrorEvent) => {
            console.error("Mapbox GL error details:", {
              type: e.type,
              error: e.error,
              message: e.error?.message,
            });

            // Retry mechanism
            if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
              retryAttemptsRef.current += 1;
              console.warn(
                `Map load failed. Retry attempt ${retryAttemptsRef.current}`
              );

              // Wait and retry
              setTimeout(() => {
                newMap.remove();
                attemptMapInitialization();
              }, RETRY_DELAY);
            } else {
              const errorMessage =
                e.error?.message ||
                "Failed to load map after multiple attempts";
              console.error("Final map initialization failure:", errorMessage);
              setMapError(errorMessage);
              setIsInitializing(false);
            }
          });

          // setMainMap(newMap)
        } catch (error) {
          console.error("Catastrophic map initialization error:", {
            error,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          setMapError(
            error instanceof Error
              ? error.message
              : "Unhandled map initialization error"
          );
          setIsInitializing(false);
        }
      };

      attemptMapInitialization();
    },
    [mapStyle, isInitializing]
  );

  const toggleLayer = useCallback(
    (layerType: MapLayer) => {
      console.log(`Toggling layer: ${layerType}`);
      const config = layerConfigs[layerType];
      const map = mapRef.current;

      if (!map) {
        console.error("Map is not initialized");
        return;
      }

      console.log("Current map layers:", map.getStyle().layers);
      setActiveLayers((prev) => {
        const newLayers = new Set(prev);
        const isCurrentlyActive = newLayers.has(layerType);

        console.log({
          layerType,
          isCurrentlyActive,
          currentLayers: Array.from(newLayers),
          configLayerId: config.layerId,
        });

        if (isCurrentlyActive) {
          // Layer is currently active, so hide it
          newLayers.delete(layerType);
          if (map.getLayer(config.layerId)) {
            console.log(`Hiding layer: ${config.layerId}`);
            map.setLayoutProperty(config.layerId, "visibility", "none");
          } else {
            console.warn(`Layer not found: ${config.layerId}`);
          }
        } else {
          // Layer is not active, so add or show it
          newLayers.add(layerType);
          if (!map.getLayer(config.layerId)) {
            // Layer doesn't exist, so add it
            console.log(`Adding new layer: ${config.layerId}`);
            addLayer(map, layerType);
          } else {
            // Layer exists, so make it visible
            console.log(`Showing existing layer: ${config.layerId}`);
            map.setLayoutProperty(config.layerId, "visibility", "visible");
          }
        }

        return newLayers;
      });
    },
    [isMapLoaded, addLayer]
  );

  const isLayerActive = useCallback(
    (layerType: MapLayer) => {
      return activeLayers.has(layerType);
    },
    [activeLayers]
  );

  const resetMapView = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [-97.7431, 30.2672],
      zoom: 5,
      essential: true,
    });
  }, []);

  const removeMarker = useCallback(() => {
    if (currentMarker) {
      currentMarker.remove();
      setCurrentMarker(null);
    }
  }, [currentMarker]);

  const setMapCenter = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      // If navigation is locked, don't move the map
      if (navigationLocked) {
        console.log("Map navigation locked - ignoring setMapCenter");
        return;
      }

      if (mapRef.current) {
        // Use jumpTo for instant positioning without animation
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          speed: 1.5,
          // duration: 1000,
        });
      }
    },
    [mapRef, navigationLocked]
  );

  const addMarker = async (
    coordinates: [number, number],
    options?: { color?: string }
  ): Promise<void> => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (currentMarker) {
      currentMarker.remove();
    }

    // map.scrollZoom.enable();
    // map.dragPan.enable();

    const color = options?.color || "#2563eb";
    const marker = new mapboxgl.Marker({ color })
      .setLngLat(coordinates)
      .addTo(map);

    setCurrentMarker(marker);

    return new Promise((resolve) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          console.warn("moveend did not fire, resolving manually");
          resolved = true;
          resolve();
        }
      }, 600); // Give it slightly longer than `duration`

      map.once("idle", () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve();
        }
      });
    });
  };

  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      const currentStyle = mapRef.current.getStyle().name;
      const newStyle = getMapStyle(mapStyle);

      if (currentStyle !== newStyle) {
        mapRef.current.setStyle(newStyle);
      }

      // Add a click handler to ensure controls are enabled
      const map = mapRef.current;
      const ensureControlsEnabled = () => {
        if (map) {
          map.scrollZoom.enable();
          map.dragPan.enable();
        }
      };

      // Enable on any map interaction
      map.on("mousedown", ensureControlsEnabled);
      map.on("touchstart", ensureControlsEnabled);
      map.on("click", async (e) => {
        const point = map.project(e.lngLat);
        const address = await getAddressFromLatLng(e.lngLat.lat, e.lngLat.lng);
        setGeocodedAddress(address);
        console.log("Address", address);
      });
      return () => {
        map.off("mousedown", ensureControlsEnabled);
        map.off("touchstart", ensureControlsEnabled);
      };
    }
  }, [mapStyle, isMapLoaded]);
  console.log("usman2", mainMap);
  useEffect(() => {
    if (mainMap) mapRef.current = mainMap;
  }, [mainMap]);
  // useEffect(() => {
  //   return () => {
  //     if (retryTimeoutRef.current) {
  //       window.clearTimeout(retryTimeoutRef.current);
  //     }
  //     if (mapRef.current) {
  //       mapRef.current.remove();
  //       mapRef.current = null;
  //     }
  //   };
  // }, []);

  // Function to unlock navigation if needed
  const unlockNavigation = useCallback(() => {
    setNavigationLocked(false);
  }, []);

  // Function to check if a location is in QCT, DDA, and get AMI value
  const checkLocationDesignations = useCallback(
    (
      coordinates: [number, number]
    ): Promise<{
      isQCT: boolean;
      isDDA: boolean;
      amiPercent: number | null;
      VLI: number | null;
    }> => {
      return new Promise((resolve) => {
        if (!mapRef.current) {
          console.log("allfeaturex0Map not initialized");
          return resolve({ isQCT: false, isDDA: false, amiPercent: null });
        }

        const map = mapRef.current;

        // if (!map.isStyleLoaded()) {
        //   console.log("allfeaturex222Map style not fully loaded yet");
        //   return resolve({ isQCT: false, isDDA: false, amiPercent: null });
        // }

        map.once("idle", () => {
          console.log(
            "allfeaturexMap is idle. Proceeding with designation check..."
          );

          const point = map.project(coordinates);
          const layerNames = allLayers;

          const allFeatures = map.queryRenderedFeatures(point);
          console.log("allfeaturex", allFeatures);
          let isQCT = false;
          let isDDA = false;
          let amiValue: number | null = null;
          let VLI: number | null = null;
          allFeatures.forEach((alf) => {
            if (alf.layer?.id.includes("2025_QCT")) isQCT = true;
            if (alf.layer?.id.includes("2025_DDA")) isDDA = true;
            if (alf.layer?.id.includes("2024_HUD AMI") && alf.properties) {
              const fips = getHudFipsCode(alf.properties);

              VLI = getAMIByFIPS(Number(fips));
              amiValue =
                alf.properties[
                  "2025 HUD AMI Data - Condensed Date 4.26.252025 HUD AMI"
                ];
            }
          });
          const vliValue = VLI ? VLI : amiValue ? amiValue * 0.5 : 0;
          const result = { isQCT, isDDA, amiPercent: amiValue, VLI: vliValue };
          console.log("Designation result:", result);
          resolve(result);
        });
      });
    },
    []
  );

  return {
    map: mapRef.current,
    geocodedAddress,
    initializeMap,
    resetMapView,
    toggleLayer,
    isLayerActive,
    mapStyle,
    setMapStyle,
    isMapLoaded,
    mapError,
    activeLayers,
    setMapCenter,
    addMarker,
    removeMarker,
    currentMarker,
    navigationLocked,
    unlockNavigation,
    checkLocationDesignations,
  };
};
