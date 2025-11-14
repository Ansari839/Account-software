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

export function GatepassTable() {
  const [gatepasses] = useState([
    { id: 1, dispatchId: "DIS-001", vehicleId: "V-001", date: "2023-01-15", status: "Active" },
    { id: 2, dispatchId: "DIS-002", vehicleId: "V-002", date: "2023-01-16", status: "Active" },
    { id: 3, dispatchId: "DIS-003", vehicleId: "V-003", date: "2023-01-17", status: "Expired" },
    { id: 4, dispatchId: "DIS-004", vehicleId: "V-004", date: "2023-01-18", status: "Active" },
    { id: 5, dispatchId: "DIS-005", vehicleId: "V-005", date: "2023-01-19", status: "Active" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Dispatch ID</TableHead>
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gatepasses.map((gatepass) => (
            <TableRow key={gatepass.id}>
              <TableCell>{gatepass.id}</TableCell>
              <TableCell>{gatepass.dispatchId}</TableCell>
              <TableCell>{gatepass.vehicleId}</TableCell>
              <TableCell>{gatepass.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  gatepass.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {gatepass.status}
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
        <Button>Add New Gatepass</Button>
      </div>
    </div>
  );
}