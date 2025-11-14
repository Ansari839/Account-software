import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function RolePermissionsForm() {
  const permissions = [
    { id: 1, name: "read_users", description: "Allow reading user data" },
    { id: 2, name: "write_users", description: "Allow writing user data" },
    { id: 3, name: "delete_users", description: "Allow deleting users" },
    { id: 4, name: "read_orders", description: "Allow reading order data" },
    { id: 5, name: "write_orders", description: "Allow writing order data" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="roleSelect">Select Role</Label>
        <select id="roleSelect" className="w-full p-2 border rounded mt-1">
          <option value="">Select a role</option>
          <option value="1">Admin</option>
          <option value="2">Manager</option>
          <option value="3">User</option>
        </select>
      </div>
      
      <div>
        <Label>Permissions</Label>
        <div className="space-y-2 mt-2">
          {permissions.map(permission => (
            <div key={permission.id} className="flex items-start space-x-2">
              <Checkbox id={`perm-${permission.id}`} />
              <div>
                <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium">
                  {permission.name}
                </Label>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Assign Permissions</Button>
      </div>
    </div>
  );
}