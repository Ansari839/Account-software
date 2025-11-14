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

export function GeneralLedgerTable() {
  const [transactions] = useState([
    { id: 1, date: "2023-01-15", account: "Cash", debit: 1000, credit: 0, description: "Initial deposit" },
    { id: 2, date: "2023-01-16", account: "Bank", debit: 0, credit: 500, description: "Check payment" },
    { id: 3, date: "2023-01-17", account: "Inventory", debit: 800, credit: 0, description: "Purchase" },
    { id: 4, date: "2023-01-18", account: "Sales Revenue", debit: 0, credit: 2500, description: "Sales" },
    { id: 5, date: "2023-01-19", account: "Operating Expenses", debit: 200, credit: 0, description: "Supplies" },
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
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.account}</TableCell>
              <TableCell>{transaction.debit}</TableCell>
              <TableCell>{transaction.credit}</TableCell>
              <TableCell>{transaction.description}</TableCell>
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
        <Button>Add New Entry</Button>
      </div>
    </div>
  );
}