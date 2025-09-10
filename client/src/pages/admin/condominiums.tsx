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
          <div className="space-y-4">
            {condominiums.map((condominium) => (
              <Card key={condominium.id} data-testid={`condominium-row-${condominium.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-angola-primary">
                          {condominium.name}
                        </h3>
                        {getCondominiumStatusBadge(condominium.status)}
                        {condominium.featured && (
                          <Badge className="bg-angola-secondary text-white">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{condominium.location}</p>
                      <p className="text-lg font-bold text-angola-primary">
                        {condominium.priceRange}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {condominium.totalUnits} unidades • {condominium.availableUnits} disponíveis • {condominium.developmentYear}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCondominium(condominium)}
                        data-testid={`btn-edit-condominium-${condominium.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCondominiumMutation.mutate(condominium.id)}
                        disabled={deleteCondominiumMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`btn-delete-condominium-${condominium.id}`}
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