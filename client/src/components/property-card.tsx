import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import { Link } from "wouter";
import { VirtualTourViewer } from "@/components/virtual-tour-viewer";
import { Eye } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `Kz${(numPrice / 1000000).toFixed(0)}.${Math.floor((numPrice % 1000000) / 100000)}M`;
    }
    return `Kz${Math.floor(numPrice / 1000)}K`;
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow" data-testid={`property-card-${property.id}`}>
      <div className="relative">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-48 object-cover"
          data-testid="property-image"
        />
        
        {/* Heart icon for favorites */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
          <Heart size={16} className="text-gray-600" />
        </button>
        
        {/* Virtual Tour 3D tag */}
        {property.virtualTourUrl && (
          <>
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Eye size={10} />
              <span>Tour 3D</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <VirtualTourViewer
                tourUrl={property.virtualTourUrl}
                propertyTitle={property.title}
                trigger={
                  <button
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                    data-testid="btn-virtual-tour-icon"
                    title="Tour Virtual 3D"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Eye size={14} />
                  </button>
                }
              />
            </div>
          </>
        )}
        
        {/* Status badge */}
        {property.status === "available" && (
          <div className="absolute bottom-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Disponível
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1" data-testid="property-title">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3" data-testid="property-location">
          <MapPin size={14} className="text-gray-400" />
          <span>{property.location}</span>
        </div>
        
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1" data-testid="property-bedrooms">
              <span>{property.bedrooms}</span>
              <Bed size={14} className="text-gray-400" />
              <span>Quartos</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1" data-testid="property-bathrooms">
              <span>{property.bathrooms}</span>
              <Bath size={14} className="text-gray-400" />
              <span>Casas de banho</span>
            </div>
          )}
          <div className="flex items-center gap-1" data-testid="property-area">
            <Maximize size={14} className="text-gray-400" />
            <span>{property.area} m²</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">A partir de</p>
            <p className="text-lg font-bold text-gray-800" data-testid="property-price">
              {formatPrice(property.price)}
            </p>
            <p className="text-xs text-gray-500">em 2 modalidades</p>
          </div>
          {property.status === "sold" ? (
            <Button 
              className="bg-gray-400 cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
              disabled={true}
              data-testid="btn-view-property-details"
            >
              Vendido
            </Button>
          ) : (
            <Link href={`/imoveis/${property.id}`}>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                data-testid="btn-view-property-details"
              >
                Ver preços
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
