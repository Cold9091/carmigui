import { type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium } from "@shared/schema";
import { IStorage } from "./storage";
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and, like, gte, lte, desc } from "drizzle-orm";
import { properties, projects, contacts, condominiums } from "@shared/schema";

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
`);

const db = drizzle(sqlite);

export class SQLiteStorage implements IStorage {
  // Properties
  async getProperties(filters?: { type?: string; location?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    try {
      let query = db.select().from(properties);
      
      // Build where conditions
      const conditions = [];
      
      if (filters) {
        if (filters.type) {
          conditions.push(eq(properties.type, filters.type));
        }
        if (filters.location) {
          conditions.push(like(properties.location, `%${filters.location}%`));
        }
        if (filters.minPrice) {
          // Convert price string to number for comparison
          conditions.push(gte(properties.price, filters.minPrice.toString()));
        }
        if (filters.maxPrice) {
          conditions.push(lte(properties.price, filters.maxPrice.toString()));
        }
        if (filters.featured !== undefined) {
          conditions.push(eq(properties.featured, filters.featured));
        }
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const result = await query.orderBy(desc(properties.createdAt));
      
      return result.map(this.convertPropertyFromDB);
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    try {
      const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
      return result[0] ? this.convertPropertyFromDB(result[0]) : undefined;
    } catch (error) {
      console.error("Error fetching property:", error);
      return undefined;
    }
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    try {
      const propertyData = this.convertPropertyToDB(property);
      const [newProperty] = await db.insert(properties).values(propertyData).returning();
      return this.convertPropertyFromDB(newProperty);
    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error("Failed to create property");
    }
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    try {
      const propertyData = this.convertPropertyToDB(property as InsertProperty, true);
      const [updatedProperty] = await db.update(properties)
        .set({ ...propertyData, updatedAt: new Date() })
        .where(eq(properties.id, id))
        .returning();
      
      return updatedProperty ? this.convertPropertyFromDB(updatedProperty) : undefined;
    } catch (error) {
      console.error("Error updating property:", error);
      return undefined;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const result = await db.delete(properties).where(eq(properties.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      return false;
    }
  }

  // Projects
  async getProjects(featured?: boolean): Promise<Project[]> {
    try {
      let query = db.select().from(projects);
      
      if (featured !== undefined) {
        query = query.where(eq(projects.featured, featured));
      }
      
      const result = await query.orderBy(desc(projects.createdAt));
      return result.map(this.convertProjectFromDB);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
      return result[0] ? this.convertProjectFromDB(result[0]) : undefined;
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const projectData = this.convertProjectToDB(project);
      const [newProject] = await db.insert(projects).values(projectData).returning();
      return this.convertProjectFromDB(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const projectData = this.convertProjectToDB(project as InsertProject, true);
      const [updatedProject] = await db.update(projects)
        .set({ ...projectData, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      
      return updatedProject ? this.convertProjectFromDB(updatedProject) : undefined;
    } catch (error) {
      console.error("Error updating project:", error);
      return undefined;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      await db.delete(projects).where(eq(projects.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    try {
      const result = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
      return result.map(this.convertContactFromDB);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    try {
      const contactData = this.convertContactToDB(contact);
      const [newContact] = await db.insert(contacts).values(contactData).returning();
      return this.convertContactFromDB(newContact);
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact");
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      await db.delete(contacts).where(eq(contacts.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  }

  // Condominiums
  async getCondominiums(featured?: boolean): Promise<Condominium[]> {
    try {
      let query = db.select().from(condominiums);
      
      if (featured !== undefined) {
        query = query.where(eq(condominiums.featured, featured));
      }
      
      const result = await query.orderBy(desc(condominiums.createdAt));
      return result.map(this.convertCondominiumFromDB);
    } catch (error) {
      console.error("Error fetching condominiums:", error);
      return [];
    }
  }

  async getCondominium(id: string): Promise<Condominium | undefined> {
    try {
      const result = await db.select().from(condominiums).where(eq(condominiums.id, id)).limit(1);
      return result[0] ? this.convertCondominiumFromDB(result[0]) : undefined;
    } catch (error) {
      console.error("Error fetching condominium:", error);
      return undefined;
    }
  }

  async createCondominium(condominium: InsertCondominium): Promise<Condominium> {
    try {
      const condominiumData = this.convertCondominiumToDB(condominium);
      const [newCondominium] = await db.insert(condominiums).values(condominiumData).returning();
      return this.convertCondominiumFromDB(newCondominium);
    } catch (error) {
      console.error("Error creating condominium:", error);
      throw new Error("Failed to create condominium");
    }
  }

  async updateCondominium(id: string, condominium: Partial<InsertCondominium>): Promise<Condominium | undefined> {
    try {
      const condominiumData = this.convertCondominiumToDB(condominium as InsertCondominium, true);
      const [updatedCondominium] = await db.update(condominiums)
        .set({ ...condominiumData, updatedAt: new Date() })
        .where(eq(condominiums.id, id))
        .returning();
      
      return updatedCondominium ? this.convertCondominiumFromDB(updatedCondominium) : undefined;
    } catch (error) {
      console.error("Error updating condominium:", error);
      return undefined;
    }
  }

  async deleteCondominium(id: string): Promise<boolean> {
    try {
      await db.delete(condominiums).where(eq(condominiums.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting condominium:", error);
      return false;
    }
  }

  // Helper methods for data conversion
  private convertPropertyFromDB(dbProperty: any): Property {
    return {
      ...dbProperty,
      images: dbProperty.images ? JSON.parse(dbProperty.images) : [],
      virtualTourUrl: dbProperty.virtualTourUrl || null,
      bedrooms: dbProperty.bedrooms || null,
      bathrooms: dbProperty.bathrooms || null,
      featured: Boolean(dbProperty.featured),
      createdAt: dbProperty.createdAt ? new Date(dbProperty.createdAt) : null,
      updatedAt: dbProperty.updatedAt ? new Date(dbProperty.updatedAt) : null,
    };
  }

  private convertPropertyToDB(property: InsertProperty | Partial<InsertProperty>, isUpdate = false): any {
    const data: any = {
      ...property,
      images: property.images ? JSON.stringify(property.images) : '[]',
      virtualTourUrl: property.virtualTourUrl || null,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
      featured: Boolean(property.featured),
    };

    if (!isUpdate) {
      data.id = crypto.randomUUID();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
    }

    return data;
  }

  private convertProjectFromDB(dbProject: any): Project {
    return {
      ...dbProject,
      images: dbProject.images ? JSON.parse(dbProject.images) : [],
      featured: Boolean(dbProject.featured),
      createdAt: dbProject.createdAt ? new Date(dbProject.createdAt) : null,
      updatedAt: dbProject.updatedAt ? new Date(dbProject.updatedAt) : null,
    };
  }

  private convertProjectToDB(project: InsertProject | Partial<InsertProject>, isUpdate = false): any {
    const data: any = {
      ...project,
      images: project.images ? JSON.stringify(project.images) : '[]',
      featured: Boolean(project.featured),
    };

    if (!isUpdate) {
      data.id = crypto.randomUUID();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
    }

    return data;
  }

  private convertContactFromDB(dbContact: any): Contact {
    return {
      ...dbContact,
      phone: dbContact.phone || null,
      createdAt: dbContact.createdAt ? new Date(dbContact.createdAt) : null,
    };
  }

  private convertContactToDB(contact: InsertContact): any {
    return {
      id: crypto.randomUUID(),
      ...contact,
      phone: contact.phone || null,
      createdAt: new Date().toISOString(),
    };
  }

  private convertCondominiumFromDB(dbCondominium: any): Condominium {
    return {
      ...dbCondominium,
      images: dbCondominium.images ? JSON.parse(dbCondominium.images) : [],
      amenities: dbCondominium.amenities ? JSON.parse(dbCondominium.amenities) : [],
      featured: Boolean(dbCondominium.featured),
      createdAt: dbCondominium.createdAt ? new Date(dbCondominium.createdAt) : null,
      updatedAt: dbCondominium.updatedAt ? new Date(dbCondominium.updatedAt) : null,
    };
  }

  private convertCondominiumToDB(condominium: InsertCondominium | Partial<InsertCondominium>, isUpdate = false): any {
    const data: any = {
      ...condominium,
      images: condominium.images ? JSON.stringify(condominium.images) : '[]',
      amenities: condominium.amenities ? JSON.stringify(condominium.amenities) : '[]',
      featured: Boolean(condominium.featured),
      completedUnits: condominium.completedUnits || 0,
    };

    if (!isUpdate) {
      data.id = crypto.randomUUID();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
    }

    return data;
  }
}