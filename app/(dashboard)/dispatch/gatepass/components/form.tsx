import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GatepassForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dispatchId">Dispatch ID</Label>
          <Input id="dispatchId" placeholder="Enter dispatch ID" />
        </div>
        <div>
          <Label htmlFor="vehicleId">Vehicle ID</Label>
          <Input id="vehicleId" placeholder="Enter vehicle ID" />
        </div>
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Gatepass</Button>
      </div>
    </div>
  );
}