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

export function BackupRestoreTable() {
  // Dummy data for the backup/restore table
  const backupData = [
    { id: 1, fileName: "backup_20240115_103045.sql", size: "125.4 MB", timestamp: "2024-01-15 10:30:45", status: "Completed" },
    { id: 2, fileName: "backup_20240114_220000.sql", size: "120.2 MB", timestamp: "2024-01-14 22:00:00", status: "Completed" },
    { id: 3, fileName: "backup_20240113_220000.sql", size: "118.7 MB", timestamp: "2024-01-13 22:00:00", status: "Completed" },
    { id: 4, fileName: "backup_20240112_220000.sql", size: "115.3 MB", timestamp: "2024-01-12 22:00:00", status: "Failed" },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backupData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.fileName}</TableCell>
              <TableCell>{row.size}</TableCell>
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
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}