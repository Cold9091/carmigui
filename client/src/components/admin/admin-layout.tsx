import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Building, 
  Hammer, 
  Mail, 
  BarChart3, 
  Home,
  Database,
  Settings,
  LogOut,
  Folder,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Navigation items for the admin sidebar
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    description: "Visão geral das estatísticas",
  },
  {
    title: "Hero",
    url: "/admin/hero",
    icon: Image,
    description: "Gerir banner principal",
  },
  {
    title: "Imóveis",
    url: "/admin/properties",
    icon: Building,
    description: "Gerir propriedades",
  },
  {
    title: "Projetos",
    url: "/admin/projects", 
    icon: Hammer,
    description: "Gerir projetos de construção",
  },
  {
    title: "Condomínios",
    url: "/admin/condominiums",
    icon: Home,
    description: "Gerir condomínios",
  },
  {
    title: "Contactos",
    url: "/admin/contacts",
    icon: Mail,
    description: "Gerir mensagens de contacto",
  },
  {
    title: "Categorias",
    url: "/admin/categories",
    icon: Folder,
    description: "Gerir categorias de imóveis",
  },
  {
    title: "Banco de Dados",
    url: "/admin/database",
    icon: Database,
    description: "Configurar e monitorizar banco de dados",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar variant="inset" className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold">
                CM
              </div>
              <div>
                <h2 className="text-lg font-bold text-angola-primary">CARMIGUI</h2>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Gestão do Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.description}
                      >
                        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="justify-start" 
                size="sm"
                data-testid="btn-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Separator />
              <Button 
                variant="ghost" 
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                size="sm"
                data-testid="btn-logout"
                onClick={() => window.location.href = "/"}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" data-testid="sidebar-trigger" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">
              {adminNavItems.find(item => item.url === location)?.title || "Dashboard"}
            </h1>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}