import type { Router } from "express";
import { storage } from "../storage";
import { insertAboutUsSchema, insertEmployeeSchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerAboutRoutes(router: Router) {
  // About Us handlers
  const aboutHandlers = createCRUDHandlers({
    storage: {
      getAll: storage.getAboutUsSections,
      getById: storage.getAboutUsSection,
      create: storage.createAboutUsSection,
      update: storage.updateAboutUsSection,
      delete: storage.deleteAboutUsSection,
    },
    schemas: {
      insert: insertAboutUsSchema,
      update: insertAboutUsSchema.partial(),
    },
    resourceName: "About Us Section",
  });

  router.get("/api/about-us", aboutHandlers.getAll);
  router.get("/api/about-us/:id", aboutHandlers.getById);
  router.post("/api/about-us", ensureAuthenticated, aboutHandlers.create);
  router.put("/api/about-us/:id", ensureAuthenticated, aboutHandlers.update);
  router.delete("/api/about-us/:id", ensureAuthenticated, aboutHandlers.delete);

  // Employees routes com filtros customizados
  router.get("/api/employees", async (req, res) => {
    try {
      const filters = {
        department: req.query.department as string,
        activeOnly: req.query.activeOnly === "true" ? true : req.query.activeOnly === "false" ? false : undefined,
      };
      const employees = await storage.getEmployees(filters);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  const employeeHandlers = createCRUDHandlers({
    storage: {
      getAll: storage.getEmployees,
      getById: storage.getEmployee,
      create: storage.createEmployee,
      update: storage.updateEmployee,
      delete: storage.deleteEmployee,
    },
    schemas: {
      insert: insertEmployeeSchema,
      update: insertEmployeeSchema.partial(),
    },
    resourceName: "Employee",
  });

  router.get("/api/employees/:id", employeeHandlers.getById);
  router.post("/api/employees", ensureAuthenticated, employeeHandlers.create);
  router.put("/api/employees/:id", ensureAuthenticated, employeeHandlers.update);
  router.delete("/api/employees/:id", ensureAuthenticated, employeeHandlers.delete);
}
