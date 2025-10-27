import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';

describe('Projects API Tests', () => {
  let app: Express;
  let server: Server;
  let agent: any;
  let createdProjectId: string;

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

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project when authenticated', async () => {
      const newProject = {
        title: 'Projeto de Teste',
        description: 'Descrição do projeto de teste',
        area: 500,
        duration: '12 meses',
        units: '20 unidades',
        year: '2024',
        status: 'in-progress'
      };

      const response = await agent
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newProject.title);
      expect(response.body.area).toBe(newProject.area);

      createdProjectId = response.body.id;
    });

    it('should reject project creation when not authenticated', async () => {
      const newProject = {
        title: 'Projeto Não Autorizado',
        description: 'Descrição',
        area: 300,
        duration: '6 meses',
        units: '10',
        year: '2024',
        status: 'planning'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(401);
    });

    it('should reject project creation with missing required fields', async () => {
      const invalidProject = {
        title: 'Projeto Incompleto'
      };

      const response = await agent
        .post('/api/projects')
        .send(invalidProject);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a specific project', async () => {
      if (!createdProjectId) {
        const createResponse = await agent
          .post('/api/projects')
          .send({
            title: 'Projeto para buscar',
            description: 'Descrição',
            area: 400,
            duration: '8 meses',
            units: '15',
            year: '2024',
            status: 'in-progress'
          });
        createdProjectId = createResponse.body.id;
      }

      const response = await request(app).get(`/api/projects/${createdProjectId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdProjectId);
    });

    it('should return 404 for non-existent project', async () => {
      const response = await request(app).get('/api/projects/nonexistent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project when authenticated', async () => {
      if (!createdProjectId) {
        const createResponse = await agent
          .post('/api/projects')
          .send({
            title: 'Projeto para atualizar',
            description: 'Descrição',
            area: 350,
            duration: '10 meses',
            units: '12',
            year: '2024',
            status: 'planning'
          });
        createdProjectId = createResponse.body.id;
      }

      const updateData = {
        title: 'Projeto Atualizado',
        status: 'completed'
      };

      const response = await agent
        .put(`/api/projects/${createdProjectId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
    });

    it('should reject update when not authenticated', async () => {
      const response = await request(app)
        .put(`/api/projects/${createdProjectId}`)
        .send({ title: 'Nova tentativa' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project when authenticated', async () => {
      const createResponse = await agent
        .post('/api/projects')
        .send({
          title: 'Projeto para deletar',
          description: 'Descrição',
          area: 250,
          duration: '5 meses',
          units: '8',
          year: '2024',
          status: 'planning'
        });

      const projectToDelete = createResponse.body.id;

      const response = await agent.delete(`/api/projects/${projectToDelete}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/api/projects/${projectToDelete}`);
      expect(getResponse.status).toBe(404);
    });

    it('should reject delete when not authenticated', async () => {
      const response = await request(app).delete(`/api/projects/some-id`);

      expect(response.status).toBe(401);
    });
  });
});
