import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import type { Contact } from "@shared/schema";

export default function AdminContactsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  // Delete mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Contacto eliminado",
        description: "O contacto foi eliminado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Ocorreu um erro ao eliminar o contacto.",
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-angola-primary mb-2">Mensagens de Contacto</h1>
          <p className="text-gray-600">Gerir todas as mensagens recebidas dos utilizadores</p>
        </div>

        {contactsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma mensagem encontrada
              </h3>
              <p className="text-gray-500">
                Quando alguém entrar em contacto, as mensagens aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} data-testid={`contact-row-${contact.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-angola-primary">
                          {contact.name}
                        </h3>
                        <Badge variant="outline">{contact.subject}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {contact.email} {contact.phone && `• ${contact.phone}`}
                      </p>
                      <p className="text-gray-700 mb-2">{contact.message}</p>
                      <p className="text-sm text-gray-500">
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-PT') : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteContactMutation.mutate(contact.id)}
                        disabled={deleteContactMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`btn-delete-contact-${contact.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}