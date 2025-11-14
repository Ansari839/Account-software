import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryAdjustmentPage() {
  // Dummy data for the table
  const adjustments = [
    { id: 1, item: "Laptop Computer", quantity: -5, reason: "Damaged Goods", date: "2024-01-15", status: "Completed" },
    { id: 2, item: "Office Chair", quantity: 10, reason: "Physical Count", date: "2024-01-16", status: "Pending" },
    { id: 3, item: "Printer Paper", quantity: -20, reason: "Shrinkage", date: "2024-01-17", status: "Completed" },
    { id: 4, item: "Coffee Machine", quantity: 2, reason: "Found in Storage", date: "2024-01-18", status: "Approved" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Inventory Adjustments</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="font-medium">{adjustment.id}</TableCell>
                    <TableCell>{adjustment.item}</TableCell>
                    <TableCell className={`${adjustment.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                    </TableCell>
                    <TableCell>{adjustment.reason}</TableCell>
                    <TableCell>{adjustment.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        adjustment.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : adjustment.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {adjustment.status}
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