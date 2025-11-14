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

export function DispatchEntryTable() {
  const [dispatchEntries] = useState([
    { id: 1, orderId: "ORD-001", date: "2023-01-15", status: "Dispatched" },
    { id: 2, orderId: "ORD-002", date: "2023-01-16", status: "In Transit" },
    { id: 3, orderId: "ORD-003", date: "2023-01-17", status: "Pending" },
    { id: 4, orderId: "ORD-004", date: "2023-01-18", status: "Delivered" },
    { id: 5, orderId: "ORD-005", date: "2023-01-19", status: "Dispatched" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatchEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.id}</TableCell>
              <TableCell>{entry.orderId}</TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  entry.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  entry.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                  entry.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {entry.status}
                </span>
              </TableCell>
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
        <Button>Add New Dispatch Entry</Button>
      </div>
    </div>
  );
}