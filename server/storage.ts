import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium } from "@shared/schema";

export interface IStorage {
  // Properties
  getProperties(filters?: { type?: string; location?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;

  // Projects
  getProjects(featured?: boolean): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;

  // Condominiums
  getCondominiums(featured?: boolean): Promise<Condominium[]>;
  getCondominium(id: string): Promise<Condominium | undefined>;
  createCondominium(condominium: InsertCondominium): Promise<Condominium>;
  updateCondominium(id: string, condominium: Partial<InsertCondominium>): Promise<Condominium | undefined>;
  deleteCondominium(id: string): Promise<boolean>;
}

// TODO: Preparar para integração futura com Supabase
// Quando implementar Supabase, trocar MemoryStorage por SupabaseStorage
// que implementará a mesma interface IStorage

export class MemoryStorage implements IStorage {
  private properties: Property[] = [
    {
      id: "1",
      title: "Apartamento T3 em Luanda Sul",
      description: "Luxuoso apartamento com 3 quartos, 2 casas de banho, sala ampla e cozinha moderna. Localizado numa das melhores zonas de Luanda Sul, com vista para o mar.",
      price: "180000000",
      location: "Luanda Sul",
      type: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      images: ["/images/apartment1.jpg", "/images/apartment1-2.jpg"],
      virtualTourUrl: "https://my.matterport.com/show/?m=vLYoS66CWpk",
      status: "available",
      featured: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15")
    },
    {
      id: "2",
      title: "Casa T4 na Ilha de Luanda",
      description: "Casa familiar com 4 quartos, jardim privado, garagem para 2 carros. Zona exclusiva da Ilha de Luanda com segurança 24h.",
      price: "350000000",
      location: "Ilha de Luanda",
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      images: ["/images/house1.jpg", "/images/house1-2.jpg"],
      virtualTourUrl: "https://my.matterport.com/show/?m=ZeJ9oKnGqGG",
      status: "available",
      featured: true,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10")
    },
    {
      id: "3",
      title: "Escritório no Centro de Luanda",
      description: "Espaço comercial moderno no coração da cidade, ideal para empresas. Ar condicionado, elevador, segurança.",
      price: "120000000",
      location: "Centro de Luanda",
      type: "office",
      bedrooms: null,
      bathrooms: 2,
      area: 80,
      images: ["/images/office1.jpg"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05")
    },
    {
      id: "4",
      title: "Apartamento T2 na Talatona",
      description: "Moderno apartamento de 2 quartos na zona da Talatona. Condomínio fechado com piscina e ginásio.",
      price: "95000000",
      location: "Talatona",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      images: ["/images/apartment2.jpg"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-12")
    },
    {
      id: "5",
      title: "Casa T5 no Benfica",
      description: "Ampla casa familiar com 5 quartos, jardim extenso, piscina e churrasqueira. Perfeita para famílias grandes.",
      price: "280000000",
      location: "Benfica",
      type: "house",
      bedrooms: 5,
      bathrooms: 4,
      area: 320,
      images: ["/images/house2.jpg", "/images/house2-2.jpg"],
      virtualTourUrl: "https://kuula.co/share/collection/7lBGt",
      status: "available",
      featured: true,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08")
    },
    {
      id: "6",
      title: "Terreno em Viana",
      description: "Terreno plano de 500m² ideal para construção de moradia. Localização estratégica com fácil acesso.",
      price: "45000000",
      location: "Viana",
      type: "land",
      bedrooms: null,
      bathrooms: null,
      area: 500,
      images: ["/images/land1.jpg"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03")
    },
    {
      id: "7",
      title: "Apartamento T1 no Miramar",
      description: "Apartamento compacto e moderno, ideal para jovens profissionais. Vista para o mar e próximo a restaurantes.",
      price: "75000000",
      location: "Miramar",
      type: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 55,
      images: ["/images/apartment3.jpg"],
      virtualTourUrl: null,
      status: "available",
      featured: false,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02")
    },
    {
      id: "8",
      title: "Loja Comercial na Maianga",
      description: "Espaço comercial térreo com grande visibilidade, ideal para comércio. Zona de grande movimento.",
      price: "85000000",
      location: "Maianga",
      type: "office",
      bedrooms: null,
      bathrooms: 1,
      area: 45,
      images: ["/images/shop1.jpg"],
      virtualTourUrl: null,
      status: "sold",
      featured: false,
      createdAt: new Date("2023-12-20"),
      updatedAt: new Date("2024-01-15")
    }
  ];

  private projects: Project[] = [
    {
      id: "1",
      title: "Complexo Residencial Talatona Gardens",
      description: "Moderno complexo residencial com apartamentos T2, T3 e T4. Inclui piscina, ginásio, parque infantil e segurança 24h.",
      area: 15000,
      duration: "24 meses",
      units: "120 apartamentos",
      year: "2024",
      status: "in-progress",
      images: ["/images/project1.jpg", "/images/project1-2.jpg"],
      featured: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "2",
      title: "Centro Comercial Benfica Plaza",
      description: "Centro comercial moderno com lojas, restaurantes, cinema e estacionamento. Localização privilegiada em Benfica.",
      area: 8000,
      duration: "18 meses",
      units: "45 lojas",
      year: "2023",
      status: "completed",
      images: ["/images/project2.jpg"],
      featured: true,
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-12-01")
    },
    {
      id: "3",
      title: "Condomínio Luanda Bay",
      description: "Desenvolvimento de luxo na beira-mar com apartamentos e penthouses. Vista panorâmica do oceano.",
      area: 25000,
      duration: "36 meses",
      units: "200 apartamentos",
      year: "2024",
      status: "planning",
      images: ["/images/project3.jpg"],
      featured: true,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20")
    },
    {
      id: "4",
      title: "Edifício de Escritórios Marginal",
      description: "Torre comercial moderna com 20 andares, localizada na Marginal de Luanda. Espaços corporativos premium.",
      area: 12000,
      duration: "30 meses",
      units: "180 escritórios",
      year: "2023",
      status: "in-progress",
      images: ["/images/project4.jpg"],
      featured: false,
      createdAt: new Date("2023-08-01"),
      updatedAt: new Date("2024-01-10")
    }
  ];

  private contacts: Contact[] = [];

  private condominiums: Condominium[] = [
    {
      id: "1",
      name: "Condomínio Miramar Residence",
      description: "Condomínio de luxo com vista para o mar, piscina, ginásio e segurança 24h. Apartamentos T2, T3 e T4 disponíveis.",
      location: "Miramar",
      centralityOrDistrict: "Luanda",
      totalUnits: 80,
      completedUnits: 60,
      availableUnits: 15,
      priceRange: "150M - 400M AKZ",
      status: "in-development",
      images: ["/images/condominium1.jpg", "/images/condominium1-2.jpg"],
      amenities: ["Piscina", "Ginásio", "Segurança 24h", "Parque infantil", "Estacionamento"],
      featured: true,
      developmentYear: "2024",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "2",
      name: "Talatona Premium Village",
      description: "Condomínio familiar na Talatona com casas geminadas e apartamentos. Zona verde, parque infantil e centro comercial integrado.",
      location: "Talatona",
      centralityOrDistrict: "Belas",
      totalUnits: 150,
      completedUnits: 120,
      availableUnits: 25,
      priceRange: "80M - 200M AKZ",
      status: "in-development",
      images: ["/images/condominium2.jpg"],
      amenities: ["Zona verde", "Parque infantil", "Centro comercial", "Segurança 24h", "Campo de futebol"],
      featured: true,
      developmentYear: "2023",
      createdAt: new Date("2023-05-01"),
      updatedAt: new Date("2024-01-15")
    },
    {
      id: "3",
      name: "Benfica Gardens",
      description: "Condomínio exclusivo no Benfica com apartamentos de alta qualidade. Design contemporâneo e acabamentos premium.",
      location: "Benfica",
      centralityOrDistrict: "Luanda",
      totalUnits: 60,
      completedUnits: 60,
      availableUnits: 8,
      priceRange: "200M - 500M AKZ",
      status: "completed",
      images: ["/images/condominium3.jpg", "/images/condominium3-2.jpg"],
      amenities: ["Piscina", "Ginásio", "Spa", "Segurança 24h", "Sala de eventos", "Estacionamento subterrâneo"],
      featured: false,
      developmentYear: "2022",
      createdAt: new Date("2022-03-01"),
      updatedAt: new Date("2023-08-01")
    }
  ];

  // Properties
  async getProperties(filters?: { type?: string; location?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    let result = [...this.properties];
    
    if (filters) {
      if (filters.type) {
        result = result.filter(p => p.type === filters.type);
      }
      if (filters.location) {
        result = result.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.minPrice) {
        result = result.filter(p => Number(p.price) >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        result = result.filter(p => Number(p.price) <= filters.maxPrice!);
      }
      if (filters.featured !== undefined) {
        result = result.filter(p => p.featured === filters.featured);
      }
    }
    
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.find(p => p.id === id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const newProperty: Property = {
      id: (this.properties.length + 1).toString(),
      ...property,
      bedrooms: property.bedrooms ?? null,
      bathrooms: property.bathrooms ?? null,
      images: property.images ?? [],
      status: property.status ?? "available",
      featured: property.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.properties[index] = {
      ...this.properties[index],
      ...property,
      updatedAt: new Date()
    };
    return this.properties[index];
  }

  async deleteProperty(id: string): Promise<boolean> {
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.properties.splice(index, 1);
    return true;
  }

  // Projects
  async getProjects(featured?: boolean): Promise<Project[]> {
    let result = [...this.projects];
    
    if (featured !== undefined) {
      result = result.filter(p => p.featured === featured);
    }
    
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: (this.projects.length + 1).toString(),
      ...project,
      images: project.images ?? [],
      featured: project.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.projects[index] = {
      ...this.projects[index],
      ...project,
      updatedAt: new Date()
    };
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.projects.splice(index, 1);
    return true;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return [...this.contacts].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact: Contact = {
      id: (this.contacts.length + 1).toString(),
      ...contact,
      phone: contact.phone ?? null,
      createdAt: new Date()
    };
    this.contacts.push(newContact);
    return newContact;
  }

  async deleteContact(id: string): Promise<boolean> {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.contacts.splice(index, 1);
    return true;
  }

  // Condominiums
  async getCondominiums(featured?: boolean): Promise<Condominium[]> {
    let result = [...this.condominiums];
    
    if (featured !== undefined) {
      result = result.filter(c => c.featured === featured);
    }
    
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCondominium(id: string): Promise<Condominium | undefined> {
    return this.condominiums.find(c => c.id === id);
  }

  async createCondominium(condominium: InsertCondominium): Promise<Condominium> {
    const newCondominium: Condominium = {
      id: (this.condominiums.length + 1).toString(),
      ...condominium,
      completedUnits: condominium.completedUnits ?? 0,
      images: condominium.images ?? [],
      amenities: condominium.amenities ?? [],
      featured: condominium.featured ?? false,
      status: condominium.status ?? "in-development",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.condominiums.push(newCondominium);
    return newCondominium;
  }

  async updateCondominium(id: string, condominium: Partial<InsertCondominium>): Promise<Condominium | undefined> {
    const index = this.condominiums.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.condominiums[index] = {
      ...this.condominiums[index],
      ...condominium,
      updatedAt: new Date()
    };
    return this.condominiums[index];
  }

  async deleteCondominium(id: string): Promise<boolean> {
    const index = this.condominiums.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.condominiums.splice(index, 1);
    return true;
  }
}

// Usar MemoryStorage para desenvolvimento do frontend
// TODO: Trocar por SupabaseStorage quando implementar Supabase
export const storage = new MemoryStorage();
