import { BaseLayout } from "@/components/layout/BaseLayout";
import { PermissionsTable } from "./components/table";

export default function PermissionsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Permissions Management</h1>
        <PermissionsTable />
      </div>
    </BaseLayout>
  );
}