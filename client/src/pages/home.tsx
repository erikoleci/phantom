import { WalletConnection } from "@/components/wallet-connection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { WalletStatus } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          Crypto dApp
        </h1>

        <div className="space-y-6">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Wallet Connected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <WalletConnection onConnect={setWalletStatus} />

              <Button
                onClick={handleClaim}
                disabled={!walletStatus.connected || isClaiming}
                className="w-full"
                size="lg"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  "Claim 1000 TRON"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}