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
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

interface StockMovement {
  id: string;
  productId: string;
  product: Product;
  batchId: string | null;
  quantity: number;
  movementType: string; // 'IN' or 'OUT'
  referenceType: string; // 'purchase_order', 'goods_receipt', 'sales_order', 'sales_return', 'adjustment'
  referenceId: string;
  description: string | null;
  date: Date;
  companyId: string;
  createdAt: Date;
}

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    movementType: 'IN',
    referenceType: 'adjustment',
    referenceId: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

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
        
        const mockMovements: StockMovement[] = [
          {
            id: '1',
            productId: '1',
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            batchId: null,
            quantity: 10,
            movementType: 'IN',
            referenceType: 'goods_receipt',
            referenceId: 'GRN-001',
            description: 'Received from supplier',
            date: new Date('2024-01-15'),
            companyId: '1',
            createdAt: new Date(),
          },
          {
            id: '2',
            productId: '2',
            product: { id: '2', name: 'Wireless Mouse', sku: 'MOU-001', unit: 'pcs' },
            batchId: null,
            quantity: 5,
            movementType: 'IN',
            referenceType: 'purchase_order',
            referenceId: 'PO-002',
            description: 'Purchase from supplier',
            date: new Date('2024-01-16'),
            companyId: '1',
            createdAt: new Date(),
          },
          {
            id: '3',
            productId: '1',
            product: { id: '1', name: 'Laptop', sku: 'LAP-001', unit: 'pcs' },
            batchId: null,
            quantity: 3,
            movementType: 'OUT',
            referenceType: 'sales_order',
            referenceId: 'SO-001',
            description: 'Sales to customer',
            date: new Date('2024-01-17'),
            companyId: '1',
            createdAt: new Date(),
          },
          {
            id: '4',
            productId: '3',
            product: { id: '3', name: 'Office Chair', sku: 'CHA-001', unit: 'pcs' },
            batchId: null,
            quantity: 2,
            movementType: 'OUT',
            referenceType: 'sales_order',
            referenceId: 'SO-003',
            description: 'Sales to customer',
            date: new Date('2024-01-18'),
            companyId: '1',
            createdAt: new Date(),
          },
        ];
        
        setProducts(mockProducts);
        setMovements(mockMovements);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'quantity') {
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
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.referenceId.trim()) {
      newErrors.referenceId = 'Reference ID is required';
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
      // Prepare movement data
      const movementData = {
        ...formData,
      };

      if (editingMovement) {
        // Update existing movement
        // const updatedMovement = await updateStockMovement(editingMovement.id, movementData);
        // setMovements(movements.map(m => m.id === editingMovement.id ? updatedMovement : m));
      } else {
        // Create new movement
        // const newMovement = await createStockMovement(movementData);
        // setMovements([...movements, newMovement]);
      }
      
      // Reset form and close dialog
      setFormData({
        productId: '',
        quantity: 0,
        movementType: 'IN',
        referenceType: 'adjustment',
        referenceId: '',
        description: '',
      });
      setErrors({});
      setIsDialogOpen(false);
      setEditingMovement(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving stock movement:', error);
    }
  };

  const handleEdit = (movement: StockMovement) => {
    setEditingMovement(movement);
    setFormData({
      productId: movement.productId,
      quantity: movement.quantity,
      movementType: movement.movementType,
      referenceType: movement.referenceType,
      referenceId: movement.referenceId,
      description: movement.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stock movement? This action cannot be undone.')) {
      try {
        // await deleteStockMovement(id);
        // setMovements(movements.filter(movement => movement.id !== id));
        // For mock implementation, just remove from state
        setMovements(movements.filter(movement => movement.id !== id));
      } catch (error) {
        console.error('Error deleting stock movement:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingMovement(null);
    setFormData({
      productId: '',
      quantity: 0,
      movementType: 'IN',
      referenceType: 'adjustment',
      referenceId: '',
      description: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const getProductInfo = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.sku})` : 'Unknown Product';
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stock Movements</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track all stock in/out movements
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Movement
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Movement Type</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Reference</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(movement.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                      {getProductInfo(movement.productId)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={movement.movementType === 'IN' ? 'default' : 'destructive'}
                      >
                        {movement.movementType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{movement.quantity}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      <Badge variant="outline">
                        {movement.referenceType.toUpperCase()}: {movement.referenceId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {movement.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(movement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(movement.id)}
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
                {editingMovement ? 'Edit Stock Movement' : 'Add New Stock Movement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
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
                    <Label htmlFor="movementType" className="text-gray-700 dark:text-gray-300">
                      Movement Type *
                    </Label>
                    <Select value={formData.movementType} onValueChange={(value) => handleSelectChange('movementType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN">IN</SelectItem>
                        <SelectItem value="OUT">OUT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceType" className="text-gray-700 dark:text-gray-300">
                      Reference Type *
                    </Label>
                    <Select value={formData.referenceType} onValueChange={(value) => handleSelectChange('referenceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase_order">Purchase Order</SelectItem>
                        <SelectItem value="goods_receipt">Goods Receipt</SelectItem>
                        <SelectItem value="sales_order">Sales Order</SelectItem>
                        <SelectItem value="sales_return">Sales Return</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referenceId" className="text-gray-700 dark:text-gray-300">
                      Reference ID *
                    </Label>
                    <Input
                      id="referenceId"
                      name="referenceId"
                      value={formData.referenceId}
                      onChange={handleInputChange}
                      className={errors.referenceId ? 'border-red-500' : ''}
                    />
                    {errors.referenceId && <div className="text-red-500 text-sm">{errors.referenceId}</div>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingMovement ? 'Update Movement' : 'Create Movement'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}