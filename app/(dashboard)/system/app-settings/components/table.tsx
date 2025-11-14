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

export function AppSettingsTable() {
  // Dummy data for the app settings table
  const settingsData = [
    { id: 1, key: "app_name", value: "ERP System", description: "Application name displayed in the UI" },
    { id: 2, key: "company_name", value: "My Company", description: "Legal company name for reports" },
    { id: 3, key: "currency", value: "USD", description: "Default currency for all transactions" },
    { id: 4, key: "date_format", value: "MM/DD/YYYY", description: "Date format used throughout the application" },
    { id: 5, key: "time_format", value: "24h", description: "Time format used throughout the application" },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settingsData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell className="font-mono">{row.key}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}