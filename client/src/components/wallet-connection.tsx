import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { connectWallet, type WalletStatus } from "@/lib/solana";

interface WalletConnectionProps {
  onConnect: (status: WalletStatus) => void;
}

export function WalletConnection({ onConnect }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom wallet to continue. Redirecting to installation page...",
          variant: "destructive",
        });
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const status = await connectWallet();
      onConnect(status);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${status.publicKey?.slice(0, 8)}...`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Connect Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
          size="lg"
        >
          {isConnecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          {isConnecting ? "Connecting..." : "Connect Phantom Wallet"}
        </Button>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Don't have Phantom wallet?{" "}
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Install it here
          </a>
        </p>
      </CardContent>
    </Card>
  );
}