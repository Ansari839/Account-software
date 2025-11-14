import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SalesOrderReturnTable() {
  return (
    <Table>
      <TableCaption>A list of your sales order returns.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Return ID</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>SR-001</TableCell>
          <TableCell>SO-001</TableCell>
          <TableCell>2024-01-20</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>$1,200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SR-002</TableCell>
          <TableCell>SO-002</TableCell>
          <TableCell>2024-01-21</TableCell>
          <TableCell>Approved</TableCell>
          <TableCell>$2,500.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}