import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import EmployeeForm from "@/components/admin/employee-form";
import type { Employee } from "@shared/schema";

export default function AdminAboutPage() {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/employees/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Funcionário eliminado",
        description: "O funcionário foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o funcionário.",
        variant: "destructive",
      });
    },
  });

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleEmployeeDialogClose = () => {
    setIsEmployeeDialogOpen(false);
    setEditingEmployee(null);
  };

  const getDepartmentLabel = (department: string) => {
    return department === 'imobiliario' ? 'Imobiliário' : 'Construtora';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão de Funcionários</h1>
          <p className="text-gray-600">Gerir funcionários da CARMIGUI</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Funcionários</h2>
            <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary" data-testid="btn-add-employee">
                  <Plus className="mr-2" size={20} />
                  Adicionar Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEmployee ? "Editar Funcionário" : "Adicionar Novo Funcionário"}
                  </DialogTitle>
                </DialogHeader>
                <EmployeeForm
                  employee={editingEmployee}
                  onSuccess={handleEmployeeDialogClose}
                />
              </DialogContent>
            </Dialog>
          </div>

          {employeesLoading ? (
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
          ) : employees.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum funcionário encontrado
                </h3>
                <p className="text-gray-500">
                  Comece por adicionar o primeiro funcionário.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <Card key={employee.id} data-testid={`employee-card-${employee.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {employee.imageUrl && (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={employee.imageUrl}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold" data-testid={`text-employee-name-${employee.id}`}>
                              {employee.name}
                            </h3>
                            <Badge className="bg-green-100 text-green-800">
                              {getDepartmentLabel(employee.department)}
                            </Badge>
                            {employee.active ? (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-medium mb-2">
                            {employee.position}
                          </p>
                          {employee.bio && (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                              {employee.bio}
                            </p>
                          )}
                          <div className="flex gap-4 text-xs text-gray-500">
                            {employee.email && <span>{employee.email}</span>}
                            {employee.phone && <span>{employee.phone}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEmployee(employee)}
                          data-testid={`btn-edit-employee-${employee.id}`}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja eliminar este funcionário?")) {
                              deleteEmployeeMutation.mutate(employee.id);
                            }
                          }}
                          data-testid={`btn-delete-employee-${employee.id}`}
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
      </div>
    </AdminLayout>
  );
}
