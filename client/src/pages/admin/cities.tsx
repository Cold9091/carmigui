import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import CityForm from "@/components/admin/city-form";
import type { City } from "@shared/schema";

export default function AdminCitiesPage() {
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cities = [], isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const deleteCityMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cities/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Cidade eliminada",
        description: "A cidade foi eliminada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar a cidade.",
        variant: "destructive",
      });
    },
  });

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsCityDialogOpen(true);
  };

  const handleCityDialogClose = () => {
    setIsCityDialogOpen(false);
    setEditingCity(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Cidades</h1>
            <p className="text-gray-600">Gerir cidades exibidas na seção "O melhor de cada cidade"</p>
          </div>
          <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" data-testid="btn-add-city">
                <Plus className="mr-2" size={20} />
                Adicionar Cidade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCity ? "Editar Cidade" : "Adicionar Nova Cidade"}
                </DialogTitle>
              </DialogHeader>
              <CityForm
                city={editingCity}
                onSuccess={handleCityDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        {citiesLoading ? (
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
        ) : cities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma cidade encontrada
              </h3>
              <p className="text-gray-500">
                Comece por adicionar a primeira cidade.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cities.map((city) => (
              <Card key={city.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={city.imageUrl}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{city.name}</h3>
                          {city.active ? (
                            <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Slug:</span> {city.slug}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Ordem de exibição:</span> {city.displayOrder}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCity(city)}
                        data-testid={`btn-edit-city-${city.id}`}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja eliminar esta cidade?")) {
                            deleteCityMutation.mutate(city.id);
                          }
                        }}
                        data-testid={`btn-delete-city-${city.id}`}
                      >
                        <Trash2 size={18} className="text-red-500" />
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
