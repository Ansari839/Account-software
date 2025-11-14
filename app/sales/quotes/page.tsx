import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SalesQuotesPage() {
  // Dummy data for the table
  const quotes = [
    { id: 1, quoteNumber: "SQ-001", customer: "ABC Corporation", date: "2024-01-15", amount: "$2,450.00", status: "Sent" },
    { id: 2, quoteNumber: "SQ-002", customer: "XYZ Industries", date: "2024-01-16", amount: "$1,780.00", status: "Pending" },
    { id: 3, quoteNumber: "SQ-003", customer: "Global Solutions", date: "2024-01-17", amount: "$3,250.00", status: "Accepted" },
    { id: 4, quoteNumber: "SQ-004", customer: "Tech Innovators", date: "2024-01-18", amount: "$980.00", status: "Expired" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Sales Quotes</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Quote Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.quoteNumber}</TableCell>
                    <TableCell>{quote.customer}</TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell>{quote.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quote.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : quote.status === "Sent"
                          ? "bg-blue-100 text-blue-800"
                          : quote.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {quote.status}
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