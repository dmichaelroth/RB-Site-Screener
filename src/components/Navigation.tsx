import { Link, useLocation } from "wouter";
import { Building, Map, PieChart, FileText, Settings, Baseline as Pipeline, Briefcase, LayoutDashboard } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/sites", label: "Site Evaluation", icon: Map },
    { path: "/pipeline/prospective", label: "Prospective Pipeline", icon: Pipeline },
    { path: "/pipeline/active", label: "Active Pipeline", icon: Briefcase },
    { path: "/analytics", label: "Analytics", icon: PieChart },
    { path: "/documents", label: "Documents", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-slate-800">SiteEval</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link 
                key={path} 
                href={path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                  isActive(path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-1.5 text-slate-400 hover:text-slate-500">
              <span className="sr-only">Notifications</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <button className="flex items-center space-x-2">
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2"
                alt="User avatar"
              />
              <span className="text-sm font-medium text-slate-700">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}