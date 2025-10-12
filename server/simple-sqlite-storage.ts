import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium, type PropertyCategory, type InsertPropertyCategory, type HeroSettings, type InsertHeroSettings } from "@shared/schema";
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
`);

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
          featured, development_year, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
}