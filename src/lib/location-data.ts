// Utility functions for fetching location data from various APIs

// County to MSA mapping data
interface CountyMsaMapping {
  state: string;
  county: string;
  msa: string;
}

// Hardcoded county-to-MSA mapping for common counties
const countyMsaMapping: CountyMsaMapping[] = [
  // Texas
  { state: 'TX', county: 'Harris County', msa: 'Houston-The Woodlands-Sugar Land' },
  { state: 'TX', county: 'Travis County', msa: 'Austin-Round Rock-Georgetown' },
  { state: 'TX', county: 'Dallas County', msa: 'Dallas-Fort Worth-Arlington' },
  { state: 'TX', county: 'Tarrant County', msa: 'Dallas-Fort Worth-Arlington' },
  { state: 'TX', county: 'Bexar County', msa: 'San Antonio-New Braunfels' },
  { state: 'TX', county: 'El Paso County', msa: 'El Paso' },
  { state: 'TX', county: 'Hidalgo County', msa: 'McAllen-Edinburg-Mission' },
  { state: 'TX', county: 'Collin County', msa: 'Dallas-Fort Worth-Arlington' },
  { state: 'TX', county: 'Denton County', msa: 'Dallas-Fort Worth-Arlington' },
  { state: 'TX', county: 'Fort Bend County', msa: 'Houston-The Woodlands-Sugar Land' },
  { state: 'TX', county: 'Montgomery County', msa: 'Houston-The Woodlands-Sugar Land' },
  { state: 'TX', county: 'Williamson County', msa: 'Austin-Round Rock-Georgetown' },
  { state: 'TX', county: 'Nueces County', msa: 'Corpus Christi' },
  { state: 'TX', county: 'Victoria County', msa: 'Victoria' },
  
  // Ohio
  { state: 'OH', county: 'Cuyahoga County', msa: 'Cleveland-Elyria' },
  { state: 'OH', county: 'Franklin County', msa: 'Columbus' },
  { state: 'OH', county: 'Hamilton County', msa: 'Cincinnati' },
  { state: 'OH', county: 'Summit County', msa: 'Akron' },
  { state: 'OH', county: 'Montgomery County', msa: 'Dayton' },
  { state: 'OH', county: 'Lucas County', msa: 'Toledo' },
  { state: 'OH', county: 'Butler County', msa: 'Cincinnati' },
  { state: 'OH', county: 'Stark County', msa: 'Canton-Massillon' },
  { state: 'OH', county: 'Lorain County', msa: 'Cleveland-Elyria' },
  { state: 'OH', county: 'Mahoning County', msa: 'Youngstown-Warren-Boardman' },
  { state: 'OH', county: 'Lake County', msa: 'Cleveland-Elyria' },
  { state: 'OH', county: 'Trumbull County', msa: 'Youngstown-Warren-Boardman' },
  { state: 'OH', county: 'Medina County', msa: 'Cleveland-Elyria' },
  { state: 'OH', county: 'Portage County', msa: 'Akron' },
  { state: 'OH', county: 'Geauga County', msa: 'Cleveland-Elyria' },
  
  // California
  { state: 'CA', county: 'Los Angeles County', msa: 'Los Angeles-Long Beach-Anaheim' },
  { state: 'CA', county: 'San Diego County', msa: 'San Diego-Chula Vista-Carlsbad' },
  { state: 'CA', county: 'Orange County', msa: 'Los Angeles-Long Beach-Anaheim' },
  { state: 'CA', county: 'Riverside County', msa: 'Riverside-San Bernardino-Ontario' },
  { state: 'CA', county: 'San Bernardino County', msa: 'Riverside-San Bernardino-Ontario' },
  { state: 'CA', county: 'Santa Clara County', msa: 'San Jose-Sunnyvale-Santa Clara' },
  { state: 'CA', county: 'Alameda County', msa: 'San Francisco-Oakland-Berkeley' },
  
  // New York
  { state: 'NY', county: 'Kings County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Queens County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'New York County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Suffolk County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Bronx County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Nassau County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Westchester County', msa: 'New York-Newark-Jersey City' },
  { state: 'NY', county: 'Erie County', msa: 'Buffalo-Cheektowaga' }
];

/**
 * Get MSA and county information from the FCC API
 * and enhance it with our hardcoded data for more accurate MSA information
 */
export const getMSA = async (lat: number, lng: number) => {
  try {
    // First get county data from FCC API
    const url = `https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results[0]?.county_fips) {
      return null;
    }
    
    const county = data.results[0].county_name;
    const state = data.results[0].state_name;
    const fips = data.results[0].county_fips;
    
    // Look up the MSA from our mapping data based on county and state
    let msa = data.results[0].msaName || null;
    
    // Try to find a better match in our hardcoded data
    // First try exact match
    let match = countyMsaMapping.find(
      mapping => mapping.county === county && mapping.state === state.slice(0, 2)
    );
    
    // If no match, try without 'County' suffix if it exists
    if (!match && county.endsWith(' County')) {
      const countyNameWithoutSuffix = county.replace(' County', '');
      match = countyMsaMapping.find(
        mapping => {
          const mappingCountyName = mapping.county.endsWith(' County') 
            ? mapping.county.replace(' County', '') 
            : mapping.county;
          return mappingCountyName === countyNameWithoutSuffix && mapping.state === state.slice(0, 2);
        }
      );
    }
    
    // If still no match, try adding 'County' suffix if it doesn't exist
    if (!match && !county.endsWith(' County')) {
      const countyNameWithSuffix = `${county} County`;
      match = countyMsaMapping.find(
        mapping => mapping.county === countyNameWithSuffix && mapping.state === state.slice(0, 2)
      );
    }
    
    if (match) {
      msa = match.msa;
    }
    
    return {
      county,
      state,
      fips,
      msa
    };
  } catch (error) {
    console.error('Error fetching MSA data:', error);
    return null;
  }
};

/**
 * Get Census Tract information from the Census Geocoding API
 */
export const getCensusTract = async (lat: number, lng: number) => {
  try {
    const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&layers=Census%20Tracts&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.result?.geographies?.['Census Tracts'][0] || null;
  } catch (error) {
    console.error('Error fetching census tract data:', error);
    return null;
  }
};

/**
 * Determine if a census tract is a QCT (Qualified Census Tract)
 * This is a simplified implementation - in a real app, you would check against
 * a database of QCT tract numbers or use an API
 */
export const isQualifiedCensusTract = (tractId: string) => {
  // This is a placeholder implementation
  // In a real app, you would check against actual QCT data
  // For now, we'll use a deterministic approach based on the tract ID
  const tractNumber = parseInt(tractId.replace(/\D/g, ''));
  return tractNumber % 5 === 0; // Example: every 5th tract is a QCT
};

/**
 * Determine if an area is a DDA (Difficult Development Area)
 * This is a simplified implementation - in a real app, you would check against
 * a database of DDA areas or use an API
 */
export const isDifficultDevelopmentArea = (county: string, state: string) => {
  // This is a placeholder implementation
  // In a real app, you would check against actual DDA data
  // For now, we'll use a deterministic approach based on the county name
  return county.length % 3 === 0; // Example: counties with names divisible by 3 are DDAs
};

/**
 * Get AMI (Area Median Income) data for a location
 * This is a simplified implementation - in a real app, you would fetch from HUD API
 */
export const getAreaMedianIncome = async (county: string, state: string) => {
  // This is a placeholder implementation
  // In a real app, you would fetch from HUD API or database
  
  // Base AMI values by state (simplified)
  const stateBaseAmis: {[key: string]: number} = {
    'TX': 72000,
    'CA': 95000,
    'NY': 89000,
    'FL': 68000,
    'OH': 65000,
    'IL': 78000,
    // Add more states as needed
  };
  
  // Get base AMI for the state or use default
  // Using the state parameter to look up the base AMI
  const baseAmi = stateBaseAmis[state] || 70000;
  
  // Adjust based on county (simplified)
  const countyFactor = (county.length % 5) / 10 + 0.8; // Between 0.8 and 1.2
  
  const ami = Math.round(baseAmi * countyFactor);
  
  return {
    ami,
    vli: Math.round(ami * 0.5),      // Very Low Income (50%)
    li: Math.round(ami * 0.8),       // Low Income (80%)
    sixtyPercent: Math.round(ami * 0.6) // 60% AMI
  };
};
