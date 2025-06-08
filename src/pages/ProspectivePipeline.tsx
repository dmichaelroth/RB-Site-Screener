import { useState } from "react";
import { Link } from "wouter";
import { usePipelineStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Building2, Calendar, MapPin, ArrowUpRight, Filter } from "lucide-react";

export default function ProspectivePipeline() {
  const { deals } = usePipelineStore();
  const prospectiveDeals = deals.filter(deal => deal.status === 'prospective');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Prospective Pipeline</h1>
          <p className="text-sm text-slate-600">
            {prospectiveDeals.length} deals under evaluation
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="text-sm">
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
          </Button>
          <Button className="text-sm">
            <Building2 className="h-4 w-4 mr-1.5" />
            Add Deal
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-600">
          <div className="col-span-4">Deal</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-2">QCT/DDA</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {prospectiveDeals.map(deal => (
            <div key={deal.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50">
              <div className="col-span-4">
                <div className="font-medium text-slate-900">{deal.name}</div>
                <div className="text-sm text-slate-500 flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {deal.address}
                </div>
              </div>
              
              <div className="col-span-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Under Review
                </span>
              </div>
              
              <div className="col-span-2">
                <div className="text-sm text-slate-600 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDistanceToNow(deal.dateAdded, { addSuffix: true })}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="flex space-x-2">
                  {deal.siteData.isQCT && (
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                      QCT
                    </span>
                  )}
                  {deal.siteData.isDDA && (
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                      DDA
                    </span>
                  )}
                </div>
              </div>
              
              <div className="col-span-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-600"
                  asChild
                >
                  <Link href={`/pipeline/prospective/${deal.id}`}>
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {prospectiveDeals.length === 0 && (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No deals yet</h3>
              <p className="text-sm text-slate-600">
                Add your first deal to start building your pipeline
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}