import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PurchaseReturnPage() {
  // Dummy data for the table
  const returns = [
    { id: 1, returnNumber: "PR-001", supplier: "ABC Suppliers", date: "2024-01-15", amount: "$520.00", status: "Processed" },
    { id: 2, returnNumber: "PR-002", supplier: "XYZ Distributors", date: "2024-01-16", amount: "$320.00", status: "Pending" },
    { id: 3, returnNumber: "PR-003", supplier: "Global Traders", date: "2024-01-17", amount: "$180.00", status: "Approved" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Purchase Returns</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Return Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">{returnItem.id}</TableCell>
                    <TableCell>{returnItem.returnNumber}</TableCell>
                    <TableCell>{returnItem.supplier}</TableCell>
                    <TableCell>{returnItem.date}</TableCell>
                    <TableCell>{returnItem.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        returnItem.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : returnItem.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {returnItem.status}
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