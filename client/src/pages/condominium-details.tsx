import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Home, Calendar, Building2, CheckCircle, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import type { Condominium } from "@shared/schema";

export default function CondominiumDetailsPage() {
  const { id } = useParams();
  
  const { data: condominium, isLoading, error } = useQuery<Condominium>({
    queryKey: ["/api/condominiums", id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !condominium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Condomínio não encontrado</h1>
          <p className="text-gray-600 mb-4">O condomínio que você procura não existe ou foi removido.</p>
          <Link href="/condominios">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Condomínios
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding py-4">
          <Link href="/condominios" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Condomínios
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={(condominium.images && condominium.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"}
            alt={condominium.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`${statusColors[condominium.status as keyof typeof statusColors]} border-0`}>
                  {statusLabels[condominium.status as keyof typeof statusLabels]}
                </Badge>
                {condominium.featured && (
                  <Badge className="bg-green-600 text-white border-0">
                    Destaque
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{condominium.name}</h1>
              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{condominium.centralityOrDistrict} • {condominium.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Condomínio</h2>
                <p className="text-gray-600 leading-relaxed">
                  {condominium.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Principais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total de Unidades</p>
                      <p className="text-lg font-semibold text-gray-900">{condominium.totalUnits}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Home className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unidades Disponíveis</p>
                      <p className="text-lg font-semibold text-gray-900">{condominium.availableUnits}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unidades Vendidas</p>
                      <p className="text-lg font-semibold text-gray-900">{condominium.completedUnits || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ano de Desenvolvimento</p>
                      <p className="text-lg font-semibold text-gray-900">{condominium.developmentYear}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {condominium.amenities && condominium.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Comodidades e Lazer</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {condominium.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {condominium.images && condominium.images.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria de Imagens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {condominium.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${condominium.name} - Imagem ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Range */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Faixa de Preço</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  {condominium.priceRange}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Preços variam conforme localização, andar e acabamentos escolhidos.
                </p>
              </CardContent>
            </Card>

            {/* Sale Conditions */}
            {(condominium.saleConditions || condominium.totalValue || condominium.initialPayment || condominium.paymentPeriod) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições de Venda</h3>
                  <div className="space-y-3">
                    {condominium.saleConditions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Condições</p>
                        <p className="text-gray-600">{condominium.saleConditions}</p>
                      </div>
                    )}
                    
                    {condominium.totalValue && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Valor Total</p>
                        <p className="text-lg font-bold text-gray-900">{condominium.totalValue}</p>
                      </div>
                    )}
                    
                    {condominium.initialPayment && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Entrada Inicial Facilitada</p>
                        <p className="text-lg font-bold text-green-600">{condominium.initialPayment}</p>
                      </div>
                    )}
                    
                    {condominium.paymentPeriod && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Prazo de Amortização</p>
                        <p className="text-gray-600">{condominium.paymentPeriod}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenho Interesse</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Entre em contato conosco para mais informações sobre este condomínio.
                </p>
                
                <div className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar Agora
                  </Button>
                  
                  <Link href="/contacto" className="block">
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{condominium.centralityOrDistrict}</p>
                      <p className="text-sm text-gray-600">{condominium.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}