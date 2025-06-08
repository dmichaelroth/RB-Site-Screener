// MapAPIContext.tsx
import { useMapAPI } from "@/hooks/useMapAPI";
import { createContext, useContext } from "react";
// import { useMapAPI } from "./useMapAPI";

const MapAPIContext = createContext<ReturnType<typeof useMapAPI> | null>(null);

export const MapAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const mapAPI = useMapAPI();
  return (
    <MapAPIContext.Provider value={mapAPI}>{children}</MapAPIContext.Provider>
  );
};

export const useMapAPIContext = () => {
  const context = useContext(MapAPIContext);
  if (!context) {
    throw new Error("useMapAPIContext must be used within MapAPIProvider");
  }
  return context;
};
