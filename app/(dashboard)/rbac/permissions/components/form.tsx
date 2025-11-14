import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PermissionsForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="permissionName">Permission Name</Label>
        <Input id="permissionName" placeholder="Enter permission name (e.g., read_users)" />
      </div>
      <div>
        <Label htmlFor="permissionDescription">Description</Label>
        <Textarea id="permissionDescription" placeholder="Enter permission description" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Permission</Button>
      </div>
    </div>
  );
}