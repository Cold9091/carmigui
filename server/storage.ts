import { properties, projects, contacts, condominiums, type Property, type InsertProperty, type Project, type InsertProject, type Contact, type InsertContact, type Condominium, type InsertCondominium } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Properties
  async getProperties(filters?: { type?: string; location?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Property[]> {
    let query = db.select().from(properties);
    
    if (filters) {
      const conditions = [];
      if (filters.type) {
        conditions.push(eq(properties.type, filters.type));
      }
      if (filters.location) {
        conditions.push(ilike(properties.location, `%${filters.location}%`));
      }
      if (filters.minPrice) {
        conditions.push(sql`${properties.price}::numeric >= ${filters.minPrice}`);
      }
      if (filters.maxPrice) {
        conditions.push(sql`${properties.price}::numeric <= ${filters.maxPrice}`);
      }
      if (filters.featured !== undefined) {
        conditions.push(eq(properties.featured, filters.featured));
      }
      
      if (conditions.length > 0) {
        return await query.where(and(...conditions)).orderBy(desc(properties.createdAt));
      }
    }
    
    return await query.orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(eq(properties.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Projects
  async getProjects(featured?: boolean): Promise<Project[]> {
    if (featured !== undefined) {
      return await db.select().from(projects).where(eq(projects.featured, featured)).orderBy(desc(projects.createdAt));
    }
    
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db
      .delete(contacts)
      .where(eq(contacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Condominiums
  async getCondominiums(featured?: boolean): Promise<Condominium[]> {
    if (featured !== undefined) {
      return await db.select().from(condominiums).where(eq(condominiums.featured, featured)).orderBy(desc(condominiums.createdAt));
    }
    
    return await db.select().from(condominiums).orderBy(desc(condominiums.createdAt));
  }

  async getCondominium(id: string): Promise<Condominium | undefined> {
    const [condominium] = await db.select().from(condominiums).where(eq(condominiums.id, id));
    return condominium;
  }

  async createCondominium(condominium: InsertCondominium): Promise<Condominium> {
    const [newCondominium] = await db
      .insert(condominiums)
      .values(condominium)
      .returning();
    return newCondominium;
  }

  async updateCondominium(id: string, condominium: Partial<InsertCondominium>): Promise<Condominium | undefined> {
    const [updatedCondominium] = await db
      .update(condominiums)
      .set({ ...condominium, updatedAt: new Date() })
      .where(eq(condominiums.id, id))
      .returning();
    return updatedCondominium;
  }

  async deleteCondominium(id: string): Promise<boolean> {
    const result = await db
      .delete(condominiums)
      .where(eq(condominiums.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
