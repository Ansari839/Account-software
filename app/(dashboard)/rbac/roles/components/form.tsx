import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RolesForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="roleName">Role Name</Label>
        <Input id="roleName" placeholder="Enter role name" />
      </div>
      <div>
        <Label htmlFor="roleDescription">Description</Label>
        <Textarea id="roleDescription" placeholder="Enter role description" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Role</Button>
      </div>
    </div>
  );
}