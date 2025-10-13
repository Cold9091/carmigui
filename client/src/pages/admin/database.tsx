import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Database, Settings, CheckCircle, AlertCircle, Info, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

interface DatabaseStatus {
  type: string;
  connected: boolean;
  file?: string;
  url?: string;
}

export default function AdminDatabasePage() {
  const { toast } = useToast();
  
  const { data: dbStatus, isLoading: statusLoading, refetch } = useQuery<DatabaseStatus>({
    queryKey: ["/api/database/status"],
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Banco de dados SQLite distribuído e escalável para produção. Para usar o Turso:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>Crie uma conta em <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">turso.tech</a></li>
                    <li>Instale o CLI: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">brew install tursodatabase/tap/turso</code></li>
                    <li>Faça login: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">turso auth login</code></li>
                    <li>Crie um banco: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">turso db create carmigui</code></li>
                    <li>Obtenha a URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">turso db show carmigui --url</code></li>
                    <li>Crie um token: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">turso db tokens create carmigui</code></li>
                    <li>Configure as variáveis de ambiente nos Secrets do Replit:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">TURSO_DATABASE_URL</code></li>
                        <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">TURSO_AUTH_TOKEN</code></li>
                      </ul>
                    </li>
                    <li>Reinicie a aplicação</li>
                  </ol>
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
    </AdminLayout>
  );
}
