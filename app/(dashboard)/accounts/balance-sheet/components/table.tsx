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

export function BalanceSheetTable() {
  const [assets] = useState([
    { id: 1, name: "Cash", amount: 5000 },
    { id: 2, name: "Accounts Receivable", amount: 3000 },
    { id: 3, name: "Inventory", amount: 8000 },
    { id: 4, name: "Fixed Assets", amount: 15000 },
  ]);
  
  const [liabilities] = useState([
    { id: 1, name: "Accounts Payable", amount: 4000 },
    { id: 2, name: "Loans Payable", amount: 10000 },
  ]);
  
  const [equity] = useState([
    { id: 1, name: "Owner's Equity", amount: 8000 },
    { id: 2, name: "Retained Earnings", amount: 9000 },
  ]);

  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalAssets.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalEquity.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Assets</h3>
          <div className="border rounded-lg">
            <Table>
              <TableBody>
                {assets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total Assets</TableCell>
                  <TableCell>${totalAssets.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Liabilities</h3>
            <div className="border rounded-lg">
              <Table>
                <TableBody>
                  {liabilities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>${item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total Liabilities</TableCell>
                    <TableCell>${totalLiabilities.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Equity</h3>
            <div className="border rounded-lg">
              <Table>
                <TableBody>
                  {equity.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>${item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total Equity</TableCell>
                    <TableCell>${totalEquity.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div className="font-bold">Total Assets:</div>
          <div className="font-bold text-right">${totalAssets.toLocaleString()}</div>
          <div className="font-bold">Total Liabilities & Equity:</div>
          <div className="font-bold text-right">${totalLiabilitiesAndEquity.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}