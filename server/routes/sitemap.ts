import { Router } from "express";
import type { IStorage } from "../storage";
import type { Property, Project, Condominium } from "@shared/schema";

export function registerSitemapRoutes(app: Router, storage: IStorage) {
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      const projects = await storage.getProjects();
      const condominiums = await storage.getCondominiums();
      
      const baseUrl = "https://carmigui.com";
      const currentDate = new Date().toISOString().split('T')[0];
      
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/imoveis', priority: '0.9', changefreq: 'daily' },
        { url: '/condominios', priority: '0.9', changefreq: 'weekly' },
        { url: '/construcao', priority: '0.9', changefreq: 'weekly' },
        { url: '/sobre-nos', priority: '0.7', changefreq: 'monthly' },
        { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
        { url: '/faq', priority: '0.8', changefreq: 'monthly' },
      ];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;
      
      staticPages.forEach(page => {
        sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      });
      
      properties.forEach((property: Property) => {
        sitemap += `  <url>
    <loc>${baseUrl}/imoveis/${property.id}</loc>
    <lastmod>${property.updatedAt?.toISOString().split('T')[0] || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
      
      projects.forEach((project: Project) => {
        sitemap += `  <url>
    <loc>${baseUrl}/construcao/${project.id}</loc>
    <lastmod>${project.updatedAt?.toISOString().split('T')[0] || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      });
      
      condominiums.forEach((condominium: Condominium) => {
        sitemap += `  <url>
    <loc>${baseUrl}/condominios/${condominium.id}</loc>
    <lastmod>${condominium.updatedAt?.toISOString().split('T')[0] || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
      
      sitemap += `</urlset>`;
      
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
}
