import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Building, Hammer, Home, MapPin, Bed, Bath, Maximize, ArrowRight, ArrowLeft, Search, CheckCircle, Key, Square } from "lucide-react";
import PropertyCard from "@/components/property-card";
import ProjectCard from "@/components/project-card";
import type { Property, Project } from "@shared/schema";

export default function HomePage() {
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { featured: true }],
  });

  const { data: featuredProjects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", { featured: true }],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding pt-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Encontre seu imóvel ideal em Luanda
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                São milhares de casas e apartamentos com toda a facilidade e a assessoria de corretores especializados.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Apartamento moderno"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-12 bg-gray-50">
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
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="btn-ver-mais"
              >
                Ver mais
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-gray-300"
                  data-testid="btn-prev"
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="btn-next"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Casa de Vidro */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de Vidro"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de Vidro</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Júpiter - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>812 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>5 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">1.000.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 2 modalidades</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Sobrado Minimalista */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Sobrado Minimalista"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Sobrado Minimalista</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Saturno - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>230 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>3 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">250.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 5 modalidades</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Casa de campo */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de campo"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de campo</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Saturno - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>100 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>2 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">100.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 6 modalidades</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Apartamento */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Apartamento"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Apartamento</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Saturno - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>68 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>2 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">195.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 8 modalidades</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="btn-ver-mais-precos"
              >
                Ver mais
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-gray-300"
                  data-testid="btn-prev-precos"
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white"
                  data-testid="btn-next-precos"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Casa de campo com piscina 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de campo com piscina"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de campo com piscina</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Barueri - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>400 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>3 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">410.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 3 imobiliárias</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Casa de campo com piscina 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de campo com piscina"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de campo com piscina</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Barueri - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>400 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>3 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">410.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 3 imobiliárias</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Casa de campo com piscina 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de campo com piscina"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de campo com piscina</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Barueri - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>400 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>3 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">410.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 3 imobiliárias</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>

            {/* Casa de campo 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Casa de campo"
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Casa de campo</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Rua Marte, Barueri - SP</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-gray-400" />
                    <span>400 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-gray-400" />
                    <span>3 quartos</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">A partir de</p>
                    <p className="text-lg font-bold text-gray-800">410.000 AKZ</p>
                    <p className="text-xs text-gray-500">em 3 imobiliárias</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    Ver preços
                  </Button>
                </div>
              </div>
            </div>
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
            {/* São Paulo */}
            <Link href="/imoveis?city=sao-paulo" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1493729463353-a98e5c23a95b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="São Paulo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">São Paulo</span>
                </div>
              </div>
            </Link>

            {/* Rio de Janeiro */}
            <Link href="/imoveis?city=rio-de-janeiro" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544737151821-6e4b99de3738?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Rio de Janeiro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Rio de Janeiro</span>
                </div>
              </div>
            </Link>

            {/* Minas Gerais */}
            <Link href="/imoveis?city=minas-gerais" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Minas Gerais"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Minas Gerais</span>
                </div>
              </div>
            </Link>

            {/* Salvador */}
            <Link href="/imoveis?city=salvador" className="group">
              <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                  alt="Salvador"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-xl">Salvador</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-spacing bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-gray-200">
              Conheça alguns dos nossos projetos de construção realizados
            </p>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                  <div className="bg-white p-8 rounded-b-lg shadow">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Hammer className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Nenhum projeto em destaque encontrado
              </h3>
              <p className="text-gray-300 mb-6">
                Ainda não há projetos em destaque. Consulte todo o nosso portfólio de construção.
              </p>
              <Link href="/construcao">
                <Button className="btn-primary" data-testid="btn-view-all-projects">
                  Ver Todos os Projetos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {featuredProjects.slice(0, 2).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/construcao">
                  <Button
                    size="lg"
                    className="btn-secondary"
                    data-testid="btn-view-all-projects"
                  >
                    Ver Todos os Projetos
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
