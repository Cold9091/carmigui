import { Facebook, Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Link, useLocation } from "wouter";

export default function Footer() {
  const [location] = useLocation();
  
  const isConstructionPage = location.includes('/construcao') || location.includes('/construction');
  
  const socialLinks = isConstructionPage ? {
    instagram: "https://www.instagram.com/carmigui_construtora_lda",
    facebook: "https://www.facebook.com/Carmiguii",
    tiktok: "https://www.tiktok.com/@carmigui_lda",
  } : {
    instagram: "https://www.instagram.com/carmigui_imobiliaria_lda",
    facebook: "https://www.facebook.com/Carmiguii2",
    tiktok: "https://www.tiktok.com/@carmigui_lda",
  };

  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center mr-2 font-semibold">
                CM
              </div>
              <span className="text-xl text-gray-800">CARMIGUI</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A CARMIGUI usa tecnologia e design para tornar a experiência de busca de 
              imóvel mais simples e agradável.
            </p>
          </div>

          {/* CARMIGUI Links */}
          <div>
            <h3 className="text-gray-800 mb-4">CARMIGUI</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-about"
                >
                  Sobre a CARMIGUI
                </Link>
              </li>
              <li>
                <a
                  href="tel:945806968"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-phone1"
                >
                  945 806 968
                </a>
              </li>
              <li>
                <a
                  href="tel:957970662"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-phone2"
                >
                  957 970 662
                </a>
              </li>
              <li>
                <a
                  href="mailto:carmiguicomercialda@gmail.com"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-email"
                >
                  carmiguicomercialda@gmail.com
                </a>
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
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-privacy"
                >
                  Política de privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-terms"
                >
                  Privacidade e Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-cookies"
                >
                  Política de Cookies
                </a>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                  data-testid="footer-link-faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
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
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors"
                data-testid="social-instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors"
                data-testid="social-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors"
                data-testid="social-tiktok"
              >
                <SiTiktok size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">CARMIGUI® 2024</p>
        </div>
      </div>
    </footer>
  );
}
