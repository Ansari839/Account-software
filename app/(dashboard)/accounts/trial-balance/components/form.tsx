import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrialBalanceForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Trial Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <input 
              id="startDate" 
              type="date" 
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <input 
              id="endDate" 
              type="date" 
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Generate Trial Balance</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}