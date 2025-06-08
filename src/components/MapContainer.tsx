import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMapAPI } from "@/hooks/useMapAPI";
import { useEvaluator } from "@/hooks/useEvaluator";
import { Compass, Layers, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/map-marker.css";
import { useEffect, useRef, useState } from "react";
import { useMapAPIContext } from "@/Context/MapContextApi";

export default function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { selectedSite } = useEvaluator();
  const {
    map,
    initializeMap,
    // applyHeatmap,
    resetMapView,
    toggleLayer,
    isLayerActive,
    mapStyle,
    setMapStyle,
    isMapLoaded,
    mapError,
    addMarker,
  } = useMapAPIContext();
  const [isMapMenuOpen, setIsMapMenuOpen] = useState(false);
  const [isContainerMounted, setIsContainerMounted] = useState(false);

  // Handle container mounting
  useEffect(() => {
    if (mapContainerRef.current) {
      setIsContainerMounted(true);
    }
  }, []);

  // Initialize map only after container is mounted
  useEffect(() => {
    if (isContainerMounted && mapContainerRef.current && !map) {
      initializeMap(mapContainerRef.current);
    }
  }, [initializeMap, map, isContainerMounted]);

  // Track the current site address to detect changes
  const prevSiteAddressRef = useRef<string>("");

  useEffect(() => {
    if (
      map &&
      isMapLoaded &&
      selectedSite &&
      selectedSite.lng &&
      selectedSite.lat
    ) {
      // Check if this is a new site by comparing addresses
      if (selectedSite.address !== prevSiteAddressRef.current) {
        console.log("New site detected, adding marker");
        // addMarker([selectedSite.lng, selectedSite.lat]);
        prevSiteAddressRef.current = selectedSite.address;
      }
    }
  }, [map, isMapLoaded, selectedSite, addMarker]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMapMenuOpen) {
        const menu = document.getElementById("map-layers-menu");
        const button = document.getElementById("map-layers-button");
        if (
          menu &&
          !menu.contains(event.target as Node) &&
          button &&
          !button.contains(event.target as Node)
        ) {
          setIsMapMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMapMenuOpen]);

  // Handle map style changes
  useEffect(() => {
    if (map && isMapLoaded) {
      const style =
        mapStyle === "satellite"
          ? "mapbox://styles/mapbox/satellite-streets-v12"
          : mapStyle === "standard"
          ? "mapbox://styles/mapbox/streets-v12"
          : "mapbox://styles/rbmlivingllc/cm9ys0y4c01fd01s5e5v3hb1u";
      map.setStyle(style);
    }
  }, [map, isMapLoaded, mapStyle]);

  if (mapError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Failed to load map: {mapError}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-100">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0"
        style={{ backgroundColor: "#e5e7eb" }}
      />

      {/* Moved left by approximately 0.5 inches (48px) */}
      <div className="absolute top-4 right-20 z-50">
        <div className="bg-white rounded-lg shadow-lg">
          <Button
            id="map-layers-button"
            variant="default"
            size="lg"
            className="px-4 py-2 text-base h-12 flex items-center justify-center rounded-md font-medium shadow-md"
            onClick={() => setIsMapMenuOpen(!isMapMenuOpen)}
          >
            <Layers className="h-5 w-5 mr-2" /> Map Layers
          </Button>

          {isMapMenuOpen && (
            <div
              id="map-layers-menu"
              className="bg-white rounded-lg shadow-lg p-4 mt-2 w-[280px] absolute right-0 animate-in fade-in-50 slide-in-from-top-5"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-semibold text-slate-700">
                  Map Options
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMapMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm uppercase text-slate-500 mb-2 font-semibold">
                    Display Layers
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="layer-qct"
                        className="h-5 w-5"
                        checked={isLayerActive("qct")}
                        onCheckedChange={() => toggleLayer("qct")}
                      />
                      <Label
                        htmlFor="layer-qct"
                        className="text-base text-slate-700 cursor-pointer font-medium"
                      >
                        <span className="inline-block w-4 h-4 bg-[#088] rounded-sm mr-2"></span>
                        QCT Boundaries
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="layer-dda"
                        className="h-5 w-5"
                        checked={isLayerActive("dda")}
                        onCheckedChange={() => toggleLayer("dda")}
                      />
                      <Label
                        htmlFor="layer-dda"
                        className="text-base text-slate-700 cursor-pointer font-medium"
                      >
                        <span className="inline-block w-4 h-4 bg-[#51bbd6] rounded-sm mr-2"></span>
                        DDA Boundaries
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="layer-ami"
                        className="h-5 w-5"
                        checked={isLayerActive("ami")}
                        onCheckedChange={() => toggleLayer("ami")}
                      />
                      <Label
                        htmlFor="layer-ami"
                        className="text-base text-slate-700 cursor-pointer font-medium"
                      >
                        <span className="inline-block w-4 h-4 bg-[#f28cb1] rounded-sm mr-2"></span>
                        2025 HUD AMI
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm uppercase text-slate-500 mb-2 font-semibold">
                    Map Style
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        mapStyle === "standard" ? "secondary" : "outline"
                      }
                      size="default"
                      className="px-4 py-2 text-base font-medium"
                      onClick={() => setMapStyle("standard")}
                    >
                      Standard
                    </Button>
                    <Button
                      variant={
                        mapStyle === "satellite" ? "secondary" : "outline"
                      }
                      size="default"
                      className="px-4 py-2 text-base font-medium"
                      onClick={() => setMapStyle("satellite")}
                    >
                      Satellite
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full px-4 py-2 text-base font-medium flex items-center justify-center"
                    onClick={resetMapView}
                  >
                    <Compass className="h-5 w-5 mr-2" /> Reset View
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
