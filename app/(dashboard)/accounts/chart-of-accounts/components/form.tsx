import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ChartOfAccountsForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="accountName">Account Name</Label>
        <Input id="accountName" placeholder="Enter account name" />
      </div>
      <div>
        <Label htmlFor="accountType">Account Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="liability">Liability</SelectItem>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="parentAccount">Parent Account (Optional)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select parent account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="current-assets">Current Assets</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Account</Button>
      </div>
    </div>
  );
}