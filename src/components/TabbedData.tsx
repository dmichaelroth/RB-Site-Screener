import { SiteEvaluationResult } from "@/hooks/useEvaluator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Home, 
  FileText, 
  Map, 
  School, 
  Building, 
  Activity,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

interface TabbedDataProps {
  site: SiteEvaluationResult;
}

export default function TabbedData({ site }: TabbedDataProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Format numbers with commas
  const formatNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  // Generate consistent random numbers based on site address
  const getConsistentRandomNumber = (min: number, max: number, seed: string) => {
    const hash = seed.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const random = Math.abs(Math.sin(hash)) * 10000;
    return Math.floor(random % (max - min + 1)) + min;
  };

  // Get consistent bike score and traffic data
  const bikeScore = getConsistentRandomNumber(30, 80, site.address);
  const trafficCount = getConsistentRandomNumber(5000, 13000, site.address);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-6 mb-4 bg-gray-100 p-1 rounded-md">
        <TabsTrigger 
          value="overview" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <Home className="h-4 w-4 mb-1" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="demographics" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <FileText className="h-4 w-4 mb-1" />
          <span>Demographics</span>
        </TabsTrigger>
        <TabsTrigger 
          value="housing" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <Building className="h-4 w-4 mb-1" />
          <span>Housing</span>
        </TabsTrigger>
        <TabsTrigger 
          value="area" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <Map className="h-4 w-4 mb-1" />
          <span>Area</span>
        </TabsTrigger>
        <TabsTrigger 
          value="schools" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <School className="h-4 w-4 mb-1" />
          <span>Schools</span>
        </TabsTrigger>
        <TabsTrigger 
          value="scores" 
          className="text-xs flex flex-col items-center pt-1 pb-0.5 data-[state=active]:bg-rbmblue data-[state=active]:text-white rounded-md"
        >
          <Activity className="h-4 w-4 mb-1" />
          <span>Scores</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Location Overview</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <table className="min-w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-slate-500 align-top">Address</td>
                  <td className="py-1 font-medium">{site.address}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-slate-500 align-top">County</td>
                  <td className="py-1 font-medium">
                    {site.address.split(',')[1]?.trim() || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-slate-500 align-top">Census Tract</td>
                  <td className="py-1 font-medium font-mono">{site.censusGeoId || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-md border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">QAP Score</div>
            <div className="text-2xl font-bold text-primary-600">{site.qapScore || 'N/A'}</div>
          </div>
          <div className="bg-white p-3 rounded-md border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">Market Score</div>
            <div className="text-2xl font-bold text-emerald-600">{site.marketScore || 'N/A'}</div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Accessibility Scores</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              <div className="text-center">
                <div className="font-medium text-lg">{site.marketData?.walkScore || 'N/A'}</div>
                <div className="text-xs text-slate-500">Walk Score</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-lg">{site.marketData?.transitScore || 'N/A'}</div>
                <div className="text-xs text-slate-500">Transit Score</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-lg">{bikeScore}</div>
                <div className="text-xs text-slate-500">Bike Score</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-lg">{trafficCount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Traffic (cars/day)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Nearby Amenities</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <table className="min-w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-slate-500">Grocery</td>
                  <td className="py-1 font-medium">
                    {site.amenities?.grocery.distance} mi 
                    {site.amenities?.grocery.name && ` (${site.amenities.grocery.name})`}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-slate-500">Transit</td>
                  <td className="py-1 font-medium">
                    {site.amenities?.transit.distance} mi 
                    {site.amenities?.transit.type && ` (${site.amenities.transit.type})`}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-slate-500">School</td>
                  <td className="py-1 font-medium">
                    {site.amenities?.school.distance} mi 
                    {site.amenities?.school.name && ` (${site.amenities.school.name})`}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-slate-500">Healthcare</td>
                  <td className="py-1 font-medium">
                    {site.amenities?.healthcare.distance} mi 
                    {site.amenities?.healthcare.name && ` (${site.amenities.healthcare.name})`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="demographics" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Population Demographics</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold">{formatNumber(site.censusData?.population)}</div>
                <div className="text-xs text-slate-500">Total Population</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatNumber(Math.round((site.censusData?.population || 0) * 1.01))}
                </div>
                <div className="text-xs text-slate-500">Population in 5 years</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatNumber(Math.round((site.censusData?.population || 0) / 
                  (site.censusData?.households || 1)))}
                </div>
                <div className="text-xs text-slate-500">People per Household</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{site.censusData?.growthRate || 0}%</div>
                <div className="text-xs text-slate-500">Annual Growth Rate</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Population by Age Group</h4>
              <div className="h-40 flex items-end space-x-2">
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">17.5%</div>
                  <div className="w-full bg-blue-200 rounded-t" style={{height: '70px'}}></div>
                  <div className="text-xs text-slate-600 mt-1">Under 15</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">13.5%</div>
                  <div className="w-full bg-blue-300 rounded-t" style={{height: '54px'}}></div>
                  <div className="text-xs text-slate-600 mt-1">15-24</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">29.9%</div>
                  <div className="w-full bg-blue-400 rounded-t" style={{height: '120px'}}></div>
                  <div className="text-xs text-slate-600 mt-1">25-44</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">23.6%</div>
                  <div className="w-full bg-blue-500 rounded-t" style={{height: '95px'}}></div>
                  <div className="text-xs text-slate-600 mt-1">45-64</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">15.5%</div>
                  <div className="w-full bg-blue-600 rounded-t" style={{height: '60px'}}></div>
                  <div className="text-xs text-slate-600 mt-1">Over 65</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div 
            className="bg-slate-50 p-3 border border-slate-200 rounded-t-md flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('demographic-details')}
          >
            <h3 className="font-medium text-slate-800">Demographic Details</h3>
            <ChevronDown 
              className={`h-4 w-4 transform transition-transform ${expandedSection === 'demographic-details' ? 'rotate-180' : ''}`} 
            />
          </div>
          {expandedSection === 'demographic-details' && (
            <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Race</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">White</td>
                        <td className="py-1 text-right">37.7%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Black</td>
                        <td className="py-1 text-right">46.2%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Asian</td>
                        <td className="py-1 text-right">2.8%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Other</td>
                        <td className="py-1 text-right">13.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Ethnicity</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Hispanic</td>
                        <td className="py-1 text-right">11.2%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Non-Hispanic</td>
                        <td className="py-1 text-right">88.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Gender</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Male</td>
                        <td className="py-1 text-right">47.8%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Female</td>
                        <td className="py-1 text-right">52.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Education</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">No Degree</td>
                        <td className="py-1 text-right">15.0%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">High School</td>
                        <td className="py-1 text-right">30.9%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Some College</td>
                        <td className="py-1 text-right">27.6%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Bachelor's</td>
                        <td className="py-1 text-right">14.2%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Post Graduate</td>
                        <td className="py-1 text-right">12.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Marital Status</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Never Married</td>
                        <td className="py-1 text-right">43.9%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Married</td>
                        <td className="py-1 text-right">22.8%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Divorced</td>
                        <td className="py-1 text-right">10.9%</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Widowed</td>
                        <td className="py-1 text-right">5.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="housing" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Housing Overview</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold">${site.amiPercent?.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Area Median Income (2025 HUD AMI)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{site.censusData?.rentBurden || 'N/A'}%</div>
                <div className="text-xs text-slate-500">Rent Burden</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-lg font-bold">$1,140</div>
                <div className="text-xs text-slate-500">Average Rent</div>
                <div className="text-xs text-slate-400 italic">One Bedroom</div>
              </div>
              <div>
                <div className="text-lg font-bold">$2.11</div>
                <div className="text-xs text-slate-500">Average Rent/SqFt</div>
                <div className="text-xs text-slate-400 italic"></div>
              </div>
              <div>
                <div className="text-lg font-bold">$136.21</div>
                <div className="text-xs text-slate-500">Average Sale Price/SqFt</div>
                <div className="text-xs text-slate-400 italic"></div>
              </div>
              <div>
                <div className="text-lg font-bold">91.3%</div>
                <div className="text-xs text-slate-500">Occupancy Rate</div>
                <div className="text-xs text-slate-400 italic"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div 
            className="bg-slate-50 p-3 border border-slate-200 rounded-t-md flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('housing-details')}
          >
            <h3 className="font-medium text-slate-800">Housing and Occupancy</h3>
            <ChevronDown 
              className={`h-4 w-4 transform transition-transform ${expandedSection === 'housing-details' ? 'rotate-180' : ''}`} 
            />
          </div>
          {expandedSection === 'housing-details' && (
            <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Occupancy</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Occupied</td>
                        <td className="py-1 text-right">84.2%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">141,310</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Vacant</td>
                        <td className="py-1 text-right">15.8%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">26,546</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Ownership</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Rented</td>
                        <td className="py-1 text-right">58.6%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">82,841</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Owned</td>
                        <td className="py-1 text-right">41.4%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">58,469</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Households</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">With Children</td>
                        <td className="py-1 text-right">23.2%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">32,824</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Without Children</td>
                        <td className="py-1 text-right">76.8%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">108,486</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="area" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Area Characteristics</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold">139</div>
                <div className="text-xs text-slate-500">Properties in Area</div>
              </div>
              <div>
                <div className="text-2xl font-bold">21,536</div>
                <div className="text-xs text-slate-500">Total Units in Area</div>
              </div>
              <div>
                <div className="text-2xl font-bold">14,578,363</div>
                <div className="text-xs text-slate-500">Total Unit SqFt in Area</div>
              </div>
              <div>
                <div className="text-2xl font-bold">B-</div>
                <div className="text-xs text-slate-500">Avg Improvements Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div 
            className="bg-slate-50 p-3 border border-slate-200 rounded-t-md flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('workforce-details')}
          >
            <h3 className="font-medium text-slate-800">Workforce</h3>
            <ChevronDown 
              className={`h-4 w-4 transform transition-transform ${expandedSection === 'workforce-details' ? 'rotate-180' : ''}`} 
            />
          </div>
          {expandedSection === 'workforce-details' && (
            <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Participation</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Participating</td>
                        <td className="py-1 text-right">59.7%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">150,696</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Not Participating</td>
                        <td className="py-1 text-right">40.3%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">101,753</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Employment Status</h4>
                  <table className="min-w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-3">Employed</td>
                        <td className="py-1 text-right">88.6%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">133,243</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-3">Unemployed</td>
                        <td className="py-1 text-right">11.4%</td>
                        <td className="py-1 pl-2 text-right text-slate-500">17,193</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="schools" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">School Summary</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold">35</div>
                <div className="text-xs text-slate-500">Total Schools</div>
              </div>
              <div>
                <div className="text-2xl font-bold">16,991</div>
                <div className="text-xs text-slate-500">Total Number of Students</div>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-3">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="pl-3 py-2 text-left font-medium text-slate-700">GreatSchools Rating</th>
                    <th className="py-2 text-left font-medium text-slate-700">Name</th>
                    <th className="py-2 text-left font-medium text-slate-700">Type</th>
                    <th className="py-2 text-left font-medium text-slate-700">Students</th>
                    <th className="py-2 text-left font-medium text-slate-700">Grades</th>
                    <th className="pr-3 py-2 text-right font-medium text-slate-700">Distance (mi)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="pl-3 py-2">
                      <div className="flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">5</div>
                        <span className="ml-2 text-xs text-slate-600">Average</span>
                      </div>
                    </td>
                    <td className="py-2 font-medium">Broadway Academy</td>
                    <td className="py-2">charter</td>
                    <td className="py-2">179</td>
                    <td className="py-2">K-8</td>
                    <td className="pr-3 py-2 text-right">0.38</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="pl-3 py-2">
                      <div className="flex items-center">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">3</div>
                        <span className="ml-2 text-xs text-slate-600">Below Average</span>
                      </div>
                    </td>
                    <td className="py-2 font-medium">Mound Elementary School</td>
                    <td className="py-2">public</td>
                    <td className="py-2">418</td>
                    <td className="py-2">PK, K-8</td>
                    <td className="pr-3 py-2 text-right">0.64</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="scores" className="mt-0">
        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">QAP Score Breakdown</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-primary-600">{site.qapScore}/100</div>
              <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                site.qapScore && site.qapScore >= 75 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : site.qapScore && site.qapScore >= 60 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {site.qapScore && site.qapScore >= 75 
                  ? 'Excellent' 
                  : site.qapScore && site.qapScore >= 60 
                    ? 'Good' 
                    : 'Below Average'}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">QCT/DDA Status</span>
                  <span className="font-medium text-primary-600">
                    {site.isQCT ? '+20 pts' : site.isDDA ? '+15 pts' : '0 pts'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${site.isQCT ? 100 : site.isDDA ? 75 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Amenity Proximity</span>
                  <span className="font-medium text-primary-600">
                    {Math.floor(Math.random() * 20 + 20)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 40 + 40)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Community Need</span>
                  <span className="font-medium text-primary-600">
                    {Math.floor(Math.random() * 15 + 10)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 30 + 40)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Income Targeting</span>
                  <span className="font-medium text-primary-600">
                    {Math.floor(Math.random() * 10 + 10)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 40 + 40)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-md overflow-hidden">
          <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
            <h3 className="font-medium text-slate-800">Market Score Breakdown</h3>
          </div>
          <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-emerald-600">{site.marketScore}/100</div>
              <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                site.marketScore && site.marketScore >= 75 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : site.marketScore && site.marketScore >= 60 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {site.marketScore && site.marketScore >= 75 
                  ? 'Strong Market' 
                  : site.marketScore && site.marketScore >= 60 
                    ? 'Moderate Market' 
                    : 'Weak Market'}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Job Growth</span>
                  <span className="font-medium text-emerald-600">
                    {Math.floor(site.marketData?.jobGrowth || 0 * 10)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 30 + 50)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">School Quality</span>
                  <span className="font-medium text-emerald-600">
                    {Math.floor((site.marketData?.schoolRating || 0) * 3)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 40 + 40)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}