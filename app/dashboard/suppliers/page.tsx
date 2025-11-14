import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SuppliersPage() {
  // Dummy data for the table
  const suppliers = [
    { id: 1, name: "ABC Suppliers", email: "contact@abcsuppliers.com", phone: "+1 (555) 123-4567", city: "New York", status: "Active" },
    { id: 2, name: "XYZ Distributors", email: "info@xyzdist.com", phone: "+1 (555) 987-6543", city: "Chicago", status: "Active" },
    { id: 3, name: "Global Traders", email: "support@globaltrade.com", phone: "+1 (555) 456-7890", city: "Los Angeles", status: "Inactive" },
    { id: 4, name: "Tech Components", email: "orders@techcomp.com", phone: "+1 (555) 234-5678", city: "San Francisco", status: "Active" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Suppliers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Supplier Master</CardTitle>
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
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        supplier.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {supplier.status}
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