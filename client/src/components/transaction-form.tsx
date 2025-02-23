import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendTransaction } from "@/lib/solana";
import { insertTransactionSchema } from "@shared/schema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  toAddress: z.string().min(32).max(44),
  amount: z.number().positive(),
});

interface TransactionFormProps {
  walletAddress: string;
  onSuccess: () => void;
}

export function TransactionForm({ walletAddress, onSuccess }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toAddress: "",
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const signature = await sendTransaction(values.toAddress, values.amount);
      
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: walletAddress,
          toAddress: values.toAddress,
          amount: values.amount,
          signature,
        }),
      });

      toast({
        title: "Transaction Successful",
        description: `Transaction signature: ${signature.slice(0, 8)}...`,
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send SOL</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              {...form.register("toAddress")}
              placeholder="Enter Solana address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000000001"
              {...form.register("amount", { valueAsNumber: true })}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Send Transaction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
