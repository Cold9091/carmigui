import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Image as ImageIcon, Save } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { ImageUpload } from "@/components/ui/image-upload";
import type { HeroSettings, InsertHeroSettings } from "@shared/schema";
import { insertHeroSettingsSchema } from "@shared/schema";

export default function AdminHeroPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: heroSettings, isLoading } = useQuery<HeroSettings | null>({
    queryKey: ["/api/admin/hero-settings"],
  });

  const form = useForm<InsertHeroSettings>({
    resolver: zodResolver(insertHeroSettingsSchema),
    defaultValues: {
      images: [],
      titleLine1: "BEM-VINDO",
      titleLine2: "AO SEU NOVO",
      titleLine3: "COMEÇO !",
      description: "Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.",
      carouselEnabled: false,
      carouselInterval: 5000,
      active: true,
    },
  });

  useEffect(() => {
    if (heroSettings) {
      form.reset({
        images: heroSettings.images || [],
        titleLine1: heroSettings.titleLine1,
        titleLine2: heroSettings.titleLine2,
        titleLine3: heroSettings.titleLine3,
        description: heroSettings.description,
        carouselEnabled: heroSettings.carouselEnabled,
        carouselInterval: heroSettings.carouselInterval,
        active: heroSettings.active,
      });
      setIsEditing(true);
    }
  }, [heroSettings, form]);

  const saveHeroMutation = useMutation({
    mutationFn: async (data: InsertHeroSettings) => {
      if (isEditing && heroSettings?.id) {
        return await apiRequest("PUT", `/api/hero-settings/${heroSettings.id}`, data);
      } else {
        return await apiRequest("POST", "/api/hero-settings", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Hero atualizado",
        description: "As configurações do Hero foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-settings"] });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações do Hero.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHeroSettings) => {
    saveHeroMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão do Hero</h1>
          <p className="text-gray-600">Configure a imagem e texto do banner principal da página inicial</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon size={20} />
                  Imagens do Hero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagens do Banner</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          maxImages={10}
                        />
                      </FormControl>
                      <FormDescription>
                        Adicione uma ou mais imagens para o hero. Use múltiplas imagens para ativar o carrossel.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carouselEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativar Carrossel</FormLabel>
                        <FormDescription>
                          Ative para exibir as imagens em rotação automática
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                          data-testid="switch-carousel"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("carouselEnabled") && (
                  <FormField
                    control={form.control}
                    name="carouselInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervalo do Carrossel (ms)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? 5000}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min={1000}
                            step={500}
                            data-testid="input-carousel-interval"
                          />
                        </FormControl>
                        <FormDescription>
                          Tempo em milissegundos entre cada troca de imagem (padrão: 5000ms = 5 segundos)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Texto do Hero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título - Linha 1</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-title-line-1" />
                      </FormControl>
                      <FormDescription>
                        Primeira linha do título (cor laranja)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título - Linha 2</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-title-line-2" />
                      </FormControl>
                      <FormDescription>
                        Segunda linha do título (cor branca)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleLine3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título - Linha 3</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-title-line-3" />
                      </FormControl>
                      <FormDescription>
                        Terceira linha do título (cor branca)
                      </FormDescription>
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
                          rows={4}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Texto descritivo exibido abaixo do título
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button 
                type="submit" 
                className="btn-primary"
                disabled={saveHeroMutation.isPending}
                data-testid="btn-save-hero"
              >
                <Save className="mr-2" size={20} />
                {saveHeroMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
