import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium, type PropertyCategory, type InsertPropertyCategory, type HeroSettings, type InsertHeroSettings, type City, type InsertCity, type AboutUs, type InsertAboutUs, type Employee, type InsertEmployee } from "@shared/schema";

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

  // Property Categories
  getPropertyCategories(activeOnly?: boolean): Promise<PropertyCategory[]>;
  getPropertyCategory(id: string): Promise<PropertyCategory | undefined>;
  createPropertyCategory(category: InsertPropertyCategory): Promise<PropertyCategory>;
  updatePropertyCategory(id: string, category: Partial<InsertPropertyCategory>): Promise<PropertyCategory | undefined>;
  deletePropertyCategory(id: string): Promise<boolean>;

  // Hero Settings
  getHeroSettings(): Promise<HeroSettings | undefined>;
  getHeroSettingsForAdmin(): Promise<HeroSettings | undefined>;
  getHeroSettingsById(id: string): Promise<HeroSettings | undefined>;
  createHeroSettings(heroSettings: InsertHeroSettings): Promise<HeroSettings>;
  updateHeroSettings(id: string, heroSettings: Partial<InsertHeroSettings>): Promise<HeroSettings | undefined>;
  deleteHeroSettings(id: string): Promise<boolean>;

  // Cities
  getCities(activeOnly?: boolean): Promise<City[]>;
  getCity(id: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: string, city: Partial<InsertCity>): Promise<City | undefined>;
  deleteCity(id: string): Promise<boolean>;

  // About Us
  getAboutUsSections(): Promise<AboutUs[]>;
  getAboutUsSection(id: string): Promise<AboutUs | undefined>;
  createAboutUsSection(aboutUs: InsertAboutUs): Promise<AboutUs>;
  updateAboutUsSection(id: string, aboutUs: Partial<InsertAboutUs>): Promise<AboutUs | undefined>;
  deleteAboutUsSection(id: string): Promise<boolean>;

  // Employees
  getEmployees(filters?: { department?: string; activeOnly?: boolean }): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
}

// Sistema de armazenamento limpo - sem dados demonstrativos
// Usa SQLite para desenvolvimento local com possibilidade de migração para Supabase

export class MemoryStorage implements IStorage {
  // Arrays vazios - sem dados demonstrativos
  private properties: Property[] = [];
  private projects: Project[] = [];
  private contacts: Contact[] = [];
  private condominiums: Condominium[] = [];
  private propertyCategories: PropertyCategory[] = [];
  private heroSettings: HeroSettings[] = [];
  private cities: City[] = [];
  private aboutUsSections: AboutUs[] = [];
  private employees: Employee[] = [];

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
      virtualTourUrl: property.virtualTourUrl ?? null,
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

