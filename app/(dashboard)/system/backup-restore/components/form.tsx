"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function BackupRestoreForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="storage-location">Storage Location</Label>
            <Input id="storage-location" placeholder="e.g., /backups/" />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch id="auto-backup" />
            <Label htmlFor="auto-backup">Enable Auto Backup</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Create Backup Now</Button>
          <Button>Restore from Backup</Button>
        </div>
      </CardContent>
    </Card>
  );
}