import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  toAddress: z.string().min(34).max(34),
  amount: z.number().positive(),
});

interface TronTransactionFormProps {
  walletAddress: string;
  onSuccess: () => void;
}

export function TronTransactionForm({ walletAddress, onSuccess }: TronTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toAddress: "",
      amount: 1000, // Default to 1000 TRON
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here we'll integrate with TRON's API
      toast({
        title: "Transaction Initiated",
        description: "This is a demo interface. In a real application, this would initiate a TRON transaction.",
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
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Send TRON</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              {...form.register("toAddress")}
              placeholder="Enter TRON address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (TRX)</Label>
            <Input
              id="amount"
              type="number"
              step="1"
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
              "Send TRON"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
