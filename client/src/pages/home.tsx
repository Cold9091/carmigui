import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Building, Hammer, Home, MapPin, Bed, Bath, Maximize, ArrowRight, ArrowLeft, Search, CheckCircle, Key, Square, Users } from "lucide-react";
import PropertyCard from "@/components/property-card";
import ProjectCard from "@/components/project-card";
import type { Property, Project, Condominium } from "@shared/schema";
import heroImage from "@assets/Component 1_1760104843634.png";

export default function HomePage() {
  // Estados para carrossel
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [cheaperIndex, setCheaperIndex] = useState(0);
  
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { featured: "true" }],
  });

  const { data: featuredProjects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", { featured: true }],
  });

  const { data: featuredCondominiums = [], isLoading: condominiumsLoading } = useQuery<Condominium[]>({
    queryKey: ["/api/condominiums", { featured: true }],
  });

  // Funções de navegação para featured properties
  const handleFeaturedPrev = () => {
    setFeaturedIndex(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleFeaturedNext = () => {
    const maxIndex = Math.max(0, featuredProperties.length - 3);
    setFeaturedIndex(prev => prev < maxIndex ? prev + 1 : maxIndex);
  };

  // Funções de navegação para cheaper properties
  const handleCheaperPrev = () => {
    setCheaperIndex(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleCheaperNext = () => {
    setCheaperIndex(prev => prev < 1 ? prev + 1 : 1); // máximo 2 páginas (6 propriedades / 3 por página)
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-[#165e31]">
        <div className="flex flex-col lg:grid lg:grid-cols-[auto_minmax(0,500px)]">
          {/* Image Column */}
          <div className="w-full">
            <img
              src={heroImage}
              alt="Banner Carmigui Imobiliária"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text Column - Hidden on small screens, visible on lg+ where it fits in the green space */}
          <div className="hidden lg:flex items-center justify-center px-6 xl:px-8 py-8 bg-[#165e31]">
            <div className="max-w-lg">
              <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)' }}>
                <span className="text-[#F5A623]">BEM-VINDO</span>
                <br />
                <span className="text-white">AO SEU NOVO</span>
                <br />
                <span className="text-white">COMEÇO !</span>
              </h1>
              <p className="text-white font-bold leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}>
                Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.
              </p>
            </div>
          </div>
        </div>
        
        {/* Mobile Text - Shown below image on small screens */}
        <div className="lg:hidden bg-[#165e31] px-6 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            <span className="text-[#F5A623]">BEM-VINDO</span>
            <br />
            <span className="text-white">AO SEU NOVO</span>
            <br />
            <span className="text-white">COMEÇO !</span>
          </h1>
          <p className="text-white text-sm sm:text-base font-bold leading-relaxed max-w-2xl mx-auto">
            Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.
          </p>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="pt-0 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Link href="/imoveis?type=apartment" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Apartamento"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Apartamento</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=kitnet" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Kitnet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Kitnet</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=loft" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Loft"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Loft</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=house" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Casa</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=fazenda" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Fazenda"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Fazenda</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=building" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Prédio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Prédio</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=office" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Comercial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Comercial</span>
                </div>
              </div>
            </Link>
            
            <Link href="/imoveis?type=coworking" className="group">
              <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Coworking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">Coworking</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* Os mais desejados do momento */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Os mais desejados do momento
              </h2>
              <p className="text-gray-600">
                Nosso algoritmo mostra as características dos imóveis mais desejados na sua região
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/imoveis">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  data-testid="btn-ver-mais"
                >
                  Ver mais
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  onClick={handleFeaturedPrev}
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-gray-300"
                  data-testid="btn-prev"
                  disabled={featuredIndex === 0}
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  onClick={handleFeaturedNext}
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="btn-next"
                  disabled={featuredIndex >= Math.max(0, featuredProperties.length - 3)}
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {propertiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-4 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum imóvel em destaque encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há imóveis em destaque. Veja todos os nossos imóveis disponíveis.
              </p>
              <Link href="/imoveis">
                <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="btn-view-all-properties">
                  Ver Todos os Imóveis
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(featuredIndex, featuredIndex + 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Busca Casa Works */}
      <section className="section-spacing bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto container-padding relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Entenda como o<br />Busca Casa funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Busca Inteligente */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Search className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-900">
                Busca Inteligente
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Busca Casa é uma ferramenta de busca vertical. Nosso objetivo é 
                tornar mais fácil a sua busca por um novo lar.
              </p>
            </div>

            {/* Imobiliárias confiáveis */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-900">
                Imobiliárias confiáveis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No Busca Casa você pode pesquisar tranquilo. A gente 
                faz uma análise rigorosa e estuda o histórico de cada 
                casa, uma a uma, antes de te indicar.
              </p>
            </div>

            {/* A casa certa pra você */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Key className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-900">
                A casa certa pra você
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Com tantas opções, às vezes fica difícil escolher, 
                né? Não no Busca Casa. Aqui você encontra 
                informações suficientes e nossos especialistas estão 
                sempre a postos para te ajudar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Os menores preços */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Os menores preços
              </h2>
              <p className="text-gray-600">
                A melhor oportunidade de compra é a que você tem o melhor preço. Aqui você encontra.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/imoveis">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  data-testid="btn-ver-mais-precos"
                >
                  Ver mais
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  onClick={handleCheaperPrev}
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-gray-300"
                  data-testid="btn-prev-precos"
                  disabled={cheaperIndex === 0}
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  onClick={handleCheaperNext}
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="btn-next-precos"
                  disabled={cheaperIndex >= 1}
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Use all properties data sorted by price */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum imóvel disponível no momento</p>
              </div>
            ) : (
              featuredProperties
                .sort((a, b) => Number(a.price) - Number(b.price))
                .slice(cheaperIndex * 3, (cheaperIndex * 3) + 3)
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
            )}
          </div>
        </div>
      </section>

      {/* O melhor de cada cidade */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                O melhor de cada cidade
              </h2>
              <p className="text-gray-600">
                O Busca Casa simplifica a busca do seu imóvel nessas cidades:
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="btn-ver-mais-cidades"
              >
                Ver mais
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-gray-300"
                  data-testid="btn-prev-cidades"
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="btn-next-cidades"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Luanda */}
            <Link href="/imoveis?city=luanda" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Luanda"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Luanda</span>
                </div>
              </div>
            </Link>

            {/* Benguela */}
            <Link href="/imoveis?city=benguela" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Benguela"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Benguela</span>
                </div>
              </div>
            </Link>

            {/* Lobito */}
            <Link href="/imoveis?city=lobito" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Lobito"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Lobito</span>
                </div>
              </div>
            </Link>

            {/* Huambo */}
            <Link href="/imoveis?city=huambo" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Huambo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Huambo</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Condominiums */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Condomínios em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça toda nossa carteira de empreendimentos residenciais, desde centralidades modernas até bairros consolidados de Luanda.
            </p>
          </div>

          {condominiumsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
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
          ) : featuredCondominiums.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum condomínio em destaque encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há condomínios em destaque. Consulte todos os nossos empreendimentos.
              </p>
              <Link href="/condominios">
                <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="btn-view-all-condominiums">
                  Ver Todos os Condomínios
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className={`grid gap-8 ${
                featuredCondominiums.length === 1 
                  ? 'grid-cols-1 max-w-md mx-auto' 
                  : featuredCondominiums.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                  : 'grid-cols-1 md:grid-cols-3'
              }`}>
                {featuredCondominiums.slice(0, 3).map((condominium) => (
                  <FeaturedCondominiumCard key={condominium.id} condominium={condominium} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/condominios">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
                    data-testid="btn-view-all-condominiums"
                  >
                    Ver Todos os Condomínios
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-4xl font-poppins font-bold mb-4">
            Pronto para Encontrar Seu Imóvel Ideal?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Entre em contacto connosco hoje mesmo e deixe-nos ajudá-lo a encontrar a propriedade perfeita
            ou realizar o projeto de construção dos seus sonhos.
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold"
              data-testid="btn-contact-us"
            >
              Entrar em Contacto
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeaturedCondominiumCard({ condominium }: { condominium: Condominium }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="relative">
        <img
          src={(condominium.images && condominium.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={condominium.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{condominium.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin size={14} className="text-gray-400" />
          <span>{condominium.centralityOrDistrict} • {condominium.location}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" />
            <span>{condominium.totalUnits} unidades</span>
          </div>
          <div className="flex items-center gap-1">
            <Home size={14} className="text-gray-400" />
            <span>{condominium.availableUnits} disponíveis</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Faixa de preço</p>
            <p className="text-lg font-bold text-gray-800">
              {condominium.priceRange}
            </p>
            <p className="text-xs text-gray-500">{condominium.developmentYear}</p>
          </div>
          <Link href={`/condominios/${condominium.id}`}>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              data-testid={`btn-ver-detalhes-${condominium.id}`}
            >
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
