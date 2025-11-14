import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SalesOrderReturnForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Order Return Form</CardTitle>
        <CardDescription>Create a new sales order return</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="returnNumber">Return Number</Label>
          <Input id="returnNumber" placeholder="Enter return number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Original Order</Label>
          <Input id="order" placeholder="Select original order" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </CardContent>
    </Card>
  );
}