import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SalesInvoicesPage() {
  // Dummy data for the table
  const invoices = [
    { id: 1, invoiceNumber: "SI-001", customer: "ABC Corporation", date: "2024-01-15", amount: "$2,450.00", status: "Paid" },
    { id: 2, invoiceNumber: "SI-002", customer: "XYZ Industries", date: "2024-01-16", amount: "$1,780.00", status: "Pending" },
    { id: 3, invoiceNumber: "SI-003", customer: "Global Solutions", date: "2024-01-17", amount: "$3,250.00", status: "Overdue" },
    { id: 4, invoiceNumber: "SI-004", customer: "Tech Innovators", date: "2024-01-18", amount: "$980.00", status: "Paid" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Sales Invoices</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : invoice.status === "Overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {invoice.status}
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