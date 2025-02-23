import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_NETWORK = "devnet";
const connection = new Connection(`https://api.${SOLANA_NETWORK}.solana.com`);

export type WalletStatus = {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
};

export async function connectWallet(): Promise<WalletStatus> {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not detected");
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
  if (!window.solana.isConnected) {
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

    const signature = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature.signature);
    
    return signature.signature;
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
