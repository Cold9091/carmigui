import type { Request, Response } from "express";
import { z } from "zod";

/**
 * Helper genérico para operação GET (lista)
 */
export function createGetAllHandler<T>(
  storageMethod: (filters?: any) => Promise<T[]>,
  resourceName: string
) {
  return async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const items = await storageMethod(filters);
      res.json(items);
    } catch (error) {
      console.error(`Error fetching ${resourceName}:`, error);
      res.status(500).json({ message: `Failed to fetch ${resourceName}` });
    }
  };
}

/**
 * Helper genérico para operação GET (item único)
 */
export function createGetByIdHandler<T>(
  storageMethod: (id: string) => Promise<T | null>,
  resourceName: string
) {
  return async (req: Request, res: Response) => {
    try {
      const item = await storageMethod(req.params.id);
      if (!item) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }
      res.json(item);
    } catch (error) {
      console.error(`Error fetching ${resourceName}:`, error);
      res.status(500).json({ message: `Failed to fetch ${resourceName}` });
    }
  };
}

/**
 * Helper genérico para operação POST (criar)
 */
export function createPostHandler<T, TInsert>(
  storageMethod: (data: TInsert) => Promise<T>,
  schema: z.ZodSchema<TInsert>,
  resourceName: string
) {
  return async (req: Request, res: Response) => {
    try {
      const data = schema.parse(req.body);
      const newItem = await storageMethod(data);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: `Invalid ${resourceName} data`, 
          errors: error.errors 
        });
      }
      console.error(`Error creating ${resourceName}:`, error);
      res.status(500).json({ message: `Failed to create ${resourceName}` });
    }
  };
}

/**
 * Helper genérico para operação PUT (atualizar)
 */
export function createPutHandler<T, TUpdate>(
  storageMethod: (id: string, data: TUpdate) => Promise<T | null>,
  schema: z.ZodSchema<TUpdate>,
  resourceName: string
) {
  return async (req: Request, res: Response) => {
    try {
      const data = schema.parse(req.body);
      const updatedItem = await storageMethod(req.params.id, data);
      if (!updatedItem) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: `Invalid ${resourceName} data`, 
          errors: error.errors 
        });
      }
      console.error(`Error updating ${resourceName}:`, error);
      res.status(500).json({ message: `Failed to update ${resourceName}` });
    }
  };
}

/**
 * Helper genérico para operação DELETE
 */
export function createDeleteHandler(
  storageMethod: (id: string) => Promise<boolean>,
  resourceName: string
) {
  return async (req: Request, res: Response) => {
    try {
      const deleted = await storageMethod(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting ${resourceName}:`, error);
      res.status(500).json({ message: `Failed to delete ${resourceName}` });
    }
  };
}

/**
 * Cria um conjunto completo de handlers CRUD para um recurso
 */
export function createCRUDHandlers<T, TInsert>(config: {
  storage: {
    getAll: (filters?: any) => Promise<T[]>;
    getById: (id: string) => Promise<T | null>;
    create: (data: TInsert) => Promise<T>;
    update: (id: string, data: Partial<TInsert>) => Promise<T | null>;
    delete: (id: string) => Promise<boolean>;
  };
  schemas: {
    insert: z.ZodSchema<TInsert>;
    update: z.ZodSchema<Partial<TInsert>>;
  };
  resourceName: string;
}) {
  return {
    getAll: createGetAllHandler(config.storage.getAll, config.resourceName),
    getById: createGetByIdHandler(config.storage.getById, config.resourceName),
    create: createPostHandler(config.storage.create, config.schemas.insert, config.resourceName),
    update: createPutHandler(config.storage.update, config.schemas.update, config.resourceName),
    delete: createDeleteHandler(config.storage.delete, config.resourceName),
  };
}
