import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Database, Server, Settings, CheckCircle, AlertCircle, Info } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";

interface DatabaseStatus {
  type: string;
  connected: boolean;
  file?: string;
  url?: string;
  tables?: number;
  lastConnection?: string;
}

export default function AdminDatabasePage() {
  const { toast } = useToast();
  
  // Fetch database status
  const { data: dbStatus, isLoading: statusLoading, refetch } = useQuery<DatabaseStatus>({
    queryKey: ["/api/database/status"],
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

  const handleMigrateToSupabase = () => {
    toast({
      title: "Migração para Supabase",
      description: "Em breve você poderá migrar facilmente para Supabase através desta interface.",
    });
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
    </AdminLayout>
  );
}