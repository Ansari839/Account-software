import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CustomerLedgerTable() {
  return (
    <Table>
      <TableCaption>A list of customer ledger entries.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Transaction Type</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2024-01-15</TableCell>
          <TableCell>Sales</TableCell>
          <TableCell>SO-001</TableCell>
          <TableCell>$0.00</TableCell>
          <TableCell>$1,200.00</TableCell>
          <TableCell>$1,200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-01-20</TableCell>
          <TableCell>Payment</TableCell>
          <TableCell>PM-001</TableCell>
          <TableCell>$1,000.00</TableCell>
          <TableCell>$0.00</TableCell>
          <TableCell>$200.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}