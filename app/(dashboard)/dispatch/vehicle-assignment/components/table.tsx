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

export function VehicleAssignmentTable() {
  const [vehicleAssignments] = useState([
    { id: 1, vehicleNo: "KA-01-AB-1234", driverName: "John Doe", dispatchId: "DIS-001", status: "Assigned" },
    { id: 2, vehicleNo: "KA-02-CD-5678", driverName: "Jane Smith", dispatchId: "DIS-002", status: "Assigned" },
    { id: 3, vehicleNo: "KA-03-EF-9012", driverName: "Bob Johnson", dispatchId: "DIS-003", status: "Available" },
    { id: 4, vehicleNo: "KA-04-GH-3456", driverName: "Alice Brown", dispatchId: "DIS-004", status: "Assigned" },
    { id: 5, vehicleNo: "KA-05-IJ-7890", driverName: "Charlie Wilson", dispatchId: "DIS-005", status: "Available" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Dispatch ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleAssignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.id}</TableCell>
              <TableCell>{assignment.vehicleNo}</TableCell>
              <TableCell>{assignment.driverName}</TableCell>
              <TableCell>{assignment.dispatchId || '-'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  assignment.status === 'Assigned' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.status}
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
        <Button>Add New Assignment</Button>
      </div>
    </div>
  );
}