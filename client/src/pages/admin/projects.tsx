import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Hammer, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import ProjectForm from "@/components/admin/project-form";
import type { Project } from "@shared/schema";

export default function AdminProjectsPage() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Delete mutation
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

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleProjectDialogClose = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Projetos</h1>
            <p className="text-gray-600">Gerir todos os projetos de construção</p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const mainImage = project.images && project.images.length > 0 
                ? project.images[0] 
                : "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
              
              return (
                <Card key={project.id} className="admin-triangular-card card-hover bg-white shadow-lg" data-testid={`project-card-${project.id}`}>
                  <div className="relative image-container">
                    <img
                      src={mainImage}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      data-testid="project-image"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {getProjectStatusBadge(project.status)}
                      {project.featured && (
                        <Badge className="bg-angola-secondary text-white">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="bg-white/90 hover:bg-white"
                        data-testid={`btn-edit-project-${project.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProjectMutation.mutate(project.id)}
                        disabled={deleteProjectMutation.isPending}
                        className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                        data-testid={`btn-delete-project-${project.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-roboto font-bold text-angola-primary mb-2" data-testid="project-title">
                      {project.title}
                    </h3>
                    <p className="text-angola-text mb-4 line-clamp-2" data-testid="project-description">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-angola-text mb-4">
                      <div className="flex items-center" data-testid="project-area">
                        <Hammer size={16} className="mr-1" />
                        {project.area.toLocaleString()} m²
                      </div>
                      <div className="flex items-center" data-testid="project-units">
                        <span className="mr-1">🏢</span>
                        {project.units}
                      </div>
                      <div className="flex items-center" data-testid="project-duration">
                        <span className="mr-1">⏱️</span>
                        {project.duration}
                      </div>
                      <div className="flex items-center" data-testid="project-year">
                        <span className="mr-1">📅</span>
                        {project.year}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}