  // Property Categories
  async getPropertyCategories(activeOnly?: boolean): Promise<PropertyCategory[]> {
    let result = [...this.propertyCategories];
    
    if (activeOnly !== undefined && activeOnly) {
      result = result.filter(c => c.active === true);
    }
    
    return result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getPropertyCategory(id: string): Promise<PropertyCategory | undefined> {
    return this.propertyCategories.find(c => c.id === id);
  }

  async createPropertyCategory(category: InsertPropertyCategory): Promise<PropertyCategory> {
    const newCategory: PropertyCategory = {
      id: (this.propertyCategories.length + 1).toString(),
      ...category,
      displayOrder: category.displayOrder ?? 0,
      active: category.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.propertyCategories.push(newCategory);
    return newCategory;
  }

  async updatePropertyCategory(id: string, category: Partial<InsertPropertyCategory>): Promise<PropertyCategory | undefined> {
    const index = this.propertyCategories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.propertyCategories[index] = {
      ...this.propertyCategories[index],
      ...category,
      updatedAt: new Date()
    };
    return this.propertyCategories[index];
  }

  async deletePropertyCategory(id: string): Promise<boolean> {
    const index = this.propertyCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.propertyCategories.splice(index, 1);
    return true;
  }

  async getHeroSettings(): Promise<HeroSettings | undefined> {
    const active = this.heroSettings.filter(h => h.active);
    return active.length > 0 ? active[0] : undefined;
  }

  async getHeroSettingsForAdmin(): Promise<HeroSettings | undefined> {
    return this.heroSettings.length > 0 ? this.heroSettings[0] : undefined;
  }

  async getHeroSettingsById(id: string): Promise<HeroSettings | undefined> {
    return this.heroSettings.find(h => h.id === id);
  }

  async createHeroSettings(heroSettings: InsertHeroSettings): Promise<HeroSettings> {
    const newHeroSettings: HeroSettings = {
      id: (this.heroSettings.length + 1).toString(),
      images: heroSettings.images ?? [],
      titleLine1: heroSettings.titleLine1 ?? "BEM-VINDO",
      titleLine2: heroSettings.titleLine2 ?? "AO SEU NOVO",
      titleLine3: heroSettings.titleLine3 ?? "COMEÇO !",
      description: heroSettings.description ?? "Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.",
      carouselEnabled: heroSettings.carouselEnabled ?? false,
      carouselInterval: heroSettings.carouselInterval ?? 5000,
      active: heroSettings.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.heroSettings.push(newHeroSettings);
    return newHeroSettings;
  }

  async updateHeroSettings(id: string, heroSettings: Partial<InsertHeroSettings>): Promise<HeroSettings | undefined> {
    const index = this.heroSettings.findIndex(h => h.id === id);
    if (index === -1) return undefined;
    
    this.heroSettings[index] = {
      ...this.heroSettings[index],
      ...heroSettings,
      updatedAt: new Date()
    };
    return this.heroSettings[index];
  }

  async deleteHeroSettings(id: string): Promise<boolean> {
    const index = this.heroSettings.findIndex(h => h.id === id);
    if (index === -1) return false;
    
    this.heroSettings.splice(index, 1);
    return true;
  }

  // Cities
  async getCities(activeOnly?: boolean): Promise<City[]> {
    let result = [...this.cities];
    
    if (activeOnly !== undefined && activeOnly) {
      result = result.filter(c => c.active === true);
    }
    
    return result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getCity(id: string): Promise<City | undefined> {
    return this.cities.find(c => c.id === id);
  }

  async createCity(city: InsertCity): Promise<City> {
    const newCity: City = {
      id: (this.cities.length + 1).toString(),
      ...city,
      displayOrder: city.displayOrder ?? 0,
      active: city.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cities.push(newCity);
    return newCity;
  }

  async updateCity(id: string, city: Partial<InsertCity>): Promise<City | undefined> {
    const index = this.cities.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.cities[index] = {
      ...this.cities[index],
      ...city,
      updatedAt: new Date()
    };
    return this.cities[index];
  }

  async deleteCity(id: string): Promise<boolean> {
    const index = this.cities.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.cities.splice(index, 1);
    return true;
  }

  // About Us
  async getAboutUsSections(): Promise<AboutUs[]> {
    return [...this.aboutUsSections].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getAboutUsSection(id: string): Promise<AboutUs | undefined> {
    return this.aboutUsSections.find(a => a.id === id);
  }

  async createAboutUsSection(aboutUs: InsertAboutUs): Promise<AboutUs> {
    const newAboutUs: AboutUs = {
      id: (this.aboutUsSections.length + 1).toString(),
      ...aboutUs,
      mission: aboutUs.mission ?? null,
      vision: aboutUs.vision ?? null,
      values: aboutUs.values ?? [],
      images: aboutUs.images ?? [],
      displayOrder: aboutUs.displayOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aboutUsSections.push(newAboutUs);
    return newAboutUs;
  }

  async updateAboutUsSection(id: string, aboutUs: Partial<InsertAboutUs>): Promise<AboutUs | undefined> {
    const index = this.aboutUsSections.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.aboutUsSections[index] = {
      ...this.aboutUsSections[index],
      ...aboutUs,
      updatedAt: new Date()
    };
    return this.aboutUsSections[index];
  }

  async deleteAboutUsSection(id: string): Promise<boolean> {
    const index = this.aboutUsSections.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.aboutUsSections.splice(index, 1);
    return true;
  }

  // Employees
  async getEmployees(filters?: { department?: string; activeOnly?: boolean }): Promise<Employee[]> {
    let result = [...this.employees];
    
    if (filters) {
      if (filters.department) {
        result = result.filter(e => e.department === filters.department);
      }
      if (filters.activeOnly !== undefined && filters.activeOnly) {
        result = result.filter(e => e.active === true);
      }
    }
    
    return result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.find(e => e.id === id);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const newEmployee: Employee = {
      id: (this.employees.length + 1).toString(),
      ...employee,
      bio: employee.bio ?? null,
      email: employee.email ?? null,
      phone: employee.phone ?? null,
      imageUrl: employee.imageUrl ?? null,
      displayOrder: employee.displayOrder ?? 0,
      active: employee.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    
    this.employees[index] = {
      ...this.employees[index],
      ...employee,
      updatedAt: new Date()
    };
    return this.employees[index];
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    this.employees.splice(index, 1);
    return true;
  }
}

// Importar SimpleSQLiteStorage para usar banco de dados real
import { SimpleSQLiteStorage } from "./simple-sqlite-storage";

// Usar SimpleSQLiteStorage para dados reais persistidos no banco de dados
// A MemoryStorage fica como fallback se SQLite falhar
export const storage = (() => {
  try {
    return new SimpleSQLiteStorage();
  } catch (error) {
    console.error("Erro ao inicializar SimpleSQLiteStorage, usando MemoryStorage como fallback:", error);
    return new MemoryStorage();
  }
})();
