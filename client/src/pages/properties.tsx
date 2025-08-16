import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building } from "lucide-react";
import PropertyCard from "@/components/property-card";
import type { Property } from "@shared/schema";

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

  const queryString = queryParams.toString();
  const queryKey = queryString ? ["/api/properties", queryString] : ["/api/properties"];

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-angola-accent section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-roboto font-bold text-angola-primary mb-4">
              Nossos Imóveis
            </h1>
            <p className="text-xl text-angola-text">
              Encontre a propriedade perfeita para si em Angola
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger data-testid="filter-type">
                  <SelectValue placeholder="Tipo de Imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Tipos</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="office">Escritório</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Localização"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                data-testid="filter-location"
              />

              <Input
                placeholder="Preço Mínimo"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                data-testid="filter-min-price"
              />

              <Input
                placeholder="Preço Máximo"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                data-testid="filter-max-price"
              />

              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-angola-primary text-angola-primary hover:bg-angola-primary hover:text-white"
                data-testid="btn-clear-filters"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Não encontrámos imóveis que correspondam aos seus critérios de pesquisa.
                Tente ajustar os filtros ou limpe-os para ver todos os imóveis disponíveis.
              </p>
              <Button onClick={clearFilters} className="btn-primary" data-testid="btn-show-all">
                Ver Todos os Imóveis
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-roboto font-bold text-angola-primary">
                  {properties.length} {properties.length === 1 ? "Imóvel Encontrado" : "Imóveis Encontrados"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
