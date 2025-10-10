import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Home, Hammer, Phone, Settings, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/Component 2_1760108947935.jpg";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/imoveis", label: "Imóveis" },
    { href: "/condominios", label: "Condomínio" },
    { href: "/construcao", label: "Construção" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="logo-link">
            <img 
              src={logoImage} 
              alt="CM Carmigui" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Comece sua busca"
                className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:bg-white/20"
                data-testid="search-input"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-yellow-300 font-medium transition-colors"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contacto">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                data-testid="btn-contact"
              >
                Contacto
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input 
                        placeholder="Comece sua busca"
                        className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-white hover:text-yellow-300 px-4 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/contacto">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white mx-4 mt-4"
                      data-testid="btn-mobile-contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contacto
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
