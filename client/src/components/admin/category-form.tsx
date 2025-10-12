import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPropertyCategorySchema, type PropertyCategory } from "@shared/schema";
import { z } from "zod";

const categoryFormSchema = insertPropertyCategorySchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  imageUrl: z.string().url("URL da imagem inválida"),
  displayOrder: z.number().min(0, "Ordem deve ser 0 ou maior").optional(),
  active: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: PropertyCategory | null;
  onSuccess?: () => void;
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      imageUrl: category?.imageUrl || "",
      displayOrder: category?.displayOrder || 0,
      active: category?.active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      if (category?.id) {
        return await apiRequest("PUT", `/api/property-categories/${category.id}`, data);
      } else {
        return await apiRequest("POST", "/api/property-categories", data);
      }
    },
    onSuccess: () => {
      toast({
        title: category ? "Categoria atualizada" : "Categoria criada",
        description: category 
          ? "A categoria foi atualizada com sucesso." 
          : "A categoria foi criada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/property-categories"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Casa, Loft, Fazenda"
                  data-testid="input-category-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL amigável)</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: casa, loft, fazenda"
                    data-testid="input-category-slug"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  data-testid="btn-generate-slug"
                >
                  Gerar
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://images.unsplash.com/..."
                  data-testid="input-category-image"
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2">
                  <img
                    src={field.value}
                    alt="Preview"
                    className="h-32 w-48 object-cover rounded-lg"
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
                  data-testid="input-category-order"
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
                <FormLabel className="text-base">Categoria Ativa</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Categoria será exibida na página inicial
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-category-active"
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
            data-testid="btn-submit-category"
          >
            {mutation.isPending ? "Salvando..." : category ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
