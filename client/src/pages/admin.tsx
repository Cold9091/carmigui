import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building, Hammer, Mail, Plus, Edit, Trash2, BarChart3, Users, TrendingUp, Eye } from "lucide-react";
import PropertyForm from "@/components/admin/property-form";
import ProjectForm from "@/components/admin/project-form";
import type { Property, Project, Contact } from "@shared/schema";

export default function AdminPage() {
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  // Delete mutations
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Imóvel eliminado",
        description: "O imóvel foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o imóvel.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Projeto eliminado",
        description: "O projeto foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o projeto.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Contacto eliminado",
        description: "O contacto foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o contacto.",
        variant: "destructive",
      });
    },
  });

  // Statistics calculations
  const totalProperties = properties.length;
  const totalProjects = projects.length;
  const totalContacts = contacts.length;
  const featuredProperties = properties.filter(p => p.featured).length;

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsPropertyDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handlePropertyDialogClose = () => {
    setIsPropertyDialogOpen(false);
    setEditingProperty(null);
  };

  const handleProjectDialogClose = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
  };

  const getPropertyStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case "sold":
        return <Badge className="bg-red-100 text-red-800">Vendido</Badge>;
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800">Arrendado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-800">Planeamento</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M Kz`;
    }
    return `${numPrice.toLocaleString()} Kz`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-angola-primary text-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl font-roboto font-bold mb-4">
              Painel Administrativo
            </h1>
            <p className="text-xl opacity-90">
              Gerencie imóveis, projetos e contactos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="text-angola-secondary mr-4" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Destaque</p>
                  <p className="text-2xl font-bold text-angola-secondary" data-testid="stats-featured">
                    {featuredProperties}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" data-testid="tab-properties">
              <Building className="mr-2" size={18} />
              Imóveis
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              <Hammer className="mr-2" size={18} />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <Mail className="mr-2" size={18} />
              Contactos
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-roboto font-bold text-angola-primary">
                Gestão de Imóveis
              </h2>
              <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary" data-testid="btn-add-property">
                    <Plus className="mr-2" size={20} />
                    Adicionar Imóvel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProperty ? "Editar Imóvel" : "Adicionar Novo Imóvel"}
                    </DialogTitle>
                  </DialogHeader>
                  <PropertyForm
                    property={editingProperty}
                    onSuccess={handlePropertyDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {propertiesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-gray-500">
                    Comece por adicionar o primeiro imóvel.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} data-testid={`property-row-${property.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-angola-primary">
                              {property.title}
                            </h3>
                            {getPropertyStatusBadge(property.status)}
                            {property.featured && (
                              <Badge className="bg-angola-secondary text-white">
                                Destaque
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{property.location}</p>
                          <p className="text-lg font-bold text-angola-primary">
                            {formatPrice(property.price)}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {property.area} m² • {property.type}
                            {property.bedrooms && ` • ${property.bedrooms} quartos`}
                            {property.bathrooms && ` • ${property.bathrooms} casas de banho`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                            data-testid={`btn-edit-property-${property.id}`}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePropertyMutation.mutate(property.id)}
                            disabled={deletePropertyMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`btn-delete-property-${property.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-roboto font-bold text-angola-primary">
                Gestão de Projetos
              </h2>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary" data-testid="btn-add-project">
                    <Plus className="mr-2" size={20} />
                    Adicionar Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? "Editar Projeto" : "Adicionar Novo Projeto"}
                    </DialogTitle>
                  </DialogHeader>
                  <ProjectForm
                    project={editingProject}
                    onSuccess={handleProjectDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {projectsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Hammer className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum projeto encontrado
                  </h3>
                  <p className="text-gray-500">
                    Comece por adicionar o primeiro projeto.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} data-testid={`project-row-${project.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-angola-primary">
                              {project.title}
                            </h3>
                            {getProjectStatusBadge(project.status)}
                            {project.featured && (
                              <Badge className="bg-angola-secondary text-white">
                                Destaque
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{project.description}</p>
                          <p className="text-sm text-gray-500">
                            {project.area.toLocaleString()} m² • {project.duration} • {project.units} • {project.year}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProject(project)}
                            data-testid={`btn-edit-project-${project.id}`}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            disabled={deleteProjectMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`btn-delete-project-${project.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-roboto font-bold text-angola-primary">
                Mensagens de Contacto
              </h2>
            </div>

            {contactsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhuma mensagem encontrada
                  </h3>
                  <p className="text-gray-500">
                    Quando alguém entrar em contacto, as mensagens aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} data-testid={`contact-row-${contact.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-angola-primary">
                              {contact.name}
                            </h3>
                            <Badge variant="outline">{contact.subject}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {contact.email} {contact.phone && `• ${contact.phone}`}
                          </p>
                          <p className="text-gray-700 mb-2">{contact.message}</p>
                          <p className="text-sm text-gray-500">
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-PT') : ''}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            disabled={deleteContactMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`btn-delete-contact-${contact.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
