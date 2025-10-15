import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium, type PropertyCategory, type InsertPropertyCategory, type HeroSettings, type InsertHeroSettings, type City, type InsertCity, type AboutUs, type InsertAboutUs, type Employee, type InsertEmployee } from "@shared/schema";
import { IStorage } from "./storage";
import Database from 'better-sqlite3';

// Criar conexão SQLite diretamente
const sqlite = new Database('./database.db');

// Criar tabelas se não existirem
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area INTEGER NOT NULL,
    images TEXT DEFAULT '[]',
    virtual_tour_url TEXT,
    status TEXT NOT NULL DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    area INTEGER NOT NULL,
    duration TEXT NOT NULL,
    units TEXT NOT NULL,
    year TEXT NOT NULL,
    status TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    featured BOOLEAN DEFAULT FALSE,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS condominiums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    centrality_or_district TEXT NOT NULL,
    total_units INTEGER NOT NULL,
    completed_units INTEGER DEFAULT 0,
    available_units INTEGER NOT NULL,
    price_range TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'in-development',
    images TEXT DEFAULT '[]',
    amenities TEXT DEFAULT '[]',
    featured BOOLEAN DEFAULT FALSE,
    development_year TEXT NOT NULL,
    sale_conditions TEXT,
    total_value TEXT,
    initial_payment TEXT,
    payment_period TEXT,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS property_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS hero_settings (
    id TEXT PRIMARY KEY,
    images TEXT DEFAULT '[]',
    title_line_1 TEXT NOT NULL DEFAULT 'BEM-VINDO',
    title_line_2 TEXT NOT NULL DEFAULT 'AO SEU NOVO',
    title_line_3 TEXT NOT NULL DEFAULT 'COMEÇO !',
    description TEXT NOT NULL DEFAULT 'Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.',
    carousel_enabled BOOLEAN DEFAULT FALSE,
    carousel_interval INTEGER DEFAULT 5000,
    active BOOLEAN DEFAULT TRUE,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS about_us (
    id TEXT PRIMARY KEY,
    company_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    mission TEXT,
    vision TEXT,
    "values" TEXT DEFAULT '[]',
    images TEXT DEFAULT '[]',
    display_order INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT
  );
  
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    phone TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TEXT,
    updated_at TEXT
  );
