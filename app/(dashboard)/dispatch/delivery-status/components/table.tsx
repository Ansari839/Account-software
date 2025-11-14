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

export function DeliveryStatusTable() {
  const [deliveryStatuses] = useState([
    { id: 1, dispatchId: "DIS-001", status: "Delivered", updatedAt: "2023-01-15" },
    { id: 2, dispatchId: "DIS-002", status: "In Transit", updatedAt: "2023-01-16" },
    { id: 3, dispatchId: "DIS-003", status: "Pending", updatedAt: "2023-01-17" },
    { id: 4, dispatchId: "DIS-004", status: "Out for Delivery", updatedAt: "2023-01-18" },
    { id: 5, dispatchId: "DIS-005", status: "Delivered", updatedAt: "2023-01-19" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Dispatch ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryStatuses.map((status) => (
            <TableRow key={status.id}>
              <TableCell>{status.id}</TableCell>
              <TableCell>{status.dispatchId}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  status.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  status.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                  status.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status.status}
                </span>
              </TableCell>
              <TableCell>{status.updatedAt}</TableCell>
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
        <Button>Add New Status</Button>
      </div>
    </div>
  );
}