import { useState } from "react";
import { Link } from "wouter";
import { usePipelineStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Building2, Calendar, MapPin, ArrowUpRight, Filter, CheckCircle2 } from "lucide-react";

export default function ActivePipeline() {
  const { deals } = usePipelineStore();
  const activeDeals = deals.filter(deal => deal.status === 'active');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Active Pipeline</h1>
          <p className="text-sm text-slate-600">
            {activeDeals.length} deals in progress
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="text-sm">
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-600">
          <div className="col-span-3">Deal</div>
          <div className="col-span-4">Progress</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {activeDeals.map(deal => (
            <div key={deal.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50">
              <div className="col-span-3">
                <div className="font-medium text-slate-900">{deal.name}</div>
                <div className="text-sm text-slate-500 flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {deal.address}
                </div>
              </div>
              
              <div className="col-span-4">
                <div className="space-y-3">
                  {deal.processes.map(process => (
                    <div key={process.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          {process.name}
                        </span>
                        <span className="text-xs text-slate-600">
                          {process.progress}%
                        </span>
                      </div>
                      <Progress value={process.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="text-sm text-slate-600 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDistanceToNow(deal.dateAdded, { addSuffix: true })}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    In Progress
                  </span>
                </div>
              </div>
              
              <div className="col-span-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-600"
                  asChild
                >
                  <Link href={`/pipeline/active/${deal.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {activeDeals.length === 0 && (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No active deals</h3>
              <p className="text-sm text-slate-600">
                Move deals from prospective to active pipeline to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}