import BaseLayout from "@/components/layout/BaseLayout";
import { AppSettingsTable } from "./components/table";
import { AppSettingsForm } from "./components/form";

export default function AppSettingsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">App Settings</h1>
        <div className="mb-6">
          <AppSettingsForm />
        </div>
        <AppSettingsTable />
      </div>
    </BaseLayout>
  );
}