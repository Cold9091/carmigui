import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const Home = lazy(() => import("@/pages/home"));
const Properties = lazy(() => import("@/pages/properties"));
const PropertyDetails = lazy(() => import("@/pages/property-details"));
const Condominiums = lazy(() => import("@/pages/condominiums"));
const CondominiumDetails = lazy(() => import("@/pages/condominium-details"));
const Construction = lazy(() => import("@/pages/construction"));
const ProjectDetails = lazy(() => import("@/pages/project-details"));
const SobreNos = lazy(() => import("@/pages/sobre-nos"));
const Admin = lazy(() => import("@/pages/admin"));
const AdminProperties = lazy(() => import("@/pages/admin/properties"));
const AdminProjects = lazy(() => import("@/pages/admin/projects"));
const AdminCondominiums = lazy(() => import("@/pages/admin/condominiums"));
const AdminContacts = lazy(() => import("@/pages/admin/contacts"));
const AdminDatabase = lazy(() => import("@/pages/admin/database"));
const AdminCategories = lazy(() => import("@/pages/admin/categories"));
const AdminHero = lazy(() => import("@/pages/admin/hero"));
const AdminCities = lazy(() => import("@/pages/admin/cities"));
const AdminAbout = lazy(() => import("@/pages/admin/about"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Navigation />}
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/imoveis" component={Properties} />
            <Route path="/imoveis/:id" component={PropertyDetails} />
            <Route path="/condominios" component={Condominiums} />
            <Route path="/condominios/:id" component={CondominiumDetails} />
            <Route path="/construcao" component={Construction} />
            <Route path="/construcao/:id" component={ProjectDetails} />
            <Route path="/sobre-nos" component={SobreNos} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin/properties" component={AdminProperties} />
            <Route path="/admin/projects" component={AdminProjects} />
            <Route path="/admin/condominiums" component={AdminCondominiums} />
            <Route path="/admin/contacts" component={AdminContacts} />
            <Route path="/admin/categories" component={AdminCategories} />
            <Route path="/admin/hero" component={AdminHero} />
            <Route path="/admin/cities" component={AdminCities} />
            <Route path="/admin/about" component={AdminAbout} />
            <Route path="/admin/database" component={AdminDatabase} />
            <Route path="/contacto" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
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
