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

export function BankBookTable() {
  const [transactions] = useState([
    { id: 1, date: "2023-01-15", bank: "First National Bank", description: "Opening deposit", debit: 5000, credit: 0, balance: 5000 },
    { id: 2, date: "2023-01-16", bank: "First National Bank", description: "Supplier payment", debit: 0, credit: 1200, balance: 3800 },
    { id: 3, date: "2023-01-17", bank: "City Bank", description: "Customer payment", debit: 2500, credit: 0, balance: 2500 },
    { id: 4, date: "2023-01-18", bank: "First National Bank", description: "ATM withdrawal", debit: 0, credit: 300, balance: 3500 },
    { id: 5, date: "2023-01-19", bank: "City Bank", description: "Bank charges", debit: 0, credit: 25, balance: 2475 },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.bank}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.debit}</TableCell>
              <TableCell>{transaction.credit}</TableCell>
              <TableCell>{transaction.balance}</TableCell>
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