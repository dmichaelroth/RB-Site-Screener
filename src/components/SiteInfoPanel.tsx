import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ChevronRight, Building, MapPin } from "lucide-react";
import { useEvaluator } from "@/hooks/useEvaluator";

export default function SiteInfoPanel() {
  const { selectedSite, setSelectedSite } = useEvaluator();

  if (!selectedSite) return null;

  return (
    <div className="absolute bottom-4 left-4 z-50 w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{selectedSite.name}</h3>
          <div className="flex items-center mt-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{selectedSite.address}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mr-2 -mt-2"
          onClick={() => setSelectedSite(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">Overall Score</span>
            <span className="text-sm font-semibold text-slate-900">{selectedSite.score}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
              style={{ width: `${selectedSite.score}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Property Type</span>
            <span className="font-medium text-slate-900">{selectedSite.propertyType}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Units</span>
            <span className="font-medium text-slate-900">{selectedSite.units}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Year Built</span>
            <span className="font-medium text-slate-900">{selectedSite.yearBuilt}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Button 
          className="w-full mt-4 flex items-center justify-center"
          variant="default"
        >
          <Building className="h-4 w-4 mr-2" />
          View Property Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}