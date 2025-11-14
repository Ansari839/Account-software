"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function ImportExportTable() {
  // Dummy data for the import/export table
  const importExportData = [
    { id: 1, fileName: "customers_20240115.csv", type: "Import", status: "Completed", timestamp: "2024-01-15 10:30:45", records: 1250 },
    { id: 2, fileName: "products_20240114.xlsx", type: "Export", status: "Completed", timestamp: "2024-01-14 15:45:30", records: 2500 },
    { id: 3, fileName: "orders_20240113.json", type: "Import", status: "Failed", timestamp: "2024-01-13 11:20:15", records: 500 },
    { id: 4, fileName: "suppliers_20240112.csv", type: "Export", status: "Completed", timestamp: "2024-01-12 09:15:20", records: 800 },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {importExportData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.fileName}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.type === "Import" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {row.type}
                </span>
              </TableCell>
              <TableCell>{row.records}</TableCell>
              <TableCell>{row.timestamp}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.status === "Completed" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {row.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-2 justify-end">
                  <Button variant="outline" size="sm">Download</Button>
                  <Button variant="outline" size="sm">View Log</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}