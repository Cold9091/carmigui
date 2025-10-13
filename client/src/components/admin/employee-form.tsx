import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertEmployeeSchema, type Employee } from "@shared/schema";
import { z } from "zod";

const employeeFormSchema = insertEmployeeSchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  position: z.string().min(1, "Cargo é obrigatório"),
  department: z.enum(["imobiliario", "construtora"]),
  bio: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  imageUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  displayOrder: z.coerce.number().min(0, "Ordem deve ser 0 ou maior").optional(),
  active: z.boolean().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  employee?: Employee | null;
  onSuccess?: () => void;
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.name || "",
      position: employee?.position || "",
      department: employee?.department || "imobiliario",
      bio: employee?.bio || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      imageUrl: employee?.imageUrl || "",
      displayOrder: employee?.displayOrder || 0,
      active: employee?.active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EmployeeFormValues) => {
      if (employee?.id) {
        return await apiRequest("PUT", `/api/employees/${employee.id}`, data);
      } else {
        return await apiRequest("POST", "/api/employees", data);
      }
    },
    onSuccess: () => {
      toast({
        title: employee ? "Funcionário atualizado" : "Funcionário criado",
        description: employee 
          ? "O funcionário foi atualizado com sucesso." 
          : "O funcionário foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o funcionário.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome completo do funcionário"
                  data-testid="input-employee-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Diretor, Gerente, Consultor"
                  data-testid="input-employee-position"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-employee-department">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="imobiliario">Imobiliário</SelectItem>
                  <SelectItem value="construtora">Construtora</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Breve descrição sobre o funcionário..."
                  rows={3}
                  data-testid="textarea-employee-bio"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@exemplo.com"
                  data-testid="input-employee-email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="+244 900 000 000"
                  data-testid="input-employee-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Foto (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://images.unsplash.com/..."
                  data-testid="input-employee-image"
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2">
                  <img
                    src={field.value}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-employee-order"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Funcionário Ativo</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Funcionário será exibido na página Sobre Nós
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-employee-active"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            className="btn-primary"
            disabled={mutation.isPending}
            data-testid="btn-submit-employee"
          >
            {mutation.isPending ? "Salvando..." : employee ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
