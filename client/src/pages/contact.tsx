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
import { MapPin, Phone, Mail, Clock, Send, Building2, Home } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { InsertContact } from "@shared/schema";

type Department = "imobiliaria" | "construtora";

export default function ContactPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("imobiliaria");

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

  const departmentInfo = {
    imobiliaria: {
      title: "Carmigui Imobiliária",
      phones: ["945 806 968", "957 970 662"],
      whatsapp: "945806968",
      email: "carmiguicomercialda@gmail.com",
      social: {
        instagram: "https://www.instagram.com/carmigui_imobiliaria_lda",
        facebook: "https://www.facebook.com/Carmiguii2",
        tiktok: "https://www.tiktok.com/@carmigui_lda",
      },
      subjects: [
        { value: "compra", label: "Compra de Imóvel" },
        { value: "venda", label: "Venda de Imóvel" },
        { value: "arrendamento", label: "Arrendamento" },
        { value: "avaliacao", label: "Avaliação de Imóvel" },
        { value: "informacoes", label: "Informações Gerais" },
      ],
    },
    construtora: {
      title: "Carmigui Construtora",
      phones: ["923 006 615", "957 970 604"],
      whatsapp: "923006615",
      email: "GERAL@CARMIGUI.COM",
      social: {
        instagram: "https://www.instagram.com/carmigui_construtora_lda",
        facebook: "https://www.facebook.com/Carmiguii",
        tiktok: "https://www.tiktok.com/@carmigui_lda",
      },
      subjects: [
        { value: "construcao", label: "Projeto de Construção" },
        { value: "reforma", label: "Reforma e Ampliação" },
        { value: "arquitetura", label: "Projeto de Arquitetura" },
        { value: "orcamento", label: "Solicitação de Orçamento" },
        { value: "informacoes", label: "Informações Gerais" },
      ],
    },
  };

  const currentDept = departmentInfo[selectedDepartment];

  const sendToWhatsApp = (data: InsertContact) => {
    const phoneNumber = currentDept.whatsapp;
    const deptName = selectedDepartment === "imobiliaria" ? "Imobiliária" : "Construtora";
    const message = `Olá! Meu nome é ${data.name}.

Área: ${deptName}
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
      if (import.meta.env.DEV) {
        console.error("Error sending contact:", error);
      }
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Entre em Contacto
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Estamos aqui para ajudar a encontrar a solução perfeita para si
            </p>
          </div>
        </div>
      </section>

      {/* Department Selection */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selecione o Departamento
            </h2>
            <p className="text-gray-600">
              Escolha a área que deseja contactar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedDepartment("imobiliaria")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedDepartment === "imobiliaria"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
              data-testid="btn-dept-imobiliaria"
            >
              <Home className={`w-12 h-12 mx-auto mb-3 ${
                selectedDepartment === "imobiliaria" ? "text-green-600" : "text-gray-400"
              }`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Carmigui Imobiliária
              </h3>
              <p className="text-sm text-gray-600">
                Compra, venda e arrendamento de imóveis
              </p>
            </button>

            <button
              onClick={() => setSelectedDepartment("construtora")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedDepartment === "construtora"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
              data-testid="btn-dept-construtora"
            >
              <Building2 className={`w-12 h-12 mx-auto mb-3 ${
                selectedDepartment === "construtora" ? "text-green-600" : "text-gray-400"
              }`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Carmigui Construtora
              </h3>
              <p className="text-sm text-gray-600">
                Projetos de construção e reformas
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Envie-nos uma Mensagem
                </h2>
                <p className="text-gray-600 mb-6">
                  {currentDept.title}
                </p>
                
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
                                {currentDept.subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                  </SelectItem>
                                ))}
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
                      className="bg-green-600 hover:bg-green-700 text-white w-full"
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
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {currentDept.title}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-600 text-white p-3 rounded-lg">
                        <Phone size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Telefone</h3>
                        <div className="text-gray-700">
                          {currentDept.phones.map((phone, index) => (
                            <a 
                              key={index}
                              href={`tel:${phone.replace(/\s/g, '')}`}
                              className="block hover:text-green-600"
                              data-testid={`contact-phone-${index}`}
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-600 text-white p-3 rounded-lg">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                        <a 
                          href={`mailto:${currentDept.email}`}
                          className="text-gray-700 hover:text-green-600"
                          data-testid="contact-email"
                        >
                          {currentDept.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-green-600 text-white p-3 rounded-lg">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Endereço</h3>
                        <p className="text-gray-700" data-testid="contact-address">
                          Luanda, Angola
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-600 text-white p-3 rounded-lg">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Horário de Funcionamento</h3>
                        <p className="text-gray-700" data-testid="contact-hours">
                          Segunda a Sexta: 08:00 - 18:00<br />
                          Sábado: 09:00 - 14:00
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-gray-900 mb-4">Siga-nos nas Redes Sociais</h3>
                  <div className="flex space-x-4">
                    <a
                      href={currentDept.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                      data-testid="social-instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      href={currentDept.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                      data-testid="social-facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a
                      href={currentDept.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                      data-testid="social-tiktok"
                    >
                      <SiTiktok size={24} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
