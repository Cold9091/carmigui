import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Users, Plus, Edit, Trash2, Home } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import AboutUsForm from "@/components/admin/about-us-form";
import EmployeeForm from "@/components/admin/employee-form";
import type { AboutUs, Employee } from "@shared/schema";

export default function AdminAboutPage() {
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingAbout, setEditingAbout] = useState<AboutUs | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aboutSections = [], isLoading: aboutLoading } = useQuery<AboutUs[]>({
    queryKey: ["/api/about-us"],
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const deleteAboutMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/about-us/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Seção eliminada",
        description: "A seção foi eliminada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/about-us"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar a seção.",
        variant: "destructive",
      });
    },
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

  const handleEditAbout = (about: AboutUs) => {
    setEditingAbout(about);
    setIsAboutDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleAboutDialogClose = () => {
    setIsAboutDialogOpen(false);
    setEditingAbout(null);
  };

  const handleEmployeeDialogClose = () => {
    setIsEmployeeDialogOpen(false);
    setEditingEmployee(null);
  };

  const getCompanyIcon = (companyType: string) => {
    return companyType === 'imobiliario' ? Building2 : Home;
  };

  const getCompanyLabel = (companyType: string) => {
    return companyType === 'imobiliario' ? 'Imobiliário' : 'Construtora';
  };

  const getDepartmentLabel = (department: string) => {
    return department === 'imobiliario' ? 'Imobiliário' : 'Construtora';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão do Sobre Nós</h1>
          <p className="text-gray-600">Gerir informações sobre a empresa e funcionários</p>
        </div>

        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sections" data-testid="tab-sections">Seções da Empresa</TabsTrigger>
            <TabsTrigger value="employees" data-testid="tab-employees">Funcionários</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Seções da Empresa</h2>
                <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary" data-testid="btn-add-section">
                      <Plus className="mr-2" size={20} />
                      Adicionar Seção
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAbout ? "Editar Seção" : "Adicionar Nova Seção"}
                      </DialogTitle>
                    </DialogHeader>
                    <AboutUsForm
                      aboutUs={editingAbout}
                      onSuccess={handleAboutDialogClose}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {aboutLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : aboutSections.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Nenhuma seção encontrada
                    </h3>
                    <p className="text-gray-500">
                      Comece por adicionar informações sobre a empresa.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {aboutSections.map((section) => {
                    const Icon = getCompanyIcon(section.companyType);
                    return (
                      <Card key={section.id} data-testid={`section-card-${section.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Icon className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold" data-testid={`text-section-title-${section.id}`}>
                                    {section.title}
                                  </h3>
                                  <Badge className="bg-green-100 text-green-800">
                                    {getCompanyLabel(section.companyType)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {section.description}
                                </p>
                                {section.mission && (
                                  <p className="text-xs text-gray-500 mb-1">
                                    <span className="font-medium">Missão:</span> {section.mission}
                                  </p>
                                )}
                                {section.vision && (
                                  <p className="text-xs text-gray-500 mb-1">
                                    <span className="font-medium">Visão:</span> {section.vision}
                                  </p>
                                )}
                                {section.values && section.values.length > 0 && (
                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium">Valores:</span> {section.values.length} item(s)
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditAbout(section)}
                                data-testid={`btn-edit-section-${section.id}`}
                              >
                                <Edit size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja eliminar esta seção?")) {
                                    deleteAboutMutation.mutate(section.id);
                                  }
                                }}
                                data-testid={`btn-delete-section-${section.id}`}
                              >
                                <Trash2 size={18} className="text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
