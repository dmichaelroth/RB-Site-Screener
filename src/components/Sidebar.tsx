import { useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { useEvaluator } from "@/hooks/useEvaluator";
import { formatNumber } from "@/lib/utils";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTableAmiValue } from "@/lib/ILData";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { selectedSite, evaluateAddress, isLoading } = useEvaluator();
  const { toast } = useToast();

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

  const [width, setWidth] = useState(420); // default width - increased from 360 to 420 for better readability
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  // These refs are not needed as we're using local variables in the event handlers

  useEffect(() => {
    const resizer = resizerRef.current;
    const sidebar = sidebarRef.current;
    if (!resizer || !sidebar) return;

    let startX: number;
    let startWidth: number;

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = parseInt(getComputedStyle(sidebar).width || "420", 10);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "ew-resize";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 320 && newWidth < 800) setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    resizer.addEventListener("mousedown", onMouseDown);

    return () => {
      resizer.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const getFontSizeClass = () => "text-[16px]"; // Increased font size from 15px to 16px for better readability
  const getWidth = () => `${width * 1.7}px`; // Increased multiplier from 1.5 to 1.7 for better readability

  const getAmiColorClass = (ami?: number) => {
    if (!ami) return "";
    if (ami >= 90000) return "bg-emerald-100 text-emerald-700";
    if (ami >= 80000) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getScoreColorClass = (score?: number) => {
    if (!score) return "";
    if (score > 85) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  if (!selectedSite) return null;

  // Parse address components (assuming address format: "street, city, state zip")
  const addressParts = selectedSite.address.split(",");
  const streetAddress = addressParts[0]?.trim() || "N/A";

  // Use the city, state, county, and MSA from the site data
  const { city, state, county, msa } = selectedSite;

  // Toggle function is defined but not used in the component

  return (
    <aside
      ref={sidebarRef}
      style={{ width: isExpanded ? getWidth() : "0" }}
      className={`bg-gray-50 shadow-lg transition-all duration-300 overflow-hidden flex flex-col z-20 relative ${getFontSizeClass()}`}
    >
      <div
        ref={resizerRef}
        className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-10 w-4 text-slate-400" />
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {/* Logo and Title */}
        <div className="flex items-center mb-4">
          <img
            src="/RBM_Logo.png"
            alt="RBM Logo"
            className="h-8 w-auto"
          />

          {/* Vertical Separator */}
          <div className="mx-3 h-6 border-l border-rbmblue/30"></div>

          {/* Tool Name */}
          <h1 className="text-rbmblue text-xl font-bold whitespace-nowrap">
            Prospective Site Evaluation Tool
          </h1>
        </div>

        {/* Address Search Input */}
        <div className="w-full mb-4">
          <GooglePlacesAutocomplete
            onPlaceSelected={handlePlaceSelected}
            placeholder="Enter Prospective Site Address"
            className="w-full h-8 text-sm rounded"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center">
              <svg
                className="animate-spin h-4 w-4"
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

        {/* Location Overview Header */}
        <div className="bg-rbmblue text-white p-3 rounded-md font-bold mb-4">
          Location Overview
        </div>

        {/* Location Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">Street Address:</span>
            <span className="font-medium text-rbmblue">{streetAddress}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">City:</span>
            <span className="font-medium text-rbmblue">{city}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">State:</span>
            <span className="font-medium text-rbmblue">{state}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">County:</span>
            <span className="font-medium text-rbmblue">{county}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">MSA:</span>
            <span className="font-medium text-rbmblue">{msa}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">
              Qualified Census Tract (QCT):
            </span>
            <span
              className={`px-2 py-1 rounded-md text-sm font-medium ${
                selectedSite.isQCT
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedSite.isQCT ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">
              Difficult Development Area (DDA):
            </span>
            <span
              className={`px-2 py-1 rounded-md text-sm font-medium ${
                selectedSite.isDDA
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedSite.isDDA ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">2025 HUD AMI:</span>
            <span className="font-medium text-rbmblue">
              ${formatNumber(selectedSite.amiPercent)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">2025 VLI:</span>
            <span className="font-medium text-rbmblue">
              ${formatNumber(selectedSite.vliAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">HUD 4 Person 60% AMI:</span>
            <span className="font-medium text-rbmblue">
              ${formatNumber(selectedSite.sixtyPercentAmi)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-rbmblue">HUD Effective AMI:</span>
            <span
              className={`px-2 py-1 rounded-md text-sm font-medium ${getAmiColorClass(
                selectedSite.effectiveAmi
              )}`}
            >
              ${formatNumber(selectedSite.effectiveAmi)}
            </span>
          </div>
        </div>

        <Tabs
          defaultValue="rent"
          className="mt-6"
        >
          <TabsList className="grid grid-cols-6 w-full bg-gray-200">
            <TabsTrigger
              value="rent"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Rent & Income
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger
              value="housing"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Housing
            </TabsTrigger>
            <TabsTrigger
              value="area"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Area
            </TabsTrigger>
            <TabsTrigger
              value="schools"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Schools
            </TabsTrigger>
            <TabsTrigger
              value="scores"
              className="data-[state=active]:bg-rbmblue data-[state=active]:text-white"
            >
              Scores
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="rent"
            className="mt-4"
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-3">Income Limits</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-600 border-b-2 border-slate-200">
                        <th className="text-left font-bold pb-2 pr-4"></th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          30% AMI
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          50% AMI
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px] bg-slate-100 border-x border-slate-200">
                          <span className="font-bold">60% AMI</span>
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          80% AMI
                        </th>
                        <th className="text-right font-bold pb-2 pl-2 min-w-[90px]">
                          100% AMI
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(
                        (size) => (
                          <tr
                            key={size}
                            className="border-b border-slate-200 hover:bg-slate-50"
                          >
                            <td className="py-2 pr-4">
                              {size} Person{size % 1 === 0 ? "s" : ""}
                            </td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  30
                                )
                              )}
                            </td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  50
                                )
                              )}
                            </td>
                            <td className="text-right py-2 px-2 font-medium bg-slate-100 border-x border-slate-200">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  60
                                )
                              )}
                            </td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  80
                                )
                              )}
                            </td>
                            <td className="text-right py-2 pl-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                )
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-3">Rent Limits</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-600 border-b-2 border-slate-200">
                        <th className="text-left font-bold pb-2 pr-4"></th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          30% AMI
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          50% AMI
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px] bg-slate-100 border-x border-slate-200">
                          <span className="font-bold">60% AMI</span>
                        </th>
                        <th className="text-right font-bold pb-2 px-2 min-w-[90px]">
                          80% AMI
                        </th>
                        <th className="text-right font-bold pb-2 pl-2 min-w-[90px]">
                          HUD FMR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Efficiency (1)", 0],
                        ["1 Bedroom (1.5)", 1],
                        ["2 Bedroom (3)", 2],
                        ["3 Bedroom (4.5)", 3],
                        ["4 Bedroom (6)", 4],
                      ].map(([label, bedrooms]) => {
                        const size = Number(label.split("(")[1].split(")")[0]);
                        return (
                          <tr
                            key={bedrooms as number}
                            className="border-b border-slate-200 hover:bg-slate-50"
                          >
                            <td className="py-2 pr-4">{label}</td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                ) / 12
                              )}
                            </td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                ) / 12
                              )}
                            </td>
                            <td className="text-right py-2 px-2 font-medium bg-slate-100 border-x border-slate-200">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                ) / 12
                              )}
                            </td>
                            <td className="text-right py-2 px-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                ) / 12
                              )}
                            </td>
                            <td className="text-right py-2 pl-2">
                              $
                              {formatNumber(
                                getTableAmiValue(
                                  selectedSite.amiPercent!,
                                  size,
                                  100
                                ) / 12
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="demographics"
            className="mt-4"
          >
            <div className="space-y-6">
              <div className="bg-white rounded-md overflow-hidden">
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
                  <h3 className="font-medium text-slate-800">
                    Population Demographics
                  </h3>
                </div>
                <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatNumber(selectedSite.censusData?.population)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Total Population
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {formatNumber(
                          Math.round(
                            (selectedSite.censusData?.population || 0) * 1.01
                          )
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Population in 5 years
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {formatNumber(
                          Math.round(
                            (selectedSite.censusData?.population || 0) /
                              (selectedSite.censusData?.households || 1)
                          )
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        People per Household
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedSite.censusData?.growthRate || 0}%
                      </div>
                      <div className="text-xs text-slate-500">
                        Annual Growth Rate
                      </div>
                    </div>
                  </div>

                  {/* Rest of demographics content */}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="housing"
            className="mt-4"
          >
            {/* Housing tab content */}
          </TabsContent>

          <TabsContent
            value="area"
            className="mt-4"
          >
            {/* Area tab content */}
          </TabsContent>

          <TabsContent
            value="schools"
            className="mt-4"
          >
            {/* Schools tab content */}
          </TabsContent>

          <TabsContent
            value="scores"
            className="mt-4"
          >
            <div className="space-y-6">
              <div className="bg-white rounded-md overflow-hidden">
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
                  <h3 className="font-medium text-slate-800">
                    QAP Score Breakdown
                  </h3>
                </div>
                <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`text-2xl font-bold ${getScoreColorClass(
                        selectedSite.qapScore
                      )}`}
                    >
                      {selectedSite.qapScore}/100
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedSite.qapScore && selectedSite.qapScore >= 75
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedSite.qapScore && selectedSite.qapScore >= 60
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedSite.qapScore && selectedSite.qapScore >= 75
                        ? "Excellent"
                        : selectedSite.qapScore && selectedSite.qapScore >= 60
                        ? "Good"
                        : "Below Average"}
                    </div>
                  </div>

                  {/* QAP score details */}
                </div>
              </div>

              <div className="bg-white rounded-md overflow-hidden">
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-t-md">
                  <h3 className="font-medium text-slate-800">
                    Market Score Breakdown
                  </h3>
                </div>
                <div className="p-3 border-x border-b border-slate-200 rounded-b-md">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`text-2xl font-bold ${getScoreColorClass(
                        selectedSite.marketScore
                      )}`}
                    >
                      {selectedSite.marketScore}/100
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedSite.marketScore &&
                        selectedSite.marketScore >= 75
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedSite.marketScore &&
                            selectedSite.marketScore >= 60
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedSite.marketScore &&
                      selectedSite.marketScore >= 75
                        ? "Strong Market"
                        : selectedSite.marketScore &&
                          selectedSite.marketScore >= 60
                        ? "Moderate Market"
                        : "Weak Market"}
                    </div>
                  </div>

                  {/* Market score details */}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
