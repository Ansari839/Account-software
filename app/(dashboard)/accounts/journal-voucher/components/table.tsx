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

export function JournalVoucherTable() {
  const [vouchers] = useState([
    { id: 1, date: "2023-01-15", account: "Cash", debit: 1000, credit: 0, description: "Initial cash deposit" },
    { id: 2, date: "2023-01-16", account: "Bank", debit: 0, credit: 500, description: "Check payment to vendor" },
    { id: 3, date: "2023-01-17", account: "Sales Revenue", debit: 0, credit: 2500, description: "Sales made on credit" },
    { id: 4, date: "2023-01-18", account: "Inventory", debit: 800, credit: 0, description: "Purchase of inventory" },
    { id: 5, date: "2023-01-19", account: "Operating Expenses", debit: 200, credit: 0, description: "Office supplies" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell>{voucher.id}</TableCell>
              <TableCell>{voucher.date}</TableCell>
              <TableCell>{voucher.account}</TableCell>
              <TableCell>{voucher.debit}</TableCell>
              <TableCell>{voucher.credit}</TableCell>
              <TableCell>{voucher.description}</TableCell>
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
        <Button>Add New Voucher</Button>
      </div>
    </div>
  );
}