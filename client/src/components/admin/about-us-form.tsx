import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAboutUsSchema, type AboutUs } from "@shared/schema";
import { z } from "zod";
import { X } from "lucide-react";
import { useState } from "react";

const aboutUsFormSchema = insertAboutUsSchema.extend({
  companyType: z.enum(["imobiliario", "construtora"]),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  mission: z.string().optional(),
  vision: z.string().optional(),
  displayOrder: z.coerce.number().min(0, "Ordem deve ser 0 ou maior").optional(),
});

type AboutUsFormValues = z.infer<typeof aboutUsFormSchema>;

interface AboutUsFormProps {
  aboutUs?: AboutUs | null;
  onSuccess?: () => void;
}

export default function AboutUsForm({ aboutUs, onSuccess }: AboutUsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newValue, setNewValue] = useState("");
  const [newImage, setNewImage] = useState("");

  const form = useForm<AboutUsFormValues>({
    resolver: zodResolver(aboutUsFormSchema),
    defaultValues: {
      companyType: aboutUs?.companyType || "imobiliario",
      title: aboutUs?.title || "",
      description: aboutUs?.description || "",
      mission: aboutUs?.mission || "",
      vision: aboutUs?.vision || "",
      values: aboutUs?.values || [],
      images: aboutUs?.images || [],
      displayOrder: aboutUs?.displayOrder || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AboutUsFormValues) => {
      if (aboutUs?.id) {
        return await apiRequest("PUT", `/api/about-us/${aboutUs.id}`, data);
      } else {
        return await apiRequest("POST", "/api/about-us", data);
      }
    },
    onSuccess: () => {
      toast({
        title: aboutUs ? "Seção atualizada" : "Seção criada",
        description: aboutUs 
          ? "A seção foi atualizada com sucesso." 
          : "A seção foi criada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/about-us"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a seção.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AboutUsFormValues) => {
    mutation.mutate(data);
  };

  const addValue = () => {
    if (newValue.trim()) {
      const currentValues = form.getValues("values") || [];
      form.setValue("values", [...currentValues, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    const currentValues = form.getValues("values") || [];
    form.setValue("values", currentValues.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const values = form.watch("values") || [];
  const images = form.watch("images") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Empresa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-company-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="imobiliario">Carmigui Imobiliário</SelectItem>
                  <SelectItem value="construtora">Carmigui Construtora</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Carmigui Imobiliário"
                  data-testid="input-about-title"
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
                  {...field}
                  placeholder="Descrição da empresa..."
                  rows={4}
                  data-testid="textarea-about-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Missão (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Nossa missão..."
                  rows={3}
                  data-testid="textarea-about-mission"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visão (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Nossa visão..."
                  rows={3}
                  data-testid="textarea-about-vision"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Valores</FormLabel>
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Adicionar valor..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
              data-testid="input-new-about-value"
            />
            <Button type="button" onClick={addValue} data-testid="btn-add-about-value">
              Adicionar
            </Button>
          </div>
          {values.length > 0 && (
            <div className="space-y-2 mt-2">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1">{value}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeValue(index)}
                    data-testid={`btn-remove-about-value-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <FormLabel>Imagens</FormLabel>
          <div className="flex gap-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="URL da imagem..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              data-testid="input-new-about-image"
            />
            <Button type="button" onClick={addImage} data-testid="btn-add-about-image">
              Adicionar
            </Button>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeImage(index)}
                    data-testid={`btn-remove-about-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  data-testid="input-about-order"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            className="btn-primary"
            disabled={mutation.isPending}
            data-testid="btn-submit-about"
          >
            {mutation.isPending ? "Salvando..." : aboutUs ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
