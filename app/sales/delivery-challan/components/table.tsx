import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DeliveryChallanTable() {
  return (
    <Table>
      <TableCaption>A list of your delivery challans.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Challan ID</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>DC-001</TableCell>
          <TableCell>SO-001</TableCell>
          <TableCell>2024-01-18</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>DC-002</TableCell>
          <TableCell>SO-002</TableCell>
          <TableCell>2024-01-19</TableCell>
          <TableCell>Delivered</TableCell>
          <TableCell>3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}