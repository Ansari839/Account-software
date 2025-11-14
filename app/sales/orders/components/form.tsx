import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SalesOrderForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Order Form</CardTitle>
        <CardDescription>Create a new sales order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input id="orderNumber" placeholder="Enter order number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Input id="customer" placeholder="Select customer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </CardContent>
    </Card>
  );
}