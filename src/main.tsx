import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Load Google Maps API
const loadGoogleMapsScript = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  
  if (!googleMapsApiKey) {
    console.warn("No Google Maps API key provided. Map functionality may be limited.");
  }
  
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  // Define the callback
  window.initMap = () => {
    console.log("Google Maps API initialized");
  };
};

// Initialize the app
loadGoogleMapsScript();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// TypeScript shim for the global initMap function
declare global {
  interface Window {
    initMap: () => void;
  }
}