import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, Home, Hammer, Phone, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/imoveis", label: "Imóveis", icon: Building },
    { href: "/construcao", label: "Construção", icon: Hammer },
    { href: "/contacto", label: "Contacto", icon: Phone },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="logo-link">
            <div className="text-2xl font-roboto font-bold text-angola-primary">
              <Building className="inline mr-2" size={28} />
              AngolaCasa
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-angola-primary"
                      : "text-angola-text hover:text-angola-primary"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon size={18} className="mr-1" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-angola-primary"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-angola-accent text-angola-primary"
                            : "text-angola-text hover:bg-angola-accent hover:text-angola-primary"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                      >
                        <Icon size={18} className="mr-2" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
