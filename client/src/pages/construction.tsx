import { useQuery } from "@tanstack/react-query";
import { Building2, Calendar, MapPin, Ruler, Hammer, Wrench, ClipboardCheck, Users, TrendingUp, Clock, Target, Phone, Mail, CheckCircle, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function ConstructionPage() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-white text-green-700 rounded-2xl flex items-center justify-center mr-4 font-bold text-2xl shadow-2xl">
              CM
            </div>
            <span className="text-4xl font-bold">CARMIGUI</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            SOMOS A SOLUÇÃO QUE PROCURAS!!!
          </h1>
          <p className="text-2xl md:text-3xl text-green-100 font-medium" data-testid="text-hero-subtitle">
            TRANSFORMANDO SONHOS EM REALIDADE
          </p>
        </div>
      </section>

      {/* Nossos Serviços */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <Hammer className="w-10 h-10 text-green-600" />
              <h2 className="text-4xl font-bold text-gray-900">NOSSOS SERVIÇOS</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow" data-testid="service-card-1">
              <Building2 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Construção de moradias e empreendimentos
              </h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow" data-testid="service-card-2">
              <ClipboardCheck className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Projetos de arquitetura e engenharia personalizados
              </h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow" data-testid="service-card-3">
              <Wrench className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reformas, ampliações e reabilitação de imóveis
              </h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow" data-testid="service-card-4">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fiscalização e gestão de obras
              </h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow" data-testid="service-card-5">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Consultoria imobiliária e acompanhamento técnico
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Na Carmigui */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Building2 className="w-10 h-10 text-green-600" />
              <h2 className="text-4xl font-bold text-gray-900">NA CARMIGUI...</h2>
            </div>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Acreditamos que construir vai muito além de erguer paredes. É dar vida a projetos, criar espaços que inspirem e oferecer soluções seguras e duradouras para cada cliente.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Com uma equipe qualificada, tecnologia moderna e compromisso com a qualidade, somos a solução que você procura para transformar o seu investimento em um verdadeiro lar ou num projeto sólido e rentável.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Evolução */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <TrendingUp className="w-10 h-10 text-green-600" />
              <h2 className="text-4xl font-bold text-gray-900">A NOSSA EVOLUÇÃO</h2>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-900 to-green-700 p-8 md:p-12 rounded-2xl shadow-xl text-white">
            <p className="text-lg leading-relaxed mb-6">
              A CARMIGUI nasceu com a visão de ser uma referência no setor da construção civil.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Ao longo dos anos, evoluímos e prestamos trabalhos para grandes empreendimentos, sempre com o mesmo propósito: unir qualidade, tecnologia e confiança para cada projeto realizado.
            </p>
            <p className="text-lg leading-relaxed">
              Cada obra entregue representa não apenas a superação de um desafio, mas também a concretização de sonhos de clientes que acreditam no nosso trabalho.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Eficiência */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Clock className="w-10 h-10 text-green-600" />
              <h2 className="text-4xl font-bold text-gray-900">A NOSSA EFICIÊNCIA</h2>
            </div>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              Na construção, cada minuto conta. Por isso, criamos processos inteligentes que garantem:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4" data-testid="efficiency-item-1">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Cumprimento rigoroso dos prazos</p>
              </div>
              <div className="flex items-start gap-4" data-testid="efficiency-item-2">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Gestão eficaz de recursos</p>
              </div>
              <div className="flex items-start gap-4" data-testid="efficiency-item-3">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Equipes altamente capacitadas e motivadas</p>
              </div>
              <div className="flex items-start gap-4" data-testid="efficiency-item-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Acompanhamento técnico detalhado para total transparência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossas Metas */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Target className="w-10 h-10 text-green-600" />
              <h2 className="text-4xl font-bold text-gray-900">AS NOSSAS METAS</h2>
            </div>
            <p className="text-lg text-gray-600 mt-4">Desde o início, estabelecemos objetivos claros:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border-2 border-green-200" data-testid="goal-card-1">
              <Award className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excelência na qualidade</h3>
              <p className="text-gray-700">Entregando construções seguras e modernas</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border-2 border-green-200" data-testid="goal-card-2">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Satisfação do cliente</h3>
              <p className="text-gray-700">Criando espaços que inspiram e atendem às suas necessidades</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border-2 border-green-200" data-testid="goal-card-3">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustentabilidade</h3>
              <p className="text-gray-700">Aplicando técnicas e materiais amigos do ambiente</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border-2 border-green-200" data-testid="goal-card-4">
              <Building2 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contribuição social</h3>
              <p className="text-gray-700">Apoiando o crescimento das comunidades locais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">CONTACTO</h2>
          <p className="text-xl text-green-100 mb-12">
            Entre em contacto conosco e descubra como podemos construir juntos o futuro que você merece.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Phone className="w-10 h-10 mx-auto mb-4" />
              <a href="tel:923006615" className="block text-2xl font-semibold hover:text-green-200 transition-colors" data-testid="link-phone-1">
                923 006 615
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Phone className="w-10 h-10 mx-auto mb-4" />
              <a href="tel:957970604" className="block text-2xl font-semibold hover:text-green-200 transition-colors" data-testid="link-phone-2">
                957 970 604
              </a>
            </div>
          </div>
          
          <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-md mx-auto">
            <Mail className="w-10 h-10 mx-auto mb-4" />
            <a href="mailto:GERAL@CARMIGUI.COM" className="text-2xl font-semibold hover:text-green-200 transition-colors" data-testid="link-email">
              GERAL@CARMIGUI.COM
            </a>
          </div>
        </div>
      </section>

      {/* Todos os Projetos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              TODOS OS PROJETOS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
            <div className="text-center py-16">
              <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500">
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-shadow">
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
