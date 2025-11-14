"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomReportsTable() {
  // Dummy data for the table
  const reportData = [
    { id: 1, name: "Custom Sales Analysis", description: "Custom sales analysis report", date: "2024-01-31", status: "Generated" },
    { id: 2, name: "Customer Behavior Report", description: "Analysis of customer behavior patterns", date: "2024-02-28", status: "Generated" },
    { id: 3, name: "Ad-hoc Inventory Report", description: "Custom inventory report as requested", date: "2024-03-31", status: "Pending" },
    { id: 4, name: "Regional Performance Report", description: "Sales performance by region", date: "2024-03-31", status: "Generated" },
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