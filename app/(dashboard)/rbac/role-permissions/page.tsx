import { BaseLayout } from "@/components/layout/BaseLayout";
import { RolePermissionsTable } from "./components/table";

export default function RolePermissionsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Role-Permissions Assignment</h1>
        <RolePermissionsTable />
      </div>
    </BaseLayout>
  );
}