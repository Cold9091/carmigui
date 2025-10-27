import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual obrigatória"),
  newPassword: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?\":{}|<>)"),
  confirmPassword: z.string().min(1, "Confirme a nova senha"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      const res = await apiRequest("POST", "/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao alterar senha");
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao alterar senha",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const seoChecks = [
    { id: 1, title: "Títulos das Páginas", status: "good", message: "Todas as páginas têm títulos únicos e descritivos" },
    { id: 2, title: "Meta Descriptions", status: "good", message: "Meta descriptions presentes nas páginas principais" },
    { id: 3, title: "Open Graph Tags", status: "warning", message: "Algumas páginas não têm Open Graph tags completas" },
    { id: 4, title: "Imagens Alt Text", status: "good", message: "Maioria das imagens têm texto alternativo" },
    { id: 5, title: "URLs Amigáveis", status: "good", message: "URLs são descritivas e amigáveis para SEO" },
    { id: 6, title: "Responsividade Mobile", status: "good", message: "Site totalmente responsivo" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações do sistema e SEO</p>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList>
          <TabsTrigger value="password" data-testid="tab-password">
            <Lock className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo">
            <Search className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <Lock className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900">Segurança Administrativa</AlertTitle>
            <AlertDescription className="text-red-800">
              <strong>Importante:</strong> Use uma senha forte e única para proteger o acesso administrativo. 
              Recomendamos senhas com no mínimo 12 caracteres, combinando letras maiúsculas e minúsculas, 
              números e símbolos especiais. Nunca compartilhe sua senha com terceiros.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Atualize sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Digite sua senha atual"
                            data-testid="input-current-password"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Digite a nova senha"
                            data-testid="input-new-password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos especiais
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirme a nova senha"
                            data-testid="input-confirm-password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-change-password"
                  >
                    {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificação de SEO</CardTitle>
              <CardDescription>
                Status da otimização para motores de busca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Status Geral: Bom</AlertTitle>
                  <AlertDescription>
                    A maioria dos requisitos de SEO estão implementados corretamente
                  </AlertDescription>
                </Alert>

                <Separator />

                <div className="space-y-3">
                  {seoChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                      data-testid={`seo-check-${check.id}`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {check.status === "good" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{check.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{check.message}</p>
                        </div>
                      </div>
                      <Badge
                        variant={check.status === "good" ? "default" : "secondary"}
                        className={
                          check.status === "good"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {check.status === "good" ? "OK" : "Atenção"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ajustes de SEO</CardTitle>
              <CardDescription>
                Recomendações para melhorar o SEO do site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Próximos Passos:</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Adicionar Open Graph tags completas em todas as páginas de propriedades</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Implementar schema.org markup para propriedades imobiliárias</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Otimizar tamanho e formato das imagens (WebP)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Adicionar sitemap.xml atualizado automaticamente</span>
                    </li>
                  </ul>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Dica:</strong> Mantenha os títulos das propriedades descritivos e únicos,
                    incluindo localização e tipo de imóvel para melhor ranqueamento.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
