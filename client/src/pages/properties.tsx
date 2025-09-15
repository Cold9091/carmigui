import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/property-card";
import type { Property } from "@shared/schema";

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    bedrooms: "",
    location: "",
    type: "",
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      bedrooms: urlParams.get('bedrooms') || "",
      location: urlParams.get('location') || "",
      type: urlParams.get('type') || "",
    };
    setFilters(initialFilters);
  }, []);

  const queryParams = new URLSearchParams();
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
  if (filters.type) queryParams.append("type", filters.type);

  const queryString = queryParams.toString();
  const queryKey = queryString ? ["/api/properties", queryString] : ["/api/properties"];

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey,
  });

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = useMemo(() => {
    return (properties || []).filter((property) => {
      if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }
      if (filters.bedrooms && filters.bedrooms !== 'all' && property.bedrooms?.toString() !== filters.bedrooms) {
        return false;
      }
      if (filters.location && filters.location !== 'all' && !property.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [properties, filters]);

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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

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

              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger data-testid="filter-type" className="bg-white">
                  <SelectValue placeholder="Tipo de imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="fazenda">Fazenda</SelectItem>
                  <SelectItem value="building">Prédio</SelectItem>
                  <SelectItem value="office">Comercial</SelectItem>
                  <SelectItem value="coworking">Coworking</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto container-padding section-spacing">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {isLoading ? "Carregando..." : `${filteredProperties.length} Imóveis à venda em Angola`}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {!isLoading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}