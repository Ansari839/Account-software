import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UnitsPage() {
  // Dummy data for the table
  const units = [
    { id: 1, name: "Piece", abbreviation: "pcs", description: "Individual piece or item", baseUnit: true },
    { id: 2, name: "Kilogram", abbreviation: "kg", description: "Metric unit of mass", baseUnit: true },
    { id: 3, name: "Gram", abbreviation: "g", description: "Subunit of kilogram", baseUnit: false },
    { id: 4, name: "Liter", abbreviation: "L", description: "Metric unit of volume", baseUnit: true },
    { id: 5, name: "Meter", abbreviation: "m", description: "Metric unit of length", baseUnit: true },
    { id: 6, name: "Box", abbreviation: "box", description: "Packaging unit", baseUnit: false },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Units of Measure</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Units</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Base Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.id}</TableCell>
                    <TableCell>{unit.name}</TableCell>
                    <TableCell className="font-mono">{unit.abbreviation}</TableCell>
                    <TableCell>{unit.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        unit.baseUnit 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {unit.baseUnit ? "Yes" : "No"}
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