import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../server/routes';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';

describe('Upload API Tests', () => {
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

    const testImagePath = path.join(process.cwd(), 'tests', 'test-image.png');
    if (!fs.existsSync(testImagePath)) {
      const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(testImagePath, buffer);
    }
  });

  afterAll(() => {
    const testImagePath = path.join(process.cwd(), 'tests', 'test-image.png');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('POST /api/upload/images', () => {
    it('should upload an image when authenticated', async () => {
      const testImagePath = path.join(process.cwd(), 'tests', 'test-image.png');

      const response = await agent
        .post('/api/upload/images')
        .attach('images', testImagePath);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('files');
      expect(Array.isArray(response.body.files)).toBe(true);
      expect(response.body.files.length).toBeGreaterThan(0);
      expect(response.body.files[0]).toHaveProperty('url');
    });

    it('should reject upload when not authenticated', async () => {
      const testImagePath = path.join(process.cwd(), 'tests', 'test-image.png');

      const response = await request(app)
        .post('/api/upload/images')
        .attach('images', testImagePath);

      expect(response.status).toBe(401);
    });

    it('should reject upload without files', async () => {
      const response = await agent.post('/api/upload/images');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /uploads/images/:filename', () => {
    it('should serve uploaded images', async () => {
      const testImagePath = path.join(process.cwd(), 'tests', 'test-image.png');

      const uploadResponse = await agent
        .post('/api/upload/images')
        .attach('images', testImagePath);

      if (uploadResponse.body.files && uploadResponse.body.files.length > 0) {
        const imageUrl = uploadResponse.body.files[0].url;
        const filename = path.basename(imageUrl);

        const response = await request(app).get(`/uploads/images/${filename}`);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image/);
      }
    });
  });
});
