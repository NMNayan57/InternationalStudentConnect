import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/dashboard";
import OnCampusSupport from "@/components/on-campus-support";
import Auth from "@/components/login";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={login} />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/on-campus-support" component={OnCampusSupport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
