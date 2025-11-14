"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function RolePermissionsTable() {
  const [roles] = useState([
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "User" },
  ]);

  const [permissions] = useState([
    { id: 1, name: "read_users" },
    { id: 2, name: "write_users" },
    { id: 3, name: "delete_users" },
    { id: 4, name: "read_orders" },
    { id: 5, name: "write_orders" },
  ]);

  // Mock data for role-permission assignments
  const [rolePermissions, setRolePermissions] = useState([
    { roleId: 1, permissionId: 1, assigned: true },
    { roleId: 1, permissionId: 2, assigned: true },
    { roleId: 1, permissionId: 3, assigned: true },
    { roleId: 1, permissionId: 4, assigned: true },
    { roleId: 1, permissionId: 5, assigned: true },
    { roleId: 2, permissionId: 1, assigned: true },
    { roleId: 2, permissionId: 2, assigned: true },
    { roleId: 2, permissionId: 4, assigned: true },
    { roleId: 3, permissionId: 1, assigned: true },
  ]);

  const handlePermissionChange = (roleId: number, permissionId: number) => {
    setRolePermissions(prev =>
      prev.map(rp =>
        rp.roleId === roleId && rp.permissionId === permissionId
          ? { ...rp, assigned: !rp.assigned }
          : rp
      )
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            {permissions.map(permission => (
              <TableHead key={permission.id} className="text-center">
                {permission.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map(role => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              {permissions.map(permission => {
                const isAssigned = rolePermissions.some(
                  rp => rp.roleId === role.id && rp.permissionId === permission.id && rp.assigned
                );
                return (
                  <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                    <Checkbox
                      checked={isAssigned}
                      onCheckedChange={() => handlePermissionChange(role.id, permission.id)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}