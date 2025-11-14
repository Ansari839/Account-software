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

export function ProfitLossTable() {
  const [revenue] = useState([
    { id: 1, name: "Sales Revenue", amount: 25000 },
    { id: 2, name: "Service Revenue", amount: 5000 },
  ]);
  
  const [expenses] = useState([
    { id: 1, name: "Cost of Goods Sold", amount: 12000 },
    { id: 2, name: "Operating Expenses", amount: 5000 },
    { id: 3, name: "Administrative Expenses", amount: 2000 },
    { id: 4, name: "Marketing Expenses", amount: 1500 },
  ]);

  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Revenue</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenue.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total Revenue</TableCell>
              <TableCell>${totalRevenue.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expenses</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total Expenses</TableCell>
              <TableCell>${totalExpenses.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between font-bold text-lg">
          <span>Net Profit/Loss</span>
          <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
            ${netProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}