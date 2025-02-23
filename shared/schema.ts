import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: numeric("amount").notNull(),
  signature: text("signature").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true,
  timestamp: true 
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
