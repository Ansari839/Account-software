import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function VehicleAssignmentForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleNo">Vehicle Number</Label>
          <Input id="vehicleNo" placeholder="Enter vehicle number" />
        </div>
        <div>
          <Label htmlFor="driverName">Driver Name</Label>
          <Input id="driverName" placeholder="Enter driver name" />
        </div>
      </div>
      <div>
        <Label htmlFor="dispatchId">Dispatch ID (Optional)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select dispatch ID" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dis-001">DIS-001</SelectItem>
            <SelectItem value="dis-002">DIS-002</SelectItem>
            <SelectItem value="dis-003">DIS-003</SelectItem>
            <SelectItem value="dis-004">DIS-004</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Assignment</Button>
      </div>
    </div>
  );
}