import { useQuery } from "@tanstack/react-query";
import { Building2, Home, Users, Target, Eye, Heart, Phone, Mail, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AboutUs, Employee } from "@shared/schema";
import logoImage from "@assets/Component 2 1_1760109982800.png";

export default function SobreNosPage() {
  const { data: aboutUsSections = [], isLoading: isLoadingAbout } = useQuery<AboutUs[]>({
    queryKey: ["/api/about-us"],
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
    select: (data) => data.filter(emp => emp.active),
  });

  const imobiliarioSection = aboutUsSections.find(section => section.companyType === 'imobiliario');
  const construtoraSection = aboutUsSections.find(section => section.companyType === 'construtora');
  
  const imobiliarioEmployees = employees.filter(emp => emp.department === 'imobiliario');
  const construtoraEmployees = employees.filter(emp => emp.department === 'construtora');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto container-padding py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <img 
                src={logoImage} 
                alt="CM Carmigui" 
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" data-testid="text-hero-title">
              SOBRE NÓS
            </h1>
            <p className="text-lg md:text-xl text-gray-200" data-testid="text-hero-subtitle">
              CONHEÇA A CARMIGUI - COMPROMISSO COM EXCELÊNCIA E CONFIANÇA
            </p>
          </div>
        </div>
      </section>

      {/* Carmigui Imobiliário Section */}
      {imobiliarioSection && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-imobiliario-title">
                    {imobiliarioSection.title}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6" data-testid="text-imobiliario-description">
                  {imobiliarioSection.description}
                </p>
                
                {imobiliarioSection.mission && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Missão</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{imobiliarioSection.mission}</p>
                  </div>
                )}
                
                {imobiliarioSection.vision && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Visão</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{imobiliarioSection.vision}</p>
                  </div>
                )}
                
                {imobiliarioSection.values && imobiliarioSection.values.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Valores</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {imobiliarioSection.values.map((value, idx) => (
                        <li key={idx}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {imobiliarioSection.images && imobiliarioSection.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {imobiliarioSection.images.slice(0, 4).map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${imobiliarioSection.title} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Carmigui Construtora Section */}
      {construtoraSection && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {construtoraSection.images && construtoraSection.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 order-2 md:order-1">
                  {construtoraSection.images.slice(0, 4).map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${construtoraSection.title} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
              
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Home className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-construtora-title">
                    {construtoraSection.title}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6" data-testid="text-construtora-description">
                  {construtoraSection.description}
                </p>
                
                {construtoraSection.mission && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Missão</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{construtoraSection.mission}</p>
                  </div>
                )}
                
                {construtoraSection.vision && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Visão</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{construtoraSection.vision}</p>
                  </div>
                )}
                
                {construtoraSection.values && construtoraSection.values.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Valores</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {construtoraSection.values.map((value, idx) => (
                        <li key={idx}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nossa Equipe Section */}
      {employees.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                NOSSA EQUIPE
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conheça os profissionais dedicados que tornam a Carmigui uma referência em excelência
              </p>
            </div>

            {imobiliarioEmployees.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-green-600" />
                  Equipe Imobiliário
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imobiliarioEmployees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`employee-card-${employee.id}`}>
                      <CardContent className="p-6">
                        {employee.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={employee.imageUrl}
                              alt={employee.name}
                              className="w-24 h-24 rounded-full mx-auto object-cover"
                            />
                          </div>
                        )}
                        <div className="text-center">
                          <h4 className="font-bold text-lg text-gray-900" data-testid={`text-employee-name-${employee.id}`}>
                            {employee.name}
                          </h4>
                          <p className="text-green-600 font-medium mb-3" data-testid={`text-employee-position-${employee.id}`}>
                            {employee.position}
                          </p>
                          {employee.bio && (
                            <p className="text-gray-600 text-sm mb-4">{employee.bio}</p>
                          )}
                          <div className="space-y-2">
                            {employee.email && (
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${employee.email}`} className="hover:text-green-600">
                                  {employee.email}
                                </a>
                              </div>
                            )}
                            {employee.phone && (
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${employee.phone}`} className="hover:text-green-600">
                                  {employee.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {construtoraEmployees.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Home className="h-6 w-6 text-green-600" />
                  Equipe Construtora
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {construtoraEmployees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`employee-card-${employee.id}`}>
                      <CardContent className="p-6">
                        {employee.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={employee.imageUrl}
                              alt={employee.name}
                              className="w-24 h-24 rounded-full mx-auto object-cover"
                            />
                          </div>
                        )}
                        <div className="text-center">
                          <h4 className="font-bold text-lg text-gray-900" data-testid={`text-employee-name-${employee.id}`}>
                            {employee.name}
                          </h4>
                          <p className="text-green-600 font-medium mb-3" data-testid={`text-employee-position-${employee.id}`}>
                            {employee.position}
                          </p>
                          {employee.bio && (
                            <p className="text-gray-600 text-sm mb-4">{employee.bio}</p>
                          )}
                          <div className="space-y-2">
                            {employee.email && (
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${employee.email}`} className="hover:text-green-600">
                                  {employee.email}
                                </a>
                              </div>
                            )}
                            {employee.phone && (
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${employee.phone}`} className="hover:text-green-600">
                                  {employee.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            PRONTO PARA TRABALHAR CONOSCO?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Entre em contato e descubra como podemos ajudar a realizar seus projetos
          </p>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-semibold"
            data-testid="btn-contact"
            onClick={() => window.location.href = '/contacto'}
          >
            ENTRAR EM CONTACTO
          </Button>
        </div>
      </section>
    </div>
  );
}
