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
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} data-testid={`property-row-${property.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-angola-primary">
                          {property.title}
                        </h3>
                        {getPropertyStatusBadge(property.status)}
                        {property.featured && (
                          <Badge className="bg-angola-secondary text-white">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{property.location}</p>
                      <p className="text-lg font-bold text-angola-primary">
                        {formatPrice(property.price)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {property.area} m² • {property.type}
                        {property.bedrooms && ` • ${property.bedrooms} quartos`}
                        {property.bathrooms && ` • ${property.bathrooms} casas de banho`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                        data-testid={`btn-edit-property-${property.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePropertyMutation.mutate(property.id)}
                        disabled={deletePropertyMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`btn-delete-property-${property.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}