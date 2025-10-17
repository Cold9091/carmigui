import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/property-card";
import type { Property, PropertyCategory, City } from "@shared/schema";

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    bedrooms: "",
    cityId: "",
    categoryId: "",
  });

  const [sortBy, setSortBy] = useState("");

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      bedrooms: urlParams.get('bedrooms') || "",
      cityId: urlParams.get('cityId') || "",
      categoryId: urlParams.get('categoryId') || "",
    };
    setFilters(initialFilters);
    setSortBy(urlParams.get('sortBy') || "");
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentParams = {
      bedrooms: urlParams.get('bedrooms') || '',
      cityId: urlParams.get('cityId') || '',
      categoryId: urlParams.get('categoryId') || '',
      sortBy: urlParams.get('sortBy') || '',
    };

    // Only update URL if filters actually changed
    const filtersChanged = 
      currentParams.bedrooms !== (filters.bedrooms === 'all' ? '' : filters.bedrooms) ||
      currentParams.cityId !== (filters.cityId === 'all' ? '' : filters.cityId) ||
      currentParams.categoryId !== (filters.categoryId === 'all' ? '' : filters.categoryId) ||
      currentParams.sortBy !== (sortBy === 'all' ? '' : sortBy);

    if (!filtersChanged) return;

    const newUrlParams = new URLSearchParams();
    if (filters.bedrooms && filters.bedrooms !== 'all') newUrlParams.set('bedrooms', filters.bedrooms);
    if (filters.cityId && filters.cityId !== 'all') newUrlParams.set('cityId', filters.cityId);
    if (filters.categoryId && filters.categoryId !== 'all') newUrlParams.set('categoryId', filters.categoryId);
    if (sortBy && sortBy !== 'all') newUrlParams.set('sortBy', sortBy);
    
    const newUrl = newUrlParams.toString() ? `${window.location.pathname}?${newUrlParams.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters, sortBy]);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = useMemo(() => {
    let filtered = (properties || []).filter((property) => {
      if (filters.categoryId && filters.categoryId !== 'all' && property.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters.bedrooms && filters.bedrooms !== 'all') {
        const propertyBedrooms = property.bedrooms || 0;
        if (filters.bedrooms === '5') {
          // Para "5+ quartos", aceitar propriedades com 5 ou mais quartos
          if (propertyBedrooms < 5) return false;
        } else {
          // Para outros valores, comparação exata
          if (propertyBedrooms.toString() !== filters.bedrooms) return false;
        }
      }
      if (filters.cityId && filters.cityId !== 'all' && property.cityId !== filters.cityId) {
        return false;
      }
      return true;
    });

    // Aplicar ordenação
    if (sortBy && sortBy !== 'all') {
      filtered = [...filtered].sort((a, b) => {
        switch(sortBy) {
          case 'price-asc':
            return Number(a.price || 0) - Number(b.price || 0);
          case 'price-desc':
            return Number(b.price || 0) - Number(a.price || 0);
          case 'newest':
            // Ordenar por data de criação (mais recentes primeiro)
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [properties, filters, sortBy]);

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
                value={filters.cityId}
                onValueChange={(value) => handleFilterChange("cityId", value)}
              >
                <SelectTrigger data-testid="filter-city" className="bg-white">
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.filter(city => city.active).map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.categoryId}
                onValueChange={(value) => handleFilterChange("categoryId", value)}
              >
                <SelectTrigger data-testid="filter-category" className="bg-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.filter(cat => cat.active).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger data-testid="filter-sort" className="bg-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Padrão</SelectItem>
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