import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPropertySchema } from "@shared/schema";
import { Save } from "lucide-react";
import type { Property, InsertProperty, PropertyCategory, City } from "@shared/schema";

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
}

export default function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price || "",
      cityId: property?.cityId || undefined,
      categoryId: property?.categoryId || undefined,
      bedrooms: property?.bedrooms || undefined,
      bathrooms: property?.bathrooms || undefined,
      area: property?.area || 0,
      images: property?.images || [],
      virtualTourUrl: property?.virtualTourUrl || "",
      status: property?.status || "available",
      featured: property?.featured || false,
    },
  });

  const propertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      if (property) {
        await apiRequest("PUT", `/api/properties/${property.id}`, data);
      } else {
        await apiRequest("POST", "/api/properties", data);
      }
    },
    onSuccess: () => {
      toast({
        title: property ? "Imóvel atualizado!" : "Imóvel criado!",
        description: property 
          ? "O imóvel foi atualizado com sucesso." 
          : "O novo imóvel foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      onSuccess?.();
    },
    onError: async (error: any) => {
      let errorMessage = "Ocorreu um erro ao guardar o imóvel. Tente novamente.";
      
      if (error?.response) {
        try {
          const errorData = await error.response.json();
          if (errorData.errors && errorData.errors.length > 0) {
            const validationErrors = errorData.errors.map((err: any) => 
              `${err.path.join('.')}: ${err.message}`
            ).join(', ');
            errorMessage = `Erro de validação: ${validationErrors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
      }
      
      toast({
        title: "Erro ao guardar",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error saving property:", error);
    },
  });

  const onSubmit = (data: InsertProperty) => {
    // Convert string inputs to numbers where needed
    const processedData = {
      ...data,
      price: data.price.toString(),
      area: Number(data.area),
      bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
      categoryId: data.categoryId || undefined,
      cityId: data.cityId || undefined,
      images: typeof data.images === "string" 
        ? (data.images as string).split(",").map((url: string) => url.trim()).filter((url: string) => url.length > 0)
        : (data.images as string[]) || [],
    };
    
    propertyMutation.mutate(processedData as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Apartamento T3 Luxuoso"
                    {...field}
                    data-testid="input-property-title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-property-category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as características do imóvel..."
                  rows={4}
                  {...field}
                  data-testid="textarea-property-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (Kz)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="150000000"
                    {...field}
                    data-testid="input-property-price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-property-city">
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (m²)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="120"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    data-testid="input-property-area"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartos</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="3"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    data-testid="input-property-bedrooms"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casas de Banho</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="2"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    data-testid="input-property-bathrooms"
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
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-property-status">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="rented">Arrendado</SelectItem>
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
                    data-testid="checkbox-property-featured"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Imóvel em Destaque
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Este imóvel será exibido na página inicial
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
              <FormLabel>Imagens do Imóvel</FormLabel>
              <FormControl>
                <ImageUpload
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                  maxImages={10}
                  disabled={propertyMutation.isPending}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Faça upload das imagens do imóvel (máximo 10 imagens, até 5MB cada)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="virtualTourUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Visita Virtual (3D)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: https://tour.example.com/property123"
                  {...field}
                  value={field.value ?? ""}
                  data-testid="input-property-virtual-tour"
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Adicione o link para tour virtual ou vídeo 360° do imóvel
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            className="btn-primary flex-1"
            disabled={propertyMutation.isPending}
            data-testid="btn-save-property"
          >
            {propertyMutation.isPending ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                {property ? "Atualizar Imóvel" : "Criar Imóvel"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
