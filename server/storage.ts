import { type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByAddress(address: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private transactions: Transaction[];
  private currentId: number;

  constructor() {
    this.transactions = [];
    this.currentId = 1;
  }

  async createTransaction(insertTx: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTx,
      id: this.currentId++,
      timestamp: new Date(),
    };
    
    this.transactions.push(transaction);
    return transaction;
  }

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (tx) => tx.fromAddress === address || tx.toAddress === address
    );
  }
}

export const storage = new MemStorage();
