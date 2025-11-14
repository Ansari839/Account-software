"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SalesReportsTable() {
  // Dummy data for the table
  const reportData = [
    { id: 1, name: "January Sales Report", description: "Sales report for January 2024", date: "2024-01-31", status: "Generated" },
    { id: 2, name: "February Sales Report", description: "Sales report for February 2024", date: "2024-02-28", status: "Generated" },
    { id: 3, name: "March Sales Report", description: "Sales report for March 2024", date: "2024-03-31", status: "Pending" },
    { id: 4, name: "Q1 Summary Report", description: "Quarter 1 summary sales report", date: "2024-03-31", status: "Generated" },
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