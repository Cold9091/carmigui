import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Folder, Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import CategoryForm from "@/components/admin/category-form";
import type { PropertyCategory } from "@shared/schema";

export default function AdminCategoriesPage() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PropertyCategory | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/property-categories/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Categoria eliminada",
        description: "A categoria foi eliminada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/property-categories"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar a categoria.",
        variant: "destructive",
      });
    },
  });

  const handleEditCategory = (category: PropertyCategory) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Categorias</h1>
            <p className="text-gray-600">Gerir categorias de imóveis exibidas na página inicial</p>
          </div>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" data-testid="btn-add-category">
                <Plus className="mr-2" size={20} />
                Adicionar Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onSuccess={handleCategoryDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        {categoriesLoading ? (
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
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-500">
                Comece por adicionar a primeira categoria de imóveis.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          {category.active ? (
                            <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Slug:</span> {category.slug}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Ordem de exibição:</span> {category.displayOrder}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                        data-testid={`btn-edit-category-${category.id}`}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja eliminar esta categoria?")) {
                            deleteCategoryMutation.mutate(category.id);
                          }
                        }}
                        data-testid={`btn-delete-category-${category.id}`}
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
