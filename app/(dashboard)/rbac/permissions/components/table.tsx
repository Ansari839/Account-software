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
import { useState } from "react";

export function PermissionsTable() {
  const [permissions] = useState([
    { id: 1, name: "read_users", description: "Allow reading user data" },
    { id: 2, name: "write_users", description: "Allow writing user data" },
    { id: 3, name: "delete_users", description: "Allow deleting users" },
    { id: 4, name: "read_orders", description: "Allow reading order data" },
    { id: 5, name: "write_orders", description: "Allow writing order data" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.id}</TableCell>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t flex justify-end">
        <Button>Add New Permission</Button>
      </div>
    </div>
  );
}