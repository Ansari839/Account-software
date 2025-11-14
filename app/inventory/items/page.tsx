import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryItemsPage() {
  // Dummy data for the table
  const items = [
    { id: 1, name: "Laptop Computer", sku: "LAP-001", category: "Electronics", stock: 45, unit: "pcs", price: "$899.00" },
    { id: 2, name: "Office Chair", sku: "CHA-002", category: "Furniture", stock: 20, unit: "pcs", price: "$149.99" },
    { id: 3, name: "Printer Paper", sku: "PAP-003", category: "Stationery", stock: 150, unit: "ream", price: "$8.50" },
    { id: 4, name: "Coffee Machine", sku: "COF-004", category: "Appliances", stock: 8, unit: "pcs", price: "$249.00" },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Inventory Items</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-gray-500">{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.price}</TableCell>
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