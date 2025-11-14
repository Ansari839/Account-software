import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PurchaseReceiptPage() {
  // Dummy data for the table
  const receipts = [
    { id: 1, receiptNumber: "GR-001", supplier: "ABC Suppliers", date: "2024-01-15", items: 5, status: "Received" },
    { id: 2, receiptNumber: "GR-002", supplier: "XYZ Distributors", date: "2024-01-16", items: 3, status: "In Transit" },
    { id: 3, receiptNumber: "GR-003", supplier: "Global Traders", date: "2024-01-17", items: 2, status: "Delivered" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Purchase Receipts</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Receipt Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.id}</TableCell>
                    <TableCell>{receipt.receiptNumber}</TableCell>
                    <TableCell>{receipt.supplier}</TableCell>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>{receipt.items}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        receipt.status === "In Transit" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : receipt.status === "Delivered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {receipt.status}
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