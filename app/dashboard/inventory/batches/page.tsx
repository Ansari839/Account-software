'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, Calendar } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface GoodsReceipt {
  id: string;
  grnNumber: string;
}

interface Batch {
  id: string;
  batchNumber: string;
  expiryDate: Date | null;
  manufacturingDate: Date | null;
  quantity: number;
  productId: string;
  product: Product;
  goodsReceiptId: string | null;
  goodsReceipt: GoodsReceipt | null;
  companyId: string;
  createdAt: Date;
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    batchNumber: '',
    productId: '',
    expiryDate: '',
    manufacturingDate: '',
    quantity: 0,
    goodsReceiptId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockProducts: Product[] = [
          { id: '1', name: 'Laptop', sku: 'LAP-001' },
          { id: '2', name: 'Wireless Mouse', sku: 'MOU-001' },
          { id: '3', name: 'Office Chair', sku: 'CHA-001' },
        ];
        
        const mockGoodsReceipts: GoodsReceipt[] = [
          { id: '1', grnNumber: 'GRN-001' },
          { id: '2', grnNumber: 'GRN-002' },
        ];
        
        const mockBatches: Batch[] = [
          {
            id: '1',
            batchNumber: 'BAT-001',
            expiryDate: new Date('2025-12-31'),
            manufacturingDate: new Date('2024-01-01'),
            quantity: 50,
            productId: '1',
            product: { id: '1', name: 'Laptop', sku: 'LAP-001' },
            goodsReceiptId: '1',
            goodsReceipt: { id: '1', grnNumber: 'GRN-001' },
            companyId: '1',
            createdAt: new Date(),
          },
          {
            id: '2',
            batchNumber: 'BAT-002',
            expiryDate: new Date('2025-11-30'),
            manufacturingDate: new Date('2024-01-05'),
            quantity: 100,
            productId: '2',
            product: { id: '2', name: 'Wireless Mouse', sku: 'MOU-001' },
            goodsReceiptId: '2',
            goodsReceipt: { id: '2', grnNumber: 'GRN-002' },
            companyId: '1',
            createdAt: new Date(),
          },
          {
            id: '3',
            batchNumber: 'BAT-003',
            expiryDate: null,
            manufacturingDate: new Date('2024-01-10'),
            quantity: 20,
            productId: '3',
            product: { id: '3', name: 'Office Chair', sku: 'CHA-001' },
            goodsReceiptId: null,
            goodsReceipt: null,
            companyId: '1',
            createdAt: new Date(),
          },
        ];
        
        setProducts(mockProducts);
        setGoodsReceipts(mockGoodsReceipts);
        setBatches(mockBatches);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle date fields
    if (name === 'expiryDate' || name === 'manufacturingDate') {
      setFormData({
        ...formData,
        [name]: value,
      });
    } 
    // Handle numeric fields
    else if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare batch data
      const batchData = {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        manufacturingDate: formData.manufacturingDate ? new Date(formData.manufacturingDate) : null,
      };

      if (editingBatch) {
        // Update existing batch
        // const updatedBatch = await updateBatch(editingBatch.id, batchData);
        // setBatches(batches.map(b => b.id === editingBatch.id ? updatedBatch : b));
      } else {
        // Create new batch
        // const newBatch = await createBatch(batchData);
        // setBatches([...batches, newBatch]);
      }
      
      // Reset form and close dialog
      setFormData({
        batchNumber: '',
        productId: '',
        expiryDate: '',
        manufacturingDate: '',
        quantity: 0,
        goodsReceiptId: '',
      });
      setErrors({});
      setIsDialogOpen(false);
      setEditingBatch(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      batchNumber: batch.batchNumber,
      productId: batch.productId,
      expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().split('T')[0] : '',
      manufacturingDate: batch.manufacturingDate ? new Date(batch.manufacturingDate).toISOString().split('T')[0] : '',
      quantity: batch.quantity,
      goodsReceiptId: batch.goodsReceiptId || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      try {
        // await deleteBatch(id);
        // setBatches(batches.filter(batch => batch.id !== id));
        // For mock implementation, just remove from state
        setBatches(batches.filter(batch => batch.id !== id));
      } catch (error) {
        console.error('Error deleting batch:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingBatch(null);
    setFormData({
      batchNumber: '',
      productId: '',
      expiryDate: '',
      manufacturingDate: '',
      quantity: 0,
      goodsReceiptId: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.sku})` : 'Unknown Product';
  };

  const getGRNNumber = (grnId: string | null) => {
    if (!grnId) return 'N/A';
    const grn = goodsReceipts.find(g => g.id === grnId);
    return grn ? grn.grnNumber : 'Unknown';
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Batches</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage product batches and lot numbers
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Batch Number</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Manufacturing Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Expiry Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Linked GRN</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{batch.batchNumber}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{getProductName(batch.productId)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {batch.manufacturingDate ? new Date(batch.manufacturingDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{batch.quantity}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{getGRNNumber(batch.goodsReceiptId)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(batch)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(batch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">
                {editingBatch ? 'Edit Batch' : 'Add New Batch'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="batchNumber" className="text-gray-700 dark:text-gray-300">
                    Batch Number *
                  </Label>
                  <Input
                    id="batchNumber"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    className={errors.batchNumber ? 'border-red-500' : ''}
                  />
                  {errors.batchNumber && <div className="text-red-500 text-sm">{errors.batchNumber}</div>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productId" className="text-gray-700 dark:text-gray-300">
                    Product *
                  </Label>
                  <Select value={formData.productId} onValueChange={(value) => handleSelectChange('productId', value)}>
                    <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.productId && <div className="text-red-500 text-sm">{errors.productId}</div>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturingDate" className="text-gray-700 dark:text-gray-300">
                      Manufacturing Date
                    </Label>
                    <Input
                      id="manufacturingDate"
                      name="manufacturingDate"
                      type="date"
                      value={formData.manufacturingDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-gray-700 dark:text-gray-300">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">
                      Quantity *
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className={errors.quantity ? 'border-red-500' : ''}
                    />
                    {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goodsReceiptId" className="text-gray-700 dark:text-gray-300">
                      Linked GRN
                    </Label>
                    <Select 
                      value={formData.goodsReceiptId || ''} 
                      onValueChange={(value) => handleSelectChange('goodsReceiptId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GRN" />
                      </SelectTrigger>
                      <SelectContent>
                        {goodsReceipts.map((grn) => (
                          <SelectItem key={grn.id} value={grn.id}>
                            {grn.grnNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}