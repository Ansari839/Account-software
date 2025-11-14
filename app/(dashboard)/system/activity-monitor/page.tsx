import BaseLayout from "@/components/layout/BaseLayout";
import { ActivityMonitorTable } from "./components/table";
import { ActivityMonitorForm } from "./components/form";

export default function ActivityMonitorPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Activity Monitor</h1>
        <div className="mb-6">
          <ActivityMonitorForm />
        </div>
        <ActivityMonitorTable />
      </div>
    </BaseLayout>
  );
}