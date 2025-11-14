'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BaseLayout from '@/components/layout/BaseLayout';

interface Supplier {
  id: string;
  name: string;
  email: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: Date;
  totalAmount: number;
  status: string;
}

interface GoodsReceipt {
  id: string;
  grnNumber: string;
  date: Date;
  totalAmount: number;
  status: string;
}

interface SupplierLedger {
  id: string;
  date: Date;
  transactionType: string; // purchase_order, goods_receipt, payment, etc.
  referenceId: string; // ID of the related transaction
  description: string;
  debit: number; // Amount the company owes to supplier (purchase, receipt)
  credit: number; // Amount supplier owes to company (returns, credits, payments made)
  balance: number; // Running balance
  relatedOrder?: PurchaseOrder;
  relatedReceipt?: GoodsReceipt;
}

export default function SupplierLedgerPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [ledgerEntries, setLedgerEntries] = useState<SupplierLedger[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockSuppliers: Supplier[] = [
          { id: '1', name: 'ABC Suppliers', email: 'contact@abcsuppliers.com' },
          { id: '2', name: 'XYZ Distributors', email: 'info@xyzdist.com' },
          { id: '3', name: 'Global Trading', email: 'hello@globaltrade.com' },
        ];
        
        const mockPurchaseOrders: PurchaseOrder[] = [
          { id: '1', orderNumber: 'PO-001', date: new Date('2024-01-10'), totalAmount: 5200, status: 'received' },
          { id: '2', orderNumber: 'PO-002', date: new Date('2024-01-12'), totalAmount: 1000, status: 'partially_received' },
          { id: '3', orderNumber: 'PO-003', date: new Date('2024-01-15'), totalAmount: 3500, status: 'confirmed' },
        ];
        
        const mockGoodsReceipts: GoodsReceipt[] = [
          { id: '1', grnNumber: 'GRN-001', date: new Date('2024-01-15'), totalAmount: 5160, status: 'approved' },
          { id: '2', grnNumber: 'GRN-002', date: new Date('2024-01-18'), totalAmount: 500, status: 'pending' },
        ];
        
        const mockLedgerEntries: SupplierLedger[] = [
          {
            id: '1',
            date: new Date('2024-01-10'),
            transactionType: 'purchase_order',
            referenceId: '1',
            description: 'Purchase Order #PO-001',
            debit: 5200,
            credit: 0,
            balance: 5200,
            relatedOrder: { id: '1', orderNumber: 'PO-001', date: new Date('2024-01-10'), totalAmount: 5200, status: 'received' },
          },
          {
            id: '2',
            date: new Date('2024-01-12'),
            transactionType: 'purchase_order',
            referenceId: '2',
            description: 'Purchase Order #PO-002',
            debit: 1000,
            credit: 0,
            balance: 6200, // 5200 + 1000
            relatedOrder: { id: '2', orderNumber: 'PO-002', date: new Date('2024-01-12'), totalAmount: 1000, status: 'partially_received' },
          },
          {
            id: '3',
            date: new Date('2024-01-15'),
            transactionType: 'goods_receipt',
            referenceId: '1',
            description: 'Goods Receipt #GRN-001',
            debit: 0,
            credit: 5160,
            balance: 1040, // 6200 - 5160
            relatedReceipt: { id: '1', grnNumber: 'GRN-001', date: new Date('2024-01-15'), totalAmount: 5160, status: 'approved' },
          },
          {
            id: '4',
            date: new Date('2024-01-18'),
            transactionType: 'payment',
            referenceId: 'P-001',
            description: 'Payment made to supplier',
            debit: 0,
            credit: 800,
            balance: 240, // 1040 - 800
          },
        ];
        
        setSuppliers(mockSuppliers);
        setPurchaseOrders(mockPurchaseOrders);
        setGoodsReceipts(mockGoodsReceipts);
        setLedgerEntries(mockLedgerEntries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplier(supplierId);
  };

  // Calculate supplier balance
  const calculateBalance = () => {
    if (!selectedSupplier) return 0;
    // Calculate balance: sum of all debits - sum of all credits
    return ledgerEntries.reduce((sum, entry) => sum + (entry.debit - entry.credit), 0);
  };

  // Filter ledger entries for selected supplier
  const filteredLedgerEntries = selectedSupplier 
    ? ledgerEntries 
    : [];

  // Get selected supplier object
  const selectedSupplierObj = suppliers.find(s => s.id === selectedSupplier);

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Supplier Ledger</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View transaction history for suppliers
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-gray-800 dark:text-white">Supplier Selection</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Supplier
                  </label>
                  <Select value={selectedSupplier} onValueChange={handleSupplierChange}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name} ({supplier.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedSupplierObj && (
                  <div className="flex items-end">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Outstanding Balance:</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        ${calculateBalance().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {selectedSupplier && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">
                Ledger for {selectedSupplierObj?.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Transaction history for the selected supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Reference</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Debit</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Credit</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        <Badge variant="outline">
                          {entry.transactionType === 'purchase_order' && entry.relatedOrder?.orderNumber}
                          {entry.transactionType === 'goods_receipt' && entry.relatedReceipt?.grnNumber}
                          {entry.transactionType === 'payment' && 'Payment'}
                          {entry.transactionType !== 'purchase_order' && 
                           entry.transactionType !== 'goods_receipt' && 
                           entry.transactionType !== 'payment' && entry.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{entry.description}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                        ${entry.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredLedgerEntries.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No ledger entries found for this supplier.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedSupplier && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Please select a supplier to view their ledger.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  );
}