import { Building, Facebook, Instagram, Linkedin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-angola-text text-white section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-roboto font-bold mb-4">
              <Building className="inline mr-2 text-angola-secondary" size={24} />
              AngolaCasa
            </div>
            <p className="text-gray-300 mb-4">
              Especialistas em imobiliário e construção de qualidade superior em Angola.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-angola-secondary transition-colors"
                data-testid="social-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-angola-secondary transition-colors"
                data-testid="social-instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-angola-secondary transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-angola-secondary transition-colors"
                data-testid="social-whatsapp"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-roboto font-bold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/imoveis"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-properties"
                >
                  Venda de Imóveis
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-rental"
                >
                  Aluguel de Propriedades
                </Link>
              </li>
              <li>
                <Link
                  href="/construcao"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-residential"
                >
                  Construção Residencial
                </Link>
              </li>
              <li>
                <Link
                  href="/construcao"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-commercial"
                >
                  Projetos Comerciais
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-roboto font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-about"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-privacy"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-terms"
                >
                  Termos de Serviço
                </a>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-angola-secondary transition-colors"
                  data-testid="footer-link-faq"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-roboto font-bold mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <span className="text-angola-secondary mr-2">📍</span>
                Rua Comandante Che Guevara, 45<br />
                Maianga, Luanda - Angola
              </p>
              <p className="flex items-center">
                <span className="text-angola-secondary mr-2">📞</span>
                +244 923 456 789
              </p>
              <p className="flex items-center">
                <span className="text-angola-secondary mr-2">✉️</span>
                info@angolacasa.ao
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 AngolaCasa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
