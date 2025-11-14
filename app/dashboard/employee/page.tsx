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

interface Company {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  hireDate: Date;
  salary: number | null;
  companyId: string;
  departmentId: string;
  roleId: string;
  company: Company;
  department: Department;
  role: Role;
  createdAt: Date;
}

import BaseLayout from '@/components/layout/BaseLayout';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    hireDate: '',
    salary: '',
    companyId: '',
    departmentId: '',
    roleId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  return (
    <BaseLayout>

  // Load employees and related data from the database
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Mock data for now - will be replaced with actual API calls
        const mockCompanies: Company[] = [
          { id: '1', name: 'ABC Corporation' },
          { id: '2', name: 'XYZ Industries' },
        ];
        
        const mockDepartments: Department[] = [
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Marketing' },
          { id: '3', name: 'HR' },
        ];
        
        const mockRoles: Role[] = [
          { id: '1', name: 'Administrator' },
          { id: '2', name: 'Manager' },
          { id: '3', name: 'Employee' },
        ];
        
        const mockEmployees: Employee[] = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1234567890',
            address: '123 Main St',
            hireDate: new Date('2023-01-15'),
            salary: 75000,
            companyId: '1',
            departmentId: '1',
            roleId: '2',
            company: { id: '1', name: 'ABC Corporation' },
            department: { id: '1', name: 'Engineering' },
            role: { id: '2', name: 'Manager' },
            createdAt: new Date(),
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+0987654321',
            address: '456 Oak Ave',
            hireDate: new Date('2023-03-20'),
            salary: 65000,
            companyId: '1',
            departmentId: '2',
            roleId: '3',
            company: { id: '1', name: 'ABC Corporation' },
            department: { id: '2', name: 'Marketing' },
            role: { id: '3', name: 'Employee' },
            createdAt: new Date(),
          },
          {
            id: '3',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.johnson@company.com',
            phone: '+1122334455',
            address: '789 Pine Rd',
            hireDate: new Date('2023-02-10'),
            salary: 80000,
            companyId: '2',
            departmentId: '3',
            roleId: '1',
            company: { id: '2', name: 'XYZ Industries' },
            department: { id: '3', name: 'HR' },
            role: { id: '1', name: 'Administrator' },
            createdAt: new Date(),
          },
        ];
        
        setCompanies(mockCompanies);
        setDepartments(mockDepartments);
        setRoles(mockRoles);
        setEmployees(mockEmployees);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
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
      // Convert salary and hireDate to proper format
      const employeeData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        hireDate: new Date(formData.hireDate),
      };

      if (editingEmployee) {
        // Update existing employee
        // const updatedEmployee = await updateEmployee(editingEmployee.id, employeeData);
        // setEmployees(employees.map(e => e.id === editingEmployee.id ? updatedEmployee : e));
      } else {
        // Create new employee
        // const newEmployee = await createEmployee(employeeData);
        // setEmployees([...employees, newEmployee]);
      }
      
      // Reset form and close dialog
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        hireDate: '',
        salary: '',
        companyId: '',
        departmentId: '',
        roleId: '',
      });
      setErrors({});
      setIsDialogOpen(false);
      setEditingEmployee(null);
      
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.address || '',
      hireDate: employee.hireDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      salary: employee.salary ? employee.salary.toString() : '',
      companyId: employee.companyId,
      departmentId: employee.departmentId,
      roleId: employee.roleId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        // await deleteEmployee(id);
        // setEmployees(employees.filter(employee => employee.id !== id));
        // For mock implementation, just remove from state
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const openAddDialog = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      hireDate: '',
      salary: '',
      companyId: '',
      departmentId: '',
      roleId: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employees</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your employee records
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Department</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Role</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Hire Date</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.email}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.department.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.role.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
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
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right text-gray-700 dark:text-gray-300">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.firstName}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right text-gray-700 dark:text-gray-300">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.lastName}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.email}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-gray-700 dark:text-gray-300">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hireDate" className="text-right text-gray-700 dark:text-gray-300">
                  Hire Date *
                </Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.hireDate ? 'border-red-500' : ''}`}
                />
                {errors.hireDate && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.hireDate}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salary" className="text-right text-gray-700 dark:text-gray-300">
                  Salary
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyId" className="text-right text-gray-700 dark:text-gray-300">
                  Company *
                </Label>
                <Select value={formData.companyId} onValueChange={(value) => handleSelectChange('companyId', value)}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departmentId" className="text-right text-gray-700 dark:text-gray-300">
                  Department *
                </Label>
                <Select value={formData.departmentId} onValueChange={(value) => handleSelectChange('departmentId', value)}>
                  <SelectTrigger className={`col-span-3 ${errors.departmentId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.departmentId}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roleId" className="text-right text-gray-700 dark:text-gray-300">
                  Role *
                </Label>
                <Select value={formData.roleId} onValueChange={(value) => handleSelectChange('roleId', value)}>
                  <SelectTrigger className={`col-span-3 ${errors.roleId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.roleId}</div>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employees</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your employee records
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Department</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Role</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Hire Date</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.email}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.department.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{employee.role.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
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
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right text-gray-700 dark:text-gray-300">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.firstName}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right text-gray-700 dark:text-gray-300">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.lastName}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.email}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-gray-700 dark:text-gray-300">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hireDate" className="text-right text-gray-700 dark:text-gray-300">
                  Hire Date *
                </Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className={`col-span-3 ${errors.hireDate ? 'border-red-500' : ''}`}
                />
                {errors.hireDate && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.hireDate}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salary" className="text-right text-gray-700 dark:text-gray-300">
                  Salary
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyId" className="text-right text-gray-700 dark:text-gray-300">
                  Company *
                </Label>
                <Select value={formData.companyId} onValueChange={(value) => handleSelectChange('companyId', value)}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departmentId" className="text-right text-gray-700 dark:text-gray-300">
                  Department *
                </Label>
                <Select value={formData.departmentId} onValueChange={(value) => handleSelectChange('departmentId', value)}>
                  <SelectTrigger className={`col-span-3 ${errors.departmentId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.departmentId}</div>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roleId" className="text-right text-gray-700 dark:text-gray-300">
                  Role *
                </Label>
                <Select value={formData.roleId} onValueChange={(value) => handleSelectChange('roleId', value)}>
                  <SelectTrigger className={`col-span-3 ${errors.roleId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && <div className="col-start-2 col-span-3 text-red-500 text-sm">{errors.roleId}</div>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}