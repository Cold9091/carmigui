import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium, type PropertyCategory, type InsertPropertyCategory, type HeroSettings, type InsertHeroSettings, type City, type InsertCity, type AboutCompany, type InsertAboutCompany, type TeamMember, type InsertTeamMember } from "@shared/schema";

export interface IStorage {
  // Properties
  getProperties(filters?: { minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]>;
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

  // About Company
  getAboutCompanyInfo(division?: string): Promise<AboutCompany[]>;
  getAboutCompany(id: string): Promise<AboutCompany | undefined>;
  createAboutCompany(aboutCompany: InsertAboutCompany): Promise<AboutCompany>;
  updateAboutCompany(id: string, aboutCompany: Partial<InsertAboutCompany>): Promise<AboutCompany | undefined>;
  deleteAboutCompany(id: string): Promise<boolean>;

  // Team Members
  getTeamMembers(filters?: { division?: string; activeOnly?: boolean }): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
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
  private aboutCompany: AboutCompany[] = [];
  private teamMembers: TeamMember[] = [];

  // Properties
  async getProperties(filters?: { minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    let result = [...this.properties];
    
    if (filters) {
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

  // About Company
  async getAboutCompanyInfo(division?: string): Promise<AboutCompany[]> {
    let result = [...this.aboutCompany];
    if (division) {
      result = result.filter(ac => ac.division === division);
    }
    return result;
  }

  async getAboutCompany(id: string): Promise<AboutCompany | undefined> {
    return this.aboutCompany.find(ac => ac.id === id);
  }

  async createAboutCompany(aboutCompany: InsertAboutCompany): Promise<AboutCompany> {
    const newAboutCompany: AboutCompany = {
      id: (this.aboutCompany.length + 1).toString(),
      ...aboutCompany,
      mission: aboutCompany.mission ?? null,
      vision: aboutCompany.vision ?? null,
      values: aboutCompany.values ?? [],
      imageUrl: aboutCompany.imageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aboutCompany.push(newAboutCompany);
    return newAboutCompany;
  }

  async updateAboutCompany(id: string, aboutCompany: Partial<InsertAboutCompany>): Promise<AboutCompany | undefined> {
    const index = this.aboutCompany.findIndex(ac => ac.id === id);
    if (index === -1) return undefined;
    
    this.aboutCompany[index] = {
      ...this.aboutCompany[index],
      ...aboutCompany,
      updatedAt: new Date()
    };
    return this.aboutCompany[index];
  }

  async deleteAboutCompany(id: string): Promise<boolean> {
    const index = this.aboutCompany.findIndex(ac => ac.id === id);
    if (index === -1) return false;
    
    this.aboutCompany.splice(index, 1);
    return true;
  }

  // Team Members
  async getTeamMembers(filters?: { division?: string; activeOnly?: boolean }): Promise<TeamMember[]> {
    let result = [...this.teamMembers];
    
    if (filters) {
      if (filters.division) {
        result = result.filter(tm => tm.division === filters.division);
      }
      if (filters.activeOnly) {
        result = result.filter(tm => tm.active === true);
      }
    }
    
    return result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return this.teamMembers.find(tm => tm.id === id);
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const newTeamMember: TeamMember = {
      id: (this.teamMembers.length + 1).toString(),
      ...teamMember,
      bio: teamMember.bio ?? null,
      imageUrl: teamMember.imageUrl ?? null,
      email: teamMember.email ?? null,
      phone: teamMember.phone ?? null,
      displayOrder: teamMember.displayOrder ?? 0,
      active: teamMember.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.teamMembers.push(newTeamMember);
    return newTeamMember;
  }

  async updateTeamMember(id: string, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const index = this.teamMembers.findIndex(tm => tm.id === id);
    if (index === -1) return undefined;
    
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...teamMember,
      updatedAt: new Date()
    };
    return this.teamMembers[index];
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const index = this.teamMembers.findIndex(tm => tm.id === id);
    if (index === -1) return false;
    
    this.teamMembers.splice(index, 1);
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
