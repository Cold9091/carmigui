import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Database, Settings, CheckCircle, AlertCircle, Info, ExternalLink, Loader2, ArrowRight } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

interface DatabaseStatus {
  type: string;
  connected: boolean;
  file?: string;
  url?: string;
}

interface TursoConfig {
  configured: boolean;
  databaseUrl: string | null;
}

export default function AdminDatabasePage() {
  const { toast } = useToast();
  const [isTursoDialogOpen, setIsTursoDialogOpen] = useState(false);
  const [tursoConfig, setTursoConfig] = useState({
    databaseUrl: "",
    authToken: "",
  });
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState("");
  
  const { data: dbStatus, isLoading: statusLoading, refetch } = useQuery<DatabaseStatus>({
    queryKey: ["/api/database/status"],
  });

  const { data: currentTursoConfig } = useQuery<TursoConfig>({
    queryKey: ["/api/database/turso-config"],
  });

  const getDatabaseTypeBadge = (type: string) => {
    switch (type) {
      case "sqlite":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">SQLite (Local)</Badge>;
      case "turso":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Turso (Cloud)</Badge>;
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

  const testTursoMutation = useMutation({
    mutationFn: async (config: typeof tursoConfig) => {
      return await apiRequest("POST", "/api/database/test-turso", config);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Teste bem-sucedido!",
        description: data.message || "Credenciais do Turso validadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no teste",
        description: error.message || "Falha ao testar as credenciais do Turso.",
        variant: "destructive",
      });
    },
  });

  const configureTursoMutation = useMutation({
    mutationFn: async (config: typeof tursoConfig) => {
      return await apiRequest("POST", "/api/database/configure-turso", config);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Configuração salva!",
        description: data.message || "Turso configurado com sucesso.",
      });
      setIsTursoDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/database/turso-config"] });
      queryClient.invalidateQueries({ queryKey: ["/api/database/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Falha ao salvar as configurações do Turso.",
        variant: "destructive",
      });
    },
  });

  const migrateTursoMutation = useMutation({
    mutationFn: async (config: typeof tursoConfig) => {
      setMigrationProgress(10);
      setMigrationStatus("Conectando ao Turso...");
      
      const result = await apiRequest("POST", "/api/database/migrate-to-turso", config);
      
      setMigrationProgress(100);
      setMigrationStatus("Migração concluída!");
      
      return result;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Migração concluída!",
        description: `${data.details.totalRecords} registros migrados com sucesso.`,
      });
      setTimeout(() => {
        setMigrationProgress(0);
        setMigrationStatus("");
        setIsTursoDialogOpen(false);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na migração",
        description: error.message || "Falha ao migrar dados para o Turso.",
        variant: "destructive",
      });
      setMigrationProgress(0);
      setMigrationStatus("");
    },
  });

  const handleTestTurso = () => {
    if (!tursoConfig.databaseUrl || !tursoConfig.authToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de testar.",
        variant: "destructive",
      });
      return;
    }
    testTursoMutation.mutate(tursoConfig);
  };

  const handleSaveTurso = () => {
    if (!tursoConfig.databaseUrl || !tursoConfig.authToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    configureTursoMutation.mutate(tursoConfig);
  };

  const handleMigrateTurso = () => {
    if (!tursoConfig.databaseUrl || !tursoConfig.authToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de migrar.",
        variant: "destructive",
      });
      return;
    }
    
    if (window.confirm("Tem certeza que deseja migrar todos os dados do SQLite para o Turso? Esta ação irá copiar todos os registros.")) {
      migrateTursoMutation.mutate(tursoConfig);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-angola-primary mb-2">Gestão do Banco de Dados</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitorizar e gerir a configuração do banco de dados</p>
          </div>
        </div>

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
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
                    <p className="text-gray-600 dark:text-gray-400">{dbStatus.type.toUpperCase()}</p>
                  </div>
                  
                  {dbStatus.file && (
                    <div>
                      <span className="font-semibold">Arquivo Local:</span>
                      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">{dbStatus.file}</p>
                    </div>
                  )}
                  
                  {dbStatus.url && (
                    <div>
                      <span className="font-semibold">Status URL:</span>
                      <p className="text-gray-600 dark:text-gray-400">{dbStatus.url}</p>
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

        <Card data-testid="turso-config-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="text-purple-600" size={20} />
              Configuração Turso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTursoConfig?.configured ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Turso já está configurado. Você pode atualizar as credenciais ou migrar dados.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <Info size={16} />
                  <AlertDescription>
                    Configure o Turso para usar um banco de dados SQLite distribuído na cloud, ideal para produção.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant={currentTursoConfig?.configured ? "outline" : "default"}
                  onClick={() => setIsTursoDialogOpen(true)}
                  data-testid="btn-configure-turso"
                >
                  <Database className="mr-2" size={16} />
                  {currentTursoConfig?.configured ? "Reconfigurar Turso" : "Configurar Turso"}
                </Button>
                
                {dbStatus?.type === "sqlite" && (
                  <Button
                    variant="outline"
                    onClick={() => setIsTursoDialogOpen(true)}
                    data-testid="btn-migrate-to-turso"
                  >
                    <ArrowRight className="mr-2" size={16} />
                    Migrar para Turso
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="database-info-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={20} />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info size={16} />
                <AlertDescription>
                  O sistema está atualmente configurado para usar <strong>{dbStatus?.type.toUpperCase() || 'SQLite'}</strong> como banco de dados.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">SQLite (Desenvolvimento Local)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Banco de dados local ideal para desenvolvimento. Os dados são armazenados em um arquivo <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">database.db</code>.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    Turso (Produção na Cloud)
                    <a 
                      href="https://turso.tech" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Banco de dados SQLite distribuído e escalável para produção.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <span>ORM:</span>
                <span className="text-green-600 dark:text-green-400">Drizzle ORM</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo de Banco Atual:</span>
                <span className="font-mono">{dbStatus?.type || 'SQLite'}</span>
              </div>
              <div className="flex justify-between">
                <span>Suporte SQLite:</span>
                <span className="text-green-600 dark:text-green-400">✓ Ativo</span>
              </div>
              <div className="flex justify-between">
                <span>Suporte Turso:</span>
                <span className="text-blue-600 dark:text-blue-400">✓ Preparado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isTursoDialogOpen} onOpenChange={setIsTursoDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="text-purple-600" />
              Configurar Turso Database
            </DialogTitle>
            <DialogDescription>
              Configure as credenciais do Turso para usar ou migrar seus dados
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="instructions">Instruções</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4 mt-4">
              {currentTursoConfig?.configured && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Turso já está configurado. Você pode atualizar as credenciais abaixo.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="turso-url">Turso Database URL</Label>
                  <Input
                    id="turso-url"
                    placeholder="libsql://seu-banco.turso.io"
                    value={tursoConfig.databaseUrl}
                    onChange={(e) => setTursoConfig({ ...tursoConfig, databaseUrl: e.target.value })}
                    data-testid="input-turso-url"
                  />
                  <p className="text-xs text-gray-500">
                    URL do seu banco de dados Turso (obtido com <code>turso db show [nome] --url</code>)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turso-token">Turso Auth Token</Label>
                  <Input
                    id="turso-token"
                    type="password"
                    placeholder="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
                    value={tursoConfig.authToken}
                    onChange={(e) => setTursoConfig({ ...tursoConfig, authToken: e.target.value })}
                    data-testid="input-turso-token"
                  />
                  <p className="text-xs text-gray-500">
                    Token de autenticação (obtido com <code>turso db tokens create [nome]</code>)
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Configure estas variáveis nos Secrets do Replit para persistência:
                    <ul className="list-disc list-inside mt-2 ml-2">
                      <li><code>TURSO_DATABASE_URL</code></li>
                      <li><code>TURSO_AUTH_TOKEN</code></li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {migrationProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{migrationStatus}</span>
                      <span>{migrationProgress}%</span>
                    </div>
                    <Progress value={migrationProgress} className="w-full" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Criar Conta no Turso</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Acesse <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center gap-1">
                      turso.tech <ExternalLink className="h-3 w-3" />
                    </a> e crie uma conta gratuita
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Instalar CLI do Turso</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                    brew install tursodatabase/tap/turso
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Para outros sistemas: <a href="https://docs.turso.tech/cli/installation" target="_blank" className="text-purple-600 hover:underline">docs.turso.tech/cli/installation</a></p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Autenticar</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                    turso auth login
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Criar Banco de Dados</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                    turso db create carmigui
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Obter Credenciais</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Database URL:</p>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                        turso db show carmigui --url
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Auth Token:</p>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                        turso db tokens create carmigui
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6. Configurar no Replit</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>Vá para Tools → Secrets no Replit</li>
                    <li>Adicione <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">TURSO_DATABASE_URL</code></li>
                    <li>Adicione <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">TURSO_AUTH_TOKEN</code></li>
                    <li>Reinicie a aplicação</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTursoDialogOpen(false)}
              data-testid="btn-cancel-turso"
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={handleTestTurso}
              disabled={testTursoMutation.isPending}
              data-testid="btn-test-turso"
            >
              {testTursoMutation.isPending ? (
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
              variant="outline"
              onClick={handleSaveTurso}
              disabled={configureTursoMutation.isPending}
              data-testid="btn-save-turso"
            >
              {configureTursoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
            {dbStatus?.type === "sqlite" && (
              <Button
                onClick={handleMigrateTurso}
                disabled={migrateTursoMutation.isPending}
                data-testid="btn-migrate-data"
              >
                {migrateTursoMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Migrar Dados
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
