import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProjectSchema } from "@shared/schema";
import { Save } from "lucide-react";
import type { Project, InsertProject } from "@shared/schema";

interface ProjectFormProps {
  project?: Project | null;
  onSuccess?: () => void;
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      area: project?.area || 0,
      duration: project?.duration || "",
      units: project?.units || "",
      year: project?.year || "",
      status: project?.status || "planning",
      images: project?.images || [],
      featured: project?.featured || false,
    },
  });

  const projectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      if (project) {
        await apiRequest("PUT", `/api/projects/${project.id}`, data);
      } else {
        await apiRequest("POST", "/api/projects", data);
      }
    },
    onSuccess: () => {
      toast({
        title: project ? "Projeto atualizado!" : "Projeto criado!",
        description: project 
          ? "O projeto foi atualizado com sucesso." 
          : "O novo projeto foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Erro ao guardar",
        description: "Ocorreu um erro ao guardar o projeto. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error saving project:", error);
    },
  });

  const onSubmit = (data: InsertProject) => {
    // Convert string inputs to numbers where needed
    const processedData = {
      ...data,
      area: Number(data.area),
      images: Array.isArray(data.images) ? data.images : [],
    };
    
    projectMutation.mutate(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Projeto</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Complexo Residencial Talatona"
                  {...field}
                  data-testid="input-project-title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o projeto de construção..."
                  rows={4}
                  {...field}
                  data-testid="textarea-project-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Total (m²)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="15000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    data-testid="input-project-area"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 18 meses"
                    {...field}
                    data-testid="input-project-duration"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidades</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 150 apartamentos"
                    {...field}
                    data-testid="input-project-units"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 2023"
                    {...field}
                    data-testid="input-project-year"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado do Projeto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-project-status">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">Planeamento</SelectItem>
                    <SelectItem value="in-progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-project-featured"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Projeto em Destaque
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Este projeto será exibido na página inicial
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagens do Projeto</FormLabel>
              <FormControl>
                <ImageUpload
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                  maxImages={10}
                  disabled={projectMutation.isPending}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Faça upload das imagens do projeto (máximo 10 imagens, até 5MB cada)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            className="btn-primary flex-1"
            disabled={projectMutation.isPending}
            data-testid="btn-save-project"
          >
            {projectMutation.isPending ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                {project ? "Atualizar Projeto" : "Criar Projeto"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
