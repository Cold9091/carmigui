import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import PropertyDetails from "@/pages/property-details";
import Condominiums from "@/pages/condominiums";
import CondominiumDetails from "@/pages/condominium-details";
import Construction from "@/pages/construction";
import ProjectDetails from "@/pages/project-details";
import Admin from "@/pages/admin";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Navigation />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/imoveis" component={Properties} />
          <Route path="/imoveis/:id" component={PropertyDetails} />
          <Route path="/condominios" component={Condominiums} />
          <Route path="/condominios/:id" component={CondominiumDetails} />
          <Route path="/construcao" component={Construction} />
          <Route path="/construcao/:id" component={ProjectDetails} />
          <Route path="/admin" component={Admin} />
          <Route path="/contacto" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
