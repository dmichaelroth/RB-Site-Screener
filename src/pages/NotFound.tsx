import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Map, Home, File, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-amber-600" />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold text-slate-800 mb-3">Page Not Found</h1>
        <p className="text-slate-600 mb-8">
          We couldn't find the page you're looking for. Please check the URL or navigate back to the main application.
        </p>
        <div className="space-y-3">
          <Button className="w-full" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/import">
              <File className="h-4 w-4 mr-2" />
              Import Data
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}