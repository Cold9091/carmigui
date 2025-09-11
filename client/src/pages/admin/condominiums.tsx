import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Home, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import CondominiumForm from "@/components/admin/condominium-form";
import type { Condominium } from "@shared/schema";

export default function AdminCondominiumsPage() {
  const [isCondominiumDialogOpen, setIsCondominiumDialogOpen] = useState(false);
  const [editingCondominium, setEditingCondominium] = useState<Condominium | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch condominiums
  const { data: condominiums = [], isLoading: condominiumsLoading } = useQuery<Condominium[]>({
    queryKey: ["/api/condominiums"],
  });

  // Delete mutation
  const deleteCondominiumMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/condominiums/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Condomínio eliminado",
        description: "O condomínio foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/condominiums"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o condomínio.",
        variant: "destructive",
      });
    },
  });

  const handleEditCondominium = (condominium: Condominium) => {
    setEditingCondominium(condominium);
    setIsCondominiumDialogOpen(true);
  };

  const handleCondominiumDialogClose = () => {
    setIsCondominiumDialogOpen(false);
    setEditingCondominium(null);
  };

  const getCondominiumStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "in-development":
        return <Badge className="bg-blue-100 text-blue-800">Em Desenvolvimento</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-800">Planeamento</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Condomínios</h1>
            <p className="text-gray-600">Gerir todos os condomínios do sistema</p>
          </div>
          <Dialog open={isCondominiumDialogOpen} onOpenChange={setIsCondominiumDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" data-testid="btn-add-condominium">
                <Plus className="mr-2" size={20} />
                Adicionar Condomínio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCondominium ? "Editar Condomínio" : "Adicionar Novo Condomínio"}
                </DialogTitle>
              </DialogHeader>
              <CondominiumForm
                condominium={editingCondominium}
                onSuccess={handleCondominiumDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        {condominiumsLoading ? (
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
        ) : condominiums.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum condomínio encontrado
              </h3>
              <p className="text-gray-500">
                Comece por adicionar o primeiro condomínio.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {condominiums.map((condominium) => {
              const mainImage = condominium.images && condominium.images.length > 0 
                ? condominium.images[0] 
                : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
              
              return (
                <Card key={condominium.id} className="admin-triangular-card card-hover bg-white shadow-lg" data-testid={`condominium-card-${condominium.id}`}>
                  <div className="relative image-container">
                    <img
                      src={mainImage}
                      alt={condominium.name}
                      className="w-full h-48 object-cover"
                      data-testid="condominium-image"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {getCondominiumStatusBadge(condominium.status)}
                      {condominium.featured && (
                        <Badge className="bg-angola-secondary text-white">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCondominium(condominium)}
                        className="bg-white/90 hover:bg-white"
                        data-testid={`btn-edit-condominium-${condominium.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCondominiumMutation.mutate(condominium.id)}
                        disabled={deleteCondominiumMutation.isPending}
                        className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                        data-testid={`btn-delete-condominium-${condominium.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-roboto font-bold text-angola-primary mb-2" data-testid="condominium-title">
                      {condominium.name}
                    </h3>
                    <p className="text-angola-text mb-2" data-testid="condominium-location">
                      {condominium.location} • {condominium.centralityOrDistrict}
                    </p>
                    <p className="text-2xl font-bold text-angola-primary mb-4" data-testid="condominium-price">
                      {condominium.priceRange}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-angola-text mb-4">
                      <div className="flex items-center" data-testid="condominium-total-units">
                        <Home size={16} className="mr-1" />
                        {condominium.totalUnits} unidades
                      </div>
                      <div className="flex items-center" data-testid="condominium-available-units">
                        <span className="mr-1">✅</span>
                        {condominium.availableUnits} disponíveis
                      </div>
                      <div className="flex items-center col-span-2" data-testid="condominium-development-year">
                        <span className="mr-1">📅</span>
                        {condominium.developmentYear}
                      </div>
                    </div>
                    {condominium.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2" data-testid="condominium-description">
                        {condominium.description}
                      </p>
                    )}
                    {condominium.amenities && condominium.amenities.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {condominium.amenities.slice(0, 3).map((amenity, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                              data-testid={`condominium-amenity-${index}`}
                            >
                              {amenity}
                            </span>
                          ))}
                          {condominium.amenities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{condominium.amenities.length - 3} mais
                            </span>
                          )}
                        </div>
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