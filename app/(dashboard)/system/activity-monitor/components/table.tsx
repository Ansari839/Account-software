"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ActivityMonitorTable() {
  // Dummy data for the activity monitor table
  const activityData = [
    { id: 1, user: "Admin User", action: "Login", ip: "192.168.1.100", timestamp: "2024-01-15 10:30:45", status: "Success" },
    { id: 2, user: "John Doe", action: "View Reports", ip: "192.168.1.105", timestamp: "2024-01-15 11:15:20", status: "Success" },
    { id: 3, user: "Jane Smith", action: "Export Data", ip: "192.168.1.110", timestamp: "2024-01-15 12:45:10", status: "Success" },
    { id: 4, user: "Unknown", action: "Login Attempt", ip: "203.0.113.50", timestamp: "2024-01-15 13:20:30", status: "Failed" },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>{row.ip}</TableCell>
              <TableCell>{row.timestamp}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.status === "Success" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
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