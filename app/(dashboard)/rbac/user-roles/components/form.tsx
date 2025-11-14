import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function UserRolesForm() {
  const roles = [
    { id: 1, name: "Admin", description: "Administrator role with full access" },
    { id: 2, name: "Manager", description: "Manager role with limited access" },
    { id: 3, name: "User", description: "Basic user role with read-only access" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="userSelect">Select User</Label>
        <select id="userSelect" className="w-full p-2 border rounded mt-1">
          <option value="">Select a user</option>
          <option value="1">John Doe</option>
          <option value="2">Jane Smith</option>
          <option value="3">Bob Johnson</option>
        </select>
      </div>
      
      <div>
        <Label>Roles</Label>
        <div className="space-y-2 mt-2">
          {roles.map(role => (
            <div key={role.id} className="flex items-start space-x-2">
              <Checkbox id={`role-${role.id}`} />
              <div>
                <Label htmlFor={`role-${role.id}`} className="text-sm font-medium">
                  {role.name}
                </Label>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Assign Roles</Button>
      </div>
    </div>
  );
}