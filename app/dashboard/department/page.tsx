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
import { prisma } from '@/lib/prisma';
import { Trash2, Plus, Save } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  company: Company;
  createdAt: Date;
}

import BaseLayout from '@/components/layout/BaseLayout';

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  return (
    <BaseLayout>

  // Load departments and companies from the database
  useEffect(() => {
    const fetchDepartmentsAndCompanies = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockCompanies: Company[] = [
          { id: '1', name: 'ABC Corporation' },
          { id: '2', name: 'XYZ Industries' },
        ];
        
        const mockDepartments: Department[] = [
          {
            id: '1',
            name: 'Engineering',
            description: 'Software engineering department',
            companyId: '1',
            company: { id: '1', name: 'ABC Corporation' },
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Marketing',
            description: 'Marketing and sales department',
            companyId: '1',
            company: { id: '1', name: 'ABC Corporation' },
            createdAt: new Date(),
          },
          {
            id: '3',
            name: 'HR',
            description: 'Human Resources department',
            companyId: '2',
            company: { id: '2', name: 'XYZ Industries' },
            createdAt: new Date(),
          },
        ];
        
        setCompanies(mockCompanies);
        setDepartments(mockDepartments);
      } catch (error) {
        console.error('Error fetching departments and companies:', error);
      }
    };

    fetchDepartmentsAndCompanies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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
      companyId: value,
    });

    // Clear error for this field when user selects
    if (errors.companyId) {
      setErrors({
        ...errors,
        companyId: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
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
      if (editingDepartment) {
        // Update existing department
        // const updatedDepartment = await updateDepartment(editingDepartment.id, formData);
        // setDepartments(departments.map(d => d.id === editingDepartment.id ? updatedDepartment : d));
      } else {
        // Create new department
        // const newDepartment = await createDepartment(formData);
        // setDepartments([...departments, newDepartment]);
      }
      
      // Reset form and close dialog
      setFormData({ name: '', description: '', companyId: '' });
      setErrors({});
      setIsDialogOpen(false);
      setEditingDepartment(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      companyId: department.companyId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        // await deleteDepartment(id);
        // setDepartments(departments.filter(department => department.id !== id));
        // For mock implementation, just remove from state
        setDepartments(departments.filter(department => department.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '', companyId: '' });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Departments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your department entities
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Company</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">{department.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{department.description || '-'}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{department.company.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(department)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(department.id)}
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
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyId" className="text-right text-gray-700 dark:text-gray-300">
                  Company *
                </Label>
                <Select value={formData.companyId} onValueChange={handleSelectChange}>
                  <SelectTrigger className={`col-span-3 ${errors.companyId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.companyId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.companyId}</div>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingDepartment ? 'Update Department' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Departments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your department entities
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Company</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">{department.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{department.description || '-'}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{department.company.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(department)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(department.id)}
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
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyId" className="text-right text-gray-700 dark:text-gray-300">
                  Company *
                </Label>
                <Select value={formData.companyId} onValueChange={handleSelectChange}>
                  <SelectTrigger className={`col-span-3 ${errors.companyId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.companyId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.companyId}</div>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingDepartment ? 'Update Department' : 'Create Department'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}