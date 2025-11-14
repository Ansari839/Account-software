import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function JournalVoucherForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="voucherDate">Date</Label>
          <Input id="voucherDate" type="date" />
        </div>
        <div>
          <Label htmlFor="account">Account</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="sales-revenue">Sales Revenue</SelectItem>
              <SelectItem value="operating-expenses">Operating Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="debitAmount">Debit Amount</Label>
          <Input id="debitAmount" type="number" placeholder="0.00" />
        </div>
        <div>
          <Label htmlFor="creditAmount">Credit Amount</Label>
          <Input id="creditAmount" type="number" placeholder="0.00" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter description" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Voucher</Button>
      </div>
    </div>
  );
}