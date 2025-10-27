import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.SESSION_SECRET = 'test-secret-key-for-testing-purposes-only-12345678901234567890';
});

afterEach(() => {
  // Cleanup after each test
});

afterAll(() => {
  // Final cleanup
});
