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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto container-padding py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <Building2 className="h-10 w-10 md:h-12 md:w-12 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-white leading-none">CARMIGUI</span>
                  <span className="text-sm md:text-base text-yellow-400 leading-none">Comercial, Lda</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Descubra Condomínios <br />de Excelência
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
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
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="relative">
        <img
          src={(condominium.images && condominium.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={condominium.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{condominium.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin size={14} className="text-gray-400" />
          <span>{condominium.centralityOrDistrict} • {condominium.location}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" />
            <span>{condominium.totalUnits} unidades</span>
          </div>
          <div className="flex items-center gap-1">
            <Home size={14} className="text-gray-400" />
            <span>{condominium.availableUnits} disponíveis</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Faixa de preço</p>
            <p className="text-lg font-bold text-gray-800">
              {condominium.priceRange}
            </p>
            <p className="text-xs text-gray-500">{condominium.developmentYear}</p>
          </div>
          <Link href={`/condominios/${condominium.id}`}>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              data-testid={`btn-ver-detalhes-${condominium.id}`}
            >
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}