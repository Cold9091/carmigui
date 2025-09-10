import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Building, MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import PropertyCard from "@/components/property-card";
import type { Property } from "@shared/schema";

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    bedrooms: "",
    location: "",
    priceRange: [25000, 490000000],
    style: "TODOS",
  });

  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  const queryParams = new URLSearchParams();
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
  if (filters.priceRange[0] > 25000) queryParams.append("minPrice", filters.priceRange[0].toString());
  if (filters.priceRange[1] < 490000000) queryParams.append("maxPrice", filters.priceRange[1].toString());

  const queryString = queryParams.toString();
  const queryKey = queryString ? ["/api/properties", queryString] : ["/api/properties"];

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey,
  });

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (propertyId: string) => {
    setSelectedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  // Sample properties data with proper Property schema format
  const sampleProperties: Property[] = [
    {
      id: "1",
      title: "Casa de Vidro",
      description: "Moderna casa de vidro com design contemporâneo e acabamentos de luxo",
      location: "Rua 1, Luanda - Angola",
      type: "house",
      area: 812,
      bedrooms: 5,
      bathrooms: 3,
      price: "1010000000",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: "https://example.com/tour/casa-vidro",
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2", 
      title: "Sobrado Minimalista",
      description: "Sobrado com design minimalista e espaços amplos para conforto familiar",
      location: "Rua 2, Benguela - Angola",
      type: "house",
      area: 230,
      bedrooms: 3,
      bathrooms: 2,
      price: "250000000",
      images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      title: "Casa de campo",
      description: "Aconchegante casa de campo ideal para quem busca tranquilidade",
      location: "Rua 3, Huambo - Angola", 
      type: "house",
      area: 100,
      bedrooms: 2,
      bathrooms: 1,
      price: "100000000",
      images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: "https://example.com/tour/casa-campo",
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      title: "Apartamento",
      description: "Apartamento moderno com localização privilegiada no centro da cidade",
      location: "Rua 4, Lobito - Angola",
      type: "apartment",
      area: 68,
      bedrooms: 2,
      bathrooms: 1,
      price: "195000000",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "5",
      title: "Casa de campo com piscina",
      description: "Espaçosa casa de campo com piscina e área de lazer completa",
      location: "Rua 5, Malanje - Angola",
      type: "house",
      area: 400,
      bedrooms: 3,
      bathrooms: 2,
      price: "500000000",
      images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "6",
      title: "Apartamento no centro",
      description: "Elegante apartamento no centro com fácil acesso a todas as comodidades",
      location: "Rua 6, Cabinda - Angola",
      type: "apartment",
      area: 400,
      bedrooms: 3,
      bathrooms: 2,
      price: "410000000",
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Procure uma oferta
            </h1>
            <p className="text-xl text-gray-600">
              Escolha entre as ofertas mais vantajosas
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-300 w-32"></div>
                <span className="text-gray-600 font-medium">Configurações de filtro</span>
                <div className="h-px bg-gray-300 w-32"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

              <Select
                value={filters.bedrooms}
                onValueChange={(value) => handleFilterChange("bedrooms", value)}
              >
                <SelectTrigger data-testid="filter-bedrooms" className="bg-white">
                  <SelectValue placeholder="Selecione os quartos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">1 quarto</SelectItem>
                  <SelectItem value="2">2 quartos</SelectItem>
                  <SelectItem value="3">3 quartos</SelectItem>
                  <SelectItem value="4">4 quartos</SelectItem>
                  <SelectItem value="5">5+ quartos</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger data-testid="filter-location" className="bg-white">
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as localizações</SelectItem>
                  <SelectItem value="Luanda">Luanda</SelectItem>
                  <SelectItem value="Benguela">Benguela</SelectItem>
                  <SelectItem value="Huambo">Huambo</SelectItem>
                  <SelectItem value="Lobito">Lobito</SelectItem>
                  <SelectItem value="Malanje">Malanje</SelectItem>
                  <SelectItem value="Cabinda">Cabinda</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Mais caro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Slider */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Kz{filters.priceRange[0].toLocaleString()}</span>
                <span className="text-sm text-gray-600">Kz{filters.priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange("priceRange", value)}
                max={490000000}
                min={25000}
                step={5000000}
                className="w-full"
              />
            </div>

            {/* Style Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700">Estilo que talvez você goste</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    ←
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    →
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                {["TODOS", "ARQUITETÔNICO", "RÚSTICO", "CLÁSSICO", "AMERICANO", "COLONIAL"].map((style) => (
                  <button
                    key={style}
                    onClick={() => handleFilterChange("style", style)}
                    className={`px-6 py-3 border rounded-lg font-medium ${
                      filters.style === style
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-600"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto container-padding section-spacing">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          200 Imóveis à venda em Angola
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}