import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BalanceSheetForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Balance Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <input 
              id="date" 
              type="date" 
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Generate Balance Sheet</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}