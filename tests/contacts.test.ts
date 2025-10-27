import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';

describe('Contacts API Tests', () => {
  let app: Express;
  let server: Server;
  let agent: any;

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

  describe('POST /api/contacts', () => {
    it('should create a new contact (public endpoint)', async () => {
      const newContact = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+244 912 345 678',
        subject: 'Interesse em imóvel',
        message: 'Gostaria de saber mais informações sobre a propriedade X'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(newContact);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newContact.name);
      expect(response.body.email).toBe(newContact.email);
    });

    it('should reject contact creation with missing required fields', async () => {
      const invalidContact = {
        name: 'Incomplete Contact'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(invalidContact);

      expect(response.status).toBe(400);
    });

    it('should reject contact creation with invalid email', async () => {
      const invalidContact = {
        name: 'João Silva',
        email: 'invalid-email',
        subject: 'Teste',
        message: 'Mensagem de teste'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(invalidContact);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/contacts', () => {
    it('should return all contacts when authenticated', async () => {
      const response = await agent.get('/api/contacts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject access when not authenticated', async () => {
      const response = await request(app).get('/api/contacts');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete a contact when authenticated', async () => {
      const createResponse = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Maria Santos',
          email: 'maria@example.com',
          subject: 'Contato para deletar',
          message: 'Esta mensagem será deletada'
        });

      const contactId = createResponse.body.id;

      const response = await agent.delete(`/api/contacts/${contactId}`);

      expect(response.status).toBe(204);
    });

    it('should reject delete when not authenticated', async () => {
      const response = await request(app).delete('/api/contacts/some-id');

      expect(response.status).toBe(401);
    });
  });
});
