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
import { Trash2, Plus, Save } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';

interface Company {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  cost: number | null;
  openingStock: number;
  minStock: number;
  unit: string;
  stock: number;
  companyId: string;
  categoryId: string | null;
  createdAt: Date;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: 0,
    cost: 0,
    openingStock: 0,
    minStock: 0,
    unit: 'pcs',
    categoryId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockCategories: Category[] = [
          { id: '1', name: 'Electronics' },
          { id: '2', name: 'Office Supplies' },
          { id: '3', name: 'Furniture' },
        ];
        
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Laptop',
            description: 'High-performance laptop',
            sku: 'LAP-001',
            price: 1200,
            cost: 1000,
            openingStock: 50,
            minStock: 5,
            unit: 'pcs',
            stock: 45, // This could be calculated based on movements
            companyId: '1',
            categoryId: '1',
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse',
            sku: 'MOU-001',
            price: 25,
            cost: 15,
            openingStock: 100,
            minStock: 10,
            unit: 'pcs',
            stock: 95,
            companyId: '1',
            categoryId: '1',
            createdAt: new Date(),
          },
          {
            id: '3',
            name: 'Office Chair',
            description: 'Ergonomic office chair',
            sku: 'CHA-001',
            price: 150,
            cost: 120,
            openingStock: 20,
            minStock: 2,
            unit: 'pcs',
            stock: 18,
            companyId: '1',
            categoryId: '3',
            createdAt: new Date(),
          },
        ];
        
        setCategories(mockCategories);
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['price', 'cost', 'openingStock', 'minStock'].includes(name)) {
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

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value,
    });

    // Clear error for this field when user selects
    if (errors.categoryId) {
      setErrors({
        ...errors,
        categoryId: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.openingStock < 0) {
      newErrors.openingStock = 'Opening stock cannot be negative';
    }
    
    if (formData.minStock < 0) {
      newErrors.minStock = 'Minimum stock cannot be negative';
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
      // Prepare product data
      const productData = {
        ...formData,
      };

      if (editingProduct) {
        // Update existing product
        // const updatedProduct = await updateProduct(editingProduct.id, productData);
        // setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      } else {
        // Create new product
        // const newProduct = await createProduct(productData);
        // setProducts([...products, newProduct]);
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        sku: '',
        price: 0,
        cost: 0,
        openingStock: 0,
        minStock: 0,
        unit: 'pcs',
        categoryId: '',
      });
      setErrors({});
      setIsDialogOpen(false);
      setEditingProduct(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      sku: product.sku,
      price: product.price,
      cost: product.cost || 0,
      openingStock: product.openingStock,
      minStock: product.minStock,
      unit: product.unit,
      categoryId: product.categoryId || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        // await deleteProduct(id);
        // setProducts(products.filter(product => product.id !== id));
        // For mock implementation, just remove from state
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      sku: '',
      price: 0,
      cost: 0,
      openingStock: 0,
      minStock: 0,
      unit: 'pcs',
      categoryId: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <BaseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your product inventory
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">SKU</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Opening Stock</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Current Stock</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Min Stock</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Unit</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{product.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.sku}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.openingStock}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.stock}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.minStock}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.unit}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
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
                
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-gray-700 dark:text-gray-300">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={errors.sku ? 'border-red-500' : ''}
                  />
                  {errors.sku && <div className="text-red-500 text-sm">{errors.sku}</div>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId" className="text-gray-700 dark:text-gray-300">
                      Category
                    </Label>
                    <Select value={formData.categoryId} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-gray-700 dark:text-gray-300">
                      Unit
                    </Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange({ target: { name: 'unit', value } } as React.ChangeEvent<HTMLInputElement>)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="g">Grams</SelectItem>
                        <SelectItem value="l">Liters</SelectItem>
                        <SelectItem value="m">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                      Sale Price *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-gray-700 dark:text-gray-300">
                      Purchase Price
                    </Label>
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      value={formData.cost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingStock" className="text-gray-700 dark:text-gray-300">
                      Opening Stock *
                    </Label>
                    <Input
                      id="openingStock"
                      name="openingStock"
                      type="number"
                      value={formData.openingStock}
                      onChange={handleInputChange}
                      min="0"
                      className={errors.openingStock ? 'border-red-500' : ''}
                    />
                    {errors.openingStock && <div className="text-red-500 text-sm">{errors.openingStock}</div>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minStock" className="text-gray-700 dark:text-gray-300">
                      Minimum Stock *
                    </Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={handleInputChange}
                      min="0"
                      className={errors.minStock ? 'border-red-500' : ''}
                    />
                    {errors.minStock && <div className="text-red-500 text-sm">{errors.minStock}</div>}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
}