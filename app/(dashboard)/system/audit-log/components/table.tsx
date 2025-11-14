"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AuditLogTable() {
  // Dummy data for the audit log table
  const auditData = [
    { id: 1, userId: "user123", action: "CREATE", module: "Customer", timestamp: "2024-01-15 10:30:45", details: "Created new customer" },
    { id: 2, userId: "user456", action: "UPDATE", module: "Product", timestamp: "2024-01-15 11:20:30", details: "Updated product price" },
    { id: 3, userId: "user789", action: "DELETE", module: "Order", timestamp: "2024-01-15 12:45:20", details: "Deleted order" },
    { id: 4, userId: "user123", action: "READ", module: "Report", timestamp: "2024-01-15 13:15:10", details: "Viewed sales report" },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.userId}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.action === "CREATE" 
                    ? "bg-blue-100 text-blue-800" 
                    : row.action === "READ"
                    ? "bg-green-100 text-green-800"
                    : row.action === "UPDATE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {row.action}
                </span>
              </TableCell>
              <TableCell>{row.module}</TableCell>
              <TableCell>{row.timestamp}</TableCell>
              <TableCell>{row.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}