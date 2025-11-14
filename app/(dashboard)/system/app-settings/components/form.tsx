"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AppSettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="app-name">Application Name</Label>
            <Input id="app-name" defaultValue="ERP System" />
          </div>
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" defaultValue="My Company" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" defaultValue="USD" />
          </div>
          <div>
            <Label htmlFor="date-format">Date Format</Label>
            <Input id="date-format" defaultValue="MM/DD/YYYY" />
          </div>
          <div>
            <Label htmlFor="time-format">Time Format</Label>
            <Input id="time-format" defaultValue="24h" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="maintenance-mode" />
          <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
        </div>
        
        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}