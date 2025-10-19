import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import type { Condominium, InsertCondominium } from "@shared/schema";
import { insertCondominiumSchema } from "@shared/schema";

interface CondominiumFormProps {
  condominium?: Condominium | null;
  onSuccess?: () => void;
}

export default function CondominiumForm({ condominium, onSuccess }: CondominiumFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCondominium>({
    resolver: zodResolver(insertCondominiumSchema),
    defaultValues: {
      name: condominium?.name || "",
      description: condominium?.description || "",
      location: condominium?.location || "",
      centralityOrDistrict: condominium?.centralityOrDistrict || "",
      totalUnits: condominium?.totalUnits || 0,
      completedUnits: condominium?.completedUnits || 0,
      availableUnits: condominium?.availableUnits || 0,
      developmentYear: condominium?.developmentYear || "",
      status: condominium?.status || "in-development",
      images: condominium?.images || [],
      amenities: condominium?.amenities || [],
      featured: condominium?.featured || false,
      paymentType: condominium?.paymentType || "preco_fixo",
      price: condominium?.price || "",
      downPayment: condominium?.downPayment || "",
      paymentPeriod: condominium?.paymentPeriod || "",
      houseCondition: condominium?.houseCondition || "",
    },
  });

  const condominiumMutation = useMutation({
    mutationFn: async (data: InsertCondominium) => {
      if (condominium) {
        await apiRequest("PUT", `/api/condominiums/${condominium.id}`, data);
      } else {
        await apiRequest("POST", "/api/condominiums", data);
      }
    },
    onSuccess: () => {
      toast({
        title: condominium ? "Condomínio atualizado!" : "Condomínio criado!",
        description: condominium 
          ? "O condomínio foi atualizado com sucesso." 
          : "O novo condomínio foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/condominiums"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Erro ao guardar",
        description: "Ocorreu um erro ao guardar o condomínio. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error saving condominium:", error);
    },
  });

  const onSubmit = (data: InsertCondominium) => {
    condominiumMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Condomínio *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Condomínio Miramar" {...field} data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Talatona, Luanda" {...field} data-testid="input-location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="centralityOrDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centralidade/Distrito *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Centralidade do Kilamba" {...field} data-testid="input-centrality" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalUnits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de Unidades *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 120" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    data-testid="input-total-units"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completedUnits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidades Concluídas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 75" 
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    data-testid="input-completed-units"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableUnits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidades Disponíveis *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 45" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    data-testid="input-available-units"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="developmentYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano de Desenvolvimento *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2024" {...field} data-testid="input-development-year" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">Planeamento</SelectItem>
                    <SelectItem value="in-development">Em Desenvolvimento</SelectItem>
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
              <FormItem className="flex items-center justify-between">
                <FormLabel>Destacar Condomínio</FormLabel>
                <FormControl>
                  <Switch 
                    checked={field.value || false} 
                    onCheckedChange={field.onChange}
                    data-testid="switch-featured"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as características principais do condomínio..."
                  className="min-h-[100px]"
                  {...field}
                  data-testid="textarea-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comodidades</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Piscina, Ginásio, Segurança 24h, Parque infantil (separar por vírgulas)"
                  value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const array = value ? value.split(",").map(item => item.trim()).filter(item => item.length > 0) : [];
                    field.onChange(array);
                  }}
                  data-testid="textarea-amenities"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs das Imagens</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Cole as URLs das imagens (uma por linha ou separadas por vírgulas)"
                  value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const array = value ? value.split(",").map(url => url.trim()).filter(url => url.length > 0) : [];
                    field.onChange(array);
                  }}
                  data-testid="textarea-images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Informações de Venda</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Modalidade de Pagamento *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "preco_fixo"}>
                    <FormControl>
                      <SelectTrigger data-testid="select-payment-type">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="preco_fixo">Preço Fixo</SelectItem>
                      <SelectItem value="parcelado">Parcelado (Com Entrada)</SelectItem>
                      <SelectItem value="customizado">Customizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("paymentType") === "preco_fixo" ? "Preço Fixo *" : "Valor Total *"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 8.500.000 Kz"
                      {...field}
                      data-testid="input-price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("paymentType") !== "preco_fixo" && (
              <>
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Entrada</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 4.000.000 Kz"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-down-payment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Amortização</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Até 6 meses com total tranquilidade"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-payment-period"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="houseCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condição da Casa</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-house-condition">
                        <SelectValue placeholder="Selecione a condição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inacabada">Casa Inacabada</SelectItem>
                      <SelectItem value="construida">Totalmente Construída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={condominiumMutation.isPending}
            className="btn-primary"
            data-testid="btn-save-condominium"
          >
            {condominiumMutation.isPending ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                {condominium ? "Atualizar Condomínio" : "Criar Condomínio"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
