import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';

describe('Categories and Cities API Tests', () => {
  let app: Express;
  let server: Server;
  let agent: any;
  let createdCategoryId: string;
  let createdCityId: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    server = await registerRoutes(app);
    agent = request.agent(app);

    await agent
      .post('/api/login')
      .send({
        email: 'carmigui@site.ao',
        password: 'Teste123'
      });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('Categories API', () => {
    describe('GET /api/property-categories', () => {
      it('should return all categories', async () => {
        const response = await request(app).get('/api/property-categories');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/property-categories', () => {
      it('should create a new category when authenticated', async () => {
        const timestamp = Date.now();
        const newCategory = {
          name: `Apartamentos de Teste ${timestamp}`,
          slug: `apartamentos-teste-${timestamp}`,
          imageUrl: '/images/apartamentos.jpg',
          displayOrder: 1,
          active: true
        };

        const response = await agent
          .post('/api/property-categories')
          .send(newCategory);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newCategory.name);

        createdCategoryId = response.body.id;
      });

      it('should reject category creation when not authenticated', async () => {
        const response = await request(app)
          .post('/api/property-categories')
          .send({
            name: 'Teste',
            slug: 'teste',
            imageUrl: '/test.jpg'
          });

        expect(response.status).toBe(401);
      });
    });

    describe('PUT /api/property-categories/:id', () => {
      it('should update a category when authenticated', async () => {
        if (!createdCategoryId) {
          const timestamp = Date.now();
          const createResponse = await agent
            .post('/api/property-categories')
            .send({
              name: `Categoria para atualizar ${timestamp}`,
              slug: `categoria-atualizar-${timestamp}`,
              imageUrl: '/test.jpg'
            });
          createdCategoryId = createResponse.body.id;
        }

        const updatedName = `Categoria Atualizada ${Date.now()}`;
        const response = await agent
          .put(`/api/property-categories/${createdCategoryId}`)
          .send({ name: updatedName });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedName);
      });
    });

    describe('DELETE /api/property-categories/:id', () => {
      it('should delete a category when authenticated', async () => {
        const timestamp = Date.now();
        const createResponse = await agent
          .post('/api/property-categories')
          .send({
            name: `Categoria para deletar ${timestamp}`,
            slug: `categoria-deletar-${timestamp}`,
            imageUrl: '/test.jpg'
          });

        const categoryId = createResponse.body.id;

        const response = await agent.delete(`/api/property-categories/${categoryId}`);

        expect(response.status).toBe(204);
      });
    });
  });

  describe('Cities API', () => {
    describe('GET /api/cities', () => {
      it('should return all cities', async () => {
        const response = await request(app).get('/api/cities');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/cities', () => {
      it('should create a new city when authenticated', async () => {
        const timestamp = Date.now();
        const newCity = {
          name: `Cidade de Teste ${timestamp}`,
          slug: `cidade-teste-${timestamp}`,
          imageUrl: '/images/cidade.jpg',
          displayOrder: 1,
          active: true
        };

        const response = await agent
          .post('/api/cities')
          .send(newCity);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newCity.name);

        createdCityId = response.body.id;
      });

      it('should reject city creation when not authenticated', async () => {
        const response = await request(app)
          .post('/api/cities')
          .send({
            name: 'Teste',
            slug: 'teste',
            imageUrl: '/test.jpg'
          });

        expect(response.status).toBe(401);
      });
    });

    describe('PUT /api/cities/:id', () => {
      it('should update a city when authenticated', async () => {
        if (!createdCityId) {
          const timestamp = Date.now();
          const createResponse = await agent
            .post('/api/cities')
            .send({
              name: `Cidade para atualizar ${timestamp}`,
              slug: `cidade-atualizar-${timestamp}`,
              imageUrl: '/test.jpg'
            });
          createdCityId = createResponse.body.id;
        }

        const updatedName = `Cidade Atualizada ${Date.now()}`;
        const response = await agent
          .put(`/api/cities/${createdCityId}`)
          .send({ name: updatedName });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedName);
      });
    });

    describe('DELETE /api/cities/:id', () => {
      it('should delete a city when authenticated', async () => {
        const timestamp = Date.now();
        const createResponse = await agent
          .post('/api/cities')
          .send({
            name: `Cidade para deletar ${timestamp}`,
            slug: `cidade-deletar-${timestamp}`,
            imageUrl: '/test.jpg'
          });

        const cityId = createResponse.body.id;

        const response = await agent.delete(`/api/cities/${cityId}`);

        expect(response.status).toBe(204);
      });
    });
  });
});
