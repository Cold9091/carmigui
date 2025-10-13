import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCitySchema, type City } from "@shared/schema";
import { z } from "zod";

const cityFormSchema = insertCitySchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  imageUrl: z.string().url("URL da imagem inválida"),
  displayOrder: z.coerce.number().min(0, "Ordem deve ser 0 ou maior").optional(),
  active: z.boolean().optional(),
});

type CityFormValues = z.infer<typeof cityFormSchema>;

interface CityFormProps {
  city?: City | null;
  onSuccess?: () => void;
}

export default function CityForm({ city, onSuccess }: CityFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: city?.name || "",
      slug: city?.slug || "",
      imageUrl: city?.imageUrl || "",
      displayOrder: city?.displayOrder || 0,
      active: city?.active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CityFormValues) => {
      if (city?.id) {
        return await apiRequest("PUT", `/api/cities/${city.id}`, data);
      } else {
        return await apiRequest("POST", "/api/cities", data);
      }
    },
    onSuccess: () => {
      toast({
        title: city ? "Cidade atualizada" : "Cidade criada",
        description: city 
          ? "A cidade foi atualizada com sucesso." 
          : "A cidade foi criada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a cidade.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CityFormValues) => {
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
              <FormLabel>Nome da Cidade</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Luanda, Benguela, Huambo"
                  data-testid="input-city-name"
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
                    placeholder="Ex: luanda, benguela, huambo"
                    data-testid="input-city-slug"
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
                  data-testid="input-city-image"
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
                  data-testid="input-city-order"
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
                <FormLabel className="text-base">Cidade Ativa</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Cidade será exibida na seção "O melhor de cada cidade"
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-city-active"
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
            data-testid="btn-submit-city"
          >
            {mutation.isPending ? "Salvando..." : city ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
