import { useQuery } from "@tanstack/react-query";
import { Hammer } from "lucide-react";
import ProjectCard from "@/components/project-card";
import type { Project } from "@shared/schema";

export default function ConstructionPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-angola-accent section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-roboto font-bold text-angola-primary mb-4">
              Portfólio de Construção
            </h1>
            <p className="text-xl text-angola-text">
              Projetos realizados com excelência e qualidade superior
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                  <div className="bg-white p-8 rounded-b-lg shadow">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Hammer className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há projetos de construção no nosso portfólio.
                Volte em breve para ver os nossos trabalhos realizados.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-roboto font-bold text-angola-primary">
                  {projects.length} {projects.length === 1 ? "Projeto" : "Projetos"} no Portfólio
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
