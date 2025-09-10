import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Linkedin } from "lucide-react";
import type { InsertContact } from "@shared/schema";

export default function ContactPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const sendToWhatsApp = (data: InsertContact) => {
    const phoneNumber = "945806968"; // Número da CARMIGUI
    const message = `Olá! Meu nome é ${data.name}.

Assunto: ${data.subject}

Mensagem:
${data.message}

Contatos:
Email: ${data.email}
Telefone: ${data.phone || "Não informado"}

Enviado através do site CARMIGUI.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      await apiRequest("POST", "/api/contacts", data);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Mensagem enviada!",
        description: "Redirecionando para WhatsApp para enviar a mensagem...",
      });
      
      // Enviar para WhatsApp
      sendToWhatsApp(data);
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Error sending contact:", error);
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-carmigui-accent section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-roboto font-bold text-carmigui-primary mb-4">
              Entre em Contacto
            </h1>
            <p className="text-xl text-carmigui-text">
              Estamos aqui para ajudar a encontrar a solução perfeita para si
            </p>
          </div>
        </div>
      </div>

      <div className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-carmigui-accent">
              <CardContent className="p-8">
                <h2 className="text-2xl font-roboto font-bold text-carmigui-primary mb-6">
                  Envie-nos uma Mensagem
                </h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Seu nome completo"
                                {...field}
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="seu@email.com"
                                {...field}
                                data-testid="input-email"
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder="+244 923 456 789"
                                {...field}
                                value={field.value ?? ""}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assunto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-subject">
                                  <SelectValue placeholder="Selecione o assunto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="compra">Compra de Imóvel</SelectItem>
                                <SelectItem value="venda">Venda de Imóvel</SelectItem>
                                <SelectItem value="construcao">Projeto de Construção</SelectItem>
                                <SelectItem value="informacoes">Informações Gerais</SelectItem>
                                <SelectItem value="parceria">Parcerias</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Escreva a sua mensagem aqui..."
                              rows={5}
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="btn-primary w-full"
                      disabled={contactMutation.isPending}
                      data-testid="btn-submit-contact"
                    >
                      {contactMutation.isPending ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-roboto font-bold text-carmigui-primary mb-6">
                  Informações de Contacto
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-carmigui-primary text-white p-3 rounded-lg">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-carmigui-text mb-1">Endereço</h3>
                      <p className="text-carmigui-text" data-testid="contact-address">
                        Luanda, Angola
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-carmigui-primary text-white p-3 rounded-lg">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-carmigui-text mb-1">Telefone</h3>
                      <p className="text-carmigui-text" data-testid="contact-phone">
                        945 806 968<br />
                        957 970 662
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-carmigui-primary text-white p-3 rounded-lg">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-carmigui-text mb-1">Email</h3>
                      <p className="text-carmigui-text" data-testid="contact-email">
                        carmiguicomercialda@gmail.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-carmigui-primary text-white p-3 rounded-lg">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-carmigui-text mb-1">Horário de Funcionamento</h3>
                      <p className="text-carmigui-text" data-testid="contact-hours">
                        Segunda a Sexta: 08:00 - 18:00<br />
                        Sábado: 09:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold text-carmigui-text mb-4">Siga-nos nas Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-carmigui-primary text-white p-3 rounded-lg hover:bg-carmigui-primary/90 transition-colors"
                    data-testid="social-facebook"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="#"
                    className="bg-carmigui-primary text-white p-3 rounded-lg hover:bg-carmigui-primary/90 transition-colors"
                    data-testid="social-instagram"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="#"
                    className="bg-carmigui-primary text-white p-3 rounded-lg hover:bg-carmigui-primary/90 transition-colors"
                    data-testid="social-linkedin"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="#"
                    className="bg-carmigui-primary text-white p-3 rounded-lg hover:bg-carmigui-primary/90 transition-colors"
                    data-testid="social-whatsapp"
                  >
                    <Phone size={24} />
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-carmigui-text mb-4">Nossa Localização</h3>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Mapa interativo será adicionado aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