`);

// Add missing columns to existing tables if they don't exist
try {
  const tableInfo = sqlite.prepare("PRAGMA table_info(condominiums)").all();
  const columns = tableInfo.map((col: any) => col.name);
  
  if (!columns.includes('sale_conditions')) {
    sqlite.exec('ALTER TABLE condominiums ADD COLUMN sale_conditions TEXT');
  }
  if (!columns.includes('total_value')) {
    sqlite.exec('ALTER TABLE condominiums ADD COLUMN total_value TEXT');
  }
  if (!columns.includes('initial_payment')) {
    sqlite.exec('ALTER TABLE condominiums ADD COLUMN initial_payment TEXT');
  }
  if (!columns.includes('payment_period')) {
    sqlite.exec('ALTER TABLE condominiums ADD COLUMN payment_period TEXT');
  }
} catch (error) {
  console.error("Error adding columns to condominiums table:", error);
}

export class SimpleSQLiteStorage implements IStorage {
  // Properties
  async getProperties(filters?: { type?: string; location?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    try {
      let sql = 'SELECT * FROM properties WHERE 1=1';
      const params: any[] = [];
      
      if (filters) {
        if (filters.type) {
          sql += ' AND type = ?';
          params.push(filters.type);
        }
        if (filters.location) {
          sql += ' AND location LIKE ?';
          params.push(`%${filters.location}%`);
        }
        if (filters.minPrice) {
          sql += ' AND CAST(price AS INTEGER) >= ?';
          params.push(filters.minPrice);
        }
        if (filters.maxPrice) {
          sql += ' AND CAST(price AS INTEGER) <= ?';
          params.push(filters.maxPrice);
        }
        if (filters.featured !== undefined) {
          sql += ' AND featured = ?';
          params.push(filters.featured ? 1 : 0);
        }
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(params);
      
      return results.map(this.convertPropertyFromDB);
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM properties WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertPropertyFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching property:", error);
      return undefined;
    }
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO properties (
          id, title, description, price, location, type, bedrooms, bathrooms, 
          area, images, virtual_tour_url, status, featured, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        property.title,
        property.description,
        property.price,
        property.location,
        property.type,
        property.bedrooms || null,
        property.bathrooms || null,
        property.area,
        JSON.stringify(property.images || []),
        property.virtualTourUrl || null,
        property.status || 'available',
        property.featured ? 1 : 0,
        now,
        now
      );
      
      const newProperty = await this.getProperty(id);
      if (!newProperty) throw new Error("Failed to retrieve created property");
      return newProperty;
    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error("Failed to create property");
    }
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    try {
      const existingProperty = await this.getProperty(id);
      if (!existingProperty) return undefined;
      
      const updates: string[] = [];
      const params: any[] = [];
      
      if (property.title !== undefined) {
        updates.push('title = ?');
        params.push(property.title);
      }
      if (property.description !== undefined) {
        updates.push('description = ?');
        params.push(property.description);
      }
      if (property.price !== undefined) {
        updates.push('price = ?');
        params.push(property.price);
      }
      if (property.location !== undefined) {
        updates.push('location = ?');
        params.push(property.location);
      }
      if (property.type !== undefined) {
        updates.push('type = ?');
        params.push(property.type);
      }
      if (property.bedrooms !== undefined) {
        updates.push('bedrooms = ?');
        params.push(property.bedrooms);
      }
      if (property.bathrooms !== undefined) {
        updates.push('bathrooms = ?');
        params.push(property.bathrooms);
      }
      if (property.area !== undefined) {
        updates.push('area = ?');
        params.push(property.area);
      }
      if (property.images !== undefined) {
        updates.push('images = ?');
        params.push(JSON.stringify(property.images));
      }
      if (property.virtualTourUrl !== undefined) {
        updates.push('virtual_tour_url = ?');
        params.push(property.virtualTourUrl);
      }
      if (property.status !== undefined) {
        updates.push('status = ?');
        params.push(property.status);
      }
      if (property.featured !== undefined) {
        updates.push('featured = ?');
        params.push(property.featured ? 1 : 0);
      }
      
      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE properties SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(...params);
      
      return this.getProperty(id);
    } catch (error) {
      console.error("Error updating property:", error);
      return undefined;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM properties WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting property:", error);
      return false;
    }
  }

  // Projects
  async getProjects(featured?: boolean): Promise<Project[]> {
    try {
      let sql = 'SELECT * FROM projects WHERE 1=1';
      const params: any[] = [];
      
      if (featured !== undefined) {
        sql += ' AND featured = ?';
        params.push(featured ? 1 : 0);
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(params);
      
      return results.map(this.convertProjectFromDB);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM projects WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertProjectFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO projects (
          id, title, description, area, duration, units, year, status, images, featured, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        project.title,
        project.description,
        project.area,
        project.duration,
        project.units,
        project.year,
        project.status,
        JSON.stringify(project.images || []),
        project.featured ? 1 : 0,
        now,
        now
      );
      
      const newProject = await this.getProject(id);
      if (!newProject) throw new Error("Failed to retrieve created project");
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const existingProject = await this.getProject(id);
      if (!existingProject) return undefined;
      
      const updates: string[] = [];
      const params: any[] = [];
      
      Object.keys(project).forEach(key => {
        const value = (project as any)[key];
        if (value !== undefined) {
          if (key === 'images') {
            updates.push('images = ?');
            params.push(JSON.stringify(value));
          } else if (key === 'featured') {
            updates.push('featured = ?');
            params.push(value ? 1 : 0);
          } else {
            updates.push(`${key} = ?`);
            params.push(value);
          }
        }
      });
      
      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(...params);
      
      return this.getProject(id);
    } catch (error) {
      console.error("Error updating project:", error);
      return undefined;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM projects WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM contacts ORDER BY created_at DESC');
      const results = stmt.all();
      return results.map(this.convertContactFromDB);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO contacts (id, name, email, phone, subject, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        contact.name,
        contact.email,
        contact.phone || null,
        contact.subject,
        contact.message,
        now
      );
      
      const newContact = this.getContact(id);
      if (!newContact) throw new Error("Failed to retrieve created contact");
      return Promise.resolve(newContact);
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact");
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM contacts WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  }

  // Condominiums
  async getCondominiums(featured?: boolean): Promise<Condominium[]> {
    try {
      let sql = 'SELECT * FROM condominiums WHERE 1=1';
      const params: any[] = [];
      
      if (featured !== undefined) {
        sql += ' AND featured = ?';
        params.push(featured ? 1 : 0);
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(params);
      
      return results.map(this.convertCondominiumFromDB);
    } catch (error) {
      console.error("Error fetching condominiums:", error);
      return [];
    }
  }

  async getCondominium(id: string): Promise<Condominium | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM condominiums WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertCondominiumFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching condominium:", error);
      return undefined;
    }
  }

  async createCondominium(condominium: InsertCondominium): Promise<Condominium> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO condominiums (
          id, name, description, location, centrality_or_district, total_units, 
          completed_units, available_units, price_range, status, images, amenities, 
          featured, development_year, sale_conditions, total_value, initial_payment, payment_period, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        condominium.name,
        condominium.description,
        condominium.location,
        condominium.centralityOrDistrict,
        condominium.totalUnits,
        condominium.completedUnits || 0,
        condominium.availableUnits,
        condominium.priceRange,
        condominium.status || 'in-development',
        JSON.stringify(condominium.images || []),
        JSON.stringify(condominium.amenities || []),
        condominium.featured ? 1 : 0,
        condominium.developmentYear,
        condominium.saleConditions || null,
        condominium.totalValue || null,
        condominium.initialPayment || null,
        condominium.paymentPeriod || null,
        now,
        now
      );
      
      const newCondominium = await this.getCondominium(id);
      if (!newCondominium) throw new Error("Failed to retrieve created condominium");
      return newCondominium;
    } catch (error) {
      console.error("Error creating condominium:", error);
      throw new Error("Failed to create condominium");
    }
  }

  async updateCondominium(id: string, condominium: Partial<InsertCondominium>): Promise<Condominium | undefined> {
    try {
      const existingCondominium = await this.getCondominium(id);
      if (!existingCondominium) return undefined;
      
      const updates: string[] = [];
      const params: any[] = [];
      
      Object.keys(condominium).forEach(key => {
        const value = (condominium as any)[key];
        if (value !== undefined) {
          if (key === 'images' || key === 'amenities') {
            updates.push(`${key} = ?`);
            params.push(JSON.stringify(value));
          } else if (key === 'featured') {
            updates.push('featured = ?');
            params.push(value ? 1 : 0);
          } else if (key === 'centralityOrDistrict') {
            updates.push('centrality_or_district = ?');
            params.push(value);
          } else if (key === 'totalUnits') {
            updates.push('total_units = ?');
            params.push(value);
          } else if (key === 'completedUnits') {
            updates.push('completed_units = ?');
            params.push(value);
          } else if (key === 'availableUnits') {
            updates.push('available_units = ?');
            params.push(value);
          } else if (key === 'priceRange') {
            updates.push('price_range = ?');
            params.push(value);
          } else if (key === 'developmentYear') {
            updates.push('development_year = ?');
            params.push(value);
          } else if (key === 'saleConditions') {
            updates.push('sale_conditions = ?');
            params.push(value);
          } else if (key === 'totalValue') {
            updates.push('total_value = ?');
            params.push(value);
          } else if (key === 'initialPayment') {
            updates.push('initial_payment = ?');
            params.push(value);
          } else if (key === 'paymentPeriod') {
            updates.push('payment_period = ?');
            params.push(value);
          } else {
            updates.push(`${key} = ?`);
            params.push(value);
          }
        }
      });
      
      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE condominiums SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(...params);
      
      return this.getCondominium(id);
    } catch (error) {
      console.error("Error updating condominium:", error);
      return undefined;
    }
  }

  async deleteCondominium(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM condominiums WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting condominium:", error);
      return false;
    }
  }

  // Helper methods
  private getContact(id: string): Contact | undefined {
    try {
      const stmt = sqlite.prepare('SELECT * FROM contacts WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertContactFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching contact:", error);
      return undefined;
    }
  }

  private convertPropertyFromDB(dbProperty: any): Property {
    return {
      id: dbProperty.id,
      title: dbProperty.title,
      description: dbProperty.description,
      price: dbProperty.price,
      location: dbProperty.location,
      type: dbProperty.type,
      bedrooms: dbProperty.bedrooms,
      bathrooms: dbProperty.bathrooms,
      area: dbProperty.area,
      images: dbProperty.images ? JSON.parse(dbProperty.images) : [],
      virtualTourUrl: dbProperty.virtual_tour_url,
      status: dbProperty.status,
      featured: Boolean(dbProperty.featured),
      createdAt: dbProperty.created_at ? new Date(dbProperty.created_at) : null,
      updatedAt: dbProperty.updated_at ? new Date(dbProperty.updated_at) : null,
    };
  }

  private convertProjectFromDB(dbProject: any): Project {
    return {
      id: dbProject.id,
      title: dbProject.title,
      description: dbProject.description,
      area: dbProject.area,
      duration: dbProject.duration,
      units: dbProject.units,
      year: dbProject.year,
      status: dbProject.status,
      images: dbProject.images ? JSON.parse(dbProject.images) : [],
      featured: Boolean(dbProject.featured),
      createdAt: dbProject.created_at ? new Date(dbProject.created_at) : null,
      updatedAt: dbProject.updated_at ? new Date(dbProject.updated_at) : null,
    };
  }

  private convertContactFromDB(dbContact: any): Contact {
    return {
      id: dbContact.id,
      name: dbContact.name,
      email: dbContact.email,
      phone: dbContact.phone,
      subject: dbContact.subject,
      message: dbContact.message,
      createdAt: dbContact.created_at ? new Date(dbContact.created_at) : null,
    };
  }

  private convertCondominiumFromDB(dbCondominium: any): Condominium {
    return {
      id: dbCondominium.id,
      name: dbCondominium.name,
      description: dbCondominium.description,
      location: dbCondominium.location,
      centralityOrDistrict: dbCondominium.centrality_or_district,
      totalUnits: dbCondominium.total_units,
      completedUnits: dbCondominium.completed_units,
      availableUnits: dbCondominium.available_units,
      priceRange: dbCondominium.price_range,
      status: dbCondominium.status,
      images: dbCondominium.images ? JSON.parse(dbCondominium.images) : [],
      amenities: dbCondominium.amenities ? JSON.parse(dbCondominium.amenities) : [],
      featured: Boolean(dbCondominium.featured),
      developmentYear: dbCondominium.development_year,
      saleConditions: dbCondominium.sale_conditions || null,
      totalValue: dbCondominium.total_value || null,
      initialPayment: dbCondominium.initial_payment || null,
      paymentPeriod: dbCondominium.payment_period || null,
      createdAt: dbCondominium.created_at ? new Date(dbCondominium.created_at) : null,
      updatedAt: dbCondominium.updated_at ? new Date(dbCondominium.updated_at) : null,
    };
  }

  // Property Categories
  async getPropertyCategories(activeOnly?: boolean): Promise<PropertyCategory[]> {
    try {
      let sql = 'SELECT * FROM property_categories WHERE 1=1';
      const params: any[] = [];
      
      if (activeOnly !== undefined && activeOnly) {
        sql += ' AND active = ?';
        params.push(1);
      }
      
      sql += ' ORDER BY display_order ASC';
      
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(params);
      
      return results.map(this.convertPropertyCategoryFromDB);
    } catch (error) {
      console.error("Error fetching property categories:", error);
      return [];
    }
  }

  async getPropertyCategory(id: string): Promise<PropertyCategory | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM property_categories WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertPropertyCategoryFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching property category:", error);
      return undefined;
    }
  }

  async createPropertyCategory(category: InsertPropertyCategory): Promise<PropertyCategory> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO property_categories (id, name, slug, image_url, display_order, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        category.name,
        category.slug,
        category.imageUrl,
        category.displayOrder ?? 0,
        category.active ? 1 : 0,
        now,
        now
      );
      
      const result = await this.getPropertyCategory(id);
      if (!result) throw new Error("Failed to create property category");
      return result;
    } catch (error) {
      console.error("Error creating property category:", error);
      throw error;
    }
  }

  async updatePropertyCategory(id: string, category: Partial<InsertPropertyCategory>): Promise<PropertyCategory | undefined> {
    try {
      const existing = await this.getPropertyCategory(id);
      if (!existing) return undefined;
      
      const now = new Date().toISOString();
      const updates: string[] = [];
      const params: any[] = [];
      
      if (category.name !== undefined) {
        updates.push('name = ?');
        params.push(category.name);
      }
      if (category.slug !== undefined) {
        updates.push('slug = ?');
        params.push(category.slug);
      }
      if (category.imageUrl !== undefined) {
        updates.push('image_url = ?');
        params.push(category.imageUrl);
      }
      if (category.displayOrder !== undefined) {
        updates.push('display_order = ?');
        params.push(category.displayOrder);
      }
      if (category.active !== undefined) {
        updates.push('active = ?');
        params.push(category.active ? 1 : 0);
      }
      
      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE property_categories SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(params);
      
      return await this.getPropertyCategory(id);
    } catch (error) {
      console.error("Error updating property category:", error);
      return undefined;
    }
  }

  async deletePropertyCategory(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM property_categories WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting property category:", error);
      return false;
    }
  }

  private convertPropertyCategoryFromDB(dbCategory: any): PropertyCategory {
    return {
      id: dbCategory.id,
      name: dbCategory.name,
      slug: dbCategory.slug,
      imageUrl: dbCategory.image_url,
      displayOrder: dbCategory.display_order,
      active: Boolean(dbCategory.active),
      createdAt: dbCategory.created_at ? new Date(dbCategory.created_at) : null,
      updatedAt: dbCategory.updated_at ? new Date(dbCategory.updated_at) : null,
    };
  }

  async getHeroSettings(): Promise<HeroSettings | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM hero_settings WHERE active = ? ORDER BY created_at DESC LIMIT 1');
      const result = stmt.get(1);
      return result ? this.convertHeroSettingsFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      return undefined;
    }
  }

  async getHeroSettingsForAdmin(): Promise<HeroSettings | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM hero_settings ORDER BY created_at DESC LIMIT 1');
      const result = stmt.get();
      return result ? this.convertHeroSettingsFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching hero settings for admin:", error);
      return undefined;
    }
  }

  async getHeroSettingsById(id: string): Promise<HeroSettings | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM hero_settings WHERE id = ?');
      const result = stmt.get(id);
      return result ? this.convertHeroSettingsFromDB(result) : undefined;
    } catch (error) {
      console.error("Error fetching hero settings by id:", error);
      return undefined;
    }
  }

  async createHeroSettings(heroSettings: InsertHeroSettings): Promise<HeroSettings> {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO hero_settings (
          id, images, title_line_1, title_line_2, title_line_3, description, 
          carousel_enabled, carousel_interval, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        JSON.stringify(heroSettings.images || []),
        heroSettings.titleLine1,
        heroSettings.titleLine2,
        heroSettings.titleLine3,
        heroSettings.description,
        heroSettings.carouselEnabled ? 1 : 0,
        heroSettings.carouselInterval ?? 5000,
        heroSettings.active ? 1 : 0,
        now,
        now
      );
      
      const result = await this.getHeroSettingsById(id);
      if (!result) throw new Error("Failed to create hero settings");
      return result;
    } catch (error) {
      console.error("Error creating hero settings:", error);
      throw error;
    }
  }

  async updateHeroSettings(id: string, heroSettings: Partial<InsertHeroSettings>): Promise<HeroSettings | undefined> {
    try {
      const existing = await this.getHeroSettingsById(id);
      if (!existing) return undefined;
      
      const now = new Date().toISOString();
      const updates: string[] = [];
      const params: any[] = [];
      
      if (heroSettings.images !== undefined) {
        updates.push('images = ?');
        params.push(JSON.stringify(heroSettings.images));
      }
      if (heroSettings.titleLine1 !== undefined) {
        updates.push('title_line_1 = ?');
        params.push(heroSettings.titleLine1);
      }
      if (heroSettings.titleLine2 !== undefined) {
        updates.push('title_line_2 = ?');
        params.push(heroSettings.titleLine2);
      }
      if (heroSettings.titleLine3 !== undefined) {
        updates.push('title_line_3 = ?');
        params.push(heroSettings.titleLine3);
      }
      if (heroSettings.description !== undefined) {
        updates.push('description = ?');
        params.push(heroSettings.description);
      }
      if (heroSettings.carouselEnabled !== undefined) {
        updates.push('carousel_enabled = ?');
        params.push(heroSettings.carouselEnabled ? 1 : 0);
      }
      if (heroSettings.carouselInterval !== undefined) {
        updates.push('carousel_interval = ?');
        params.push(heroSettings.carouselInterval);
      }
      if (heroSettings.active !== undefined) {
        updates.push('active = ?');
        params.push(heroSettings.active ? 1 : 0);
      }
      
      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE hero_settings SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(params);
      
      return await this.getHeroSettingsById(id);
    } catch (error) {
      console.error("Error updating hero settings:", error);
      return undefined;
    }
  }

  async deleteHeroSettings(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM hero_settings WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting hero settings:", error);
      return false;
    }
  }

  private convertHeroSettingsFromDB(dbHeroSettings: any): HeroSettings {
    return {
      id: dbHeroSettings.id,
      images: dbHeroSettings.images ? JSON.parse(dbHeroSettings.images) : [],
      titleLine1: dbHeroSettings.title_line_1,
      titleLine2: dbHeroSettings.title_line_2,
      titleLine3: dbHeroSettings.title_line_3,
      description: dbHeroSettings.description,
      carouselEnabled: Boolean(dbHeroSettings.carousel_enabled),
      carouselInterval: dbHeroSettings.carousel_interval,
      active: Boolean(dbHeroSettings.active),
      createdAt: dbHeroSettings.created_at ? new Date(dbHeroSettings.created_at) : null,
      updatedAt: dbHeroSettings.updated_at ? new Date(dbHeroSettings.updated_at) : null,
    };
  }

  // Cities
  async getCities(activeOnly?: boolean): Promise<City[]> {
    try {
      let sql = 'SELECT * FROM cities';
      const params: any[] = [];
      
      if (activeOnly) {
        sql += ' WHERE active = ?';
        params.push(1);
      }
      
      sql += ' ORDER BY display_order ASC';
      
      const stmt = sqlite.prepare(sql);
      const rows = params.length > 0 ? stmt.all(params) : stmt.all();
      return rows.map(row => this.convertCityFromDB(row));
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  }

  async getCity(id: string): Promise<City | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM cities WHERE id = ?');
      const row = stmt.get(id);
      return row ? this.convertCityFromDB(row) : undefined;
    } catch (error) {
      console.error("Error fetching city:", error);
      return undefined;
    }
  }

  async createCity(city: InsertCity): Promise<City> {
    try {
      const id = `city_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO cities (id, name, slug, image_url, display_order, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        city.name,
        city.slug,
        city.imageUrl,
        city.displayOrder ?? 0,
        city.active ? 1 : 0,
        now,
        now
      );
      
      const result = await this.getCity(id);
      if (!result) throw new Error("Failed to create city");
      return result;
    } catch (error) {
      console.error("Error creating city:", error);
      throw error;
    }
  }

  async updateCity(id: string, city: Partial<InsertCity>): Promise<City | undefined> {
    try {
      const existing = await this.getCity(id);
      if (!existing) return undefined;
      
      const now = new Date().toISOString();
      const updates: string[] = [];
      const params: any[] = [];
      
      if (city.name !== undefined) {
        updates.push('name = ?');
        params.push(city.name);
      }
      if (city.slug !== undefined) {
        updates.push('slug = ?');
        params.push(city.slug);
      }
      if (city.imageUrl !== undefined) {
        updates.push('image_url = ?');
        params.push(city.imageUrl);
      }
      if (city.displayOrder !== undefined) {
        updates.push('display_order = ?');
        params.push(city.displayOrder);
      }
      if (city.active !== undefined) {
        updates.push('active = ?');
        params.push(city.active ? 1 : 0);
      }
      
      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE cities SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(params);
      
      return await this.getCity(id);
    } catch (error) {
      console.error("Error updating city:", error);
      return undefined;
    }
  }

  async deleteCity(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM cities WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting city:", error);
      return false;
    }
  }

  private convertCityFromDB(dbCity: any): City {
    return {
      id: dbCity.id,
      name: dbCity.name,
      slug: dbCity.slug,
      imageUrl: dbCity.image_url,
      displayOrder: dbCity.display_order,
      active: Boolean(dbCity.active),
      createdAt: dbCity.created_at ? new Date(dbCity.created_at) : null,
      updatedAt: dbCity.updated_at ? new Date(dbCity.updated_at) : null,
    };
  }

  // About Us
  async getAboutUsSections(): Promise<AboutUs[]> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM about_us ORDER BY display_order ASC');
      const results = stmt.all();
      return results.map(this.convertAboutUsFromDB);
    } catch (error) {
      console.error("Error fetching about us sections:", error);
      return [];
    }
  }

  async getAboutUsSection(id: string): Promise<AboutUs | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM about_us WHERE id = ?');
      const row = stmt.get(id);
      return row ? this.convertAboutUsFromDB(row) : undefined;
    } catch (error) {
      console.error("Error fetching about us section:", error);
      return undefined;
    }
  }

  async createAboutUsSection(aboutUs: InsertAboutUs): Promise<AboutUs> {
    try {
      const id = `aboutus_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO about_us (id, company_type, title, description, mission, vision, "values", images, display_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        aboutUs.companyType,
        aboutUs.title,
        aboutUs.description,
        aboutUs.mission || null,
        aboutUs.vision || null,
        JSON.stringify(aboutUs.values || []),
        JSON.stringify(aboutUs.images || []),
        aboutUs.displayOrder ?? 0,
        now,
        now
      );
      
      const result = await this.getAboutUsSection(id);
      if (!result) throw new Error("Failed to create about us section");
      return result;
    } catch (error) {
      console.error("Error creating about us section:", error);
      throw error;
    }
  }

  async updateAboutUsSection(id: string, aboutUs: Partial<InsertAboutUs>): Promise<AboutUs | undefined> {
    try {
      const existing = await this.getAboutUsSection(id);
      if (!existing) return undefined;
      
      const now = new Date().toISOString();
      const updates: string[] = [];
      const params: any[] = [];
      
      if (aboutUs.companyType !== undefined) {
        updates.push('company_type = ?');
        params.push(aboutUs.companyType);
      }
      if (aboutUs.title !== undefined) {
        updates.push('title = ?');
        params.push(aboutUs.title);
      }
      if (aboutUs.description !== undefined) {
        updates.push('description = ?');
        params.push(aboutUs.description);
      }
      if (aboutUs.mission !== undefined) {
        updates.push('mission = ?');
        params.push(aboutUs.mission);
      }
      if (aboutUs.vision !== undefined) {
        updates.push('vision = ?');
        params.push(aboutUs.vision);
      }
      if (aboutUs.values !== undefined) {
        updates.push('"values" = ?');
        params.push(JSON.stringify(aboutUs.values));
      }
      if (aboutUs.images !== undefined) {
        updates.push('images = ?');
        params.push(JSON.stringify(aboutUs.images));
      }
      if (aboutUs.displayOrder !== undefined) {
        updates.push('display_order = ?');
        params.push(aboutUs.displayOrder);
      }
      
      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE about_us SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(params);
      
      return await this.getAboutUsSection(id);
    } catch (error) {
      console.error("Error updating about us section:", error);
      return undefined;
    }
  }

  async deleteAboutUsSection(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM about_us WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting about us section:", error);
      return false;
    }
  }

  // Employees
  async getEmployees(filters?: { department?: string; activeOnly?: boolean }): Promise<Employee[]> {
    try {
      let sql = 'SELECT * FROM employees WHERE 1=1';
      const params: any[] = [];
      
      if (filters) {
        if (filters.department) {
          sql += ' AND department = ?';
          params.push(filters.department);
        }
        if (filters.activeOnly !== undefined && filters.activeOnly) {
          sql += ' AND active = ?';
          params.push(1);
        }
      }
      
      sql += ' ORDER BY display_order ASC';
      
      const stmt = sqlite.prepare(sql);
      const results = stmt.all(params);
      return results.map(this.convertEmployeeFromDB);
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    try {
      const stmt = sqlite.prepare('SELECT * FROM employees WHERE id = ?');
      const row = stmt.get(id);
      return row ? this.convertEmployeeFromDB(row) : undefined;
    } catch (error) {
      console.error("Error fetching employee:", error);
      return undefined;
    }
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    try {
      const id = `employee_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();
      
      const stmt = sqlite.prepare(`
        INSERT INTO employees (id, name, position, department, bio, email, phone, image_url, display_order, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        employee.name,
        employee.position,
        employee.department,
        employee.bio || null,
        employee.email || null,
        employee.phone || null,
        employee.imageUrl || null,
        employee.displayOrder ?? 0,
        employee.active ? 1 : 0,
        now,
        now
      );
      
      const result = await this.getEmployee(id);
      if (!result) throw new Error("Failed to create employee");
      return result;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    try {
      const existing = await this.getEmployee(id);
      if (!existing) return undefined;
      
      const now = new Date().toISOString();
      const updates: string[] = [];
      const params: any[] = [];
      
      if (employee.name !== undefined) {
        updates.push('name = ?');
        params.push(employee.name);
      }
      if (employee.position !== undefined) {
        updates.push('position = ?');
        params.push(employee.position);
      }
      if (employee.department !== undefined) {
        updates.push('department = ?');
        params.push(employee.department);
      }
      if (employee.bio !== undefined) {
        updates.push('bio = ?');
        params.push(employee.bio);
      }
      if (employee.email !== undefined) {
        updates.push('email = ?');
        params.push(employee.email);
      }
      if (employee.phone !== undefined) {
        updates.push('phone = ?');
        params.push(employee.phone);
      }
      if (employee.imageUrl !== undefined) {
        updates.push('image_url = ?');
        params.push(employee.imageUrl);
      }
      if (employee.displayOrder !== undefined) {
        updates.push('display_order = ?');
        params.push(employee.displayOrder);
      }
      if (employee.active !== undefined) {
        updates.push('active = ?');
        params.push(employee.active ? 1 : 0);
      }
      
      updates.push('updated_at = ?');
      params.push(now);
      params.push(id);
      
      const stmt = sqlite.prepare(`UPDATE employees SET ${updates.join(', ')} WHERE id = ?`);
      stmt.run(params);
      
      return await this.getEmployee(id);
    } catch (error) {
      console.error("Error updating employee:", error);
      return undefined;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const stmt = sqlite.prepare('DELETE FROM employees WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  }

  private convertAboutUsFromDB(dbAboutUs: any): AboutUs {
    return {
      id: dbAboutUs.id,
      companyType: dbAboutUs.company_type,
      title: dbAboutUs.title,
      description: dbAboutUs.description,
      mission: dbAboutUs.mission,
      vision: dbAboutUs.vision,
      values: dbAboutUs.values ? JSON.parse(dbAboutUs.values) : [],
      images: dbAboutUs.images ? JSON.parse(dbAboutUs.images) : [],
      displayOrder: dbAboutUs.display_order,
      createdAt: dbAboutUs.created_at ? new Date(dbAboutUs.created_at) : null,
      updatedAt: dbAboutUs.updated_at ? new Date(dbAboutUs.updated_at) : null,
    };
  }

  private convertEmployeeFromDB(dbEmployee: any): Employee {
    return {
      id: dbEmployee.id,
      name: dbEmployee.name,
      position: dbEmployee.position,
      department: dbEmployee.department,
      bio: dbEmployee.bio,
      email: dbEmployee.email,
      phone: dbEmployee.phone,
      imageUrl: dbEmployee.image_url,
      displayOrder: dbEmployee.display_order,
      active: Boolean(dbEmployee.active),
      createdAt: dbEmployee.created_at ? new Date(dbEmployee.created_at) : null,
      updatedAt: dbEmployee.updated_at ? new Date(dbEmployee.updated_at) : null,
    };
  }
}