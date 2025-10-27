import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';

describe('Properties API Tests', () => {
  let app: Express;
  let server: Server;
  let agent: any;
  let createdPropertyId: string;

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

  describe('GET /api/properties', () => {
    it('should return all properties', async () => {
      const response = await request(app).get('/api/properties');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter properties by status', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ status: 'available' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/properties', () => {
    it('should create a new property when authenticated', async () => {
      const newProperty = {
        title: 'Casa de Teste',
        description: 'Descrição da casa de teste',
        price: '150000000',
        cityId: '1',
        categoryId: '1',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        status: 'available',
        paymentType: 'preco_fixo',
        houseCondition: 'construida'
      };

      const response = await agent
        .post('/api/properties')
        .send(newProperty);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newProperty.title);
      expect(response.body.price).toBe(newProperty.price);

      createdPropertyId = response.body.id;
    });

    it('should reject property creation when not authenticated', async () => {
      const newProperty = {
        title: 'Casa de Teste 2',
        description: 'Descrição',
        price: '100000000',
        cityId: '1',
        categoryId: '1',
        area: 100,
        status: 'available',
        paymentType: 'preco_fixo'
      };

      const response = await request(app)
        .post('/api/properties')
        .send(newProperty);

      expect(response.status).toBe(401);
    });

    it('should reject property creation with missing required fields', async () => {
      const invalidProperty = {
        title: 'Casa Incompleta'
      };

      const response = await agent
        .post('/api/properties')
        .send(invalidProperty);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should return a specific property', async () => {
      if (!createdPropertyId) {
        const createResponse = await agent
          .post('/api/properties')
          .send({
            title: 'Casa para buscar',
            description: 'Descrição',
            price: '100000000',
            cityId: '1',
            categoryId: '1',
            area: 100,
            status: 'available',
            paymentType: 'preco_fixo'
          });
        createdPropertyId = createResponse.body.id;
      }

      const response = await request(app).get(`/api/properties/${createdPropertyId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdPropertyId);
    });

    it('should return 404 for non-existent property', async () => {
      const response = await request(app).get('/api/properties/nonexistent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update a property when authenticated', async () => {
      if (!createdPropertyId) {
        const createResponse = await agent
          .post('/api/properties')
          .send({
            title: 'Casa para atualizar',
            description: 'Descrição',
            price: '100000000',
            cityId: '1',
            categoryId: '1',
            area: 100,
            status: 'available',
            paymentType: 'preco_fixo'
          });
        createdPropertyId = createResponse.body.id;
      }

      const updateData = {
        title: 'Casa Atualizada',
        price: '200000000'
      };

      const response = await agent
        .put(`/api/properties/${createdPropertyId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.price).toBe(updateData.price);
    });

    it('should reject update when not authenticated', async () => {
      const response = await request(app)
        .put(`/api/properties/${createdPropertyId}`)
        .send({ title: 'Nova tentativa' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete a property when authenticated', async () => {
      const createResponse = await agent
        .post('/api/properties')
        .send({
          title: 'Casa para deletar',
          description: 'Descrição',
          price: '100000000',
          cityId: '1',
          categoryId: '1',
          area: 100,
          status: 'available',
          paymentType: 'preco_fixo'
        });

      const propertyToDelete = createResponse.body.id;

      const response = await agent.delete(`/api/properties/${propertyToDelete}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/api/properties/${propertyToDelete}`);
      expect(getResponse.status).toBe(404);
    });

    it('should reject delete when not authenticated', async () => {
      const response = await request(app).delete(`/api/properties/some-id`);

      expect(response.status).toBe(401);
    });
  });
});
