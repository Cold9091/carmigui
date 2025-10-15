import { useQuery } from "@tanstack/react-query";
import { Building2, Calendar, MapPin, Ruler, Wrench, ClipboardCheck, Users, CheckCircle, Shield, Award, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function ConstructionPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto container-padding py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <Building2 className="h-10 w-10 md:h-12 md:w-12 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-white leading-none">CARMIGUI</span>
                  <span className="text-sm md:text-base text-yellow-400 leading-none">Comercial, Lda</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" data-testid="text-hero-title">
              SOMOS A SOLUÇÃO QUE PROCURAS!!!
            </h1>
            <p className="text-lg md:text-xl text-gray-200" data-testid="text-hero-subtitle">
              TRANSFORMANDO SONHOS EM REALIDADE
            </p>
          </div>
        </div>
      </section>

      {/* Nossos Serviços - Compacto como na página de condomínios */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              NOSSOS SERVIÇOS
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            <div className="text-center w-full md:w-[calc(33.333%-1rem)]" data-testid="service-card-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Construção de moradias e empreendimentos
              </h3>
            </div>
            
            <div className="text-center w-full md:w-[calc(33.333%-1rem)]" data-testid="service-card-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Projetos de arquitetura e engenharia personalizados
              </h3>
            </div>
            
            <div className="text-center w-full md:w-[calc(33.333%-1rem)]" data-testid="service-card-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Reformas, ampliações e reabilitação de imóveis
              </h3>
            </div>
            
            <div className="text-center w-full md:w-[calc(33.333%-1rem)]" data-testid="service-card-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Fiscalização e gestão de obras
              </h3>
            </div>
            
            <div className="text-center w-full md:w-[calc(33.333%-1rem)]" data-testid="service-card-5">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Consultoria imobiliária e acompanhamento técnico
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Na Carmigui - Layout compacto */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              NA CARMIGUI...
            </h2>
          </div>
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              Acreditamos que construir vai muito além de erguer paredes. É dar vida a projetos, criar espaços que inspirem e oferecer soluções seguras e duradouras para cada cliente.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Com uma equipe qualificada, tecnologia moderna e compromisso com a qualidade, somos a solução que você procura para transformar o seu investimento em um verdadeiro lar ou num projeto sólido e rentável.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Evolução - Layout compacto */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              A NOSSA EVOLUÇÃO
            </h2>
          </div>
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-8 rounded-2xl text-white space-y-4">
            <p className="text-base leading-relaxed">
              A CARMIGUI nasceu com a visão de ser uma referência no setor da construção civil.
            </p>
            <p className="text-base leading-relaxed">
              Ao longo dos anos, evoluímos e prestamos trabalhos para grandes empreendimentos, sempre com o mesmo propósito: unir qualidade, tecnologia e confiança para cada projeto realizado.
            </p>
            <p className="text-base leading-relaxed">
              Cada obra entregue representa não apenas a superação de um desafio, mas também a concretização de sonhos de clientes que acreditam no nosso trabalho.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Eficiência - Layout compacto */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              A NOSSA EFICIÊNCIA
            </h2>
            <p className="text-base text-gray-600 max-w-4xl mx-auto">
              Na construção, cada minuto conta. Por isso, criamos processos inteligentes que garantem:
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3" data-testid="efficiency-item-1">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">Cumprimento rigoroso dos prazos</p>
            </div>
            <div className="flex items-start gap-3" data-testid="efficiency-item-2">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">Gestão eficaz de recursos</p>
            </div>
            <div className="flex items-start gap-3" data-testid="efficiency-item-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">Equipes altamente capacitadas e motivadas</p>
            </div>
            <div className="flex items-start gap-3" data-testid="efficiency-item-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">Acompanhamento técnico detalhado para total transparência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossas Metas - Layout compacto */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              AS NOSSAS METAS
            </h2>
            <p className="text-base text-gray-600">
              Desde o início, estabelecemos objetivos claros:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center" data-testid="goal-card-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Excelência na qualidade</h3>
              <p className="text-sm text-gray-600">Entregando construções seguras e modernas</p>
            </div>
            
            <div className="text-center" data-testid="goal-card-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Satisfação do cliente</h3>
              <p className="text-sm text-gray-600">Criando espaços que inspiram e atendem às suas necessidades</p>
            </div>
            
            <div className="text-center" data-testid="goal-card-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Sustentabilidade</h3>
              <p className="text-sm text-gray-600">Aplicando técnicas e materiais amigos do ambiente</p>
            </div>
            
            <div className="text-center" data-testid="goal-card-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Contribuição social</h3>
              <p className="text-sm text-gray-600">Apoiando o crescimento das comunidades locais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato - Layout compacto como no print */}
      <section className="py-10 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">CONTACTO</h2>
            <p className="text-base text-gray-200 max-w-3xl mx-auto">
              Entre em contacto conosco e descubra como podemos construir juntos o futuro que você merece.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a 
                href="tel:923006615" 
                className="flex items-center justify-center gap-3 bg-green-800/60 p-4 rounded-xl hover:bg-green-800/80 transition-colors"
                data-testid="link-phone-1"
              >
                <Phone className="w-5 h-5" />
                <span className="text-lg font-semibold">923 006 615</span>
              </a>
              
              <a 
                href="tel:957970604" 
                className="flex items-center justify-center gap-3 bg-green-800/60 p-4 rounded-xl hover:bg-green-800/80 transition-colors"
                data-testid="link-phone-2"
              >
                <Phone className="w-5 h-5" />
                <span className="text-lg font-semibold">957 970 604</span>
              </a>
            </div>
            
            <a 
              href="mailto:GERAL@CARMIGUI.COM" 
              className="flex items-center justify-center gap-3 bg-green-800/60 p-4 rounded-xl hover:bg-green-800/80 transition-colors"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5" />
              <span className="text-lg font-semibold">GERAL@CARMIGUI.COM</span>
            </a>
          </div>
        </div>
      </section>

      {/* Todos os Projetos */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              TODOS OS PROJETOS
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Conheça nossa carteira completa de projetos de construção, desde empreendimentos residenciais até complexos comerciais.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600">
                Ainda não há projetos no nosso portfólio. Volte em breve!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectPortfolioCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectPortfolioCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={(project.images && project.images[0]) || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{project.title}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin size={14} className="text-gray-400" />
          <span>Luanda, Angola</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          {project.area && (
            <div className="flex items-center gap-1">
              <Ruler size={14} className="text-gray-400" />
              <span>{project.area}</span>
            </div>
          )}
          {project.duration && (
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-gray-400" />
              <span>{project.duration}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Ano</p>
            <p className="text-lg font-bold text-gray-800">
              {project.year}
            </p>
          </div>
          <Link href={`/construcao/${project.id}`}>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              data-testid={`btn-ver-projeto-${project.id}`}
            >
              Ver Projeto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
