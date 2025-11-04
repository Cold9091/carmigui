import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium, type PropertyCategory, type InsertPropertyCategory, type HeroSettings, type InsertHeroSettings, type City, type InsertCity, type AboutUs, type InsertAboutUs, type Employee, type InsertEmployee, type User, type InsertUser } from "@shared/schema";
import session, { type SessionData } from "express-session";
import { createClient } from "@libsql/client";

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<User | undefined>;
  sessionStore: session.Store;
  // Properties
  getProperties(filters?: { categoryId?: string; cityId?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]>;
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

import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  private users: User[] = [];
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Auth
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: user.email,
      password: user.password,
      name: user.name || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    this.users[index] = {
      ...this.users[index],
      password,
      updatedAt: new Date()
    };
    return this.users[index];
  }

  // Properties
  async getProperties(filters?: { categoryId?: string; cityId?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    let result = [...this.properties];
    
    if (filters) {
      if (filters.categoryId) {
        result = result.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.cityId) {
        result = result.filter(p => p.cityId === filters.cityId);
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
      paymentType: property.paymentType ?? "preco_fixo",
      downPayment: property.downPayment ?? null,
      paymentPeriod: property.paymentPeriod ?? null,
      houseCondition: property.houseCondition ?? null,
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
      paymentType: condominium.paymentType ?? "preco_fixo",
      downPayment: condominium.downPayment ?? null,
      paymentPeriod: condominium.paymentPeriod ?? null,
      houseCondition: condominium.houseCondition ?? null,
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

// TursoSessionStore - Session store persistente no Turso
class TursoSessionStore extends session.Store {
  private client: any;
  private saveCounter: Map<string, number> = new Map();

  constructor(client: any) {
    super();
    this.client = client;
  }

  async get(sid: string, callback: (err: any, session?: SessionData | null) => void): Promise<void> {
    try {
      console.log('🔍 Buscando sessão:', sid.substring(0, 8));
      const result = await this.client.execute({
        sql: 'SELECT data, expires FROM sessions WHERE sid = ?',
        args: [sid]
      });
      
      if (result.rows.length === 0) {
        console.log('⚠️ Sessão não encontrada:', sid.substring(0, 8));
        return callback(null, null);
      }
      
      const row = result.rows[0];
      const expires = row.expires as number;
      
      if (expires && expires < Date.now()) {
        console.log('⏰ Sessão expirada:', sid.substring(0, 8));
        await this.destroy(sid, () => {});
        return callback(null, null);
      }
      
      const sessionData = JSON.parse(row.data as string);
      console.log('✅ Sessão recuperada:', sid.substring(0, 8), '| passport:', JSON.stringify(sessionData.passport));
      callback(null, sessionData);
    } catch (error) {
      console.error('❌ Erro ao ler sessão:', error);
      callback(error);
    }
  }

  async set(sid: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
    try {
      const expires = session.cookie?.expires ? new Date(session.cookie.expires).getTime() : Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      // Incrementar contador
      const shortSid = sid.substring(0, 8);
      const count = (this.saveCounter.get(shortSid) || 0) + 1;
      this.saveCounter.set(shortSid, count);
      
      // Log ANTES de stringify para ver se há modificação
      const passportBefore = JSON.stringify(session.passport);
      const data = JSON.stringify(session);
      const passportAfter = JSON.stringify(session.passport);
      
      console.log(`💾 [${count}ª vez] Salvando sessão:`, shortSid, '| passport ANTES:', passportBefore, '| passport DEPOIS:', passportAfter);
      console.log('📦 Dados completos a salvar:', data.substring(0, 200));
      
      // Stack trace para ver quem está chamando
      const stack = new Error().stack?.split('\n').slice(2, 5).join(' <- ');
      console.log('📍 Chamado de:', stack);
      
      await this.client.execute({
        sql: 'INSERT OR REPLACE INTO sessions (sid, data, expires) VALUES (?, ?, ?)',
        args: [sid, data, expires]
      });
      
      console.log(`✅ [${count}ª vez] Sessão salva:`, shortSid);
      if (callback) callback();
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
      if (callback) callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    try {
      await this.client.execute({
        sql: 'DELETE FROM sessions WHERE sid = ?',
        args: [sid]
      });
      if (callback) callback();
    } catch (error) {
      console.error('❌ Erro ao deletar sessão:', error);
      if (callback) callback(error);
    }
  }

  async touch(sid: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
    try {
      const expires = session.cookie?.expires ? new Date(session.cookie.expires).getTime() : Date.now() + (7 * 24 * 60 * 60 * 1000);
      await this.client.execute({
        sql: 'UPDATE sessions SET expires = ? WHERE sid = ?',
        args: [expires, sid]
      });
      if (callback) callback();
    } catch (error) {
      console.error('❌ Erro ao atualizar sessão:', error);
      if (callback) callback(error);
    }
  }
}

// TursoStorage - Implementação com libSQL (Turso Database)
class TursoStorage extends MemoryStorage {
  private client: any;
  private initPromise: Promise<void>;
  public sessionStore: session.Store;

  constructor() {
    super();
    const url = process.env.TURSO_DATABASE_URL!;
    const authToken = process.env.TURSO_AUTH_TOKEN!;
    
    this.client = createClient({ url, authToken });
    
    // Criar session store persistente com Turso
    this.sessionStore = new TursoSessionStore(this.client);
    console.log("✅ TursoSessionStore criado (sessões persistentes)");
    
    this.initPromise = this.initializeTables();
    console.log("✅ TursoStorage conectado:", url.substring(0, 35) + "...");
  }

  private async initializeTables() {
    const tables = [
      { name: 'sessions', sql: 'CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT NOT NULL, expires INTEGER NOT NULL)' },
      { name: 'users', sql: 'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, name TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'property_categories', sql: 'CREATE TABLE IF NOT EXISTS property_categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, image_url TEXT NOT NULL, display_order INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'cities', sql: 'CREATE TABLE IF NOT EXISTS cities (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, image_url TEXT NOT NULL, display_order INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'properties', sql: 'CREATE TABLE IF NOT EXISTS properties (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, price TEXT NOT NULL, city_id TEXT NOT NULL, category_id TEXT NOT NULL, bedrooms INTEGER, bathrooms INTEGER, area INTEGER NOT NULL, images TEXT, virtual_tour_url TEXT, status TEXT, featured INTEGER DEFAULT 0, payment_type TEXT, down_payment TEXT, payment_period TEXT, house_condition TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'projects', sql: 'CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, area INTEGER NOT NULL, duration TEXT NOT NULL, units TEXT NOT NULL, year TEXT NOT NULL, status TEXT NOT NULL, images TEXT, featured INTEGER DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'contacts', sql: 'CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT NOT NULL, message TEXT NOT NULL, created_at INTEGER NOT NULL)' },
      { name: 'condominiums', sql: 'CREATE TABLE IF NOT EXISTS condominiums (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, location TEXT NOT NULL, centrality_or_district TEXT NOT NULL, total_units INTEGER NOT NULL, completed_units INTEGER DEFAULT 0, available_units INTEGER NOT NULL, status TEXT, images TEXT, amenities TEXT, featured INTEGER DEFAULT 0, development_year TEXT NOT NULL, payment_type TEXT, price TEXT NOT NULL, down_payment TEXT, payment_period TEXT, house_condition TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'hero_settings', sql: 'CREATE TABLE IF NOT EXISTS hero_settings (id TEXT PRIMARY KEY, images TEXT, title_line_1 TEXT, title_line_2 TEXT, title_line_3 TEXT, description TEXT NOT NULL, carousel_enabled INTEGER DEFAULT 0, carousel_interval INTEGER DEFAULT 5000, active INTEGER DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'about_us', sql: 'CREATE TABLE IF NOT EXISTS about_us (id TEXT PRIMARY KEY, company_type TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, mission TEXT, vision TEXT, values TEXT, images TEXT, display_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' },
      { name: 'employees', sql: 'CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, name TEXT NOT NULL, position TEXT NOT NULL, department TEXT NOT NULL, bio TEXT, email TEXT, phone TEXT, image_url TEXT, display_order INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)' }
    ];

    for (const table of tables) {
      try {
        await this.client.execute(table.sql);
        console.log(`✅ Tabela ${table.name} criada/verificada`);
      } catch (error: any) {
        console.error(`❌ Erro ao criar tabela ${table.name}:`, error.message);
        // Continua mesmo se uma tabela falhar
      }
    }

    console.log("✅ Inicialização de tabelas Turso concluída");
  }

  private toTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  private fromTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.initPromise;
    try {
      const result = await this.client.execute({
        sql: "SELECT * FROM users WHERE email = ?",
        args: [email]
      });
      
      if (result.rows.length === 0) return undefined;
      
      const row = result.rows[0];
      return {
        id: row.id as string,
        email: row.email as string,
        password: row.password as string,
        name: row.name as string | null,
        createdAt: this.fromTimestamp(row.created_at as number),
        updatedAt: this.fromTimestamp(row.updated_at as number)
      };
    } catch (error) {
      console.error("❌ Erro ao buscar usuário no Turso:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.initPromise;
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = this.toTimestamp(new Date());

    await this.client.execute({
      sql: "INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, user.email, user.password, user.name || null, now, now]
    });

    console.log("✅ Usuário criado no Turso:", user.email);

    return {
      id,
      email: user.email,
      password: user.password,
      name: user.name || null,
      createdAt: this.fromTimestamp(now),
      updatedAt: this.fromTimestamp(now)
    };
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    await this.initPromise;
    const now = this.toTimestamp(new Date());

    await this.client.execute({
      sql: "UPDATE users SET password = ?, updated_at = ? WHERE id = ?",
      args: [password, now, id]
    });

    const result = await this.client.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id]
    });

    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      id: row.id as string,
      email: row.email as string,
      password: row.password as string,
      name: row.name as string | null,
      createdAt: this.fromTimestamp(row.created_at as number),
      updatedAt: this.fromTimestamp(row.updated_at as number)
    };
  }
}

// Escolher storage baseado em variáveis de ambiente
export const storage = (() => {
  const hasTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;
  
  if (hasTurso) {
    try {
      console.log("🚀 Inicializando TursoStorage (persistência real)...");
      return new TursoStorage();
    } catch (error: any) {
      console.error("❌ Erro ao inicializar TursoStorage:", error.message);
      console.log("⚠️  Fallback para MemoryStorage");
      return new MemoryStorage();
    }
  }
  
  const isVercel = !!process.env.VERCEL;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isVercel || isProduction) {
    console.log("⚠️  Usando MemoryStorage (dados temporários - configure Turso para persistência)");
    return new MemoryStorage();
  }
  
  try {
    console.log("💾 Ambiente local - tentando usar SimpleSQLiteStorage");
    const { SimpleSQLiteStorage } = require("./simple-sqlite-storage");
    return new SimpleSQLiteStorage();
  } catch (error: any) {
    console.warn("⚠️  SimpleSQLiteStorage não disponível, usando MemoryStorage:", error.message);
    return new MemoryStorage();
  }
})();
