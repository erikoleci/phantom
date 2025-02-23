import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { type Transaction } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface TransactionHistoryProps {
  walletAddress: string;
}

export function TransactionHistory({ walletAddress }: TransactionHistoryProps) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", walletAddress],
  });

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((tx) => (
              <TableRow key={tx.signature}>
                <TableCell className="font-mono">
                  {tx.fromAddress.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-mono">
                  {tx.toAddress.slice(0, 8)}...
                </TableCell>
                <TableCell>{tx.amount} SOL</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
