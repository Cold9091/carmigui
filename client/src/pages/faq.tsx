import { SEOHead } from "@/components/seo/SEOHead";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/utils/seo-schemas";
import { FAQ_DATA, PAGE_SEO } from "@/data/seo-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const faqSchema = generateFAQSchema(FAQ_DATA);
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: "https://carmigui.com/" },
    { name: "Perguntas Frequentes", url: "https://carmigui.com/faq" }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [faqSchema, breadcrumbSchema]
  };

  return (
    <>
      <SEOHead
        title="Perguntas Frequentes - Construção e Imobiliário em Angola"
        description="Tire suas dúvidas sobre construção de vivendas, compra de imóveis e condomínios em Luanda. Respostas rápidas sobre preços, prazos e condições de pagamento em Kz."
        keywords="faq construção angola, dúvidas imóveis luanda, perguntas vivendas angola, preço construção luanda, financiamento imóveis angola"
        schema={combinedSchema}
      />

      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-16">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <div className="flex items-center justify-center mb-6">
              <HelpCircle className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-faq-title">
              Perguntas Frequentes
            </h1>
            <p className="text-lg md:text-xl text-gray-200" data-testid="text-faq-subtitle">
              Tire todas as suas dúvidas sobre construção, imóveis e condomínios em Angola
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dúvidas Comuns sobre Construção e Imobiliário em Luanda
              </h2>
              <p className="text-gray-600">
                Reunimos as perguntas mais frequentes dos nossos clientes sobre construção de vivendas,
                compra de imóveis, condomínios e serviços em Angola. Se não encontrar sua resposta,
                entre em contacto connosco.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {FAQ_DATA.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-gray-50 rounded-lg px-6 border border-gray-200"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-16 bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-gray-700 mb-6">
                Nossa equipa está pronta para ajudar você com qualquer questão sobre
                construção, imóveis ou condomínios em Angola.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="btn-call-faq"
                >
                  <a href="tel:+244945806968">
                    <Phone className="mr-2 h-5 w-5" />
                    Ligar: 945 806 968
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  data-testid="btn-email-faq"
                >
                  <a href="mailto:carmiguicomercialda@gmail.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Enviar Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto container-padding">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Temas Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/construcao"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                data-testid="link-related-construction"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Construção</h3>
                <p className="text-sm text-gray-600">
                  Saiba mais sobre nossos serviços de construção de vivendas e prédios
                </p>
              </a>
              <a
                href="/imoveis"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                data-testid="link-related-properties"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Imóveis</h3>
                <p className="text-sm text-gray-600">
                  Explore nosso portfólio de imóveis à venda em Luanda
                </p>
              </a>
              <a
                href="/condominios"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                data-testid="link-related-condominiums"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Condomínios</h3>
                <p className="text-sm text-gray-600">
                  Conheça nossos condomínios exclusivos em Luanda
                </p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
