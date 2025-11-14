import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeliveryChallanForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Challan Form</CardTitle>
        <CardDescription>Create a new delivery challan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="challanNumber">Challan Number</Label>
          <Input id="challanNumber" placeholder="Enter challan number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Sales Order</Label>
          <Input id="order" placeholder="Select sales order" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </CardContent>
    </Card>
  );
}