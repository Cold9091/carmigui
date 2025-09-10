import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Hammer, Mail, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import type { Property, Project, Contact, Condominium } from "@shared/schema";

export default function AdminPage() {

  // Fetch data for dashboard statistics
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: condominiums = [] } = useQuery<Condominium[]>({
    queryKey: ["/api/condominiums"],
  });


  // Statistics calculations
  const totalProperties = properties.length;
  const totalProjects = projects.length;
  const totalContacts = contacts.length;
  const totalCondominiums = condominiums.length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const featuredCondominiums = condominiums.filter(c => c.featured).length;


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-angola-primary mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral das estatísticas do sistema</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="text-angola-primary mr-4" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Imóveis</p>
                  <p className="text-2xl font-bold text-angola-primary" data-testid="stats-properties">
                    {totalProperties}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Hammer className="text-angola-primary mr-4" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                  <p className="text-2xl font-bold text-angola-primary" data-testid="stats-projects">
                    {totalProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="text-angola-primary mr-4" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Condomínios</p>
                  <p className="text-2xl font-bold text-angola-primary" data-testid="stats-condominiums">
                    {totalCondominiums}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="text-angola-primary mr-4" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens</p>
                  <p className="text-2xl font-bold text-angola-primary" data-testid="stats-contacts">
                    {totalContacts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Items Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imóveis em Destaque</p>
                  <p className="text-xl font-bold text-angola-secondary">{featuredProperties}</p>
                </div>
                <TrendingUp className="text-angola-secondary" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projetos em Destaque</p>
                  <p className="text-xl font-bold text-angola-secondary">{featuredProjects}</p>
                </div>
                <TrendingUp className="text-angola-secondary" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Condomínios em Destaque</p>
                  <p className="text-xl font-bold text-angola-secondary">{featuredCondominiums}</p>
                </div>
                <TrendingUp className="text-angola-secondary" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
