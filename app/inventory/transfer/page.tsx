import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryTransferPage() {
  // Dummy data for the table
  const transfers = [
    { id: 1, from: "Main Warehouse", to: "Regional Hub", item: "Laptop Computer", quantity: 10, date: "2024-01-15", status: "Completed" },
    { id: 2, from: "Regional Hub", to: "Cold Storage", item: "Coffee Machine", quantity: 5, date: "2024-01-16", status: "In Transit" },
    { id: 3, from: "Main Warehouse", to: "Overflow Warehouse", item: "Office Chair", quantity: 15, date: "2024-01-17", status: "Pending" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Inventory Transfers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>{transfer.from}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell>{transfer.item}</TableCell>
                    <TableCell>{transfer.quantity}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transfer.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : transfer.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {transfer.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}