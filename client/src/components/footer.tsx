import { Building, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Building className="mr-2 text-purple-600" size={24} />
              <span className="text-xl text-gray-800">AngolaCasa</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A AngolaCasa usa tecnologia e design para tornar a experiência de busca de 
              imóvel mais simples e agradável.
            </p>
          </div>

          {/* AngolaCasa Links */}
          <div>
            <h3 className="text-gray-800 mb-4">AngolaCasa</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-about"
                >
                  Sobre a AngolaCasa
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-properties"
                >
                  Ferramentas
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-privacy"
                >
                  Política de privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-terms"
                >
                  Privacidade e Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-cookies"
                >
                  Política de Cookies
                </a>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  data-testid="footer-link-partners"
                >
                  Nossos Parceiros
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-gray-800 mb-4">Siga-nos!</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-colors"
                data-testid="social-instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-colors"
                data-testid="social-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-600 transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">AngolaCasa® 2024</p>
        </div>
      </div>
    </footer>
  );
}