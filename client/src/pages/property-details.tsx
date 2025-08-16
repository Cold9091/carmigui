import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Phone, Mail, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", id],
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

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Imóvel não encontrado</h1>
          <p className="text-gray-500 mb-6">O imóvel que procura não existe ou foi removido.</p>
          <Link href="/imoveis">
            <Button className="btn-primary" data-testid="btn-back-to-properties">
              <ArrowLeft className="mr-2" size={20} />
              Voltar aos Imóveis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Disponível</Badge>;
      case "sold":
        return <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">Vendido</Badge>;
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">Arrendado</Badge>;
      default:
        return <Badge className="text-lg px-4 py-2">{status}</Badge>;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M Kz`;
    }
    return `${numPrice.toLocaleString()} Kz`;
  };

  const getPropertyType = (type: string) => {
    switch (type) {
      case "apartment": return "Apartamento";
      case "house": return "Casa";
      case "office": return "Escritório";
      case "land": return "Terreno";
      default: return type;
    }
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Back Button */}
        <Link href="/imoveis">
          <Button
            variant="outline"
            className="mb-6 border-angola-primary text-angola-primary hover:bg-angola-primary hover:text-white"
            data-testid="btn-back"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar aos Imóveis
          </Button>
        </Link>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-4xl font-roboto font-bold text-angola-primary mb-2" data-testid="property-title">
                {property.title}
              </h1>
              <p className="text-xl text-angola-text flex items-center" data-testid="property-location">
                <MapPin className="text-angola-secondary mr-2" size={20} />
                {property.location}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-angola-primary mb-2" data-testid="property-price">
                {formatPrice(property.price)}
              </div>
              {getStatusBadge(property.status)}
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            data-testid="property-main-image"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-roboto font-bold text-angola-primary mb-6">
                  Detalhes do Imóvel
                </h2>
                
                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Maximize size={32} className="mx-auto" />
                    </div>
                    <div className="text-2xl font-bold text-angola-text" data-testid="detail-area">
                      {property.area}
                    </div>
                    <div className="text-sm text-gray-500">m²</div>
                  </div>
                  
                  {property.bedrooms && (
                    <div className="text-center">
                      <div className="text-angola-primary mb-2">
                        <Bed size={32} className="mx-auto" />
                      </div>
                      <div className="text-2xl font-bold text-angola-text" data-testid="detail-bedrooms">
                        {property.bedrooms}
                      </div>
                      <div className="text-sm text-gray-500">Quartos</div>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="text-center">
                      <div className="text-angola-primary mb-2">
                        <Bath size={32} className="mx-auto" />
                      </div>
                      <div className="text-2xl font-bold text-angola-text" data-testid="detail-bathrooms">
                        {property.bathrooms}
                      </div>
                      <div className="text-sm text-gray-500">Casas de banho</div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-angola-primary mb-2">
                      <Calendar size={32} className="mx-auto" />
                    </div>
                    <div className="text-lg font-bold text-angola-text" data-testid="detail-type">
                      {getPropertyType(property.type)}
                    </div>
                    <div className="text-sm text-gray-500">Tipo</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-roboto font-bold text-angola-primary mb-4">
                    Descrição
                  </h3>
                  <p className="text-angola-text leading-relaxed" data-testid="property-description">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {property.images && property.images.length > 1 && (
              <Card className="mt-8">
                <CardContent className="p-8">
                  <h3 className="text-xl font-roboto font-bold text-angola-primary mb-4">
                    Galeria de Imagens
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} - Imagem ${index + 2}`}
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
                  Interessado neste imóvel?
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
                      <div>vendas@angolacasa.ao</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="btn-primary w-full"
                    disabled={property.status === "sold"}
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
                      Enviar Mensagem
                    </Button>
                  </Link>
                </div>

                {property.status === "sold" && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm text-center font-medium">
                      Este imóvel já foi vendido
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
