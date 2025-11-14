import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DispatchEntryForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orderId">Order ID</Label>
          <Input id="orderId" placeholder="Enter order ID" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Dispatch Entry</Button>
      </div>
    </div>
  );
}