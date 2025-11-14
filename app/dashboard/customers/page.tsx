import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CustomersPage() {
  // Dummy data for the table
  const customers = [
    { id: 1, name: "ABC Corporation", email: "contact@abccorp.com", phone: "+1 (555) 123-4567", city: "New York", status: "Active" },
    { id: 2, name: "XYZ Industries", email: "info@xyzindustries.com", phone: "+1 (555) 987-6543", city: "Chicago", status: "Active" },
    { id: 3, name: "Global Solutions", email: "support@globalsol.com", phone: "+1 (555) 456-7890", city: "Los Angeles", status: "Inactive" },
    { id: 4, name: "Tech Innovators", email: "hello@techinnovate.com", phone: "+1 (555) 234-5678", city: "San Francisco", status: "Active" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Master</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {customer.status}
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