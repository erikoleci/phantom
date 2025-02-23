import { WalletConnection } from "@/components/wallet-connection";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionHistory } from "@/components/transaction-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { WalletStatus } from "@/lib/solana";

export default function Home() {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    connected: false,
    publicKey: null,
    balance: null,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          Solana Transaction dApp
        </h1>

        {!walletStatus.connected ? (
          <WalletConnection onConnect={setWalletStatus} />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Address: {walletStatus.publicKey}
                  </p>
                  <p className="text-lg font-semibold">
                    Balance: {walletStatus.balance?.toFixed(4)} SOL
                  </p>
                </div>
              </CardContent>
            </Card>

            <TransactionForm
              walletAddress={walletStatus.publicKey!}
              onSuccess={() => {
                // Refresh balance after transaction
                // Implementation would go here
              }}
            />

            <TransactionHistory walletAddress={walletStatus.publicKey!} />
          </div>
        )}
      </div>
    </div>
  );
}
