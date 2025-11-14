'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  createdAt: Date;
}

import BaseLayout from '@/components/layout/BaseLayout';

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  return (
    <BaseLayout>

  // Load roles from the database
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockRoles: Role[] = [
          {
            id: '1',
            name: 'Administrator',
            description: 'Full system access',
            permissions: ['read', 'write', 'delete', 'admin'],
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Manager',
            description: 'Can manage employees and departments',
            permissions: ['read', 'write'],
            createdAt: new Date(),
          },
          {
            id: '3',
            name: 'Employee',
            description: 'Basic employee access',
            permissions: ['read'],
            createdAt: new Date(),
          },
        ];
        
        setRoles(mockRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
      // Process permissions from comma-separated string to array
      const permissions = formData.permissions
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (editingRole) {
        // Update existing role
        // const updatedRole = await updateRole(editingRole.id, { ...formData, permissions });
        // setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r));
      } else {
        // Create new role
        // const newRole = await createRole({ ...formData, permissions });
        // setRoles([...roles, newRole]);
      }
      
      // Reset form and close dialog
      setFormData({ name: '', description: '', permissions: '' });
      setErrors({});
      setIsDialogOpen(false);
      setEditingRole(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        // await deleteRole(id);
        // setRoles(roles.filter(role => role.id !== id));
        // For mock implementation, just remove from state
        setRoles(roles.filter(role => role.id !== id));
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: '' });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your system roles and permissions
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Permissions</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">{role.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{role.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(role.id)}
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
              {editingRole ? 'Edit Role' : 'Add New Role'}
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
                <Label htmlFor="permissions" className="text-right text-gray-700 dark:text-gray-300">
                  Permissions
                </Label>
                <Input
                  id="permissions"
                  name="permissions"
                  value={formData.permissions}
                  onChange={handleInputChange}
                  placeholder="comma, separated, permissions"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingRole ? 'Update Role' : 'Create Role'}
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your system roles and permissions
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Permissions</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">{role.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{role.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(role.id)}
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
              {editingRole ? 'Edit Role' : 'Add New Role'}
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
                <Label htmlFor="permissions" className="text-right text-gray-700 dark:text-gray-300">
                  Permissions
                </Label>
                <Input
                  id="permissions"
                  name="permissions"
                  value={formData.permissions}
                  onChange={handleInputChange}
                  placeholder="comma, separated, permissions"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}