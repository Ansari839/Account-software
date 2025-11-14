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

export function ChartOfAccountsTable() {
  const [accounts] = useState([
    { id: 1, name: "Cash", type: "Asset", parent: "Current Assets" },
    { id: 2, name: "Accounts Receivable", type: "Asset", parent: "Current Assets" },
    { id: 3, name: "Inventory", type: "Asset", parent: "Current Assets" },
    { id: 4, name: "Fixed Assets", type: "Asset", parent: "Assets" },
    { id: 5, name: "Accounts Payable", type: "Liability", parent: "Current Liabilities" },
    { id: 6, name: "Loans Payable", type: "Liability", parent: "Long-term Liabilities" },
    { id: 7, name: "Owner's Equity", type: "Equity", parent: "" },
    { id: 8, name: "Sales Revenue", type: "Revenue", parent: "" },
    { id: 9, name: "Cost of Goods Sold", type: "Expense", parent: "Expenses" },
    { id: 10, name: "Operating Expenses", type: "Expense", parent: "Expenses" },
  ]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Parent Account</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.id}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>{account.parent}</TableCell>
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
        <Button>Add New Account</Button>
      </div>
    </div>
  );
}