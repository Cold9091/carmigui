// Vercel Serverless Function handler
// This file imports and runs the Express app built in dist/app.js

import { createApp } from '../dist/app.js';

let appPromise = null;

export default async (req, res) => {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return app(req, res);
};
