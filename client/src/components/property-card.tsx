import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case "sold":
        return <Badge className="bg-red-100 text-red-800">Vendido</Badge>;
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800">Arrendado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M Kz`;
    }
    return `${numPrice.toLocaleString()} Kz`;
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";

  return (
    <Card className="card-hover bg-white shadow-lg overflow-hidden" data-testid={`property-card-${property.id}`}>
      <div className="relative">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-48 object-cover"
          data-testid="property-image"
        />
        <div className="absolute top-4 right-4">
          {property.featured && (
            <Badge className="bg-angola-secondary text-white">Destaque</Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
          <span className="font-semibold" data-testid="property-price">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-roboto font-bold text-angola-primary" data-testid="property-title">
            {property.title}
          </h3>
          {getStatusBadge(property.status)}
        </div>
        <p className="text-angola-text mb-4 flex items-center" data-testid="property-location">
          <MapPin className="text-angola-secondary mr-2" size={16} />
          {property.location}
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm text-angola-text mb-4">
          {property.bedrooms && (
            <div className="flex items-center" data-testid="property-bedrooms">
              <Bed className="text-angola-secondary mr-1" size={16} />
              {property.bedrooms} Quartos
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center" data-testid="property-bathrooms">
              <Bath className="text-angola-secondary mr-1" size={16} />
              {property.bathrooms} Casas de banho
            </div>
          )}
          <div className="flex items-center" data-testid="property-area">
            <Maximize className="text-angola-secondary mr-1" size={16} />
            {property.area} m²
          </div>
        </div>
        <Link href={`/imoveis/${property.id}`}>
          <Button 
            className={`w-full ${property.status === "sold" ? "bg-gray-400 cursor-not-allowed" : "btn-primary"}`}
            disabled={property.status === "sold"}
            data-testid="btn-view-property-details"
          >
            {property.status === "sold" ? "Vendido" : "Ver Detalhes"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
