import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Maximize, Users, Clock, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Projeto não encontrado</h1>
          <p className="text-gray-500 mb-6">O projeto que procura não existe ou foi removido.</p>
          <Link href="/construcao">
            <Button className="btn-primary" data-testid="btn-back-to-projects">
              <ArrowLeft className="mr-2" size={20} />
              Voltar aos Projetos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Concluído</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">Em Andamento</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">Planeamento</Badge>;
      default:
        return <Badge className="text-lg px-4 py-2">{status}</Badge>;
    }
  };

  const mainImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Back Button */}
        <Link href="/construcao">
          <Button
            variant="outline"
            className="mb-6 border-angola-primary text-angola-primary hover:bg-angola-primary hover:text-white"
            data-testid="btn-back"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar aos Projetos
          </Button>
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-4xl font-roboto font-bold text-angola-primary mb-2" data-testid="project-title">
                {project.title}
              </h1>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(project.status)}
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <img
            src={mainImage}
            alt={project.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            data-testid="project-main-image"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-roboto font-bold text-angola-primary mb-6">
                  Detalhes do Projeto
                </h2>
                
                {/* Project Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Maximize size={32} className="mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-angola-text" data-testid="detail-area">
                      {project.area.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">m²</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Clock size={32} className="mx-auto" />
                    </div>
                    <div className="text-lg font-bold text-angola-text" data-testid="detail-duration">
                      {project.duration}
                    </div>
                    <div className="text-sm text-gray-500">Duração</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Users size={32} className="mx-auto" />
                    </div>
                    <div className="text-lg font-bold text-angola-text" data-testid="detail-units">
                      {project.units}
                    </div>
                    <div className="text-sm text-gray-500">Unidades</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Calendar size={32} className="mx-auto" />
                    </div>
                    <div className="text-lg font-bold text-angola-text" data-testid="detail-year">
                      {project.year}
                    </div>
                    <div className="text-sm text-gray-500">Ano</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-roboto font-bold text-angola-primary mb-4">
                    Descrição
                  </h3>
                  <p className="text-angola-text leading-relaxed" data-testid="project-description">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {project.images && project.images.length > 1 && (
              <Card className="mt-8">
                <CardContent className="p-8">
                  <h3 className="text-xl font-roboto font-bold text-angola-primary mb-4">
                    Galeria do Projeto
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${project.title} - Imagem ${index + 2}`}
                        className="w-full h-32 object-cover rounded-lg"
                        data-testid={`gallery-image-${index}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Card */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-8">
                <h3 className="text-xl font-roboto font-bold text-angola-primary mb-6">
                  Interessado num projeto similar?
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-angola-text">
                    <Phone className="text-angola-secondary mr-3" size={20} />
                    <div>
                      <div className="font-semibold">Telefone</div>
                      <div>+244 923 456 789</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-angola-text">
                    <Mail className="text-angola-secondary mr-3" size={20} />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div>projetos@angolacasa.ao</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="btn-primary w-full"
                    data-testid="btn-contact-phone"
                  >
                    <Phone className="mr-2" size={20} />
                    Ligar Agora
                  </Button>
                  
                  <Link href="/contacto">
                    <Button 
                      variant="outline"
                      className="w-full border-angola-primary text-angola-primary hover:bg-angola-primary hover:text-white"
                      data-testid="btn-contact-form"
                    >
                      <Mail className="mr-2" size={20} />
                      Solicitar Orçamento
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-angola-accent rounded-lg">
                  <p className="text-angola-primary text-sm text-center font-medium">
                    Realizamos projetos personalizados de acordo com as suas necessidades
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
