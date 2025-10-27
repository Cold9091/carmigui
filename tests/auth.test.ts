import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';

describe('Authentication Tests', () => {
  let app: Express;
  let server: Server;
  let agent: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    server = await registerRoutes(app);
    agent = request.agent(app);
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('POST /api/login', () => {
    it('should login with valid credentials', async () => {
      const response = await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'Teste123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'carmigui@site.ao');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject login without credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/user', () => {
    it('should return user info when authenticated', async () => {
      await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'Teste123'
        });

      const response = await agent.get('/api/user');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'carmigui@site.ao');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/user');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Não autenticado');
    });
  });

  describe('POST /api/logout', () => {
    it('should logout authenticated user', async () => {
      await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'Teste123'
        });

      const response = await agent.post('/api/logout');
      expect(response.status).toBe(200);

      const userResponse = await agent.get('/api/user');
      expect(userResponse.status).toBe(401);
    });
  });

  describe('POST /api/change-password', () => {
    it('should change password when authenticated with correct current password', async () => {
      await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'Teste123'
        });

      const response = await agent
        .post('/api/change-password')
        .send({
          currentPassword: 'Teste123',
          newPassword: 'NewPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Senha alterada com sucesso');

      await agent.post('/api/logout');

      const loginResponse = await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'NewPassword123'
        });

      expect(loginResponse.status).toBe(200);

      await agent
        .post('/api/change-password')
        .send({
          currentPassword: 'NewPassword123',
          newPassword: 'Teste123'
        });
    });

    it('should reject password change when not authenticated', async () => {
      const response = await request(app)
        .post('/api/change-password')
        .send({
          currentPassword: 'Teste123',
          newPassword: 'NewPassword123'
        });

      expect(response.status).toBe(401);
    });

    it('should reject password change with incorrect current password', async () => {
      await agent
        .post('/api/login')
        .send({
          email: 'carmigui@site.ao',
          password: 'Teste123'
        });

      const response = await agent
        .post('/api/change-password')
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Senha atual incorreta');
    });
  });
});
