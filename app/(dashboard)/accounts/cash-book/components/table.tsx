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

export function CashBookTable() {
  const [transactions] = useState([
    { id: 1, date: "2023-01-15", description: "Cash deposit", debit: 1000, credit: 0, balance: 1000 },
    { id: 2, date: "2023-01-16", description: "Office supplies", debit: 0, credit: 150, balance: 850 },
    { id: 3, date: "2023-01-17", description: "Sales revenue", debit: 500, credit: 0, balance: 1350 },
    { id: 4, date: "2023-01-18", description: "Employee salary", debit: 0, credit: 400, balance: 950 },
    { id: 5, date: "2023-01-19", description: "Bank deposit", debit: 0, credit: 300, balance: 650 },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
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