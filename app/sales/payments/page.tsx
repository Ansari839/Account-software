import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SalesPaymentsPage() {
  // Dummy data for the table
  const payments = [
    { id: 1, paymentNumber: "SP-001", customer: "ABC Corporation", date: "2024-01-15", amount: "$2,450.00", method: "Bank Transfer" },
    { id: 2, paymentNumber: "SP-002", customer: "XYZ Industries", date: "2024-01-16", amount: "$1,780.00", method: "Credit Card" },
    { id: 3, paymentNumber: "SP-003", customer: "Global Solutions", date: "2024-01-17", amount: "$3,250.00", method: "Check" },
    { id: 4, paymentNumber: "SP-004", customer: "Tech Innovators", date: "2024-01-18", amount: "$980.00", method: "Cash" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Sales Payments</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Payment Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.paymentNumber}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.method}</TableCell>
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