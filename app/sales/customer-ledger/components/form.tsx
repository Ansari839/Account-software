import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerLedgerForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Ledger Form</CardTitle>
        <CardDescription>View customer ledger details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Input id="customer" placeholder="Select customer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromDate">From Date</Label>
          <Input id="fromDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="toDate">To Date</Label>
          <Input id="toDate" type="date" />
        </div>
      </CardContent>
    </Card>
  );
}