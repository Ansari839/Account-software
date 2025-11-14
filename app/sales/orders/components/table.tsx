import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SalesOrdersTable() {
  return (
    <Table>
      <TableCaption>A list of your sales orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>SO-001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>2024-01-15</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>$1,200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SO-002</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>2024-01-16</TableCell>
          <TableCell>Confirmed</TableCell>
          <TableCell>$2,500.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}