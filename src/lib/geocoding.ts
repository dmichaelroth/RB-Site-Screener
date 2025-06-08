// lib/geocoding.ts

// Using Mapbox Geocoding API (replace with your preferred geocoding service)
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const accessToken = 'pk.eyJ1IjoicmJtbGl2aW5nbGxjIiwiYSI6ImNtOXlwb2dhcTFsZDQyanB2NmgxNXYwbDUifQ.hnABaqYOfuKKMYx3XDidoQ'; // Use the same token as your map
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return [longitude, latitude];
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}