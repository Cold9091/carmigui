import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
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

  const mainImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";

  return (
    <Card className="card-hover bg-white shadow-lg overflow-hidden" data-testid={`project-card-${project.id}`}>
      <div className="relative">
        <img
          src={mainImage}
          alt={project.title}
          className="w-full h-64 object-cover"
          loading="lazy"
          data-testid="project-image"
        />
      </div>
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-roboto font-bold text-angola-primary" data-testid="project-title">
            {project.title}
          </h3>
          {getStatusBadge(project.status)}
        </div>
        <p className="text-angola-text mb-4" data-testid="project-description">
          {project.description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-angola-text mb-6">
          <div data-testid="project-area">
            <strong>Área Total:</strong> {project.area.toLocaleString()} m²
          </div>
          <div data-testid="project-duration">
            <strong>Duração:</strong> {project.duration}
          </div>
          <div data-testid="project-units">
            <strong>Unidades:</strong> {project.units}
          </div>
          <div data-testid="project-year">
            <strong>Ano:</strong> {project.year}
          </div>
        </div>
        <Link href={`/projetos/${project.id}`}>
          <Button className="btn-primary w-full" data-testid="btn-view-project-details">
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
