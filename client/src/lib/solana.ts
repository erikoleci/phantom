import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Add type definitions for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
      publicKey: PublicKey | null;
      isConnected: boolean;
    };
  }
}

const SOLANA_NETWORK = "devnet";
const connection = new Connection(`https://api.${SOLANA_NETWORK}.solana.com`);

export type WalletStatus = {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
};

export async function connectWallet(): Promise<WalletStatus> {
  if (!window.solana || !window.solana.isPhantom) {
    window.open("https://phantom.app/", "_blank");
    throw new Error("Please install Phantom wallet first");
  }

  try {
    const resp = await window.solana.connect();
    const balance = await connection.getBalance(resp.publicKey);

    return {
      connected: true,
      publicKey: resp.publicKey.toString(),
      balance: balance / LAMPORTS_PER_SOL
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function sendTransaction(
  toAddress: string,
  amount: number
): Promise<string> {
  if (!window.solana || !window.solana.isConnected || !window.solana.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    const toPublicKey = new PublicKey(toAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    const { signature } = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);

    return signature;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

export async function getBalance(publicKey: string): Promise<number> {
  const key = new PublicKey(publicKey);
  const balance = await connection.getBalance(key);
  return balance / LAMPORTS_PER_SOL;
}