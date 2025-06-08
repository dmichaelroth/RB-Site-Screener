import { useState } from "react";
import { useRoute, Link } from "wouter";
import { usePipelineStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import {
  Building2,
  Calendar,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Users,
  FileText,
  Clock,
  AlertCircle
} from "lucide-react";

export default function DealDetail() {
  const [, params] = useRoute("/pipeline/:status/:id");
  const { deals, updateDealStatus } = usePipelineStore();
  const deal = deals.find(d => d.id === params?.id);
  
  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Deal Not Found</h2>
          <p className="text-slate-600 mb-4">This deal may have been moved or deleted.</p>
          <Button asChild>
            <Link href="/pipeline/prospective">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Return to Pipeline
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalProgress = deal.processes.reduce((acc, process) => acc + process.progress, 0) / 
    (deal.processes.length || 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/pipeline/${deal.status}`}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Pipeline
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">{deal.name}</h1>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            deal.status === 'active' 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {deal.status === 'active' ? 'Active' : 'Prospective'}
          </span>
        </div>
        
        {deal.status === 'prospective' && (
          <Button 
            className="text-sm"
            onClick={() => updateDealStatus(deal.id, 'active')}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Move to Active Pipeline
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">Overview</h3>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="h-4 w-4 mr-1.5" />
              {deal.address}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <Clock className="h-4 w-4 mr-1.5" />
              Added {formatDistanceToNow(deal.dateAdded, { addSuffix: true })}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <Building2 className="h-4 w-4 mr-1.5" />
              {deal.siteData.isQCT ? 'QCT' : deal.siteData.isDDA ? 'DDA' : 'Non-QCT/DDA'}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">Progress</h3>
            <div className="text-sm font-medium text-slate-600">{Math.round(totalProgress)}%</div>
          </div>
          <Progress value={totalProgress} className="h-2 mb-4" />
          <div className="space-y-2">
            {deal.processes.map(process => (
              <div key={process.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{process.name}</span>
                <span className="font-medium">{process.progress}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">Team</h3>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {deal.contacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{contact.name}</span>
                <span className="text-xs text-slate-500">{contact.role}</span>
              </div>
            ))}
            {deal.contacts.length > 3 && (
              <div className="text-xs text-slate-500 text-center pt-1">
                +{deal.contacts.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="processes" className="bg-white rounded-lg border border-slate-200">
        <TabsList className="p-1 border-b border-slate-200">
          <TabsTrigger value="processes" className="text-sm">Processes</TabsTrigger>
          <TabsTrigger value="contacts" className="text-sm">Contacts</TabsTrigger>
          <TabsTrigger value="documents" className="text-sm">Documents</TabsTrigger>
          <TabsTrigger value="notes" className="text-sm">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processes" className="p-4">
          <div className="space-y-6">
            {deal.processes.map(process => (
              <div key={process.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-slate-800">{process.name}</h3>
                    <p className="text-sm text-slate-500">{process.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      process.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : process.status === 'inProgress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {process.status === 'completed' ? 'Completed' :
                       process.status === 'inProgress' ? 'In Progress' : 'Not Started'}
                    </span>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className="text-sm text-slate-600">{process.progress}%</span>
                  </div>
                  <Progress value={process.progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  {process.checklist.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          className="h-4 w-4 text-primary-600 rounded border-slate-300"
                          onChange={() => {}}
                        />
                        <span className="ml-2 text-sm text-slate-700">{item.title}</span>
                      </div>
                      {item.dueDate && (
                        <span className="text-xs text-slate-500">
                          Due {formatDistanceToNow(item.dueDate, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="p-4">
          <div className="space-y-4">
            {deal.contacts.map(contact => (
              <div key={contact.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-800">{contact.name}</h3>
                  <span className="text-xs text-slate-500">{contact.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Company</p>
                    <p className="font-medium">{contact.company}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Role</p>
                    <p className="font-medium">{contact.role}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="font-medium">{contact.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="font-medium">{contact.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="p-4">
          <div className="text-center text-slate-600 py-8">
            <FileText className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p>Document management coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="p-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <textarea
              className="w-full h-32 text-sm border-0 focus:ring-0 resize-none"
              placeholder="Add notes about this deal..."
              value={deal.notes}
              onChange={() => {}}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}