import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DeliveryStatusForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dispatchId">Dispatch ID</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select dispatch ID" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dis-001">DIS-001</SelectItem>
            <SelectItem value="dis-002">DIS-002</SelectItem>
            <SelectItem value="dis-003">DIS-003</SelectItem>
            <SelectItem value="dis-004">DIS-004</SelectItem>
            <SelectItem value="dis-005">DIS-005</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Status</Button>
      </div>
    </div>
  );
}