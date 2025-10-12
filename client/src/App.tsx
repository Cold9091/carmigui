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
import AdminProperties from "@/pages/admin/properties";
import AdminProjects from "@/pages/admin/projects";
import AdminCondominiums from "@/pages/admin/condominiums";
import AdminContacts from "@/pages/admin/contacts";
import AdminDatabase from "@/pages/admin/database";
import AdminCategories from "@/pages/admin/categories";
import AdminHero from "@/pages/admin/hero";
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
          <Route path="/admin/properties" component={AdminProperties} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/condominiums" component={AdminCondominiums} />
          <Route path="/admin/contacts" component={AdminContacts} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/admin/hero" component={AdminHero} />
          <Route path="/admin/database" component={AdminDatabase} />
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
