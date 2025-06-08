import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Home, Upload, ArrowLeft, FileSpreadsheet, File as FileCsv, Database, RefreshCw } from "lucide-react";

export default function DataImport() {
  const { toast } = useToast();
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  
  const form = useForm({
    defaultValues: {
      apiKey: "",
      dataSource: "csv"
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0]);
    }
  };
  
  const handleImport = () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setProcessComplete(true);
      setImportedCount(Math.floor(Math.random() * 30) + 10);
      
      toast({
        title: "Import Complete",
        description: `${importedCount} sites have been successfully imported and analyzed.`
      });
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-slate-600 hover:text-slate-900 mr-4 flex items-center">
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Back to Map</span>
              </a>
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Import Site Data</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {processComplete ? (
          <div className="bg-white p-6 shadow-sm rounded-lg border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Import Complete!</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                {importedCount} sites have been successfully imported and analyzed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary-600" />
                  Import Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Sites:</span>
                    <span className="font-medium">{importedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">QCT Sites:</span>
                    <span className="font-medium">{Math.floor(importedCount * 0.4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">DDA Sites:</span>
                    <span className="font-medium">{Math.floor(importedCount * 0.15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">High Priority Sites:</span>
                    <span className="font-medium">{Math.floor(importedCount * 0.25)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-primary-600" />
                  Next Steps
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-600 mr-2">→</div>
                    <span className="text-slate-600">View and filter your imported sites on the map</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-600 mr-2">→</div>
                    <span className="text-slate-600">Apply filters to find sites matching your criteria</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-600 mr-2">→</div>
                    <span className="text-slate-600">Export selected sites for further analysis</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <Button className="flex-1" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Sites on Map
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                setFileUploaded(null);
                setProcessComplete(false);
              }}>
                <Upload className="h-4 w-4 mr-2" />
                Import More Sites
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-sm rounded-lg border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Import Properties</h2>
            
            <Tabs defaultValue="file">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="file" className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>File Upload</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>API Import</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-1">
                      Upload File (CSV, Excel, or Spreadsheet)
                    </Label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        fileUploaded ? 'border-primary-300 bg-primary-50' : 'border-slate-300 hover:border-primary-300'
                      } transition-colors`}
                    >
                      {fileUploaded ? (
                        <div>
                          <FileCsv className="h-10 w-10 mx-auto text-primary-600 mb-3" />
                          <p className="text-sm font-medium text-slate-800">{fileUploaded.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {(fileUploaded.size / 1024).toFixed(2)} KB
                          </p>
                          <button 
                            className="mt-3 text-xs text-primary-600 hover:text-primary-700"
                            onClick={() => setFileUploaded(null)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                          <p className="text-sm text-slate-500">
                            <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            CSV, XLS, XLSX (max 10MB)
                          </p>
                        </div>
                      )}
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.xls,.xlsx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                      <h3 className="font-medium text-slate-800 mb-3">Expected Format</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        Your file should include the following columns:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                        <li><span className="font-medium">Address</span> - Full address including city, state, zip</li>
                        <li><span className="font-medium">Latitude/Longitude</span> (optional) - Geocoordinates</li>
                        <li><span className="font-medium">Name</span> (optional) - Property name or identifier</li>
                        <li><span className="font-medium">Notes</span> (optional) - Additional property information</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={handleImport}
                      disabled={!fileUploaded || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Import Data
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Map
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="api">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="api-key" className="block text-sm font-medium text-slate-700 mb-1">
                      API Key
                    </Label>
                    <Input 
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                      {...form.register("apiKey")}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      The API key for accessing your property database
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="data-source" className="block text-sm font-medium text-slate-700 mb-1">
                      Data Source
                    </Label>
                    <select 
                      id="data-source"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      {...form.register("dataSource")}
                    >
                      <option value="csv">Property CSV Database</option>
                      <option value="mls">MLS Integration</option>
                      <option value="custom">Custom API</option>
                    </select>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-amber-800 mb-1">API Integration</h3>
                        <p className="text-sm text-amber-700">
                          This feature requires an API key and configured integration. Please contact support for assistance setting up your API connection.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      disabled={true}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Connect API (Coming Soon)
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Map
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Need help with data import? <a href="#" className="text-primary-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </main>
    </div>
  );
}