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

export function UserRolesTable() {
  const [users] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ]);

  const [roles] = useState([
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "User" },
  ]);

  // Mock data for user-role assignments
  const [userRoles, setUserRoles] = useState([
    { userId: 1, roleId: 1, assigned: true },
    { userId: 1, roleId: 2, assigned: false },
    { userId: 1, roleId: 3, assigned: false },
    { userId: 2, roleId: 1, assigned: false },
    { userId: 2, roleId: 2, assigned: true },
    { userId: 2, roleId: 3, assigned: true },
    { userId: 3, roleId: 1, assigned: false },
    { userId: 3, roleId: 2, assigned: false },
    { userId: 3, roleId: 3, assigned: true },
  ]);

  const handleRoleChange = (userId: number, roleId: number) => {
    setUserRoles(prev =>
      prev.map(ur =>
        ur.userId === userId && ur.roleId === roleId
          ? { ...ur, assigned: !ur.assigned }
          : ur
      )
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            {roles.map(role => (
              <TableHead key={role.id} className="text-center">
                {role.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              {roles.map(role => {
                const isAssigned = userRoles.some(
                  ur => ur.userId === user.id && ur.roleId === role.id && ur.assigned
                );
                return (
                  <TableCell key={`${user.id}-${role.id}`} className="text-center">
                    <Checkbox
                      checked={isAssigned}
                      onCheckedChange={() => handleRoleChange(user.id, role.id)}
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