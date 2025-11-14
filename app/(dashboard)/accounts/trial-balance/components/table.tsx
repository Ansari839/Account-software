"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function TrialBalanceTable() {
  const [accounts] = useState([
    { id: 1, name: "Cash", debit: 5000, credit: 0 },
    { id: 2, name: "Accounts Receivable", debit: 3000, credit: 0 },
    { id: 3, name: "Inventory", debit: 8000, credit: 0 },
    { id: 4, name: "Fixed Assets", debit: 15000, credit: 0 },
    { id: 5, name: "Accounts Payable", debit: 0, credit: 4000 },
    { id: 6, name: "Loans Payable", debit: 0, credit: 10000 },
    { id: 7, name: "Owner's Equity", debit: 0, credit: 8000 },
    { id: 8, name: "Sales Revenue", debit: 0, credit: 25000 },
    { id: 9, name: "Cost of Goods Sold", debit: 12000, credit: 0 },
    { id: 10, name: "Operating Expenses", debit: 5000, credit: 0 },
  ]);

  const totalDebit = accounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = accounts.reduce((sum, account) => sum + account.credit, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalDebit.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalCredit.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.debit > 0 ? `$${account.debit.toLocaleString()}` : ''}</TableCell>
                <TableCell>{account.credit > 0 ? `$${account.credit.toLocaleString()}` : ''}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Totals</TableCell>
              <TableCell>${totalDebit.toLocaleString()}</TableCell>
              <TableCell>${totalCredit.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}