import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  cityId: varchar("city_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area").notNull(), // in square meters
  images: text("images").array().default([]),
  virtualTourUrl: text("virtual_tour_url"), // URL for 3D/virtual tour
  status: text("status").notNull().default("available"), // available, sold, rented
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  area: integer("area").notNull(), // in square meters
  duration: text("duration").notNull(),
  units: text("units").notNull(), // number of units/rooms/stores etc
  year: text("year").notNull(),
  status: text("status").notNull(), // completed, in-progress, planning
  images: text("images").array().default([]),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const condominiums = pgTable("condominiums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  centralityOrDistrict: text("centrality_or_district").notNull(),
  totalUnits: integer("total_units").notNull(),
  completedUnits: integer("completed_units").default(0),
  availableUnits: integer("available_units").notNull(),
  priceRange: text("price_range").notNull(), // e.g., "50M - 150M AKZ"
  status: text("status").notNull().default("in-development"), // in-development, completed, planning
  images: text("images").array().default([]),
  amenities: text("amenities").array().default([]), // piscina, academia, playground, etc
  featured: boolean("featured").default(false),
  developmentYear: text("development_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertyCategories = pgTable("property_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const heroSettings = pgTable("hero_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  images: text("images").array().default([]),
  titleLine1: text("title_line_1").notNull().default("BEM-VINDO"),
  titleLine2: text("title_line_2").notNull().default("AO SEU NOVO"),
  titleLine3: text("title_line_3").notNull().default("COMEÇO !"),
  description: text("description").notNull().default("Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário."),
  carouselEnabled: boolean("carousel_enabled").default(false),
  carouselInterval: integer("carousel_interval").default(5000),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cities = pgTable("cities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aboutUs = pgTable("about_us", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyType: text("company_type").notNull(), // 'imobiliario' or 'construtora'
  title: text("title").notNull(),
  description: text("description").notNull(),
  mission: text("mission"),
  vision: text("vision"),
  values: text("values").array().default([]),
  images: text("images").array().default([]),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(), // 'imobiliario' or 'construtora'
  bio: text("bio"),
  email: text("email"),
  phone: text("phone"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertCondominiumSchema = createInsertSchema(condominiums).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyCategorySchema = createInsertSchema(propertyCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHeroSettingsSchema = createInsertSchema(heroSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAboutUsSchema = createInsertSchema(aboutUs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Condominium = typeof condominiums.$inferSelect;
export type InsertCondominium = z.infer<typeof insertCondominiumSchema>;
export type PropertyCategory = typeof propertyCategories.$inferSelect;
export type InsertPropertyCategory = z.infer<typeof insertPropertyCategorySchema>;
export type HeroSettings = typeof heroSettings.$inferSelect;
export type InsertHeroSettings = z.infer<typeof insertHeroSettingsSchema>;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type AboutUs = typeof aboutUs.$inferSelect;
export type InsertAboutUs = z.infer<typeof insertAboutUsSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
