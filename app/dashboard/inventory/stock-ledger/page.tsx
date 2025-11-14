'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BaseLayout from '@/components/layout/BaseLayout';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

interface StockMovement {
  id: string;
  movementType: string; // 'IN' or 'OUT'
  referenceType: string; // 'purchase_order', 'goods_receipt', 'sales_order', 'sales_return', 'adjustment'
  referenceId: string;
  quantity: number;
}

interface StockLedger {
  id: string;
  productId: string;
  date: Date;
  transactionType: string; // 'purchase_order', 'goods_receipt', 'sales_order', 'sales_return', 'adjustment'
  referenceId: string; // ID of the related transaction
  description: string;
  qtyIn: number;
  qtyOut: number;
  balance: number; // Running balance
  product: Product;
  movement: StockMovement | null;
}

export default function StockLedgerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLedger, setStockLedger] = useState<StockLedger[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockProducts: Product[] = [
          { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
          { id: '2', name: 'Wireless Mouse', sku: 'MOU-001', unit: 'pcs' },
          { id: '3', name: 'Office Chair', sku: 'CHA-001', unit: 'pcs' },
        ];
        
        const mockStockMovements: StockMovement[] = [
          { id: '1', movementType: 'IN', referenceType: 'goods_receipt', referenceId: 'GRN-001', quantity: 10 },
          { id: '2', movementType: 'IN', referenceType: 'purchase_order', referenceId: 'PO-002', quantity: 5 },
          { id: '3', movementType: 'OUT', referenceType: 'sales_order', referenceId: 'SO-001', quantity: 3 },
          { id: '4', movementType: 'OUT', referenceType: 'sales_order', referenceId: 'SO-003', quantity: 2 },
        ];
        
        const mockStockLedger: StockLedger[] = [
          {
            id: '1',
            productId: '1',
            date: new Date('2024-01-15'),
            transactionType: 'goods_receipt',
            referenceId: 'GRN-001',
            description: 'Received from supplier',
            qtyIn: 10,
            qtyOut: 0,
            balance: 10,
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            movement: { id: '1', movementType: 'IN', referenceType: 'goods_receipt', referenceId: 'GRN-001', quantity: 10 },
          },
          {
            id: '2',
            productId: '1',
            date: new Date('2024-01-16'),
            transactionType: 'purchase_order',
            referenceId: 'PO-002',
            description: 'Purchase from supplier',
            qtyIn: 5,
            qtyOut: 0,
            balance: 15, // 10 + 5
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            movement: { id: '2', movementType: 'IN', referenceType: 'purchase_order', referenceId: 'PO-002', quantity: 5 },
          },
          {
            id: '3',
            productId: '1',
            date: new Date('2024-01-17'),
            transactionType: 'sales_order',
            referenceId: 'SO-001',
            description: 'Sales to customer',
            qtyIn: 0,
            qtyOut: 3,
            balance: 12, // 15 - 3
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            movement: { id: '3', movementType: 'OUT', referenceType: 'sales_order', referenceId: 'SO-001', quantity: 3 },
          },
          {
            id: '4',
            productId: '1',
            date: new Date('2024-01-18'),
            transactionType: 'sales_order',
            referenceId: 'SO-003',
            description: 'Sales to customer',
            qtyIn: 0,
            qtyOut: 2,
            balance: 10, // 12 - 2
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            movement: { id: '4', movementType: 'OUT', referenceType: 'sales_order', referenceId: 'SO-003', quantity: 2 },
          },
          {
            id: '5',
            productId: '2',
            date: new Date('2024-01-16'),
            transactionType: 'purchase_order',
            referenceId: 'PO-002',
            description: 'Purchase from supplier',
            qtyIn: 5,
            qtyOut: 0,
            balance: 5,
            product: { id: '2', name: 'Wireless Mouse', sku: 'MOU-001', unit: 'pcs' },
            movement: { id: '2', movementType: 'IN', referenceType: 'purchase_order', referenceId: 'PO-002', quantity: 5 },
          },
        ];
        
        setProducts(mockProducts);
        setStockMovements(mockStockMovements);
        setStockLedger(mockStockLedger);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  // Filter stock ledger for selected product
  const filteredStockLedger = selectedProduct 
    ? stockLedger.filter(entry => entry.productId === selectedProduct)
    : stockLedger;

  // Get selected product object
  const selectedProductObj = products.find(p => p.id === selectedProduct);

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stock Ledger</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View running stock balance for products
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 dark:text-white">Product Selection</CardTitle>
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Product
                </label>
                <Select value={selectedProduct} onValueChange={handleProductChange}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">
              {selectedProductObj 
                ? `Stock Ledger for ${selectedProductObj.name} (${selectedProductObj.sku})` 
                : 'Stock Ledger for All Products'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Detailed stock movements and running balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Reference</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Qty IN</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Qty OUT</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockLedger.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      <Badge variant="outline">
                        {entry.transactionType.toUpperCase()}: {entry.referenceId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{entry.description}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      {entry.qtyIn > 0 ? entry.qtyIn : '-'}
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400">
                      {entry.qtyOut > 0 ? entry.qtyOut : '-'}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                      {entry.balance} {selectedProductObj?.unit || ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredStockLedger.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No stock ledger entries found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}