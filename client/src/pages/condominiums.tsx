import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Building2, MapPin, Users, Home, CheckCircle, Calendar, ArrowRight } from "lucide-react";
import type { Condominium } from "@shared/schema";

export default function CondominiumsPage() {
  const { data: condominiums = [], isLoading } = useQuery<Condominium[]>({
    queryKey: ["/api/condominiums"],
  });

  const { data: featuredCondominiums = [] } = useQuery<Condominium[]>({
    queryKey: ["/api/condominiums", "featured=true"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Descubra Condomínios <br />de Excelência
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Explore nossos projetos residenciais exclusivos em Luanda, projetados para oferecer 
              qualidade de vida e segurança para sua família.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Condominiums */}
      {featuredCondominiums.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Condomínios em Destaque
                </h2>
                <p className="text-gray-600 text-lg">
                  Nossos principais projetos residenciais em desenvolvimento e já entregues
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCondominiums.map((condominium) => (
                <CondominiumCard key={condominium.id} condominium={condominium} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Condominiums */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todos os Condomínios
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conheça toda nossa carteira de empreendimentos residenciais, 
              desde centralidades modernas até bairros consolidados de Luanda.
            </p>
          </div>
          
          {condominiums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {condominiums.map((condominium) => (
                <CondominiumCard key={condominium.id} condominium={condominium} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum condomínio disponível
              </h3>
              <p className="text-gray-600">
                Em breve teremos novos projetos residenciais disponíveis.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Projetos Exclusivos
              </h3>
              <p className="text-gray-600">
                Condomínios projetados com arquitetura moderna e áreas de lazer completas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Materiais de primeira qualidade e acabamentos que seguem padrões internacionais
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Localizações Premium
              </h3>
              <p className="text-gray-600">
                Situados nas melhores centralidades e bairros nobres de Luanda
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CondominiumCard({ condominium }: { condominium: Condominium }) {
  const statusColors = {
    "in-development": "bg-yellow-100 text-yellow-800",
    "completed": "bg-green-100 text-green-800",
    "planning": "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    "in-development": "Em Construção",
    "completed": "Entregue",
    "planning": "Em Planejamento",
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={(condominium.images && condominium.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={condominium.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${statusColors[condominium.status as keyof typeof statusColors]} border-0`}>
            {statusLabels[condominium.status as keyof typeof statusLabels]}
          </Badge>
        </div>
        {condominium.featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-600 text-white border-0">
              Destaque
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {condominium.name}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{condominium.centralityOrDistrict} • {condominium.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {condominium.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{condominium.totalUnits} unidades</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Home className="h-4 w-4 mr-1" />
            <span>{condominium.availableUnits} disponíveis</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{condominium.developmentYear}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-sm text-gray-600">Faixa de preço:</span>
          <p className="text-lg font-semibold text-green-600">
            {condominium.priceRange}
          </p>
        </div>
        
        {condominium.amenities && condominium.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {condominium.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {condominium.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{condominium.amenities.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Link href={`/condominios/${condominium.id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white group">
            Ver Detalhes
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}