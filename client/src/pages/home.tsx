import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Building, Hammer, Home, MapPin, Bed, Bath, Maximize, ArrowRight } from "lucide-react";
import PropertyCard from "@/components/property-card";
import ProjectCard from "@/components/project-card";
import type { Property, Project } from "@shared/schema";

export default function HomePage() {
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "featured=true"],
  });

  const { data: featuredProjects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", "featured=true"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 hero-gradient z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        ></div>

        <div className="relative z-20 text-center max-w-4xl mx-auto container-padding">
          <h1 className="text-5xl md:text-6xl font-roboto font-bold mb-6">
            Seu Lar dos Sonhos em Angola
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-opensans">
            Especialistas em imobiliário e construção de qualidade superior
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/imoveis">
              <Button
                size="lg"
                className="bg-angola-secondary hover:bg-angola-secondary/90 text-white px-8 py-4 text-lg"
                data-testid="btn-view-properties"
              >
                <Home className="mr-2" size={20} />
                Ver Imóveis
              </Button>
            </Link>
            <Link href="/construcao">
              <Button
                size="lg"
                className="bg-angola-primary hover:bg-angola-primary/90 text-white px-8 py-4 text-lg"
                data-testid="btn-view-projects"
              >
                <Hammer className="mr-2" size={20} />
                Nossos Projetos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-spacing bg-angola-accent">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-angola-primary mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-angola-text max-w-3xl mx-auto">
              Oferecemos soluções completas em imobiliário e construção para atender todas as suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Real Estate Section */}
            <Card className="card-hover bg-white shadow-lg">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                  alt="Apartamento de luxo"
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Home className="text-3xl text-angola-primary mr-4" size={32} />
                  <h3 className="text-2xl font-roboto font-bold text-angola-primary">
                    Área Imobiliária
                  </h3>
                </div>
                <p className="text-angola-text mb-6">
                  Encontre o imóvel perfeito com nossa vasta seleção de propriedades em toda Angola.
                  Casas, apartamentos, escritórios e terrenos das melhores localizações.
                </p>
                <ul className="text-angola-text space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Apartamentos de luxo
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Casas unifamiliares
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Espaços comerciais
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Terrenos para investimento
                  </li>
                </ul>
                <Link href="/imoveis">
                  <Button className="btn-primary w-full" data-testid="btn-explore-properties">
                    Explorar Imóveis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Construction Section */}
            <Card className="card-hover bg-white shadow-lg">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                  alt="Projeto de construção"
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Hammer className="text-3xl text-angola-primary mr-4" size={32} />
                  <h3 className="text-2xl font-roboto font-bold text-angola-primary">
                    Área de Construção
                  </h3>
                </div>
                <p className="text-angola-text mb-6">
                  Transformamos sonhos em realidade com projetos de construção de alta qualidade.
                  Da concepção à conclusão, garantimos excelência em cada detalhe.
                </p>
                <ul className="text-angola-text space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Construção residencial
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Projetos comerciais
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Renovações completas
                  </li>
                  <li className="flex items-center">
                    <span className="text-angola-secondary mr-2">✓</span>
                    Design personalizado
                  </li>
                </ul>
                <Link href="/construcao">
                  <Button className="btn-primary w-full" data-testid="btn-view-construction">
                    Ver Projetos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-angola-primary mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-angola-text">
              Descubra as melhores propriedades disponíveis em Angola
            </p>
          </div>

          {propertiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-6 rounded-b-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum imóvel em destaque encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há propriedades em destaque. Consulte todos os nossos imóveis disponíveis.
              </p>
              <Link href="/imoveis">
                <Button className="btn-primary" data-testid="btn-view-all-properties">
                  Ver Todos os Imóveis
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/imoveis">
                  <Button
                    size="lg"
                    className="btn-secondary"
                    data-testid="btn-view-all-properties"
                  >
                    Ver Todos os Imóveis
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-angola-primary mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-angola-text">
              Conheça alguns dos nossos projetos de construção realizados
            </p>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[...Array(2)].map((_, i) => (
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
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Hammer className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum projeto em destaque encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há projetos em destaque. Consulte todo o nosso portfólio de construção.
              </p>
              <Link href="/construcao">
                <Button className="btn-primary" data-testid="btn-view-all-projects">
                  Ver Todos os Projetos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {featuredProjects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/construcao">
                  <Button
                    size="lg"
                    className="btn-secondary"
                    data-testid="btn-view-all-projects"
                  >
                    Ver Todos os Projetos
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-angola-primary text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-4xl font-roboto font-bold mb-4">
            Pronto para Encontrar Seu Imóvel Ideal?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Entre em contacto connosco hoje mesmo e deixe-nos ajudá-lo a encontrar a propriedade perfeita
            ou realizar o projeto de construção dos seus sonhos.
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              className="bg-angola-secondary hover:bg-angola-secondary/90 text-white px-8 py-4 text-lg"
              data-testid="btn-contact-us"
            >
              Entrar em Contacto
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
