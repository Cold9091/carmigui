import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import PropertyForm from "@/components/admin/property-form";
import type { Property } from "@shared/schema";

export default function AdminPropertiesPage() {
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Delete mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Imóvel eliminado",
        description: "O imóvel foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o imóvel.",
        variant: "destructive",
      });
    },
  });

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsPropertyDialogOpen(true);
  };

  const handlePropertyDialogClose = () => {
    setIsPropertyDialogOpen(false);
    setEditingProperty(null);
  };

  const getPropertyStatusBadge = (status: string) => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Imóveis</h1>
            <p className="text-gray-600">Gerir todas as propriedades do sistema</p>
          </div>
          <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" data-testid="btn-add-property">
                <Plus className="mr-2" size={20} />
                Adicionar Imóvel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? "Editar Imóvel" : "Adicionar Novo Imóvel"}
                </DialogTitle>
              </DialogHeader>
              <PropertyForm
                property={editingProperty}
                onSuccess={handlePropertyDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        {propertiesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500">
                Comece por adicionar o primeiro imóvel.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const mainImage = property.images && property.images.length > 0 
                ? property.images[0] 
                : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
              
              return (
                <Card key={property.id} className="card-hover bg-white shadow-lg overflow-hidden" data-testid={`property-card-${property.id}`}>
                  <div className="relative">
                    <img
                      src={mainImage}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                      data-testid="property-image"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {getPropertyStatusBadge(property.status)}
                      {property.featured && (
                        <Badge className="bg-angola-secondary text-white">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                        className="bg-white/90 hover:bg-white"
                        data-testid={`btn-edit-property-${property.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePropertyMutation.mutate(property.id)}
                        disabled={deletePropertyMutation.isPending}
                        className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                        data-testid={`btn-delete-property-${property.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-roboto font-bold text-angola-primary mb-2" data-testid="property-title">
                      {property.title}
                    </h3>
                    <p className="text-angola-text mb-2" data-testid="property-location">
                      {property.location}
                    </p>
                    <p className="text-2xl font-bold text-angola-primary mb-4" data-testid="property-price">
                      {formatPrice(property.price)}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-sm text-angola-text">
                      <div className="flex items-center" data-testid="property-area">
                        <Building size={16} className="mr-1" />
                        {property.area} m²
                      </div>
                      {property.bedrooms && (
                        <div className="flex items-center" data-testid="property-bedrooms">
                          <span className="mr-1">🛏️</span>
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center" data-testid="property-bathrooms">
                          <span className="mr-1">🚿</span>
                          {property.bathrooms}
                        </div>
                      )}
                    </div>
                    {property.type && (
                      <p className="text-sm text-gray-500 mt-2" data-testid="property-type">
                        <strong>Tipo:</strong> {property.type}
                      </p>
                    )}
                    {property.virtualTourUrl && (
                      <div className="mt-4">
                        <a 
                          href={property.virtualTourUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                          data-testid="property-virtual-tour"
                        >
                          🏠 Tour Virtual
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}