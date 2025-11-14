import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CashBookForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="transactionDate">Date</Label>
        <Input id="transactionDate" type="date" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter transaction description" />
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
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Entry</Button>
      </div>
    </div>
  );
}