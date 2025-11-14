"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InventoryReportsTable() {
  // Dummy data for the table
  const reportData = [
    { id: 1, name: "Stock Level Report", description: "Current stock levels in inventory", date: "2024-01-31", status: "Generated" },
    { id: 2, name: "Slow Moving Items Report", description: "Items with low turnover rate", date: "2024-02-28", status: "Generated" },
    { id: 3, name: "Expiry Report", description: "Items approaching expiry dates", date: "2024-03-31", status: "Pending" },
    { id: 4, name: "Q1 Inventory Summary", description: "Quarter 1 inventory summary report", date: "2024-03-31", status: "Generated" },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.status === "Generated" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}