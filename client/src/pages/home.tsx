import { WalletConnection } from "@/components/wallet-connection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { WalletStatus } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bitcoin, Wallet } from "lucide-react";

export default function Home() {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    connected: false,
    publicKey: null,
    balance: null,
  });
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      toast({
        title: "Tokens Claimed",
        description: "1000 TRON tokens have been claimed successfully!",
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Failed to claim tokens",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 relative">
      {/* Decorative grid background */}
      <div className="crypto-grid" />

      <div className="max-w-6xl mx-auto space-y-6 relative">
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-5xl font-bold glow-text">
            Crypto dApp
          </h1>
          <p className="text-gray-400">
            Connect your wallet and claim your tokens
          </p>
        </div>

        <div className="space-y-6">
          <Card className="w-full max-w-md mx-auto crypto-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
                <Bitcoin className="h-6 w-6 text-[#00ff87]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <WalletConnection onConnect={setWalletStatus} />

              <Button
                onClick={handleClaim}
                disabled={!walletStatus.connected || isClaiming}
                className={`w-full ${!walletStatus.connected ? 'opacity-50' : 'btn-glow'}`}
                size="lg"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Claim 1000 TRON
                  </>
                )}
              </Button>

              {walletStatus.connected && (
                <p className="text-sm text-center text-emerald-400">
                  Connected: {walletStatus.publicKey?.slice(0, 8)}...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}