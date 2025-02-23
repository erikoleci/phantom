import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/transactions/:address", async (req, res) => {
    const { address } = req.params;
    const transactions = await storage.getTransactionsByAddress(address);
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    const result = insertTransactionSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const transaction = await storage.createTransaction(result.data);
    res.status(201).json(transaction);
  });

  const httpServer = createServer(app);
  return httpServer;
}
