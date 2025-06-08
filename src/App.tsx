import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toast";
import { TooltipProvider } from "./components/ui/tooltip";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { EvaluatorProvider } from "./hooks/useEvaluator";
import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "./components/ui/toast";
import ErrorBoundary from "./components/ErrorBoundary";
import { MapAPIProvider } from "./Context/MapContextApi";

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <Home />}</Route>
      <Route>{() => <NotFound />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MapAPIProvider>
          <EvaluatorProvider>
            <ToastProvider>
              <ErrorBoundary>
                <div className="min-h-screen bg-slate-50">
                  <Toaster />
                  <Router />
                </div>
              </ErrorBoundary>
            </ToastProvider>
          </EvaluatorProvider>
        </MapAPIProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
