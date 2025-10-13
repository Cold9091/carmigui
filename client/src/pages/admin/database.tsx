import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Database, Server, Settings, CheckCircle, AlertCircle, Info, ExternalLink, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DatabaseStatus {
  type: string;
  connected: boolean;
  file?: string;
  url?: string;
  tables?: number;
  lastConnection?: string;
}

interface SupabaseConfig {
  configured: boolean;
  supabaseUrl: string | null;
  hasDatabaseUrl: boolean;
}

export default function AdminDatabasePage() {
  const { toast } = useToast();
  const [isSupabaseDialogOpen, setIsSupabaseDialogOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState({
    supabaseUrl: "",
    supabaseAnonKey: "",
    databaseUrl: "",
  });
  
  // Fetch database status
  const { data: dbStatus, isLoading: statusLoading, refetch } = useQuery<DatabaseStatus>({
    queryKey: ["/api/database/status"],
  });

  // Fetch current Supabase config
  const { data: currentConfig } = useQuery<SupabaseConfig>({
    queryKey: ["/api/database/supabase-config"],
  });

  const getDatabaseTypeBadge = (type: string) => {
    switch (type) {
      case "sqlite":
        return <Badge className="bg-blue-100 text-blue-800">SQLite (Local)</Badge>;
      case "neon":
        return <Badge className="bg-green-100 text-green-800">PostgreSQL (Neon)</Badge>;
      case "supabase":
        return <Badge className="bg-purple-100 text-purple-800">Supabase</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getConnectionIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="text-green-600" size={20} />
    ) : (
      <AlertCircle className="text-red-600" size={20} />
    );
  };

  const handleTestConnection = async () => {
    try {
      await apiRequest("POST", "/api/database/test");
      toast({
        title: "Conexão testada",
        description: "A conexão com o banco de dados está funcionando corretamente.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao banco de dados.",
        variant: "destructive",
      });
    }
  };

  // Mutation to test Supabase credentials
  const testSupabaseMutation = useMutation({
    mutationFn: async (config: typeof supabaseConfig) => {
      return await apiRequest("POST", "/api/database/test-supabase", config);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Teste bem-sucedido!",
        description: data.message || "Credenciais do Supabase validadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no teste",
        description: error.message || "Falha ao testar as credenciais do Supabase.",
        variant: "destructive",
      });
    },
  });

  // Mutation to save Supabase configuration
  const configureSupabaseMutation = useMutation({
    mutationFn: async (config: typeof supabaseConfig) => {
      return await apiRequest("POST", "/api/database/configure-supabase", config);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Configuração salva!",
        description: data.message || "Supabase configurado com sucesso.",
      });
      setIsSupabaseDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/database/supabase-config"] });
      queryClient.invalidateQueries({ queryKey: ["/api/database/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Falha ao salvar as configurações do Supabase.",
        variant: "destructive",
      });
    },
  });

  const handleMigrateToSupabase = () => {
    setIsSupabaseDialogOpen(true);
  };

  const handleTestSupabase = () => {
    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey || !supabaseConfig.databaseUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de testar.",
        variant: "destructive",
      });
      return;
    }
    testSupabaseMutation.mutate(supabaseConfig);
  };

  const handleSaveSupabase = () => {
    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey || !supabaseConfig.databaseUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    configureSupabaseMutation.mutate(supabaseConfig);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão do Banco de Dados</h1>
            <p className="text-gray-600">Monitorizar e gerir a configuração do banco de dados</p>
          </div>
        </div>

        {/* Status da Conexão */}
        <Card data-testid="database-status-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : dbStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getConnectionIcon(dbStatus.connected)}
                    <span className="font-semibold">Estado da Conexão:</span>
                    <span>{dbStatus.connected ? "Conectado" : "Desconectado"}</span>
                  </div>
                  {getDatabaseTypeBadge(dbStatus.type)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Tipo de Banco:</span>
                    <p className="text-gray-600">{dbStatus.type.toUpperCase()}</p>
                  </div>
                  
                  {dbStatus.file && (
                    <div>
                      <span className="font-semibold">Arquivo Local:</span>
                      <p className="text-gray-600 font-mono text-sm">{dbStatus.file}</p>
                    </div>
                  )}
                  
                  {dbStatus.url && (
                    <div>
                      <span className="font-semibold">Status URL:</span>
                      <p className="text-gray-600">{dbStatus.url}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    data-testid="btn-test-connection"
                  >
                    <Settings className="mr-2" size={16} />
                    Testar Conexão
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-red-600">Erro ao carregar status do banco de dados</p>
            )}
          </CardContent>
        </Card>

        {/* Configurações de Migração */}
        <Card data-testid="migration-settings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} />
              Migração para Supabase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info size={16} />
                <AlertDescription>
                  O sistema atualmente está configurado para usar {dbStatus?.type.toUpperCase() || 'SQLite'} para desenvolvimento. 
                  Quando estiver pronto para produção, pode migrar facilmente para Supabase.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleMigrateToSupabase}
                  data-testid="btn-setup-supabase"
                >
                  <Database className="mr-2" size={16} />
                  Configurar Supabase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Técnicas */}
        <Card data-testid="technical-info-card">
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ambiente:</span>
                <span className="font-mono">Development</span>
              </div>
              <div className="flex justify-between">
                <span>Configuração Automática:</span>
                <span className="text-green-600">Ativa</span>
              </div>
              <div className="flex justify-between">
                <span>Fallback para SQLite:</span>
                <span className="text-green-600">Configurado</span>
              </div>
              <div className="flex justify-between">
                <span>Suporte Supabase:</span>
                <span className="text-blue-600">Preparado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Configuration Dialog */}
      <Dialog open={isSupabaseDialogOpen} onOpenChange={setIsSupabaseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="text-purple-600" />
              Configurar Supabase
            </DialogTitle>
            <DialogDescription>
              Configure as credenciais do Supabase para migrar seu banco de dados
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="instructions">Instruções</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {currentConfig?.configured && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Supabase já está configurado. Você pode atualizar as credenciais abaixo.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase Project URL</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://seu-projeto.supabase.co"
                    value={supabaseConfig.supabaseUrl}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, supabaseUrl: e.target.value })}
                    data-testid="input-supabase-url"
                  />
                  <p className="text-xs text-gray-500">
                    URL do seu projeto no Supabase (Settings → API → Project URL)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
                  <Input
                    id="supabase-anon-key"
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseConfig.supabaseAnonKey}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, supabaseAnonKey: e.target.value })}
                    data-testid="input-supabase-anon-key"
                  />
                  <p className="text-xs text-gray-500">
                    Chave pública do Supabase (Settings → API → anon/public key)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="database-url">Database URL (Connection String)</Label>
                  <Input
                    id="database-url"
                    type="password"
                    placeholder="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
                    value={supabaseConfig.databaseUrl}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, databaseUrl: e.target.value })}
                    data-testid="input-database-url"
                  />
                  <p className="text-xs text-gray-500">
                    String de conexão PostgreSQL (Settings → Database → Connection string → URI)
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Em produção, configure estas variáveis diretamente nos Secrets do Replit ou no seu provedor de hospedagem.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    1. Criar Projeto no Supabase
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center gap-1">
                      supabase.com <ExternalLink className="h-3 w-3" />
                    </a> e crie uma conta gratuita
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Clique em "Start your project"</li>
                    <li>Escolha um nome para o projeto</li>
                    <li>Defina uma senha segura para o banco de dados</li>
                    <li>Escolha a região mais próxima (ex: São Paulo)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    2. Obter Credenciais
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    No painel do Supabase, vá para Settings → API:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li><strong>Project URL:</strong> Copie a URL do projeto</li>
                    <li><strong>anon/public key:</strong> Copie a chave pública</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2 mb-2">
                    Depois vá para Settings → Database:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li><strong>Connection string → URI:</strong> Copie a string de conexão</li>
                    <li>Substitua [YOUR-PASSWORD] pela senha do banco de dados</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    3. Migrar Dados
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Após configurar o Supabase:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Execute <code className="bg-gray-100 px-2 py-1 rounded">npm run db:push</code> para criar as tabelas</li>
                    <li>Exporte seus dados atuais se necessário</li>
                    <li>Importe os dados no Supabase</li>
                    <li>Reinicie a aplicação para usar o novo banco</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    4. Schema do Banco de Dados
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Seu projeto usa as seguintes tabelas:
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    <ul className="space-y-1">
                      <li>✓ properties (imóveis)</li>
                      <li>✓ projects (projetos)</li>
                      <li>✓ contacts (contactos)</li>
                      <li>✓ condominiums (condomínios)</li>
                      <li>✓ property_categories (categorias)</li>
                      <li>✓ hero_settings (configurações hero)</li>
                      <li>✓ cities (cidades)</li>
                      <li>✓ about_us (sobre nós)</li>
                      <li>✓ employees (funcionários)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSupabaseDialogOpen(false)}
              data-testid="btn-cancel-supabase"
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={handleTestSupabase}
              disabled={testSupabaseMutation.isPending}
              data-testid="btn-test-supabase"
            >
              {testSupabaseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>
            <Button
              onClick={handleSaveSupabase}
              disabled={configureSupabaseMutation.isPending}
              data-testid="btn-save-supabase"
            >
              {configureSupabaseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Salvar Configuração
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}