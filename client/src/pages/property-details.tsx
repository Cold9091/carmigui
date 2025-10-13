import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar, ChevronLeft, ChevronRight, Heart, Share2, Building, Home, TrendingUp, Eye } from "lucide-react";
import { VirtualTourViewer, VirtualTourBadge } from "@/components/virtual-tour-viewer";
import { Link } from "wouter";
import { useState } from "react";
import type { Property } from "@shared/schema";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  const { data: similarProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: !!property,
    select: (data) => data.filter(p => p.id !== property?.id && p.location === property?.location).slice(0, 3),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Imóvel não encontrado</h1>
          <p className="text-gray-600 mb-4">O imóvel que você procura não existe ou foi removido.</p>
          <Link href="/imoveis">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Imóveis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M AKZ`;
    }
    return `${numPrice.toLocaleString()} AKZ`;
  };

  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'office': 'Escritório',
      'land': 'Terreno',
      'kitnet': 'Kitnet',
      'loft': 'Loft'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto container-padding py-4">
          <div className="flex items-center justify-between">
            <Link href="/imoveis" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Imóveis
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Favoritar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Property Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{property.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={propertyImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
                
                {propertyImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {propertyImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Property Specs */}
              <div className="p-6 bg-yellow-50">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center text-gray-700">
                    <Home className="h-5 w-5 mr-2 text-yellow-600" />
                    <span className="text-lg font-medium">{property.area}m²</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center text-gray-700">
                      <Bed className="h-5 w-5 mr-2 text-yellow-600" />
                      <span className="text-lg font-medium">{property.bedrooms} Quartos</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center text-gray-700">
                      <Bath className="h-5 w-5 mr-2 text-yellow-600" />
                      <span className="text-lg font-medium">{property.bathrooms} Banheiros</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {propertyImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {propertyImages.slice(1, 5).map((image, index) => (
                  <div 
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setCurrentImageIndex(index + 1)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - ${index + 2}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Imóvel</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Você pode estar interessado em</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarProperties.map((prop) => (
                      <div key={prop.id} className="group cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden mb-3">
                          <img
                            src={(prop.images && prop.images[0]) || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                            alt={prop.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{prop.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {prop.location}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {prop.area && <span>{prop.area} m²</span>}
                          {prop.bedrooms && <span>{prop.bedrooms} quartos</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">A partir de</p>
                            <p className="text-lg font-bold text-green-600">{formatPrice(prop.price)}</p>
                            <p className="text-xs text-gray-500">em 3 modalidades</p>
                          </div>
                          <Link href={`/imoveis/${prop.id}`}>
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              Ver preços
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Location Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Conheça a região do bairro {property.location}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{property.location}</p>
                      <p className="text-sm text-gray-600">Luanda, Angola</p>
                    </div>
                  </div>
                </div>
                
                {/* Map placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Mapa da região</p>
                      <p className="text-xs text-gray-500">{property.location}</p>
                    </div>
                  </div>
                  {/* Simulated map elements */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-8 right-8 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Ver mapa completo
                </Button>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interessado neste imóvel?
                </h3>
                
                <div className="space-y-3">
                  {property.virtualTourUrl && (
                    <VirtualTourViewer
                      tourUrl={property.virtualTourUrl}
                      propertyTitle={property.title}
                      trigger={
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          Tour Virtual 3D
                        </Button>
                      }
                    />
                  )}
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar para Imobiliária
                  </Button>
                  
                  <Link href="/contacto" className="block">
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    💼 Corretores especializados prontos para te atender
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